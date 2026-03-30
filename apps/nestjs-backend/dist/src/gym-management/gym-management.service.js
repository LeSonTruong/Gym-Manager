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
const core_1 = require("@mikro-orm/core");
const shared_1 = require("@next-nest-turbo-boilerplate/shared");
const common_1 = require("@nestjs/common");
const gym_management_entity_1 = require("./entities/gym-management.entity");
const gym_management_mapper_1 = require("./gym-management.mapper");
let GymManagementService = class GymManagementService {
    orm;
    constructor(orm) {
        this.orm = orm;
    }
    async getSnapshot() {
        return (0, shared_1.createGymManagementSnapshot)(await this.loadDataset());
    }
    async login(email, password) {
        const em = this.createEntityManager();
        const userEntity = await em.findOne(gym_management_entity_1.UserEntity, { email });
        if (!userEntity || password !== userEntity.passwordHint) {
            throw new common_1.UnauthorizedException('Invalid demo credentials');
        }
        const user = (0, gym_management_mapper_1.mapUserEntity)(userEntity);
        return {
            user,
            accessToken: `demo-access-token-${user.id}`,
            refreshToken: `demo-refresh-token-${user.id}`,
        };
    }
    async getCurrentUser() {
        const em = this.createEntityManager();
        const currentUsers = await em.find(gym_management_entity_1.UserEntity, { status: 'ACTIVE' }, { orderBy: { createdAt: 'asc', id: 'asc' }, limit: 1 });
        const currentUser = currentUsers[0];
        if (!currentUser) {
            throw new common_1.UnauthorizedException('No demo users configured');
        }
        return (0, gym_management_mapper_1.mapUserEntity)(currentUser);
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
        trainer.status = 'INACTIVE';
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
        (0, core_1.wrap)(member).assign(this.toMemberEntityData(updateMemberDto), { ignoreUndefined: true });
        await em.flush();
        return (0, gym_management_mapper_1.mapMemberEntity)(member);
    }
    async deleteMember(memberId) {
        const em = this.createEntityManager();
        const member = await this.getRequiredMemberEntity(em, memberId);
        member.status = 'INACTIVE';
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
        membershipPlan.status = 'OFF_SALE';
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
        (0, core_1.wrap)(product).assign(this.toProductEntityData(updateProductDto), { ignoreUndefined: true });
        await em.flush();
        return (0, gym_management_mapper_1.mapProductEntity)(product);
    }
    async deleteProduct(productId) {
        const em = this.createEntityManager();
        const product = await this.getRequiredProductEntity(em, productId);
        product.status = 'INACTIVE';
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
        em.persist(operatingExpense);
        await em.flush();
        return (0, gym_management_mapper_1.mapOperatingExpenseEntity)(operatingExpense);
    }
    async updateOperatingExpense(expenseId, updateOperatingExpenseDto) {
        const em = this.createEntityManager();
        const operatingExpense = await this.getRequiredOperatingExpenseEntity(em, expenseId);
        (0, core_1.wrap)(operatingExpense).assign(await this.toOperatingExpenseEntityData(em, updateOperatingExpenseDto), {
            ignoreUndefined: true,
        });
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
    async loadDataset() {
        const em = this.createEntityManager();
        const [users, personalTrainers, ptContracts, attendanceLogs, payrollPeriods, payrollEntries, members, membershipPlans, memberMemberships, memberPtAssignments, membershipInvoices, products, inventoryTransactions, salesInvoices, salesInvoiceItems, operatingExpenses, equipmentAssets, maintenanceRecords, systemConfigs,] = await Promise.all([
            em.findAll(gym_management_entity_1.UserEntity, { orderBy: { createdAt: 'asc', id: 'asc' } }),
            em.findAll(gym_management_entity_1.PersonalTrainerEntity, { orderBy: { code: 'asc' } }),
            em.findAll(gym_management_entity_1.PtContractEntity, { orderBy: { effectiveFrom: 'asc', id: 'asc' } }),
            em.findAll(gym_management_entity_1.AttendanceLogEntity, { orderBy: { attendanceDate: 'asc', checkInAt: 'asc', id: 'asc' } }),
            em.findAll(gym_management_entity_1.PayrollPeriodEntity, { orderBy: { fromDate: 'asc', id: 'asc' } }),
            em.findAll(gym_management_entity_1.PayrollEntryEntity, { orderBy: { createdAt: 'asc', id: 'asc' } }),
            em.findAll(gym_management_entity_1.MemberEntity, { orderBy: { code: 'asc' } }),
            em.findAll(gym_management_entity_1.MembershipPlanEntity, { orderBy: { code: 'asc' } }),
            em.findAll(gym_management_entity_1.MemberMembershipEntity, { orderBy: { startDate: 'asc', id: 'asc' } }),
            em.findAll(gym_management_entity_1.MemberPtAssignmentEntity, { orderBy: { assignedFrom: 'asc', id: 'asc' } }),
            em.findAll(gym_management_entity_1.MembershipInvoiceEntity, { orderBy: { invoiceDate: 'asc', id: 'asc' } }),
            em.findAll(gym_management_entity_1.ProductEntity, { orderBy: { code: 'asc' } }),
            em.findAll(gym_management_entity_1.InventoryTransactionEntity, { orderBy: { transactionDate: 'asc', id: 'asc' } }),
            em.findAll(gym_management_entity_1.SalesInvoiceEntity, { orderBy: { invoiceDate: 'asc', id: 'asc' } }),
            em.findAll(gym_management_entity_1.SalesInvoiceItemEntity, { orderBy: { createdAt: 'asc', id: 'asc' } }),
            em.findAll(gym_management_entity_1.OperatingExpenseEntity, { orderBy: { expenseDate: 'asc', id: 'asc' } }),
            em.findAll(gym_management_entity_1.EquipmentAssetEntity, { orderBy: { code: 'asc' } }),
            em.findAll(gym_management_entity_1.MaintenanceRecordEntity, { orderBy: { maintenanceDate: 'asc', id: 'asc' } }),
            em.findAll(gym_management_entity_1.SystemConfigEntity, { orderBy: { key: 'asc' } }),
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
            data.equipmentAsset = (await this.resolveEquipmentAsset(em, dto.equipmentAssetId)) ?? null;
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
        if (dto.approvedByUserId !== undefined) {
            data.approvedByUser = (await this.resolveApprovedByUser(em, dto.approvedByUserId)) ?? null;
        }
        if (dto.attachmentUrl !== undefined) {
            data.attachmentUrl = dto.attachmentUrl;
        }
        if (dto.status !== undefined) {
            data.status = dto.status;
        }
        return data;
    }
    async resolveEquipmentAsset(em, equipmentAssetId) {
        if (equipmentAssetId === undefined || equipmentAssetId === null) {
            return undefined;
        }
        const equipmentAsset = await em.findOne(gym_management_entity_1.EquipmentAssetEntity, { id: equipmentAssetId });
        if (!equipmentAsset) {
            throw new common_1.NotFoundException(`Equipment ${equipmentAssetId} not found`);
        }
        return equipmentAsset;
    }
    async resolveApprovedByUser(em, approvedByUserId) {
        if (approvedByUserId === undefined || approvedByUserId === null) {
            return undefined;
        }
        const approvedByUser = await em.findOne(gym_management_entity_1.UserEntity, { id: approvedByUserId });
        if (!approvedByUser) {
            throw new common_1.NotFoundException(`User ${approvedByUserId} not found`);
        }
        return approvedByUser;
    }
    async getRequiredPersonalTrainerEntity(em, ptId) {
        const personalTrainer = await em.findOne(gym_management_entity_1.PersonalTrainerEntity, { id: ptId });
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
        const membershipPlan = await em.findOne(gym_management_entity_1.MembershipPlanEntity, { id: membershipPlanId });
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
        const equipmentAsset = await em.findOne(gym_management_entity_1.EquipmentAssetEntity, { id: equipmentAssetId });
        if (!equipmentAsset) {
            throw new common_1.NotFoundException(`Equipment ${equipmentAssetId} not found`);
        }
        return equipmentAsset;
    }
    async findOperatingExpenseOrThrow(em, expenseId) {
        const operatingExpense = await em.findOne(gym_management_entity_1.OperatingExpenseEntity, { id: expenseId });
        if (!operatingExpense) {
            throw new common_1.NotFoundException(`Expense ${expenseId} not found`);
        }
        return operatingExpense;
    }
    async getRequiredSystemConfigEntity(em, configKey) {
        const systemConfig = await em.findOne(gym_management_entity_1.SystemConfigEntity, { key: configKey });
        if (!systemConfig) {
            throw new common_1.NotFoundException(`System config ${configKey} not found`);
        }
        return systemConfig;
    }
};
exports.GymManagementService = GymManagementService;
exports.GymManagementService = GymManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.MikroORM])
], GymManagementService);
//# sourceMappingURL=gym-management.service.js.map