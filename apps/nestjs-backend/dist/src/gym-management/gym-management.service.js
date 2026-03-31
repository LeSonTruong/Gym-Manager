"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GymManagementService = void 0;
const node_buffer_1 = require("node:buffer");
const node_crypto_1 = require("node:crypto");
const core_1 = require("@mikro-orm/core");
const shared_1 = require("@next-nest-turbo-boilerplate/shared");
const common_1 = require("@nestjs/common");
const PDFDocument = require("pdfkit");
const XLSX = require("xlsx");
const redis_service_1 = require("../redis/redis.service");
const gym_management_entity_1 = require("./entities/gym-management.entity");
const gym_management_mapper_1 = require("./gym-management.mapper");
const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;
const payrollPeriodTransitions = {
    OPEN: ["PENDING_APPROVAL"],
    PENDING_APPROVAL: ["APPROVED"],
    APPROVED: ["PAID"],
    PAID: [],
};
const payrollEntryTransitions = {
    PENDING_APPROVAL: ["APPROVED"],
    APPROVED: ["PAID"],
    PAID: [],
};
const operatingExpenseTransitions = {
    DRAFT: ["PENDING_APPROVAL"],
    PENDING_APPROVAL: ["APPROVED", "REJECTED"],
    APPROVED: ["PAID"],
    REJECTED: ["DRAFT"],
    PAID: [],
};
const salesInvoiceTransitions = {
    DRAFT: ["CONFIRMED"],
    CONFIRMED: ["CANCELLED"],
    CANCELLED: [],
};
let GymManagementService = class GymManagementService {
    orm;
    redisService;
    constructor(orm, redisService) {
        this.orm = orm;
        this.redisService = redisService;
    }
    async getSnapshot() {
        return (0, shared_1.createGymManagementSnapshot)(await this.loadDataset());
    }
    async login(email, password) {
        const em = this.createEntityManager();
        const userEntity = await em.findOne(gym_management_entity_1.UserEntity, { email });
        if (!userEntity || password !== userEntity.passwordHint) {
            throw new common_1.UnauthorizedException("Invalid demo credentials");
        }
        if (userEntity.status !== "ACTIVE") {
            throw new common_1.UnauthorizedException("User account is inactive");
        }
        const user = (0, gym_management_mapper_1.mapUserEntity)(userEntity);
        const ptId = user.role === "PT"
            ? await this.resolvePtIdForUser(em, userEntity)
            : undefined;
        const { accessToken, refreshToken } = await this.issueAuthTokens({
            sessionId: (0, node_crypto_1.randomUUID)(),
            userId: user.id,
            role: user.role,
            ptId,
        });
        return {
            user,
            accessToken,
            refreshToken,
            accessTokenExpiresIn: ACCESS_TOKEN_TTL_SECONDS,
            refreshTokenExpiresIn: REFRESH_TOKEN_TTL_SECONDS,
        };
    }
    async refreshAccessToken(refreshToken) {
        const payload = await this.redisService.getJson(this.toRefreshTokenKey(refreshToken));
        if (!payload) {
            throw new common_1.UnauthorizedException("Refresh token is invalid or expired");
        }
        const em = this.createEntityManager();
        const userEntity = await em.findOne(gym_management_entity_1.UserEntity, { id: payload.userId });
        if (!userEntity || userEntity.status !== "ACTIVE") {
            throw new common_1.UnauthorizedException("User account is inactive");
        }
        await this.redisService.deleteKey(this.toRefreshTokenKey(refreshToken));
        const user = (0, gym_management_mapper_1.mapUserEntity)(userEntity);
        const ptId = user.role === "PT"
            ? await this.resolvePtIdForUser(em, userEntity)
            : undefined;
        const issuedTokens = await this.issueAuthTokens({
            sessionId: payload.sessionId,
            userId: user.id,
            role: user.role,
            ptId,
        });
        return {
            user,
            accessToken: issuedTokens.accessToken,
            refreshToken: issuedTokens.refreshToken,
            accessTokenExpiresIn: ACCESS_TOKEN_TTL_SECONDS,
            refreshTokenExpiresIn: REFRESH_TOKEN_TTL_SECONDS,
        };
    }
    async logout(refreshToken, accessToken) {
        await this.redisService.deleteKey(this.toRefreshTokenKey(refreshToken));
        if (accessToken) {
            await this.redisService.deleteKey(this.toAccessTokenKey(accessToken));
            await this.redisService.setValue(this.toRevokedAccessTokenKey(accessToken), "1", ACCESS_TOKEN_TTL_SECONDS);
        }
    }
    async validateAccessToken(accessToken) {
        const isRevoked = await this.redisService.getValue(this.toRevokedAccessTokenKey(accessToken));
        if (isRevoked) {
            throw new common_1.UnauthorizedException("Access token has been revoked");
        }
        const payload = await this.redisService.getJson(this.toAccessTokenKey(accessToken));
        if (!payload) {
            throw new common_1.UnauthorizedException("Access token is invalid or expired");
        }
        const em = this.createEntityManager();
        const userEntity = await em.findOne(gym_management_entity_1.UserEntity, { id: payload.userId });
        if (!userEntity || userEntity.status !== "ACTIVE") {
            throw new common_1.UnauthorizedException("User account is inactive");
        }
        return {
            user: (0, gym_management_mapper_1.mapUserEntity)(userEntity),
            role: payload.role,
            ptId: payload.ptId,
            sessionId: payload.sessionId,
            accessToken,
        };
    }
    async getCurrentUser(accessToken) {
        const authenticatedUser = await this.validateAccessToken(accessToken);
        return authenticatedUser.user;
    }
    async getCurrentUserById(userId) {
        const em = this.createEntityManager();
        const currentUser = await em.findOne(gym_management_entity_1.UserEntity, { id: userId });
        if (!currentUser || currentUser.status !== "ACTIVE") {
            throw new common_1.UnauthorizedException("No demo users configured");
        }
        return (0, gym_management_mapper_1.mapUserEntity)(currentUser);
    }
    async checkInAttendance(attendanceCheckInDto) {
        const em = this.createEntityManager();
        if (!attendanceCheckInDto.ptId) {
            throw new common_1.BadRequestException("ptId is required");
        }
        const pt = await this.getRequiredPersonalTrainerEntity(em, attendanceCheckInDto.ptId);
        const openedShift = await em.findOne(gym_management_entity_1.AttendanceLogEntity, {
            personalTrainer: pt,
            checkOutAt: null,
        });
        if (openedShift) {
            throw new common_1.ConflictException(`PT ${attendanceCheckInDto.ptId} already has an open shift`);
        }
        const checkInAt = attendanceCheckInDto.checkInAt
            ? new Date(attendanceCheckInDto.checkInAt)
            : new Date();
        if (Number.isNaN(checkInAt.getTime())) {
            throw new common_1.BadRequestException("Invalid check in time");
        }
        const allowMultipleShifts = await this.getBooleanSystemConfig(em, "allow_multiple_shifts_per_day", false);
        const attendanceDate = this.toVietnamDate(checkInAt);
        if (!allowMultipleShifts) {
            const existingShift = await em.findOne(gym_management_entity_1.AttendanceLogEntity, {
                personalTrainer: pt,
                attendanceDate,
            });
            if (existingShift) {
                throw new common_1.ConflictException(`PT ${attendanceCheckInDto.ptId} already has a shift for ${attendanceDate.toISOString().slice(0, 10)}`);
            }
        }
        const attendanceLog = em.create(gym_management_entity_1.AttendanceLogEntity, {
            personalTrainer: pt,
            attendanceDate,
            checkInAt,
            checkOutAt: null,
            workedHours: "0",
            overtimeHours: "0",
            status: "OPEN",
            workCredit: "0",
        });
        em.persist(attendanceLog);
        await em.flush();
        return (0, gym_management_mapper_1.mapAttendanceLogEntity)(attendanceLog);
    }
    async checkOutAttendance(attendanceCheckOutDto) {
        const em = this.createEntityManager();
        if (!attendanceCheckOutDto.ptId) {
            throw new common_1.BadRequestException("ptId is required");
        }
        const pt = await this.getRequiredPersonalTrainerEntity(em, attendanceCheckOutDto.ptId);
        const attendanceLog = await this.findAttendanceLogForCheckOut(em, pt, attendanceCheckOutDto.attendanceLogId);
        if (!attendanceLog) {
            throw new common_1.NotFoundException(`Open shift for PT ${attendanceCheckOutDto.ptId} not found`);
        }
        if (attendanceLog.checkOutAt) {
            throw new common_1.ConflictException(`Shift ${attendanceLog.id} is already checked out`);
        }
        const checkOutAt = attendanceCheckOutDto.checkOutAt
            ? new Date(attendanceCheckOutDto.checkOutAt)
            : new Date();
        if (Number.isNaN(checkOutAt.getTime())) {
            throw new common_1.BadRequestException("Invalid check out time");
        }
        if (checkOutAt <= attendanceLog.checkInAt) {
            throw new common_1.BadRequestException("Check out time must be after check in time");
        }
        const workedHours = Number(((checkOutAt.getTime() - attendanceLog.checkInAt.getTime()) /
            36e5).toFixed(2));
        const ptContract = await this.findActivePtContractEntity(em, pt.id, attendanceLog.attendanceDate);
        const minValidShiftHours = ptContract
            ? Number(ptContract.minValidShiftHours)
            : await this.getNumberSystemConfig(em, "min_valid_shift_hours", 5);
        const standardShiftHours = ptContract
            ? Number(ptContract.standardShiftHours)
            : 8;
        const halfShiftPolicy = await this.getStringSystemConfig(em, "half_shift_policy", "NO_COUNT");
        let status;
        let workCredit;
        if (workedHours >= minValidShiftHours) {
            status = "VALID";
            workCredit = 1;
        }
        else if (halfShiftPolicy === "HALF_COUNT") {
            status = "HALF";
            workCredit = 0.5;
        }
        else {
            status = "INVALID";
            workCredit = 0;
        }
        const overtimeHours = workedHours > standardShiftHours
            ? Number((workedHours - standardShiftHours).toFixed(2))
            : 0;
        attendanceLog.checkOutAt = checkOutAt;
        attendanceLog.workedHours = workedHours.toString();
        attendanceLog.overtimeHours = overtimeHours.toString();
        attendanceLog.status = status;
        attendanceLog.workCredit = workCredit.toString();
        await em.flush();
        return (0, gym_management_mapper_1.mapAttendanceLogEntity)(attendanceLog);
    }
    async getPtDetail(ptId) {
        const dataset = await this.loadDataset();
        const trainer = (0, shared_1.findPersonalTrainerById)(dataset, ptId);
        if (!trainer) {
            throw new common_1.NotFoundException(`PT ${ptId} not found`);
        }
        const assignedMembers = dataset.memberPtAssignments
            .filter((assignment) => assignment.ptId === ptId)
            .map((assignment) => (0, shared_1.findMemberById)(dataset, assignment.memberId))
            .filter((member) => member !== undefined);
        return {
            trainer,
            contract: (0, shared_1.findPtContractByPtId)(dataset, ptId),
            attendance: (0, shared_1.getAttendanceByPtId)(dataset, ptId),
            payrollEntries: dataset.payrollEntries.filter((entry) => entry.ptId === ptId),
            assignedMembers,
        };
    }
    async getMemberDetail(memberId) {
        const dataset = await this.loadDataset();
        const member = (0, shared_1.findMemberById)(dataset, memberId);
        if (!member) {
            throw new common_1.NotFoundException(`Member ${memberId} not found`);
        }
        return {
            member,
            memberships: dataset.memberMemberships.filter((membership) => membership.memberId === memberId),
            ptAssignments: (0, shared_1.getMemberAssignmentsByMemberId)(dataset, memberId),
            membershipInvoices: (0, shared_1.getMembershipInvoicesByMemberId)(dataset, memberId),
            salesInvoices: (0, shared_1.getSalesInvoicesByMemberId)(dataset, memberId),
        };
    }
    async getPayrollPeriodDetail(payrollPeriodId) {
        const dataset = await this.loadDataset();
        const period = (0, shared_1.findPayrollPeriodById)(dataset, payrollPeriodId);
        if (!period) {
            throw new common_1.NotFoundException(`Payroll period ${payrollPeriodId} not found`);
        }
        return {
            period,
            entries: (0, shared_1.getPayrollEntriesByPeriodId)(dataset, payrollPeriodId),
        };
    }
    async getSalesInvoiceDetail(salesInvoiceId) {
        const dataset = await this.loadDataset();
        const salesInvoice = (0, shared_1.findSalesInvoiceById)(dataset, salesInvoiceId);
        if (!salesInvoice) {
            throw new common_1.NotFoundException(`Sales invoice ${salesInvoiceId} not found`);
        }
        return salesInvoice;
    }
    async getExpenseDetail(expenseId) {
        const dataset = await this.loadDataset();
        const expense = (0, shared_1.findOperatingExpenseById)(dataset, expenseId);
        if (!expense) {
            throw new common_1.NotFoundException(`Expense ${expenseId} not found`);
        }
        return expense;
    }
    async getEquipmentDetail(equipmentAssetId) {
        const dataset = await this.loadDataset();
        const equipmentAsset = (0, shared_1.findEquipmentAssetById)(dataset, equipmentAssetId);
        if (!equipmentAsset) {
            throw new common_1.NotFoundException(`Equipment ${equipmentAssetId} not found`);
        }
        return equipmentAsset;
    }
    async submitPayrollPeriod(payrollPeriodId, submittedByUserId) {
        return this.transitionPayrollPeriodStatus(payrollPeriodId, "PENDING_APPROVAL", submittedByUserId);
    }
    async approvePayrollPeriod(payrollPeriodId, approvedByUserId) {
        return this.transitionPayrollPeriodStatus(payrollPeriodId, "APPROVED", approvedByUserId);
    }
    async markPayrollPeriodPaid(payrollPeriodId, paidByUserId) {
        return this.transitionPayrollPeriodStatus(payrollPeriodId, "PAID", paidByUserId);
    }
    async submitExpense(expenseId) {
        return this.transitionExpenseStatus(expenseId, "PENDING_APPROVAL");
    }
    async approveExpense(expenseId, approvedByUserId) {
        return this.transitionExpenseStatus(expenseId, "APPROVED", {
            approvedByUserId,
        });
    }
    async rejectExpense(expenseId, rejectionReason) {
        return this.transitionExpenseStatus(expenseId, "REJECTED", {
            rejectionReason,
        });
    }
    async markExpensePaid(expenseId) {
        return this.transitionExpenseStatus(expenseId, "PAID");
    }
    async confirmSalesInvoice(salesInvoiceId) {
        return this.transitionSalesInvoiceStatus(salesInvoiceId, "CONFIRMED");
    }
    async cancelSalesInvoice(salesInvoiceId, cancellationReason) {
        return this.transitionSalesInvoiceStatus(salesInvoiceId, "CANCELLED", cancellationReason);
    }
    async exportReport(reportType, format) {
        const snapshot = await this.getSnapshot();
        const reportData = this.getReportData(snapshot, reportType);
        const exportedAt = new Date().toISOString();
        const rows = this.toExportRows(reportData);
        if (format === "xlsx") {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(rows);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
            return {
                content: XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }),
                fileName: `${reportType}-report-${exportedAt.slice(0, 10)}.xlsx`,
                mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            };
        }
        return {
            content: await this.toPdfBuffer(reportType, exportedAt, rows),
            fileName: `${reportType}-report-${exportedAt.slice(0, 10)}.pdf`,
            mimeType: "application/pdf",
        };
    }
    async createPersonalTrainer(createPersonalTrainerDto) {
        const em = this.createEntityManager();
        const trainerData = this.toPersonalTrainerEntityData(createPersonalTrainerDto);
        const trainer = em.create(gym_management_entity_1.PersonalTrainerEntity, trainerData);
        em.persist(trainer);
        await em.flush();
        return (0, gym_management_mapper_1.mapPersonalTrainerEntity)(trainer);
    }
    async updatePersonalTrainer(ptId, updatePersonalTrainerDto) {
        const em = this.createEntityManager();
        const trainer = await this.getRequiredPersonalTrainerEntity(em, ptId);
        (0, core_1.wrap)(trainer).assign(this.toPersonalTrainerEntityData(updatePersonalTrainerDto), { ignoreUndefined: true });
        await em.flush();
        return (0, gym_management_mapper_1.mapPersonalTrainerEntity)(trainer);
    }
    async deletePersonalTrainer(ptId) {
        const em = this.createEntityManager();
        const trainer = await this.getRequiredPersonalTrainerEntity(em, ptId);
        trainer.status = "INACTIVE";
        await em.flush();
        return (0, gym_management_mapper_1.mapPersonalTrainerEntity)(trainer);
    }
    async createMember(createMemberDto) {
        const em = this.createEntityManager();
        const memberData = this.toMemberEntityData(createMemberDto);
        const member = em.create(gym_management_entity_1.MemberEntity, memberData);
        em.persist(member);
        await em.flush();
        return (0, gym_management_mapper_1.mapMemberEntity)(member);
    }
    async updateMember(memberId, updateMemberDto) {
        const em = this.createEntityManager();
        const member = await this.getRequiredMemberEntity(em, memberId);
        (0, core_1.wrap)(member).assign(this.toMemberEntityData(updateMemberDto), {
            ignoreUndefined: true,
        });
        await em.flush();
        return (0, gym_management_mapper_1.mapMemberEntity)(member);
    }
    async deleteMember(memberId) {
        const em = this.createEntityManager();
        const member = await this.getRequiredMemberEntity(em, memberId);
        member.status = "INACTIVE";
        await em.flush();
        return (0, gym_management_mapper_1.mapMemberEntity)(member);
    }
    async createMembershipPlan(createMembershipPlanDto) {
        const em = this.createEntityManager();
        const membershipPlanData = this.toMembershipPlanEntityData(createMembershipPlanDto);
        const membershipPlan = em.create(gym_management_entity_1.MembershipPlanEntity, membershipPlanData);
        em.persist(membershipPlan);
        await em.flush();
        return (0, gym_management_mapper_1.mapMembershipPlanEntity)(membershipPlan);
    }
    async updateMembershipPlan(membershipPlanId, updateMembershipPlanDto) {
        const em = this.createEntityManager();
        const membershipPlan = await this.getRequiredMembershipPlanEntity(em, membershipPlanId);
        (0, core_1.wrap)(membershipPlan).assign(this.toMembershipPlanEntityData(updateMembershipPlanDto), { ignoreUndefined: true });
        await em.flush();
        return (0, gym_management_mapper_1.mapMembershipPlanEntity)(membershipPlan);
    }
    async deleteMembershipPlan(membershipPlanId) {
        const em = this.createEntityManager();
        const membershipPlan = await this.getRequiredMembershipPlanEntity(em, membershipPlanId);
        membershipPlan.status = "OFF_SALE";
        await em.flush();
        return (0, gym_management_mapper_1.mapMembershipPlanEntity)(membershipPlan);
    }
    async createProduct(createProductDto) {
        const em = this.createEntityManager();
        const productData = this.toProductEntityData(createProductDto);
        const product = em.create(gym_management_entity_1.ProductEntity, productData);
        em.persist(product);
        await em.flush();
        return (0, gym_management_mapper_1.mapProductEntity)(product);
    }
    async updateProduct(productId, updateProductDto) {
        const em = this.createEntityManager();
        const product = await this.getRequiredProductEntity(em, productId);
        (0, core_1.wrap)(product).assign(this.toProductEntityData(updateProductDto), {
            ignoreUndefined: true,
        });
        await em.flush();
        return (0, gym_management_mapper_1.mapProductEntity)(product);
    }
    async deleteProduct(productId) {
        const em = this.createEntityManager();
        const product = await this.getRequiredProductEntity(em, productId);
        product.status = "INACTIVE";
        await em.flush();
        return (0, gym_management_mapper_1.mapProductEntity)(product);
    }
    async createEquipment(createEquipmentDto) {
        const em = this.createEntityManager();
        const equipmentAssetData = this.toEquipmentAssetEntityData(createEquipmentDto);
        const equipmentAsset = em.create(gym_management_entity_1.EquipmentAssetEntity, equipmentAssetData);
        em.persist(equipmentAsset);
        await em.flush();
        return (0, gym_management_mapper_1.mapEquipmentAssetEntity)(equipmentAsset);
    }
    async updateEquipment(equipmentAssetId, updateEquipmentDto) {
        const em = this.createEntityManager();
        const equipmentAsset = await this.getRequiredEquipmentAssetEntity(em, equipmentAssetId);
        (0, core_1.wrap)(equipmentAsset).assign(this.toEquipmentAssetEntityData(updateEquipmentDto), { ignoreUndefined: true });
        await em.flush();
        return (0, gym_management_mapper_1.mapEquipmentAssetEntity)(equipmentAsset);
    }
    async createOperatingExpense(createOperatingExpenseDto) {
        const em = this.createEntityManager();
        const operatingExpenseData = (await this.toOperatingExpenseEntityData(em, createOperatingExpenseDto));
        const operatingExpense = em.create(gym_management_entity_1.OperatingExpenseEntity, operatingExpenseData);
        this.resetOperatingExpenseWorkflow(operatingExpense);
        em.persist(operatingExpense);
        await em.flush();
        return (0, gym_management_mapper_1.mapOperatingExpenseEntity)(operatingExpense);
    }
    async updateOperatingExpense(expenseId, updateOperatingExpenseDto) {
        const em = this.createEntityManager();
        const operatingExpense = await this.getRequiredOperatingExpenseEntity(em, expenseId);
        if (!["DRAFT", "REJECTED"].includes(operatingExpense.status)) {
            throw new common_1.BadRequestException("Only draft or rejected expenses can be updated");
        }
        (0, core_1.wrap)(operatingExpense).assign(await this.toOperatingExpenseEntityData(em, updateOperatingExpenseDto), {
            ignoreUndefined: true,
        });
        this.resetOperatingExpenseWorkflow(operatingExpense);
        await em.flush();
        return (0, gym_management_mapper_1.mapOperatingExpenseEntity)(operatingExpense);
    }
    async patchSystemConfig(configKey, patchSystemConfigDto) {
        const em = this.createEntityManager();
        const systemConfig = await this.getRequiredSystemConfigEntity(em, configKey);
        systemConfig.value = patchSystemConfigDto.value;
        await em.flush();
        return (0, gym_management_mapper_1.mapSystemConfigEntity)(systemConfig);
    }
    createEntityManager() {
        return this.orm.em.fork();
    }
    async transitionPayrollPeriodStatus(payrollPeriodId, nextStatus, actorUserId) {
        const em = this.createEntityManager();
        const payrollPeriod = await em.findOne(gym_management_entity_1.PayrollPeriodEntity, {
            id: payrollPeriodId,
        });
        if (!payrollPeriod) {
            throw new common_1.NotFoundException(`Payroll period ${payrollPeriodId} not found`);
        }
        this.ensureAllowedTransition("Payroll period", payrollPeriod.status, nextStatus, payrollPeriodTransitions);
        const actor = await this.resolveApprovedByUser(em, actorUserId);
        if (!actor) {
            throw new common_1.NotFoundException(`User ${actorUserId} not found`);
        }
        const payrollEntries = await em.find(gym_management_entity_1.PayrollEntryEntity, { payrollPeriod });
        if (nextStatus === "PENDING_APPROVAL") {
            payrollPeriod.submittedAt = new Date();
            payrollPeriod.approvedByUser = null;
            payrollPeriod.approvedAt = null;
            payrollPeriod.paidAt = null;
        }
        if (nextStatus === "APPROVED") {
            if (!payrollPeriod.submittedAt) {
                throw new common_1.BadRequestException("Payroll period must be submitted before approval");
            }
            for (const entry of payrollEntries) {
                this.ensureAllowedTransition("Payroll entry", entry.status, "APPROVED", payrollEntryTransitions);
                entry.status = "APPROVED";
            }
            payrollPeriod.approvedByUser = actor;
            payrollPeriod.approvedAt = new Date();
            payrollPeriod.paidAt = null;
        }
        if (nextStatus === "PAID") {
            if (!payrollPeriod.approvedAt || !payrollPeriod.approvedByUser) {
                throw new common_1.BadRequestException("Payroll period must be approved before payout");
            }
            for (const entry of payrollEntries) {
                this.ensureAllowedTransition("Payroll entry", entry.status, "PAID", payrollEntryTransitions);
                entry.status = "PAID";
            }
            payrollPeriod.paidAt = new Date();
        }
        payrollPeriod.status = nextStatus;
        await em.flush();
        return this.getPayrollPeriodDetail(payrollPeriodId);
    }
    async transitionExpenseStatus(expenseId, nextStatus, options) {
        const em = this.createEntityManager();
        const expense = await this.getRequiredOperatingExpenseEntity(em, expenseId);
        this.ensureAllowedTransition("Operating expense", expense.status, nextStatus, operatingExpenseTransitions);
        if (nextStatus === "PENDING_APPROVAL") {
            expense.submittedAt = new Date();
            expense.approvedByUser = null;
            expense.approvedAt = null;
            expense.rejectedAt = null;
            expense.rejectionReason = null;
            expense.paidAt = null;
        }
        if (nextStatus === "APPROVED") {
            if (!expense.submittedAt) {
                throw new common_1.BadRequestException("Expense must be submitted before approval");
            }
            const approvedByUser = await this.resolveApprovedByUser(em, options?.approvedByUserId);
            if (!approvedByUser) {
                throw new common_1.BadRequestException("approvedByUserId is required when approving expenses");
            }
            expense.approvedByUser = approvedByUser;
            expense.approvedAt = new Date();
            expense.rejectedAt = null;
            expense.rejectionReason = null;
            expense.paidAt = null;
        }
        if (nextStatus === "REJECTED") {
            if (!options?.rejectionReason?.trim()) {
                throw new common_1.BadRequestException("rejectionReason is required when rejecting expenses");
            }
            expense.approvedByUser = null;
            expense.approvedAt = null;
            expense.rejectedAt = new Date();
            expense.rejectionReason = options.rejectionReason.trim();
            expense.paidAt = null;
        }
        if (nextStatus === "DRAFT") {
            expense.submittedAt = null;
            expense.approvedByUser = null;
            expense.approvedAt = null;
            expense.rejectedAt = null;
            expense.rejectionReason = null;
            expense.paidAt = null;
        }
        if (nextStatus === "PAID") {
            if (!expense.approvedAt || !expense.approvedByUser) {
                throw new common_1.BadRequestException("Expense must be approved before payout");
            }
            expense.paidAt = new Date();
        }
        expense.status = nextStatus;
        await em.flush();
        return (0, gym_management_mapper_1.mapOperatingExpenseEntity)(expense);
    }
    resetOperatingExpenseWorkflow(expense) {
        expense.status = "DRAFT";
        expense.submittedAt = null;
        expense.approvedByUser = null;
        expense.approvedAt = null;
        expense.rejectedAt = null;
        expense.rejectionReason = null;
        expense.paidAt = null;
    }
    async transitionSalesInvoiceStatus(salesInvoiceId, nextStatus, cancellationReason) {
        const em = this.createEntityManager();
        const salesInvoice = await em.findOne(gym_management_entity_1.SalesInvoiceEntity, { id: salesInvoiceId }, { populate: ["createdByUser", "member"] });
        if (!salesInvoice) {
            throw new common_1.NotFoundException(`Sales invoice ${salesInvoiceId} not found`);
        }
        this.ensureAllowedTransition("Sales invoice", salesInvoice.status, nextStatus, salesInvoiceTransitions);
        const invoiceItems = await em.find(gym_management_entity_1.SalesInvoiceItemEntity, { salesInvoice }, { populate: ["product", "salesInvoice"] });
        if (nextStatus === "CONFIRMED") {
            for (const invoiceItem of invoiceItems) {
                if (invoiceItem.product.stockOnHand < invoiceItem.quantity) {
                    throw new common_1.ConflictException(`Insufficient stock for product ${invoiceItem.product.code}`);
                }
            }
            for (const invoiceItem of invoiceItems) {
                invoiceItem.product.stockOnHand -= invoiceItem.quantity;
                em.persist(this.toInventoryTransactionForInvoice(em, invoiceItem, "SALE", -invoiceItem.quantity));
            }
            salesInvoice.confirmedAt = new Date();
            salesInvoice.cancelledAt = null;
            salesInvoice.cancellationReason = null;
        }
        if (nextStatus === "CANCELLED") {
            if (!salesInvoice.confirmedAt) {
                throw new common_1.BadRequestException("Sales invoice must be confirmed before cancellation");
            }
            if (!cancellationReason?.trim()) {
                throw new common_1.BadRequestException("cancellationReason is required when cancelling sales invoice");
            }
            for (const invoiceItem of invoiceItems) {
                invoiceItem.product.stockOnHand += invoiceItem.quantity;
                em.persist(this.toInventoryTransactionForInvoice(em, invoiceItem, "ADJUSTMENT", invoiceItem.quantity));
            }
            salesInvoice.cancelledAt = new Date();
            salesInvoice.cancellationReason = cancellationReason.trim();
        }
        salesInvoice.status = nextStatus;
        await em.flush();
        return this.getSalesInvoiceDetail(salesInvoiceId);
    }
    toInventoryTransactionForInvoice(em, invoiceItem, type, quantity) {
        return em.create(gym_management_entity_1.InventoryTransactionEntity, {
            product: invoiceItem.product,
            type,
            quantity,
            unitCost: invoiceItem.unitCost,
            transactionDate: new Date(),
            referenceCode: invoiceItem.salesInvoice.code,
            note: `${type} from invoice ${invoiceItem.salesInvoice.code}`,
        });
    }
    ensureAllowedTransition(resourceLabel, currentStatus, nextStatus, transitions) {
        if (!transitions[currentStatus].includes(nextStatus)) {
            throw new common_1.BadRequestException(`${resourceLabel} transition ${currentStatus} -> ${nextStatus} is not allowed`);
        }
    }
    getReportData(snapshot, reportType) {
        if (reportType === "payroll") {
            return snapshot.payrollReport;
        }
        if (reportType === "revenue") {
            return snapshot.revenueReport;
        }
        if (reportType === "expenses") {
            return snapshot.expenseReport;
        }
        return snapshot.profitReport;
    }
    toExportRows(reportData) {
        if (Array.isArray(reportData)) {
            return reportData.map((entry, index) => this.flattenToRow(entry, { index: index + 1 }));
        }
        if (reportData && typeof reportData === "object") {
            return [this.flattenToRow(reportData)];
        }
        return [{ value: String(reportData) }];
    }
    flattenToRow(value, seed = {}, prefix = "") {
        const row = { ...seed };
        if (!value || typeof value !== "object") {
            if (prefix) {
                row[prefix] = String(value);
            }
            return row;
        }
        for (const [entryKey, entryValue] of Object.entries(value)) {
            const nextKey = prefix ? `${prefix}.${entryKey}` : entryKey;
            if (entryValue === null ||
                typeof entryValue === "string" ||
                typeof entryValue === "number" ||
                typeof entryValue === "boolean") {
                row[nextKey] = entryValue ?? "";
                continue;
            }
            if (Array.isArray(entryValue)) {
                row[nextKey] = JSON.stringify(entryValue);
                continue;
            }
            Object.assign(row, this.flattenToRow(entryValue, {}, nextKey));
        }
        return row;
    }
    async toPdfBuffer(reportType, exportedAt, rows) {
        const document = new PDFDocument({ margin: 36, size: "A4" });
        const buffers = [];
        document.on("data", (chunk) => {
            buffers.push(chunk);
        });
        const completion = new Promise((resolve) => {
            document.on("end", () => {
                resolve(node_buffer_1.Buffer.concat(buffers));
            });
        });
        document
            .fontSize(16)
            .text(`${reportType.toUpperCase()} REPORT`, { underline: true });
        document.moveDown(0.5);
        document.fontSize(10).text(`Generated at: ${exportedAt}`);
        document.moveDown();
        for (const row of rows) {
            for (const [key, value] of Object.entries(row)) {
                document.fontSize(9).text(`${key}: ${String(value)}`);
            }
            document.moveDown(0.75);
        }
        document.end();
        return completion;
    }
    toVietnamDate(value) {
        const formatter = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Ho_Chi_Minh",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        const [year, month, day] = formatter.format(value).split("-");
        return (0, gym_management_mapper_1.parseDateOnly)(`${year}-${month}-${day}`);
    }
    async findActivePtContractEntity(em, ptId, attendanceDate) {
        const dateOnly = attendanceDate.toISOString().slice(0, 10);
        const contract = await em.findOne(gym_management_entity_1.PtContractEntity, {
            personalTrainer: ptId,
            effectiveFrom: { $lte: (0, gym_management_mapper_1.parseDateOnly)(dateOnly) },
            effectiveTo: { $gte: (0, gym_management_mapper_1.parseDateOnly)(dateOnly) },
        }, { orderBy: { effectiveFrom: "desc", createdAt: "desc" } });
        return contract ?? undefined;
    }
    async findAttendanceLogForCheckOut(em, pt, attendanceLogId) {
        if (attendanceLogId) {
            return ((await em.findOne(gym_management_entity_1.AttendanceLogEntity, {
                id: attendanceLogId,
                personalTrainer: pt,
            })) ?? undefined);
        }
        return ((await em.findOne(gym_management_entity_1.AttendanceLogEntity, { personalTrainer: pt, checkOutAt: null }, { orderBy: { checkInAt: "desc", createdAt: "desc" } })) ?? undefined);
    }
    async getStringSystemConfig(em, key, fallbackValue) {
        const systemConfig = await em.findOne(gym_management_entity_1.SystemConfigEntity, { key });
        return systemConfig?.value?.trim() || fallbackValue;
    }
    async getNumberSystemConfig(em, key, fallbackValue) {
        const rawValue = await this.getStringSystemConfig(em, key, fallbackValue.toString());
        const numericValue = Number(rawValue);
        return Number.isFinite(numericValue) ? numericValue : fallbackValue;
    }
    async getBooleanSystemConfig(em, key, fallbackValue) {
        const rawValue = (await this.getStringSystemConfig(em, key, fallbackValue.toString())).toLowerCase();
        if (rawValue === "true") {
            return true;
        }
        if (rawValue === "false") {
            return false;
        }
        return fallbackValue;
    }
    async issueAuthTokens(payload) {
        const accessToken = this.generateOpaqueToken("access");
        const refreshToken = this.generateOpaqueToken("refresh");
        await this.redisService.setJson(this.toAccessTokenKey(accessToken), payload, ACCESS_TOKEN_TTL_SECONDS);
        await this.redisService.setJson(this.toRefreshTokenKey(refreshToken), payload, REFRESH_TOKEN_TTL_SECONDS);
        return {
            accessToken,
            refreshToken,
        };
    }
    generateOpaqueToken(prefix) {
        return `${prefix}_${(0, node_crypto_1.randomBytes)(32).toString("base64url")}`;
    }
    toAccessTokenKey(accessToken) {
        return `auth:access:${accessToken}`;
    }
    toRefreshTokenKey(refreshToken) {
        return `auth:refresh:${refreshToken}`;
    }
    toRevokedAccessTokenKey(accessToken) {
        return `auth:revoked:access:${accessToken}`;
    }
    async resolvePtIdForUser(em, user) {
        const trainer = await em.findOne(gym_management_entity_1.PersonalTrainerEntity, {
            email: user.email,
        });
        return trainer?.id;
    }
    async loadDataset() {
        const em = this.createEntityManager();
        const [users, personalTrainers, ptContracts, attendanceLogs, payrollPeriods, payrollEntries, members, membershipPlans, memberMemberships, memberPtAssignments, membershipInvoices, products, inventoryTransactions, salesInvoices, salesInvoiceItems, operatingExpenses, equipmentAssets, maintenanceRecords, systemConfigs,] = await Promise.all([
            em.findAll(gym_management_entity_1.UserEntity, { orderBy: { createdAt: "asc", id: "asc" } }),
            em.findAll(gym_management_entity_1.PersonalTrainerEntity, { orderBy: { code: "asc" } }),
            em.findAll(gym_management_entity_1.PtContractEntity, {
                orderBy: { effectiveFrom: "asc", id: "asc" },
            }),
            em.findAll(gym_management_entity_1.AttendanceLogEntity, {
                orderBy: { attendanceDate: "asc", checkInAt: "asc", id: "asc" },
            }),
            em.findAll(gym_management_entity_1.PayrollPeriodEntity, {
                orderBy: { fromDate: "asc", id: "asc" },
            }),
            em.findAll(gym_management_entity_1.PayrollEntryEntity, {
                orderBy: { createdAt: "asc", id: "asc" },
            }),
            em.findAll(gym_management_entity_1.MemberEntity, { orderBy: { code: "asc" } }),
            em.findAll(gym_management_entity_1.MembershipPlanEntity, { orderBy: { code: "asc" } }),
            em.findAll(gym_management_entity_1.MemberMembershipEntity, {
                orderBy: { startDate: "asc", id: "asc" },
            }),
            em.findAll(gym_management_entity_1.MemberPtAssignmentEntity, {
                orderBy: { assignedFrom: "asc", id: "asc" },
            }),
            em.findAll(gym_management_entity_1.MembershipInvoiceEntity, {
                orderBy: { invoiceDate: "asc", id: "asc" },
            }),
            em.findAll(gym_management_entity_1.ProductEntity, { orderBy: { code: "asc" } }),
            em.findAll(gym_management_entity_1.InventoryTransactionEntity, {
                orderBy: { transactionDate: "asc", id: "asc" },
            }),
            em.findAll(gym_management_entity_1.SalesInvoiceEntity, {
                orderBy: { invoiceDate: "asc", id: "asc" },
            }),
            em.findAll(gym_management_entity_1.SalesInvoiceItemEntity, {
                orderBy: { createdAt: "asc", id: "asc" },
            }),
            em.findAll(gym_management_entity_1.OperatingExpenseEntity, {
                orderBy: { expenseDate: "asc", id: "asc" },
            }),
            em.findAll(gym_management_entity_1.EquipmentAssetEntity, { orderBy: { code: "asc" } }),
            em.findAll(gym_management_entity_1.MaintenanceRecordEntity, {
                orderBy: { maintenanceDate: "asc", id: "asc" },
            }),
            em.findAll(gym_management_entity_1.SystemConfigEntity, { orderBy: { key: "asc" } }),
        ]);
        return (0, gym_management_mapper_1.mapDatasetFromEntities)({
            users,
            personalTrainers,
            ptContracts,
            attendanceLogs,
            payrollPeriods,
            payrollEntries,
            members,
            membershipPlans,
            memberMemberships,
            memberPtAssignments,
            membershipInvoices,
            products,
            inventoryTransactions,
            salesInvoices,
            salesInvoiceItems,
            operatingExpenses,
            equipmentAssets,
            maintenanceRecords,
            systemConfigs,
        });
    }
    toPersonalTrainerEntityData(dto) {
        const data = {};
        if (dto.code !== undefined) {
            data.code = dto.code;
        }
        if (dto.fullName !== undefined) {
            data.fullName = dto.fullName;
        }
        if (dto.gender !== undefined) {
            data.gender = dto.gender;
        }
        if (dto.birthDate !== undefined) {
            data.birthDate = (0, gym_management_mapper_1.parseDateOnly)(dto.birthDate);
        }
        if (dto.phone !== undefined) {
            data.phone = dto.phone;
        }
        if (dto.email !== undefined) {
            data.email = dto.email;
        }
        if (dto.address !== undefined) {
            data.address = dto.address;
        }
        if (dto.status !== undefined) {
            data.status = dto.status;
        }
        if (dto.specialties !== undefined) {
            data.specialties = dto.specialties;
        }
        if (dto.experienceYears !== undefined) {
            data.experienceYears = dto.experienceYears;
        }
        if (dto.avatarUrl !== undefined) {
            data.avatarUrl = dto.avatarUrl;
        }
        if (dto.startDate !== undefined) {
            data.startDate = (0, gym_management_mapper_1.parseDateOnly)(dto.startDate);
        }
        return data;
    }
    toMemberEntityData(dto) {
        const data = {};
        if (dto.code !== undefined) {
            data.code = dto.code;
        }
        if (dto.fullName !== undefined) {
            data.fullName = dto.fullName;
        }
        if (dto.gender !== undefined) {
            data.gender = dto.gender;
        }
        if (dto.birthDate !== undefined) {
            data.birthDate = (0, gym_management_mapper_1.parseDateOnly)(dto.birthDate);
        }
        if (dto.phone !== undefined) {
            data.phone = dto.phone;
        }
        if (dto.email !== undefined) {
            data.email = dto.email;
        }
        if (dto.address !== undefined) {
            data.address = dto.address;
        }
        if (dto.heightCm !== undefined) {
            data.heightCm = dto.heightCm;
        }
        if (dto.weightKg !== undefined) {
            data.weightKg = dto.weightKg;
        }
        if (dto.goal !== undefined) {
            data.goal = dto.goal;
        }
        if (dto.healthNotes !== undefined) {
            data.healthNotes = dto.healthNotes;
        }
        if (dto.registeredAt !== undefined) {
            data.registeredAt = (0, gym_management_mapper_1.parseDateOnly)(dto.registeredAt);
        }
        if (dto.status !== undefined) {
            data.status = dto.status;
        }
        return data;
    }
    toMembershipPlanEntityData(dto) {
        const data = {};
        if (dto.code !== undefined) {
            data.code = dto.code;
        }
        if (dto.name !== undefined) {
            data.name = dto.name;
        }
        if (dto.type !== undefined) {
            data.type = dto.type;
        }
        if (dto.price !== undefined) {
            data.price = (0, gym_management_mapper_1.toDecimalString)(dto.price);
        }
        if (dto.durationDays !== undefined) {
            data.durationDays = dto.durationDays;
        }
        if (dto.usageLimit !== undefined) {
            data.usageLimit = dto.usageLimit;
        }
        if (dto.includesPt !== undefined) {
            data.includesPt = dto.includesPt;
        }
        if (dto.includedPtSessions !== undefined) {
            data.includedPtSessions = dto.includedPtSessions;
        }
        if (dto.perks !== undefined) {
            data.perks = dto.perks;
        }
        if (dto.status !== undefined) {
            data.status = dto.status;
        }
        return data;
    }
    toProductEntityData(dto) {
        const data = {};
        if (dto.code !== undefined) {
            data.code = dto.code;
        }
        if (dto.name !== undefined) {
            data.name = dto.name;
        }
        if (dto.category !== undefined) {
            data.category = dto.category;
        }
        if (dto.unitCost !== undefined) {
            data.unitCost = (0, gym_management_mapper_1.toDecimalString)(dto.unitCost);
        }
        if (dto.salePrice !== undefined) {
            data.salePrice = (0, gym_management_mapper_1.toDecimalString)(dto.salePrice);
        }
        if (dto.stockOnHand !== undefined) {
            data.stockOnHand = dto.stockOnHand;
        }
        if (dto.minimumStockLevel !== undefined) {
            data.minimumStockLevel = dto.minimumStockLevel;
        }
        if (dto.status !== undefined) {
            data.status = dto.status;
        }
        return data;
    }
    toEquipmentAssetEntityData(dto) {
        const data = {};
        if (dto.code !== undefined) {
            data.code = dto.code;
        }
        if (dto.name !== undefined) {
            data.name = dto.name;
        }
        if (dto.purchasedAt !== undefined) {
            data.purchasedAt = (0, gym_management_mapper_1.parseDateOnly)(dto.purchasedAt);
        }
        if (dto.purchaseValue !== undefined) {
            data.purchaseValue = (0, gym_management_mapper_1.toDecimalString)(dto.purchaseValue);
        }
        if (dto.condition !== undefined) {
            data.condition = dto.condition;
        }
        if (dto.nextMaintenanceAt !== undefined) {
            data.nextMaintenanceAt = (0, gym_management_mapper_1.parseDateOnly)(dto.nextMaintenanceAt);
        }
        if (dto.note !== undefined) {
            data.note = dto.note;
        }
        return data;
    }
    async toOperatingExpenseEntityData(em, dto) {
        const data = {};
        if (dto.code !== undefined) {
            data.code = dto.code;
        }
        if (dto.expenseDate !== undefined) {
            data.expenseDate = (0, gym_management_mapper_1.parseDateOnly)(dto.expenseDate);
        }
        if (dto.category !== undefined) {
            data.category = dto.category;
        }
        if (dto.equipmentAssetId !== undefined) {
            data.equipmentAsset =
                (await this.resolveEquipmentAsset(em, dto.equipmentAssetId)) ?? null;
        }
        if (dto.vendorName !== undefined) {
            data.vendorName = dto.vendorName;
        }
        if (dto.amount !== undefined) {
            data.amount = (0, gym_management_mapper_1.toDecimalString)(dto.amount);
        }
        if (dto.description !== undefined) {
            data.description = dto.description;
        }
        if (dto.attachmentUrl !== undefined) {
            data.attachmentUrl = dto.attachmentUrl;
        }
        return data;
    }
    async resolveEquipmentAsset(em, equipmentAssetId) {
        if (equipmentAssetId === undefined || equipmentAssetId === null) {
            return undefined;
        }
        const equipmentAsset = await em.findOne(gym_management_entity_1.EquipmentAssetEntity, {
            id: equipmentAssetId,
        });
        if (!equipmentAsset) {
            throw new common_1.NotFoundException(`Equipment ${equipmentAssetId} not found`);
        }
        return equipmentAsset;
    }
    async resolveApprovedByUser(em, approvedByUserId) {
        if (approvedByUserId === undefined || approvedByUserId === null) {
            return undefined;
        }
        const approvedByUser = await em.findOne(gym_management_entity_1.UserEntity, {
            id: approvedByUserId,
        });
        if (!approvedByUser) {
            throw new common_1.NotFoundException(`User ${approvedByUserId} not found`);
        }
        return approvedByUser;
    }
    async getRequiredPersonalTrainerEntity(em, ptId) {
        const personalTrainer = await em.findOne(gym_management_entity_1.PersonalTrainerEntity, {
            id: ptId,
        });
        if (!personalTrainer) {
            throw new common_1.NotFoundException(`PT ${ptId} not found`);
        }
        return personalTrainer;
    }
    async getRequiredMemberEntity(em, memberId) {
        const member = await em.findOne(gym_management_entity_1.MemberEntity, { id: memberId });
        if (!member) {
            throw new common_1.NotFoundException(`Member ${memberId} not found`);
        }
        return member;
    }
    async getRequiredMembershipPlanEntity(em, membershipPlanId) {
        return this.findMembershipPlanOrThrow(em, membershipPlanId);
    }
    async findMembershipPlanOrThrow(em, membershipPlanId) {
        const membershipPlan = await em.findOne(gym_management_entity_1.MembershipPlanEntity, {
            id: membershipPlanId,
        });
        if (!membershipPlan) {
            throw new common_1.NotFoundException(`Membership plan ${membershipPlanId} not found`);
        }
        return membershipPlan;
    }
    async getRequiredProductEntity(em, productId) {
        const product = await em.findOne(gym_management_entity_1.ProductEntity, { id: productId });
        if (!product) {
            throw new common_1.NotFoundException(`Product ${productId} not found`);
        }
        return product;
    }
    async getRequiredOperatingExpenseEntity(em, expenseId) {
        return this.findOperatingExpenseOrThrow(em, expenseId);
    }
    async getRequiredEquipmentAssetEntity(em, equipmentAssetId) {
        const equipmentAsset = await em.findOne(gym_management_entity_1.EquipmentAssetEntity, {
            id: equipmentAssetId,
        });
        if (!equipmentAsset) {
            throw new common_1.NotFoundException(`Equipment ${equipmentAssetId} not found`);
        }
        return equipmentAsset;
    }
    async findOperatingExpenseOrThrow(em, expenseId) {
        const operatingExpense = await em.findOne(gym_management_entity_1.OperatingExpenseEntity, {
            id: expenseId,
        });
        if (!operatingExpense) {
            throw new common_1.NotFoundException(`Expense ${expenseId} not found`);
        }
        return operatingExpense;
    }
    async getRequiredSystemConfigEntity(em, configKey) {
        const systemConfig = await em.findOne(gym_management_entity_1.SystemConfigEntity, {
            key: configKey,
        });
        if (!systemConfig) {
            throw new common_1.NotFoundException(`System config ${configKey} not found`);
        }
        return systemConfig;
    }
};
exports.GymManagementService = GymManagementService;
exports.GymManagementService = GymManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.MikroORM,
        redis_service_1.RedisService])
], GymManagementService);
//# sourceMappingURL=gym-management.service.js.map