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
const auth_crypto_1 = require("./auth/auth-crypto");
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
const payrollPeriodStatuses = [
    "OPEN",
    "PENDING_APPROVAL",
    "APPROVED",
    "PAID",
];
const payrollEntryStatuses = ["PENDING_APPROVAL", "APPROVED", "PAID"];
const operatingExpenseStatuses = [
    "DRAFT",
    "PENDING_APPROVAL",
    "APPROVED",
    "REJECTED",
    "PAID",
];
const salesInvoiceStatuses = ["DRAFT", "CONFIRMED", "CANCELLED"];
const authTokenRoles = ["ADMIN", "STAFF"];
const genderValues = ["MALE", "FEMALE", "OTHER"];
function isOneOf(value, acceptedValues) {
    return acceptedValues.includes(value);
}
function coerceEnumValue(value, acceptedValues, fallback) {
    return isOneOf(value, acceptedValues) ? value : fallback;
}
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
    async login(username, password) {
        const em = this.createEntityManager();
        const userEntity = await em.findOne(gym_management_entity_1.UserEntity, { username });
        if (!userEntity || !(0, auth_crypto_1.verifyPassword)(password, userEntity.passwordHash)) {
            throw new common_1.UnauthorizedException("Invalid demo credentials");
        }
        if (userEntity.status !== "ACTIVE" || userEntity.deletedAt) {
            throw new common_1.UnauthorizedException("User account is inactive");
        }
        if (!userEntity.passwordHash.startsWith("scrypt$")) {
            userEntity.passwordHash = (0, auth_crypto_1.hashPassword)(password);
            await em.flush();
        }
        const user = (0, gym_management_mapper_1.mapUserEntity)(userEntity);
        const ptId = await this.resolvePtIdForUser(em, userEntity);
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
        const em = this.createEntityManager();
        const refreshTokenEntity = await em.findOne(gym_management_entity_1.RefreshTokenEntity, {
            tokenHash: (0, auth_crypto_1.hashOpaqueToken)(refreshToken),
            revokedAt: null,
        }, {
            populate: ["user"],
        });
        if (!refreshTokenEntity ||
            refreshTokenEntity.expiresAt.getTime() <= Date.now()) {
            throw new common_1.UnauthorizedException("Refresh token is invalid or expired");
        }
        const userEntity = refreshTokenEntity.user;
        if (userEntity?.status !== "ACTIVE" || userEntity.deletedAt) {
            throw new common_1.UnauthorizedException("User account is inactive");
        }
        const user = (0, gym_management_mapper_1.mapUserEntity)(userEntity);
        const ptId = await this.resolvePtIdForUser(em, userEntity);
        const accessToken = await this.issueAccessToken({
            sessionId: refreshTokenEntity.sessionId,
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
    async logout(refreshToken, accessToken) {
        const em = this.createEntityManager();
        const refreshTokenEntity = await em.findOne(gym_management_entity_1.RefreshTokenEntity, {
            tokenHash: (0, auth_crypto_1.hashOpaqueToken)(refreshToken),
            revokedAt: null,
        });
        if (refreshTokenEntity) {
            refreshTokenEntity.revokedAt = new Date();
            await em.flush();
        }
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
        const authTokenPayload = this.toAuthTokenPayload(payload);
        const em = this.createEntityManager();
        const userEntity = await em.findOne(gym_management_entity_1.UserEntity, {
            id: authTokenPayload.userId,
        });
        if (userEntity?.status !== "ACTIVE" || userEntity.deletedAt) {
            throw new common_1.UnauthorizedException("User account is inactive");
        }
        return {
            user: (0, gym_management_mapper_1.mapUserEntity)(userEntity),
            role: authTokenPayload.role,
            ptId: authTokenPayload.ptId,
            sessionId: authTokenPayload.sessionId,
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
        if (currentUser?.status !== "ACTIVE" || currentUser.deletedAt) {
            throw new common_1.UnauthorizedException("No demo users configured");
        }
        return (0, gym_management_mapper_1.mapUserEntity)(currentUser);
    }
    async updateAccountCredentials(userId, updates) {
        const em = this.createEntityManager();
        const user = await this.getRequiredUserEntity(em, userId);
        const nextFullName = updates.fullName?.trim();
        const nextUsername = updates.username?.trim();
        const nextPassword = updates.newPassword?.trim();
        const currentPassword = updates.currentPassword?.trim();
        if (!nextFullName && !nextUsername && !nextPassword) {
            throw new common_1.BadRequestException("Provide at least one field to update (fullName, username or newPassword)");
        }
        if (nextFullName && nextFullName !== user.fullName) {
            user.fullName = nextFullName;
        }
        if (nextUsername && nextUsername !== user.username) {
            const existingUser = await em.findOne(gym_management_entity_1.UserEntity, {
                username: nextUsername,
                id: { $ne: user.id },
            });
            if (existingUser) {
                throw new common_1.ConflictException("Username is already taken");
            }
            user.username = nextUsername;
        }
        if (nextPassword) {
            if (!currentPassword) {
                throw new common_1.BadRequestException("currentPassword is required when changing password");
            }
            if (!(0, auth_crypto_1.verifyPassword)(currentPassword, user.passwordHash)) {
                throw new common_1.UnauthorizedException("Current password is incorrect");
            }
            user.passwordHash = (0, auth_crypto_1.hashPassword)(nextPassword);
        }
        else if (currentPassword) {
            throw new common_1.BadRequestException("newPassword is required when currentPassword is provided");
        }
        await em.flush();
        return (0, gym_management_mapper_1.mapUserEntity)(user);
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
        this.assertCurrentVietnamDate(checkInAt, "checkInAt");
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
            paidHours: "0",
            overtimeHours: "0",
            status: "OPEN",
            workCredit: "0",
            note: null,
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
            throw new common_1.BadRequestException(`PT ${attendanceCheckOutDto.ptId} does not have an open shift to check out`);
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
        this.assertCurrentVietnamDate(attendanceLog.attendanceDate, "attendanceDate");
        this.assertCurrentVietnamDate(checkOutAt, "checkOutAt");
        if (checkOutAt <= attendanceLog.checkInAt) {
            throw new common_1.BadRequestException("Check out time must be after check in time");
        }
        const workedHours = Number(((checkOutAt.getTime() - attendanceLog.checkInAt.getTime()) /
            36e5).toFixed(2));
        const ptContract = await this.findActivePtContractEntity(em, pt.id, attendanceLog.attendanceDate);
        const fullShiftHours = ptContract
            ? Number(ptContract.minValidShiftHours)
            : await this.getNumberSystemConfig(em, "min_valid_shift_hours", 5);
        const standardShiftHours = ptContract
            ? Number(ptContract.standardShiftHours)
            : 8;
        const { status, workCredit } = this.resolveAttendanceStatusAndWorkCredit(workedHours, fullShiftHours);
        const { paidHours, overtimeHours } = this.calculateAttendanceCompensation(workedHours, standardShiftHours);
        attendanceLog.checkOutAt = checkOutAt;
        attendanceLog.workedHours = (0, gym_management_mapper_1.toDecimalString)(workedHours);
        attendanceLog.paidHours = (0, gym_management_mapper_1.toDecimalString)(paidHours);
        attendanceLog.overtimeHours = (0, gym_management_mapper_1.toDecimalString)(overtimeHours);
        attendanceLog.status = status;
        attendanceLog.workCredit = (0, gym_management_mapper_1.toDecimalString)(workCredit);
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
    async createPtContract(ptId, createPtContractDto) {
        const em = this.createEntityManager();
        const trainer = await this.getRequiredPersonalTrainerEntity(em, ptId);
        const effectiveFrom = (0, gym_management_mapper_1.parseDateOnly)(createPtContractDto.effectiveFrom);
        const effectiveTo = createPtContractDto.effectiveTo
            ? (0, gym_management_mapper_1.parseDateOnly)(createPtContractDto.effectiveTo)
            : null;
        this.ensureValidDateRange(effectiveFrom, effectiveTo, "PT contract");
        await this.ensurePtContractDateRangeAvailable(em, ptId, effectiveFrom, effectiveTo);
        const contract = em.create(gym_management_entity_1.PtContractEntity, {
            personalTrainer: trainer,
            contractCode: createPtContractDto.contractCode ??
                this.generateReferenceCode(`PTC-${trainer.code}`),
            contractType: createPtContractDto.contractType,
            salaryType: createPtContractDto.salaryType,
            baseSalary: (0, gym_management_mapper_1.toDecimalString)(createPtContractDto.baseSalary),
            minValidShiftHours: (0, gym_management_mapper_1.toDecimalString)(createPtContractDto.minValidShiftHours),
            standardShiftHours: (0, gym_management_mapper_1.toDecimalString)(createPtContractDto.standardShiftHours),
            overtimeHourlyRate: (0, gym_management_mapper_1.toDecimalString)(createPtContractDto.overtimeHourlyRate),
            performanceBonusThreshold: createPtContractDto.performanceBonusThreshold,
            performanceBonusAmount: (0, gym_management_mapper_1.toDecimalString)(createPtContractDto.performanceBonusAmount),
            packageCommissionRate: (0, gym_management_mapper_1.toDecimalString)(createPtContractDto.packageCommissionRate),
            salesCommissionRate: (0, gym_management_mapper_1.toDecimalString)(createPtContractDto.salesCommissionRate),
            allowances: (0, gym_management_mapper_1.toDecimalString)(createPtContractDto.allowances),
            penaltyRules: createPtContractDto.penaltyRules,
            effectiveFrom,
            effectiveTo,
        });
        em.persist(contract);
        await em.flush();
        return (0, gym_management_mapper_1.mapPtContractEntity)(contract);
    }
    async updatePtContract(ptId, contractId, updatePtContractDto) {
        const em = this.createEntityManager();
        await this.getRequiredPersonalTrainerEntity(em, ptId);
        const contract = await em.findOne(gym_management_entity_1.PtContractEntity, { id: contractId, personalTrainer: ptId }, { populate: ["personalTrainer"] });
        if (!contract) {
            throw new common_1.NotFoundException(`PT contract ${contractId} not found`);
        }
        const effectiveFrom = updatePtContractDto.effectiveFrom
            ? (0, gym_management_mapper_1.parseDateOnly)(updatePtContractDto.effectiveFrom)
            : contract.effectiveFrom;
        const effectiveTo = updatePtContractDto.effectiveTo !== undefined
            ? (0, gym_management_mapper_1.parseDateOnly)(updatePtContractDto.effectiveTo)
            : (contract.effectiveTo ?? null);
        this.ensureValidDateRange(effectiveFrom, effectiveTo, "PT contract");
        await this.ensurePtContractDateRangeAvailable(em, ptId, effectiveFrom, effectiveTo, contract.id);
        (0, core_1.wrap)(contract).assign({
            contractCode: updatePtContractDto.contractCode,
            contractType: updatePtContractDto.contractType,
            salaryType: updatePtContractDto.salaryType,
            baseSalary: updatePtContractDto.baseSalary === undefined
                ? undefined
                : (0, gym_management_mapper_1.toDecimalString)(updatePtContractDto.baseSalary),
            minValidShiftHours: updatePtContractDto.minValidShiftHours === undefined
                ? undefined
                : (0, gym_management_mapper_1.toDecimalString)(updatePtContractDto.minValidShiftHours),
            standardShiftHours: updatePtContractDto.standardShiftHours === undefined
                ? undefined
                : (0, gym_management_mapper_1.toDecimalString)(updatePtContractDto.standardShiftHours),
            overtimeHourlyRate: updatePtContractDto.overtimeHourlyRate === undefined
                ? undefined
                : (0, gym_management_mapper_1.toDecimalString)(updatePtContractDto.overtimeHourlyRate),
            performanceBonusThreshold: updatePtContractDto.performanceBonusThreshold,
            performanceBonusAmount: updatePtContractDto.performanceBonusAmount === undefined
                ? undefined
                : (0, gym_management_mapper_1.toDecimalString)(updatePtContractDto.performanceBonusAmount),
            packageCommissionRate: updatePtContractDto.packageCommissionRate === undefined
                ? undefined
                : (0, gym_management_mapper_1.toDecimalString)(updatePtContractDto.packageCommissionRate),
            salesCommissionRate: updatePtContractDto.salesCommissionRate === undefined
                ? undefined
                : (0, gym_management_mapper_1.toDecimalString)(updatePtContractDto.salesCommissionRate),
            allowances: updatePtContractDto.allowances === undefined
                ? undefined
                : (0, gym_management_mapper_1.toDecimalString)(updatePtContractDto.allowances),
            penaltyRules: updatePtContractDto.penaltyRules,
            effectiveFrom,
            effectiveTo,
        }, { ignoreUndefined: true });
        await em.flush();
        return (0, gym_management_mapper_1.mapPtContractEntity)(contract);
    }
    async createMemberMembership(createMemberMembershipDto) {
        const em = this.createEntityManager();
        const member = await this.getRequiredMemberEntity(em, createMemberMembershipDto.memberId);
        const membershipPlan = await this.getRequiredMembershipPlanEntity(em, createMemberMembershipDto.membershipPlanId);
        const activeMembership = await em.findOne(gym_management_entity_1.MemberMembershipEntity, {
            member,
            status: "ACTIVE",
            deletedAt: null,
        });
        if (activeMembership) {
            throw new common_1.ConflictException(`Member ${member.id} already has an active membership`);
        }
        const startDate = (0, gym_management_mapper_1.parseDateOnly)(createMemberMembershipDto.startDate);
        const trainer = createMemberMembershipDto.ptId
            ? await this.getRequiredPersonalTrainerEntity(em, createMemberMembershipDto.ptId)
            : null;
        if (membershipPlan.includesPt && !trainer) {
            throw new common_1.BadRequestException("ptId is required for plans that include PT");
        }
        if (!membershipPlan.includesPt && trainer) {
            throw new common_1.BadRequestException("Selected plan does not include PT support");
        }
        return this.createMembershipSale(em, member, membershipPlan, startDate, createMemberMembershipDto.paymentMethod, createMemberMembershipDto.totalAmount, trainer);
    }
    async renewMemberMembership(membershipId, renewMemberMembershipDto) {
        const em = this.createEntityManager();
        const membership = await em.findOne(gym_management_entity_1.MemberMembershipEntity, { id: membershipId, deletedAt: null }, { populate: ["member", "membershipPlan"] });
        if (!membership) {
            throw new common_1.NotFoundException(`Membership ${membershipId} not found`);
        }
        const startDate = renewMemberMembershipDto.startDate
            ? (0, gym_management_mapper_1.parseDateOnly)(renewMemberMembershipDto.startDate)
            : this.addDays(membership.endDate, 1);
        let trainer = renewMemberMembershipDto.ptId
            ? await this.getRequiredPersonalTrainerEntity(em, renewMemberMembershipDto.ptId)
            : null;
        if (!trainer && membership.membershipPlan.includesPt) {
            const activeAssignment = await em.findOne(gym_management_entity_1.MemberPtAssignmentEntity, {
                member: membership.member,
                status: "ACTIVE",
            }, {
                populate: ["personalTrainer"],
                orderBy: { assignedFrom: "desc", createdAt: "desc" },
            });
            trainer = activeAssignment?.personalTrainer ?? null;
        }
        if (membership.membershipPlan.includesPt && !trainer) {
            throw new common_1.BadRequestException("ptId is required when renewing a PT plan");
        }
        return this.createMembershipSale(em, membership.member, membership.membershipPlan, startDate, renewMemberMembershipDto.paymentMethod ?? "CASH", undefined, trainer);
    }
    async cancelMemberMembership(membershipId, cancelledAt) {
        const em = this.createEntityManager();
        const membership = await em.findOne(gym_management_entity_1.MemberMembershipEntity, {
            id: membershipId,
            deletedAt: null,
        });
        if (!membership) {
            throw new common_1.NotFoundException(`Membership ${membershipId} not found`);
        }
        const cancelledDate = cancelledAt ? (0, gym_management_mapper_1.parseDateOnly)(cancelledAt) : new Date();
        if (cancelledDate < membership.startDate) {
            throw new common_1.BadRequestException("cancelledAt must be on or after membership startDate");
        }
        membership.status = "CANCELLED";
        membership.endDate = cancelledDate;
        await em.flush();
        return (0, gym_management_mapper_1.mapMemberMembershipEntity)(membership);
    }
    async createMemberAssignment(createMemberAssignmentDto) {
        const em = this.createEntityManager();
        const trainer = await this.getRequiredPersonalTrainerEntity(em, createMemberAssignmentDto.ptId);
        const membership = await em.findOne(gym_management_entity_1.MemberMembershipEntity, {
            id: createMemberAssignmentDto.memberMembershipId,
            deletedAt: null,
        }, { populate: ["member", "membershipPlan"] });
        if (!membership) {
            throw new common_1.NotFoundException(`Membership ${createMemberAssignmentDto.memberMembershipId} not found`);
        }
        const { member } = membership;
        if (createMemberAssignmentDto.memberId !== undefined &&
            createMemberAssignmentDto.memberId !== member.id) {
            throw new common_1.BadRequestException(`Membership ${membership.id} does not belong to member ${createMemberAssignmentDto.memberId}`);
        }
        if (!membership.membershipPlan.includesPt) {
            throw new common_1.BadRequestException(`Membership ${membership.id} does not include PT support`);
        }
        const assignedFrom = (0, gym_management_mapper_1.parseDateOnly)(createMemberAssignmentDto.assignedFrom);
        const assignment = await this.createOrReplaceMemberAssignment(em, membership, trainer, assignedFrom, Number(membership.membershipPlan.price), createMemberAssignmentDto.note);
        return (0, gym_management_mapper_1.mapMemberPtAssignmentEntity)(assignment);
    }
    async endMemberAssignment(assignmentId, endMemberAssignmentDto) {
        const em = this.createEntityManager();
        const assignment = await em.findOne(gym_management_entity_1.MemberPtAssignmentEntity, {
            id: assignmentId,
        });
        if (!assignment) {
            throw new common_1.NotFoundException(`Assignment ${assignmentId} not found`);
        }
        assignment.assignedTo = endMemberAssignmentDto.assignedTo
            ? (0, gym_management_mapper_1.parseDateOnly)(endMemberAssignmentDto.assignedTo)
            : new Date();
        assignment.status = "ENDED";
        await em.flush();
        return (0, gym_management_mapper_1.mapMemberPtAssignmentEntity)(assignment);
    }
    async createPayrollPeriod(createPayrollPeriodDto) {
        const em = this.createEntityManager();
        const fromDate = (0, gym_management_mapper_1.parseDateOnly)(createPayrollPeriodDto.from);
        const toDate = (0, gym_management_mapper_1.parseDateOnly)(createPayrollPeriodDto.to);
        this.ensureValidDateRange(fromDate, toDate, "Payroll period");
        const payrollPeriod = em.create(gym_management_entity_1.PayrollPeriodEntity, {
            code: createPayrollPeriodDto.code ??
                `${createPayrollPeriodDto.from.slice(0, 7)}`,
            fromDate,
            toDate,
            status: "OPEN",
            submittedAt: null,
            approvedByUser: null,
            approvedAt: null,
            paidAt: null,
        });
        em.persist(payrollPeriod);
        await em.flush();
        return (0, gym_management_mapper_1.mapPayrollPeriodEntity)(payrollPeriod);
    }
    async generatePayroll(generatePayrollDto) {
        const em = this.createEntityManager();
        const payrollPeriod = await em.findOne(gym_management_entity_1.PayrollPeriodEntity, {
            id: generatePayrollDto.payrollPeriodId,
        });
        if (!payrollPeriod) {
            throw new common_1.NotFoundException(`Payroll period ${generatePayrollDto.payrollPeriodId} not found`);
        }
        if (payrollPeriod.status !== "OPEN") {
            throw new common_1.BadRequestException("Payroll can only be generated while the period is OPEN");
        }
        const existingEntries = await em.find(gym_management_entity_1.PayrollEntryEntity, {
            payrollPeriod,
        });
        if (existingEntries.length > 0) {
            em.remove(existingEntries);
            await em.flush();
        }
        const trainers = await em.find(gym_management_entity_1.PersonalTrainerEntity, { deletedAt: null, status: "ACTIVE" }, { populate: ["user"] });
        const assignments = await em.find(gym_management_entity_1.MemberPtAssignmentEntity, {}, { populate: ["memberMembership", "personalTrainer"] });
        const membershipInvoices = await em.find(gym_management_entity_1.MembershipInvoiceEntity, {}, { populate: ["memberMembership", "member"] });
        const salesInvoices = await em.find(gym_management_entity_1.SalesInvoiceEntity, { status: "CONFIRMED" }, { populate: ["createdByUser", "member"] });
        const defaultWorkCreditTarget = await this.getNumberSystemConfig(em, "payroll_standard_work_credits", 26);
        const normalizedDefaultWorkCreditTarget = defaultWorkCreditTarget > 0 ? defaultWorkCreditTarget : 26;
        for (const trainer of trainers) {
            const contract = await this.findPtContractForPeriod(em, trainer.id, payrollPeriod.fromDate, payrollPeriod.toDate);
            const configuredBaseSalaryAmount = await this.getNumberSystemConfig(em, `pt_${trainer.id}_base_salary`, contract ? Number(contract.baseSalary) : 0);
            const workCreditTarget = await this.getNumberSystemConfig(em, `pt_${trainer.id}_standard_work_credits`, normalizedDefaultWorkCreditTarget);
            const overtimeHourlyRate = await this.getNumberSystemConfig(em, `pt_${trainer.id}_overtime_hourly_rate`, contract ? Number(contract.overtimeHourlyRate) : 0);
            const allowanceAmount = await this.getNumberSystemConfig(em, `pt_${trainer.id}_allowance`, contract ? Number(contract.allowances) : 0);
            const salesCommissionRate = await this.getNumberSystemConfig(em, `pt_${trainer.id}_sales_commission_rate`, contract ? Number(contract.salesCommissionRate) : 0);
            const performanceBonusThreshold = await this.getNumberSystemConfig(em, `pt_${trainer.id}_performance_bonus_threshold`, contract ? contract.performanceBonusThreshold : 0);
            const performanceBonusAmountValue = await this.getNumberSystemConfig(em, `pt_${trainer.id}_performance_bonus_amount`, contract ? Number(contract.performanceBonusAmount) : 0);
            const attendanceLogs = await em.find(gym_management_entity_1.AttendanceLogEntity, {
                personalTrainer: trainer,
                attendanceDate: {
                    $gte: payrollPeriod.fromDate,
                    $lte: payrollPeriod.toDate,
                },
            });
            const validShiftCredits = this.sumNumbers(attendanceLogs.map((attendanceLog) => Number(attendanceLog.workCredit)));
            const paidHours = this.sumNumbers(attendanceLogs.map((attendanceLog) => Number(attendanceLog.paidHours)));
            const overtimeHours = this.sumNumbers(attendanceLogs.map((attendanceLog) => Number(attendanceLog.overtimeHours)));
            const normalizedWorkCreditTarget = workCreditTarget > 0
                ? workCreditTarget
                : normalizedDefaultWorkCreditTarget;
            const baseSalaryAmount = this.sumNumbers([
                configuredBaseSalaryAmount * (normalizedWorkCreditTarget > 0
                    ? validShiftCredits / normalizedWorkCreditTarget
                    : 0),
            ]);
            const assignmentInvoices = membershipInvoices.filter((invoice) => this.isDateWithinPeriod(invoice.invoiceDate, payrollPeriod));
            const packageCommission = this.sumNumbers(assignmentInvoices.map((invoice) => {
                const assignment = assignments.find((candidate) => candidate.personalTrainer.id === trainer.id &&
                    candidate.memberMembership.id === invoice.memberMembership.id &&
                    this.isAssignmentActiveOnDate(candidate, invoice.invoiceDate));
                if (!assignment) {
                    return 0;
                }
                return Number(assignment.commissionAmount);
            }));
            const packageCount = assignmentInvoices.filter((invoice) => assignments.some((assignment) => assignment.personalTrainer.id === trainer.id &&
                assignment.memberMembership.id === invoice.memberMembership.id &&
                this.isAssignmentActiveOnDate(assignment, invoice.invoiceDate))).length;
            const salesCommission = this.sumNumbers(salesInvoices
                .filter((invoice) => this.isDateWithinPeriod(invoice.invoiceDate, payrollPeriod) &&
                invoice.createdByUser.id === trainer.user?.id)
                .map((invoice) => Number(invoice.totalAmount) * salesCommissionRate));
            const performanceBonus = packageCount >= performanceBonusThreshold
                ? performanceBonusAmountValue
                : 0;
            const overtimeAmount = this.sumNumbers([
                overtimeHours * overtimeHourlyRate,
            ]);
            const attendanceBonusAmount = 0;
            const deductionAmount = 0;
            const penalties = 0;
            const grossPay = this.sumNumbers([
                baseSalaryAmount,
                attendanceBonusAmount,
                overtimeAmount,
                packageCommission,
                salesCommission,
                performanceBonus,
                allowanceAmount,
            ]);
            const netPay = grossPay - deductionAmount - penalties;
            const payrollEntry = em.create(gym_management_entity_1.PayrollEntryEntity, {
                payrollPeriod,
                personalTrainer: trainer,
                contract: contract ?? null,
                validShiftCredits: (0, gym_management_mapper_1.toDecimalString)(validShiftCredits),
                paidHours: (0, gym_management_mapper_1.toDecimalString)(paidHours),
                overtimeHours: (0, gym_management_mapper_1.toDecimalString)(overtimeHours),
                baseSalaryAmount: (0, gym_management_mapper_1.toDecimalString)(baseSalaryAmount),
                attendanceBonusAmount: (0, gym_management_mapper_1.toDecimalString)(attendanceBonusAmount),
                overtimeAmount: (0, gym_management_mapper_1.toDecimalString)(overtimeAmount),
                packageCommission: (0, gym_management_mapper_1.toDecimalString)(packageCommission),
                salesCommission: (0, gym_management_mapper_1.toDecimalString)(salesCommission),
                performanceBonus: (0, gym_management_mapper_1.toDecimalString)(performanceBonus),
                allowanceAmount: (0, gym_management_mapper_1.toDecimalString)(allowanceAmount),
                deductionAmount: (0, gym_management_mapper_1.toDecimalString)(deductionAmount),
                penalties: (0, gym_management_mapper_1.toDecimalString)(penalties),
                grossPay: (0, gym_management_mapper_1.toDecimalString)(grossPay),
                netPay: (0, gym_management_mapper_1.toDecimalString)(netPay),
                status: "PENDING_APPROVAL",
            });
            em.persist(payrollEntry);
        }
        await em.flush();
        return this.getPayrollPeriodDetail(payrollPeriod.id);
    }
    async getPayrollMe(userId) {
        const em = this.createEntityManager();
        const user = await this.getRequiredUserEntity(em, userId);
        const ptId = await this.resolvePtIdForUser(em, user);
        if (!ptId) {
            return [];
        }
        const dataset = await this.loadDataset();
        return dataset.payrollEntries.filter((entry) => entry.ptId === ptId);
    }
    async createSalesInvoice(createSalesInvoiceDto, createdByUserId) {
        const em = this.createEntityManager();
        const createdByUser = await this.getRequiredUserEntity(em, createdByUserId);
        const member = createSalesInvoiceDto.memberId
            ? await this.getRequiredMemberEntity(em, createSalesInvoiceDto.memberId)
            : null;
        if (createSalesInvoiceDto.items.length === 0) {
            throw new common_1.BadRequestException("Sales invoice must include at least one item");
        }
        const resolvedItems = await Promise.all(createSalesInvoiceDto.items.map(async (item) => ({
            dto: item,
            product: await this.getRequiredProductEntity(em, item.productId),
        })));
        const lineTotal = this.sumNumbers(resolvedItems.map(({ dto, product }) => dto.quantity * Number(product.salePrice)));
        const discountAmount = createSalesInvoiceDto.discountAmount ?? 0;
        const totalAmount = Math.max(0, lineTotal - discountAmount);
        const salesInvoice = em.create(gym_management_entity_1.SalesInvoiceEntity, {
            code: createSalesInvoiceDto.code ??
                this.generateReferenceCode("SI"),
            invoiceDate: createSalesInvoiceDto.invoiceDate
                ? new Date(createSalesInvoiceDto.invoiceDate)
                : new Date(),
            createdByUser,
            member,
            customerName: createSalesInvoiceDto.customerName,
            status: "DRAFT",
            paymentMethod: createSalesInvoiceDto.paymentMethod,
            discountAmount: (0, gym_management_mapper_1.toDecimalString)(discountAmount),
            totalAmount: (0, gym_management_mapper_1.toDecimalString)(totalAmount),
            note: createSalesInvoiceDto.note ?? "",
            confirmedAt: null,
            cancelledAt: null,
            cancellationReason: null,
        });
        em.persist(salesInvoice);
        await em.flush();
        for (const resolvedItem of resolvedItems) {
            em.persist(em.create(gym_management_entity_1.SalesInvoiceItemEntity, {
                salesInvoice,
                product: resolvedItem.product,
                quantity: resolvedItem.dto.quantity,
                unitPrice: (0, gym_management_mapper_1.toDecimalString)(Number(resolvedItem.product.salePrice)),
                unitCost: (0, gym_management_mapper_1.toDecimalString)(Number(resolvedItem.product.unitCost)),
                lineTotal: (0, gym_management_mapper_1.toDecimalString)(resolvedItem.dto.quantity * Number(resolvedItem.product.salePrice)),
            }));
        }
        await em.flush();
        return this.getSalesInvoiceDetail(salesInvoice.id);
    }
    async importInventory(inventoryImportDto) {
        const em = this.createEntityManager();
        const product = await this.getRequiredProductEntity(em, inventoryImportDto.productId);
        const transaction = em.create(gym_management_entity_1.InventoryTransactionEntity, {
            product,
            type: "IMPORT",
            quantity: inventoryImportDto.quantity,
            unitCost: (0, gym_management_mapper_1.toDecimalString)(inventoryImportDto.unitCost),
            transactionDate: inventoryImportDto.transactionDate
                ? new Date(inventoryImportDto.transactionDate)
                : new Date(),
            referenceCode: inventoryImportDto.referenceCode ??
                this.generateReferenceCode(`IMP-${product.code}`),
            note: inventoryImportDto.note ?? "Inventory import",
        });
        product.stockOnHand += inventoryImportDto.quantity;
        em.persist(transaction);
        await em.flush();
        return (0, gym_management_mapper_1.mapInventoryTransactionEntity)(transaction);
    }
    async patchAttendance(attendanceLogId, patchAttendanceDto) {
        const em = this.createEntityManager();
        const attendanceLog = await em.findOne(gym_management_entity_1.AttendanceLogEntity, { id: attendanceLogId }, { populate: ["personalTrainer"] });
        if (!attendanceLog) {
            throw new common_1.NotFoundException(`Attendance log ${attendanceLogId} not found`);
        }
        this.assertCurrentVietnamDate(attendanceLog.attendanceDate, "attendanceDate");
        if (patchAttendanceDto.checkInAt !== undefined) {
            const checkInAt = new Date(patchAttendanceDto.checkInAt);
            if (Number.isNaN(checkInAt.getTime())) {
                throw new common_1.BadRequestException("Invalid check in time");
            }
            this.assertCurrentVietnamDate(checkInAt, "checkInAt");
            attendanceLog.checkInAt = checkInAt;
            attendanceLog.attendanceDate = this.toVietnamDate(checkInAt);
        }
        if (patchAttendanceDto.checkOutAt !== undefined) {
            const checkOutAt = new Date(patchAttendanceDto.checkOutAt);
            if (Number.isNaN(checkOutAt.getTime())) {
                throw new common_1.BadRequestException("Invalid check out time");
            }
            this.assertCurrentVietnamDate(checkOutAt, "checkOutAt");
            attendanceLog.checkOutAt = checkOutAt;
        }
        if (patchAttendanceDto.note !== undefined) {
            attendanceLog.note = patchAttendanceDto.note;
        }
        await this.recalculateAttendanceLog(em, attendanceLog);
        await em.flush();
        return (0, gym_management_mapper_1.mapAttendanceLogEntity)(attendanceLog);
    }
    async createMembershipSale(em, member, membershipPlan, startDate, paymentMethod, totalAmount, trainer) {
        const endDate = this.addDays(startDate, membershipPlan.durationDays - 1);
        const membership = em.create(gym_management_entity_1.MemberMembershipEntity, {
            member,
            membershipPlan,
            startDate,
            endDate,
            status: "ACTIVE",
            deletedAt: null,
        });
        em.persist(membership);
        await em.flush();
        const invoice = em.create(gym_management_entity_1.MembershipInvoiceEntity, {
            code: this.generateReferenceCode("MI"),
            member,
            memberMembership: membership,
            invoiceDate: new Date(),
            totalAmount: (0, gym_management_mapper_1.toDecimalString)(totalAmount ?? Number(membershipPlan.price)),
            paymentMethod,
            status: "CONFIRMED",
        });
        em.persist(invoice);
        await em.flush();
        let assignment;
        if (trainer) {
            assignment = (0, gym_management_mapper_1.mapMemberPtAssignmentEntity)(await this.createOrReplaceMemberAssignment(em, membership, trainer, startDate, totalAmount ?? Number(membershipPlan.price)));
        }
        return {
            membership: (0, gym_management_mapper_1.mapMemberMembershipEntity)(membership),
            invoice: (0, gym_management_mapper_1.mapMembershipInvoiceEntity)(invoice),
            assignment,
        };
    }
    ensureValidDateRange(fromDate, toDate, context) {
        if (toDate && toDate < fromDate) {
            throw new common_1.BadRequestException(`${context} end date must be on or after the start date`);
        }
    }
    async ensurePtContractDateRangeAvailable(em, ptId, effectiveFrom, effectiveTo, excludeContractId) {
        const existingContracts = await em.find(gym_management_entity_1.PtContractEntity, {
            personalTrainer: ptId,
        });
        for (const existingContract of existingContracts) {
            if (existingContract.id === excludeContractId) {
                continue;
            }
            if (this.doDateRangesOverlap(existingContract.effectiveFrom, existingContract.effectiveTo, effectiveFrom, effectiveTo)) {
                throw new common_1.ConflictException(`PT ${ptId} already has a contract overlapping this effective period`);
            }
        }
    }
    doDateRangesOverlap(leftFrom, leftTo, rightFrom, rightTo) {
        const leftToValue = leftTo === null || leftTo === undefined
            ? Number.POSITIVE_INFINITY
            : new Date(leftTo).getTime();
        const rightToValue = rightTo === null || rightTo === undefined
            ? Number.POSITIVE_INFINITY
            : new Date(rightTo).getTime();
        return leftFrom.getTime() <= rightToValue && rightFrom.getTime() <= leftToValue;
    }
    addDays(date, days) {
        const clone = new Date(date);
        clone.setUTCDate(clone.getUTCDate() + days);
        return clone;
    }
    sumNumbers(values) {
        return Number(values.reduce((total, value) => total + value, 0).toFixed(2));
    }
    calculateAssignmentCommissionAmount(baseAmount, fallbackRate) {
        if (fallbackRate !== undefined) {
            return Number((baseAmount * fallbackRate).toFixed(2));
        }
        return 0;
    }
    async createOrReplaceMemberAssignment(em, membership, trainer, assignedFrom, baseAmount, note) {
        const activeAssignments = await em.find(gym_management_entity_1.MemberPtAssignmentEntity, {
            member: membership.member,
            status: "ACTIVE",
        });
        for (const activeAssignment of activeAssignments) {
            activeAssignment.status = "ENDED";
            activeAssignment.assignedTo = assignedFrom;
        }
        const packageCommissionRate = await this.getPackageCommissionRateForTrainer(em, trainer, assignedFrom);
        const commissionAmount = this.calculateAssignmentCommissionAmount(baseAmount, packageCommissionRate);
        const assignment = em.create(gym_management_entity_1.MemberPtAssignmentEntity, {
            member: membership.member,
            personalTrainer: trainer,
            memberMembership: membership,
            assignedFrom,
            assignedTo: null,
            commissionAmount: (0, gym_management_mapper_1.toDecimalString)(commissionAmount),
            status: "ACTIVE",
            note: note ?? null,
        });
        em.persist(assignment);
        await em.flush();
        return assignment;
    }
    isDateWithinPeriod(value, payrollPeriod) {
        const timestamp = value.getTime();
        return (timestamp >= payrollPeriod.fromDate.getTime() &&
            timestamp <= this.addDays(payrollPeriod.toDate, 1).getTime());
    }
    isAssignmentActiveOnDate(assignment, value) {
        const timestamp = new Date(value).getTime();
        const assignedFrom = new Date(assignment.assignedFrom).getTime();
        const assignedTo = assignment.assignedTo
            ? new Date(assignment.assignedTo).getTime()
            : Number.POSITIVE_INFINITY;
        return timestamp >= assignedFrom && timestamp <= assignedTo;
    }
    async findPtContractForPeriod(em, ptId, fromDate, toDate) {
        const contracts = await em.find(gym_management_entity_1.PtContractEntity, {
            personalTrainer: ptId,
        }, {
            orderBy: { effectiveFrom: "desc", createdAt: "desc" },
        });
        return contracts.find((contract) => this.doDateRangesOverlap(contract.effectiveFrom, contract.effectiveTo, fromDate, toDate));
    }
    async recalculateAttendanceLog(em, attendanceLog) {
        if (!attendanceLog.checkOutAt) {
            attendanceLog.workedHours = "0";
            attendanceLog.paidHours = "0";
            attendanceLog.overtimeHours = "0";
            attendanceLog.status = "OPEN";
            attendanceLog.workCredit = "0";
            return;
        }
        if (attendanceLog.checkOutAt <= attendanceLog.checkInAt) {
            throw new common_1.BadRequestException("Check out time must be after check in time");
        }
        const workedHours = Number(((attendanceLog.checkOutAt.getTime() - attendanceLog.checkInAt.getTime()) /
            36e5).toFixed(2));
        const ptContract = await this.findActivePtContractEntity(em, attendanceLog.personalTrainer.id, attendanceLog.attendanceDate);
        const fullShiftHours = ptContract
            ? Number(ptContract.minValidShiftHours)
            : await this.getNumberSystemConfig(em, "min_valid_shift_hours", 5);
        const standardShiftHours = ptContract
            ? Number(ptContract.standardShiftHours)
            : 8;
        const { status, workCredit } = this.resolveAttendanceStatusAndWorkCredit(workedHours, fullShiftHours);
        const { paidHours, overtimeHours } = this.calculateAttendanceCompensation(workedHours, standardShiftHours);
        attendanceLog.workedHours = (0, gym_management_mapper_1.toDecimalString)(workedHours);
        attendanceLog.paidHours = (0, gym_management_mapper_1.toDecimalString)(paidHours);
        attendanceLog.overtimeHours = (0, gym_management_mapper_1.toDecimalString)(overtimeHours);
        attendanceLog.status = status;
        attendanceLog.workCredit = (0, gym_management_mapper_1.toDecimalString)(workCredit);
    }
    calculateAttendanceCompensation(workedHours, standardShiftHours) {
        if (workedHours <= standardShiftHours) {
            return {
                paidHours: workedHours,
                overtimeHours: 0,
            };
        }
        const overtimeHours = Math.floor(workedHours - standardShiftHours);
        return {
            paidHours: standardShiftHours,
            overtimeHours,
        };
    }
    resolveAttendanceStatusAndWorkCredit(workedHours, fullShiftHours) {
        const normalizedFullShiftHours = fullShiftHours > 0 ? fullShiftHours : 5;
        if (workedHours <= 0) {
            return {
                status: "INVALID",
                workCredit: 0,
            };
        }
        if (workedHours >= normalizedFullShiftHours) {
            return {
                status: "VALID",
                workCredit: 1,
            };
        }
        return {
            status: "HALF",
            workCredit: Number((workedHours / normalizedFullShiftHours).toFixed(2)),
        };
    }
    generateReferenceCode(prefix) {
        return `${prefix}-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${(0, node_crypto_1.randomUUID)().slice(0, 8).toUpperCase()}`;
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
        const trainerUser = createPersonalTrainerDto.userId
            ? await this.getRequiredUserEntity(em, createPersonalTrainerDto.userId)
            : null;
        const trainer = em.create(gym_management_entity_1.PersonalTrainerEntity, {
            code: createPersonalTrainerDto.code,
            user: trainerUser,
            fullName: createPersonalTrainerDto.fullName,
            gender: coerceEnumValue(createPersonalTrainerDto.gender ?? "OTHER", genderValues, "OTHER"),
            birthDate: createPersonalTrainerDto.birthDate
                ? (0, gym_management_mapper_1.parseDateOnly)(createPersonalTrainerDto.birthDate)
                : (0, gym_management_mapper_1.parseDateOnly)("2000-01-01"),
            phone: createPersonalTrainerDto.phone,
            startDate: createPersonalTrainerDto.startDate
                ? (0, gym_management_mapper_1.parseDateOnly)(createPersonalTrainerDto.startDate)
                : (0, gym_management_mapper_1.parseDateOnly)(new Date().toISOString()),
            status: createPersonalTrainerDto.status ?? "ACTIVE",
        });
        em.persist(trainer);
        await em.flush();
        return (0, gym_management_mapper_1.mapPersonalTrainerEntity)(trainer);
    }
    async updatePersonalTrainer(ptId, updatePersonalTrainerDto) {
        const em = this.createEntityManager();
        const trainer = await this.getRequiredPersonalTrainerEntity(em, ptId);
        const trainerData = this.toPersonalTrainerEntityData(updatePersonalTrainerDto);
        if (updatePersonalTrainerDto.userId !== undefined) {
            trainerData.user = updatePersonalTrainerDto.userId
                ? await this.getRequiredUserEntity(em, updatePersonalTrainerDto.userId)
                : null;
        }
        (0, core_1.wrap)(trainer).assign(trainerData, { ignoreUndefined: true });
        await em.flush();
        return (0, gym_management_mapper_1.mapPersonalTrainerEntity)(trainer);
    }
    async deletePersonalTrainer(ptId) {
        const em = this.createEntityManager();
        const trainer = await this.getRequiredPersonalTrainerEntity(em, ptId);
        trainer.status = "INACTIVE";
        trainer.deletedAt = null;
        await em.flush();
        return (0, gym_management_mapper_1.mapPersonalTrainerEntity)(trainer);
    }
    async createMember(createMemberDto) {
        const em = this.createEntityManager();
        const member = em.create(gym_management_entity_1.MemberEntity, {
            code: createMemberDto.code,
            fullName: createMemberDto.fullName,
            gender: coerceEnumValue(createMemberDto.gender ?? "OTHER", genderValues, "OTHER"),
            birthDate: createMemberDto.birthDate
                ? (0, gym_management_mapper_1.parseDateOnly)(createMemberDto.birthDate)
                : (0, gym_management_mapper_1.parseDateOnly)("2000-01-01"),
            phone: createMemberDto.phone,
            registeredAt: createMemberDto.registeredAt
                ? (0, gym_management_mapper_1.parseDateOnly)(createMemberDto.registeredAt)
                : (0, gym_management_mapper_1.parseDateOnly)(new Date().toISOString()),
            status: createMemberDto.status ?? "ACTIVE",
        });
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
        member.deletedAt = null;
        await em.flush();
        return (0, gym_management_mapper_1.mapMemberEntity)(member);
    }
    async createMembershipPlan(createMembershipPlanDto) {
        const em = this.createEntityManager();
        const membershipPlan = em.create(gym_management_entity_1.MembershipPlanEntity, {
            code: createMembershipPlanDto.code,
            name: createMembershipPlanDto.name,
            type: createMembershipPlanDto.type,
            price: (0, gym_management_mapper_1.toDecimalString)(createMembershipPlanDto.price),
            durationDays: createMembershipPlanDto.durationDays,
            includesPt: createMembershipPlanDto.includesPt,
            perks: createMembershipPlanDto.perks,
            status: createMembershipPlanDto.status,
        });
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
        const product = em.create(gym_management_entity_1.ProductEntity, {
            code: createProductDto.code,
            name: createProductDto.name,
            category: createProductDto.category,
            unitCost: (0, gym_management_mapper_1.toDecimalString)(createProductDto.unitCost),
            salePrice: (0, gym_management_mapper_1.toDecimalString)(createProductDto.salePrice),
            stockOnHand: createProductDto.stockOnHand,
            minimumStockLevel: createProductDto.minimumStockLevel,
            status: createProductDto.status,
        });
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
        product.deletedAt = new Date();
        await em.flush();
        return (0, gym_management_mapper_1.mapProductEntity)(product);
    }
    async createOperatingExpense(createOperatingExpenseDto) {
        const em = this.createEntityManager();
        const operatingExpense = em.create(gym_management_entity_1.OperatingExpenseEntity, {
            code: createOperatingExpenseDto.code,
            expenseDate: (0, gym_management_mapper_1.parseDateOnly)(createOperatingExpenseDto.expenseDate),
            category: createOperatingExpenseDto.category,
            vendorName: createOperatingExpenseDto.vendorName,
            amount: (0, gym_management_mapper_1.toDecimalString)(createOperatingExpenseDto.amount),
            description: createOperatingExpenseDto.description,
            attachmentUrl: createOperatingExpenseDto.attachmentUrl,
            status: "DRAFT",
        });
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
    async patchSystemConfig(configKey, patchSystemConfigDto, actorUserId) {
        const em = this.createEntityManager();
        const normalizedKey = configKey.trim();
        let systemConfig = await em.findOne(gym_management_entity_1.SystemConfigEntity, {
            key: normalizedKey,
        });
        if (!systemConfig) {
            const systemConfigData = {
                key: normalizedKey,
                label: this.toSystemConfigLabel(normalizedKey),
                value: patchSystemConfigDto.value,
                description: `Custom config for ${normalizedKey}`,
                updatedByUser: null,
            };
            systemConfig = em.create(gym_management_entity_1.SystemConfigEntity, systemConfigData);
            em.persist(systemConfig);
        }
        systemConfig.value = patchSystemConfigDto.value;
        if (actorUserId) {
            systemConfig.updatedByUser = await this.getRequiredUserEntity(em, actorUserId);
        }
        await em.flush();
        return (0, gym_management_mapper_1.mapSystemConfigEntity)(systemConfig);
    }
    async cleanupSystemConfigTrash() {
        const em = this.createEntityManager();
        const systemConfigs = await em.find(gym_management_entity_1.SystemConfigEntity, {});
        const activeTrainers = await em.find(gym_management_entity_1.PersonalTrainerEntity, {
            deletedAt: null,
        });
        const activeTrainerIds = new Set(activeTrainers.map((trainer) => trainer.id));
        const staleConfigs = systemConfigs.filter((systemConfig) => {
            if (systemConfig.key === "half_shift_policy") {
                return true;
            }
            if (!systemConfig.key.startsWith("pt_")) {
                return false;
            }
            const trainerScopedKey = systemConfig.key.slice(3);
            const separatorIndex = trainerScopedKey.indexOf("_");
            if (separatorIndex <= 0) {
                return false;
            }
            const ptId = trainerScopedKey.slice(0, separatorIndex);
            return !activeTrainerIds.has(ptId);
        });
        if (staleConfigs.length > 0) {
            em.remove(staleConfigs);
            await em.flush();
        }
        return {
            removedCount: staleConfigs.length,
            removedKeys: staleConfigs.map((config) => config.key),
        };
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
        this.ensureAllowedTransition("Payroll period", coerceEnumValue(payrollPeriod.status, payrollPeriodStatuses, "OPEN"), nextStatus, payrollPeriodTransitions);
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
                this.ensureAllowedTransition("Payroll entry", coerceEnumValue(entry.status, payrollEntryStatuses, "PENDING_APPROVAL"), "APPROVED", payrollEntryTransitions);
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
                this.ensureAllowedTransition("Payroll entry", coerceEnumValue(entry.status, payrollEntryStatuses, "PENDING_APPROVAL"), "PAID", payrollEntryTransitions);
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
        this.ensureAllowedTransition("Operating expense", coerceEnumValue(expense.status, operatingExpenseStatuses, "DRAFT"), nextStatus, operatingExpenseTransitions);
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
        this.ensureAllowedTransition("Sales invoice", coerceEnumValue(salesInvoice.status, salesInvoiceStatuses, "DRAFT"), nextStatus, salesInvoiceTransitions);
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
        if (!this.isObjectRecord(value)) {
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
    isObjectRecord(value) {
        return Boolean(value) && typeof value === "object" && !Array.isArray(value);
    }
    toAuthTokenPayload(payload) {
        if (!this.isObjectRecord(payload)) {
            throw new common_1.UnauthorizedException("Access token payload is invalid");
        }
        const { sessionId, userId, role, ptId } = payload;
        if (typeof sessionId !== "string" || typeof userId !== "string") {
            throw new common_1.UnauthorizedException("Access token payload is invalid");
        }
        if (typeof role !== "string" || !isOneOf(role, authTokenRoles)) {
            throw new common_1.UnauthorizedException("Access token payload is invalid");
        }
        if (ptId !== undefined && typeof ptId !== "string") {
            throw new common_1.UnauthorizedException("Access token payload is invalid");
        }
        return {
            sessionId,
            userId,
            role,
            ptId,
        };
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
    assertCurrentVietnamDate(value, fieldName) {
        const targetDate = this.toVietnamDate(value).getTime();
        const currentDate = this.toVietnamDate(new Date()).getTime();
        if (targetDate !== currentDate) {
            throw new common_1.BadRequestException(`${fieldName} must be on current Vietnam date`);
        }
    }
    async findActivePtContractEntity(em, ptId, attendanceDate) {
        return this.findPtContractForPeriod(em, ptId, attendanceDate, attendanceDate);
    }
    async getPackageCommissionRateForTrainer(em, trainer, effectiveDate) {
        const contract = await this.findActivePtContractEntity(em, trainer.id, effectiveDate);
        return this.getNumberSystemConfig(em, `pt_${trainer.id}_package_commission_rate`, contract ? Number(contract.packageCommissionRate) : 0);
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
    toSystemConfigLabel(configKey) {
        return configKey
            .split("_")
            .map((segment) => segment.length > 0
            ? `${segment.slice(0, 1).toUpperCase()}${segment.slice(1)}`
            : segment)
            .join(" ");
    }
    async issueAccessToken(payload) {
        const accessToken = this.generateOpaqueToken("access");
        await this.redisService.setJson(this.toAccessTokenKey(accessToken), payload, ACCESS_TOKEN_TTL_SECONDS);
        return accessToken;
    }
    async issueAuthTokens(payload) {
        const em = this.createEntityManager();
        const accessToken = await this.issueAccessToken(payload);
        const refreshToken = this.generateOpaqueToken("refresh");
        const refreshTokenEntity = em.create(gym_management_entity_1.RefreshTokenEntity, {
            user: em.getReference(gym_management_entity_1.UserEntity, payload.userId),
            tokenHash: (0, auth_crypto_1.hashOpaqueToken)(refreshToken),
            sessionId: payload.sessionId,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
            revokedAt: null,
        });
        em.persist(refreshTokenEntity);
        await em.flush();
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
    toRevokedAccessTokenKey(accessToken) {
        return `auth:revoked:access:${accessToken}`;
    }
    async resolvePtIdForUser(em, user) {
        const trainer = await em.findOne(gym_management_entity_1.PersonalTrainerEntity, {
            user: user.id,
        });
        return trainer?.id;
    }
    async loadDataset() {
        const em = this.createEntityManager();
        const [users, personalTrainers, ptContracts, attendanceLogs, payrollPeriods, payrollEntries, members, membershipPlans, memberMemberships, memberPtAssignments, membershipInvoices, products, inventoryTransactions, salesInvoices, salesInvoiceItems, operatingExpenses, systemConfigs,] = await Promise.all([
            em.find(gym_management_entity_1.UserEntity, { deletedAt: null }, { orderBy: { createdAt: "asc", id: "asc" } }),
            em.find(gym_management_entity_1.PersonalTrainerEntity, {}, { orderBy: { code: "asc" } }),
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
            em.find(gym_management_entity_1.MemberEntity, {}, { orderBy: { code: "asc" } }),
            em.findAll(gym_management_entity_1.MembershipPlanEntity, { orderBy: { code: "asc" } }),
            em.find(gym_management_entity_1.MemberMembershipEntity, { deletedAt: null }, { orderBy: { startDate: "asc", id: "asc" } }),
            em.findAll(gym_management_entity_1.MemberPtAssignmentEntity, {
                orderBy: { assignedFrom: "asc", id: "asc" },
            }),
            em.findAll(gym_management_entity_1.MembershipInvoiceEntity, {
                orderBy: { invoiceDate: "asc", id: "asc" },
            }),
            em.find(gym_management_entity_1.ProductEntity, { deletedAt: null }, { orderBy: { code: "asc" } }),
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
            data.gender = coerceEnumValue(dto.gender, genderValues, "OTHER");
        }
        if (dto.birthDate !== undefined) {
            data.birthDate = (0, gym_management_mapper_1.parseDateOnly)(dto.birthDate);
        }
        if (dto.phone !== undefined) {
            data.phone = dto.phone;
        }
        if (dto.startDate !== undefined) {
            data.startDate = (0, gym_management_mapper_1.parseDateOnly)(dto.startDate);
        }
        if (dto.status !== undefined) {
            data.status = dto.status;
            if (dto.status === "ACTIVE") {
                data.deletedAt = null;
            }
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
            data.gender = coerceEnumValue(dto.gender, genderValues, "OTHER");
        }
        if (dto.birthDate !== undefined) {
            data.birthDate = (0, gym_management_mapper_1.parseDateOnly)(dto.birthDate);
        }
        if (dto.phone !== undefined) {
            data.phone = dto.phone;
        }
        if (dto.registeredAt !== undefined) {
            data.registeredAt = (0, gym_management_mapper_1.parseDateOnly)(dto.registeredAt);
        }
        if (dto.status !== undefined) {
            data.status = dto.status;
            if (dto.status === "ACTIVE") {
                data.deletedAt = null;
            }
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
        if (dto.includesPt !== undefined) {
            data.includesPt = dto.includesPt;
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
    async getRequiredUserEntity(em, userId) {
        const user = await em.findOne(gym_management_entity_1.UserEntity, { id: userId, deletedAt: null });
        if (!user) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        return user;
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
        const member = await em.findOne(gym_management_entity_1.MemberEntity, {
            id: memberId,
        });
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
        const product = await em.findOne(gym_management_entity_1.ProductEntity, {
            id: productId,
            deletedAt: null,
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product ${productId} not found`);
        }
        return product;
    }
    async getRequiredOperatingExpenseEntity(em, expenseId) {
        return this.findOperatingExpenseOrThrow(em, expenseId);
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
};
exports.GymManagementService = GymManagementService;
exports.GymManagementService = GymManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.MikroORM,
        redis_service_1.RedisService])
], GymManagementService);
//# sourceMappingURL=gym-management.service.js.map