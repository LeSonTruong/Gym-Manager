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
var GymManagementSeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GymManagementSeedService = void 0;
const core_1 = require("@mikro-orm/core");
const shared_1 = require("@next-nest-turbo-boilerplate/shared");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const config_key_enum_1 = require("../config/config-key.enum");
const gym_management_entity_1 = require("./entities/gym-management.entity");
const auth_crypto_1 = require("./auth/auth-crypto");
function toDateOnly(value) {
    return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
}
function toDateTime(value) {
    return new Date(value);
}
function toOptionalDateTime(value) {
    return value ? toDateTime(value) : null;
}
function toDecimal(value) {
    return value.toString();
}
let GymManagementSeedService = GymManagementSeedService_1 = class GymManagementSeedService {
    orm;
    configService;
    logger = new common_1.Logger(GymManagementSeedService_1.name);
    constructor(orm, configService) {
        this.orm = orm;
        this.configService = configService;
    }
    async onModuleInit() {
        await (((globalThis.process?.env.POSTGRES_HOST) ?? '').toLowerCase() === 'sqlite'
            ? this.orm.schema.updateSchema()
            : this.orm.migrator.up());
        if (!this.configService.get(config_key_enum_1.ConfigKey.ENABLE_DEMO_SEED)) {
            this.logger.log('Skipped demo data seed because ENABLE_DEMO_SEED is disabled');
            return;
        }
        await this.seedIfEmpty();
    }
    async seedIfEmpty() {
        const em = this.orm.em.fork();
        const userCount = await em.count(gym_management_entity_1.UserEntity, {});
        if (userCount > 0) {
            return;
        }
        const dataset = (0, shared_1.createGymManagementMockData)();
        em.persist(dataset.users.map((user) => em.create(gym_management_entity_1.UserEntity, {
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            role: user.role,
            status: user.status,
            passwordHash: (0, auth_crypto_1.hashPassword)(user.passwordHint ?? 'demo123'),
            deletedAt: toOptionalDateTime(user.deletedAt),
        })));
        em.persist(dataset.members.map((member) => em.create(gym_management_entity_1.MemberEntity, {
            id: member.id,
            code: member.code,
            fullName: member.fullName,
            phone: member.phone,
            status: member.status,
            deletedAt: toOptionalDateTime(member.deletedAt),
        })));
        em.persist(dataset.membershipPlans.map((plan) => em.create(gym_management_entity_1.MembershipPlanEntity, {
            id: plan.id,
            code: plan.code,
            name: plan.name,
            type: plan.type,
            price: toDecimal(plan.price),
            durationDays: plan.durationDays,
            includesPt: plan.includesPt,
            includedPtSessions: plan.includedPtSessions,
            perks: plan.perks,
            status: plan.status,
        })));
        em.persist(dataset.products.map((product) => em.create(gym_management_entity_1.ProductEntity, {
            id: product.id,
            code: product.code,
            name: product.name,
            category: product.category,
            unitCost: toDecimal(product.unitCost),
            salePrice: toDecimal(product.salePrice),
            stockOnHand: product.stockOnHand,
            minimumStockLevel: product.minimumStockLevel,
            status: product.status,
            deletedAt: toOptionalDateTime(product.deletedAt),
        })));
        em.persist(dataset.systemConfigs.map((config) => em.create(gym_management_entity_1.SystemConfigEntity, {
            key: config.key,
            label: config.label,
            value: config.value,
            description: config.description,
            updatedByUser: config.updatedByUserId
                ? em.getReference(gym_management_entity_1.UserEntity, config.updatedByUserId)
                : null,
            updatedAt: toOptionalDateTime(config.updatedAt) ?? new Date(),
        })));
        await em.flush();
        em.persist(dataset.personalTrainers.map((trainer) => em.create(gym_management_entity_1.PersonalTrainerEntity, {
            id: trainer.id,
            code: trainer.code,
            user: trainer.userId
                ? em.getReference(gym_management_entity_1.UserEntity, trainer.userId)
                : null,
            fullName: trainer.fullName,
            phone: trainer.phone,
            status: trainer.status,
            deletedAt: toOptionalDateTime(trainer.deletedAt),
        })));
        await em.flush();
        em.persist(dataset.ptContracts.map((contract) => em.create(gym_management_entity_1.PtContractEntity, {
            id: contract.id,
            personalTrainer: em.getReference(gym_management_entity_1.PersonalTrainerEntity, contract.ptId),
            contractCode: contract.contractCode ??
                `PTC-${contract.ptId.toUpperCase()}-${contract.id.slice(-3)}`,
            contractType: contract.contractType,
            salaryType: contract.salaryType,
            baseSalary: toDecimal(contract.baseSalary),
            minValidShiftHours: toDecimal(contract.minValidShiftHours),
            standardShiftHours: toDecimal(contract.standardShiftHours),
            overtimeHourlyRate: toDecimal(contract.overtimeHourlyRate),
            performanceBonusThreshold: contract.performanceBonusThreshold,
            performanceBonusAmount: toDecimal(contract.performanceBonusAmount),
            packageCommissionRate: toDecimal(contract.packageCommissionRate),
            salesCommissionRate: toDecimal(contract.salesCommissionRate),
            allowances: toDecimal(contract.allowances),
            penaltyRules: [],
            effectiveFrom: toDateOnly(contract.effectiveFrom),
            effectiveTo: contract.effectiveTo ? toDateOnly(contract.effectiveTo) : null,
        })));
        em.persist(dataset.attendanceLogs.map((attendanceLog) => em.create(gym_management_entity_1.AttendanceLogEntity, {
            id: attendanceLog.id,
            personalTrainer: em.getReference(gym_management_entity_1.PersonalTrainerEntity, attendanceLog.ptId),
            attendanceDate: toDateOnly(attendanceLog.attendanceDate),
            checkInAt: toDateTime(attendanceLog.checkInAt),
            checkOutAt: attendanceLog.checkOutAt ? toDateTime(attendanceLog.checkOutAt) : null,
            workedHours: toDecimal(attendanceLog.workedHours),
            paidHours: toDecimal(attendanceLog.paidHours ?? attendanceLog.workedHours),
            overtimeHours: toDecimal(attendanceLog.overtimeHours),
            status: attendanceLog.status,
            workCredit: toDecimal(attendanceLog.workCredit),
            note: attendanceLog.note ?? null,
        })));
        em.persist(dataset.payrollPeriods.map((period) => em.create(gym_management_entity_1.PayrollPeriodEntity, {
            id: period.id,
            code: period.code,
            fromDate: toDateOnly(period.from),
            toDate: toDateOnly(period.to),
            status: period.status,
            submittedAt: toOptionalDateTime(period.submittedAt),
            approvedByUser: period.approvedByUserId
                ? em.getReference(gym_management_entity_1.UserEntity, period.approvedByUserId)
                : null,
            approvedAt: toOptionalDateTime(period.approvedAt),
            paidAt: toOptionalDateTime(period.paidAt),
        })));
        em.persist(dataset.memberMemberships.map((membership) => em.create(gym_management_entity_1.MemberMembershipEntity, {
            id: membership.id,
            member: em.getReference(gym_management_entity_1.MemberEntity, membership.memberId),
            membershipPlan: em.getReference(gym_management_entity_1.MembershipPlanEntity, membership.membershipPlanId),
            startDate: toDateOnly(membership.startDate),
            endDate: toDateOnly(membership.endDate),
            status: membership.status,
            deletedAt: toOptionalDateTime(membership.deletedAt),
        })));
        await em.flush();
        const periodLookup = new Map(dataset.payrollPeriods.map((period) => [period.id, period]));
        const contractLookup = new Map(dataset.ptContracts.map((contract) => [contract.ptId, contract]));
        const attendanceByPtId = new Map();
        for (const attendanceLog of dataset.attendanceLogs) {
            const current = attendanceByPtId.get(attendanceLog.ptId) ?? [];
            current.push(attendanceLog);
            attendanceByPtId.set(attendanceLog.ptId, current);
        }
        em.persist(dataset.payrollEntries.map((entry) => {
            const period = periodLookup.get(entry.payrollPeriodId);
            const contract = contractLookup.get(entry.ptId);
            const paidHours = (attendanceByPtId.get(entry.ptId) ?? [])
                .filter((attendanceLog) => {
                if (!period) {
                    return false;
                }
                return (attendanceLog.attendanceDate >= period.from &&
                    attendanceLog.attendanceDate <= period.to);
            })
                .reduce((total, attendanceLog) => total + (attendanceLog.paidHours ?? attendanceLog.workedHours), 0);
            return em.create(gym_management_entity_1.PayrollEntryEntity, {
                id: entry.id,
                payrollPeriod: em.getReference(gym_management_entity_1.PayrollPeriodEntity, entry.payrollPeriodId),
                personalTrainer: em.getReference(gym_management_entity_1.PersonalTrainerEntity, entry.ptId),
                contract: contract ? em.getReference(gym_management_entity_1.PtContractEntity, contract.id) : null,
                validShiftCredits: toDecimal(entry.validShiftCredits),
                paidHours: toDecimal(entry.paidHours ?? paidHours),
                overtimeHours: toDecimal(entry.overtimeHours),
                baseSalaryAmount: toDecimal(entry.baseSalaryAmount ?? contract?.baseSalary ?? 0),
                attendanceBonusAmount: toDecimal(entry.attendanceBonusAmount ?? 0),
                overtimeAmount: toDecimal(entry.overtimeAmount ??
                    Number((entry.overtimeHours * (contract?.overtimeHourlyRate ?? 0)).toFixed(2))),
                packageCommission: toDecimal(entry.packageCommission),
                salesCommission: toDecimal(entry.salesCommission),
                performanceBonus: toDecimal(entry.performanceBonus),
                allowanceAmount: toDecimal(entry.allowanceAmount ?? contract?.allowances ?? 0),
                deductionAmount: toDecimal(entry.deductionAmount ?? 0),
                penalties: toDecimal(entry.penalties),
                grossPay: toDecimal(entry.grossPay),
                netPay: toDecimal(entry.netPay),
                status: entry.status,
            });
        }));
        em.persist(dataset.memberPtAssignments.map((assignment) => em.create(gym_management_entity_1.MemberPtAssignmentEntity, {
            id: assignment.id,
            member: em.getReference(gym_management_entity_1.MemberEntity, assignment.memberId),
            personalTrainer: em.getReference(gym_management_entity_1.PersonalTrainerEntity, assignment.ptId),
            memberMembership: em.getReference(gym_management_entity_1.MemberMembershipEntity, assignment.memberMembershipId),
            assignedFrom: toDateOnly(assignment.assignedFrom),
            assignedTo: assignment.assignedTo ? toDateOnly(assignment.assignedTo) : null,
            commissionType: assignment.commissionType ?? 'FIXED',
            commissionValue: assignment.commissionValue === undefined || assignment.commissionValue === null
                ? null
                : toDecimal(assignment.commissionValue),
            commissionAmount: toDecimal(assignment.commissionAmount),
            status: assignment.status,
            note: assignment.note ?? null,
        })));
        em.persist(dataset.membershipInvoices.map((invoice) => em.create(gym_management_entity_1.MembershipInvoiceEntity, {
            id: invoice.id,
            code: invoice.code,
            member: em.getReference(gym_management_entity_1.MemberEntity, invoice.memberId),
            memberMembership: em.getReference(gym_management_entity_1.MemberMembershipEntity, invoice.memberMembershipId),
            invoiceDate: toDateTime(invoice.invoiceDate),
            totalAmount: toDecimal(invoice.totalAmount),
            paymentMethod: invoice.paymentMethod,
            status: invoice.status,
        })));
        em.persist(dataset.salesInvoices.map((invoice) => em.create(gym_management_entity_1.SalesInvoiceEntity, {
            id: invoice.id,
            code: invoice.code,
            invoiceDate: toDateTime(invoice.invoiceDate),
            createdByUser: em.getReference(gym_management_entity_1.UserEntity, invoice.createdByUserId),
            member: invoice.memberId ? em.getReference(gym_management_entity_1.MemberEntity, invoice.memberId) : null,
            customerName: invoice.customerName,
            status: invoice.status,
            paymentMethod: invoice.paymentMethod,
            discountAmount: toDecimal(invoice.discountAmount),
            totalAmount: toDecimal(invoice.totalAmount),
            note: invoice.note,
            confirmedAt: toOptionalDateTime(invoice.confirmedAt),
            cancelledAt: toOptionalDateTime(invoice.cancelledAt),
            cancellationReason: invoice.cancellationReason ?? null,
        })));
        em.persist(dataset.operatingExpenses.map((expense) => em.create(gym_management_entity_1.OperatingExpenseEntity, {
            id: expense.id,
            code: expense.code,
            expenseDate: toDateOnly(expense.expenseDate),
            category: expense.category,
            vendorName: expense.vendorName,
            amount: toDecimal(expense.amount),
            description: expense.description,
            approvedByUser: expense.approvedByUserId
                ? em.getReference(gym_management_entity_1.UserEntity, expense.approvedByUserId)
                : null,
            submittedAt: toOptionalDateTime(expense.submittedAt),
            approvedAt: toOptionalDateTime(expense.approvedAt),
            rejectedAt: toOptionalDateTime(expense.rejectedAt),
            rejectionReason: expense.rejectionReason ?? null,
            paidAt: toOptionalDateTime(expense.paidAt),
            attachmentUrl: expense.attachmentUrl,
            status: expense.status,
        })));
        em.persist(dataset.inventoryTransactions.map((transaction) => em.create(gym_management_entity_1.InventoryTransactionEntity, {
            id: transaction.id,
            product: em.getReference(gym_management_entity_1.ProductEntity, transaction.productId),
            type: transaction.type,
            quantity: transaction.quantity,
            unitCost: toDecimal(transaction.unitCost),
            transactionDate: toDateTime(transaction.transactionDate),
            referenceCode: transaction.referenceCode,
            note: transaction.note,
        })));
        await em.flush();
        em.persist(dataset.salesInvoices.flatMap((invoice) => invoice.items.map((item, index) => em.create(gym_management_entity_1.SalesInvoiceItemEntity, {
            id: `${invoice.id}-item-${index + 1}`,
            salesInvoice: em.getReference(gym_management_entity_1.SalesInvoiceEntity, invoice.id),
            product: em.getReference(gym_management_entity_1.ProductEntity, item.productId),
            quantity: item.quantity,
            unitPrice: toDecimal(item.unitPrice),
            unitCost: toDecimal(item.unitCost),
            lineTotal: toDecimal(item.lineTotal),
        }))));
        await em.flush();
        this.logger.log((((globalThis.process?.env.POSTGRES_HOST) ?? '').toLowerCase() === 'sqlite')
            ? 'Seeded Gym Manager demo data into local SQLite fallback'
            : 'Seeded Gym Manager demo data into PostgreSQL');
    }
};
exports.GymManagementSeedService = GymManagementSeedService;
exports.GymManagementSeedService = GymManagementSeedService = GymManagementSeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.MikroORM,
        config_1.ConfigService])
], GymManagementSeedService);
//# sourceMappingURL=gym-management.seed.service.js.map