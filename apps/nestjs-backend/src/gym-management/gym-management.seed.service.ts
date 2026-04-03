import { MikroORM } from '@mikro-orm/core';
import {
  createGymManagementMockData,
  type GymManagementDataset,
} from '@next-nest-turbo-boilerplate/shared';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '../config/config-key.enum';
import {
  AttendanceLogEntity,
  InventoryTransactionEntity,
  MemberEntity,
  MemberMembershipEntity,
  MemberPtAssignmentEntity,
  MembershipInvoiceEntity,
  MembershipPlanEntity,
  OperatingExpenseEntity,
  PayrollEntryEntity,
  PayrollPeriodEntity,
  PersonalTrainerEntity,
  ProductEntity,
  PtContractEntity,
  SalesInvoiceEntity,
  SalesInvoiceItemEntity,
  SystemConfigEntity,
  UserEntity,
} from './entities/gym-management.entity';
import { hashPassword } from './auth/auth-crypto';

function toDateOnly(value: string): Date {
  return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
}

function toDateTime(value: string): Date {
  return new Date(value);
}

function toOptionalDateTime(value?: string | null): Date | null {
  return value ? toDateTime(value) : null;
}

function toDecimal(value: number): string {
  return value.toString();
}

@Injectable()
export class GymManagementSeedService implements OnModuleInit {
  private readonly logger = new Logger(GymManagementSeedService.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly configService: ConfigService,
  ) {

  }

  async onModuleInit(): Promise<void> {
    await (((globalThis.process?.env.POSTGRES_HOST) ?? '').toLowerCase() === 'sqlite'
      ? this.orm.schema.updateSchema()
      : this.orm.migrator.up());

    if (!this.configService.get<boolean>(ConfigKey.ENABLE_DEMO_SEED)) {
      this.logger.log('Skipped demo data seed because ENABLE_DEMO_SEED is disabled');
      return;
    }

    await this.seedIfEmpty();
  }

  private async seedIfEmpty(): Promise<void> {
    const em = this.orm.em.fork();
    const userCount = await em.count(UserEntity, {});

    if (userCount > 0) {
      return;
    }

    const dataset: GymManagementDataset = createGymManagementMockData();

    em.persist(
      dataset.users.map((user) =>
        em.create(UserEntity, {
          id: user.id,
          fullName: user.fullName,
          username: user.username,
          role: user.role,
          status: user.status,
          passwordHash: hashPassword(user.passwordHint ?? 'demo123'),
          deletedAt: toOptionalDateTime(user.deletedAt),
        }),
      ),
    );

    em.persist(
      dataset.members.map((member) =>
        em.create(MemberEntity, {
          id: member.id,
          code: member.code,
          fullName: member.fullName,
          gender: member.gender,
          birthDate: toDateOnly(member.birthDate),
          phone: member.phone,
          email: member.email,
          address: member.address,
          heightCm: member.heightCm,
          weightKg: member.weightKg,
          goal: member.goal,
          healthNotes: member.healthNotes,
          registeredAt: toDateOnly(member.registeredAt),
          status: member.status,
          deletedAt: toOptionalDateTime(member.deletedAt),
        }),
      ),
    );

    em.persist(
      dataset.membershipPlans.map((plan) =>
        em.create(MembershipPlanEntity, {
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
        }),
      ),
    );

    em.persist(
      dataset.products.map((product) =>
        em.create(ProductEntity, {
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
        }),
      ),
    );

    em.persist(
      dataset.systemConfigs.map((config) =>
        em.create(SystemConfigEntity, {
          key: config.key,
          label: config.label,
          value: config.value,
          description: config.description,
          updatedByUser: config.updatedByUserId
            ? em.getReference(UserEntity, config.updatedByUserId)
            : null,
          updatedAt: toOptionalDateTime(config.updatedAt) ?? new Date(),
        }),
      ),
    );

    await em.flush();
    em.persist(
      dataset.personalTrainers.map((trainer) =>
        em.create(PersonalTrainerEntity, {
          id: trainer.id,
          code: trainer.code,
          user: trainer.userId
            ? em.getReference(UserEntity, trainer.userId)
            : null,
          fullName: trainer.fullName,
          gender: trainer.gender,
          birthDate: toDateOnly(trainer.birthDate),
          phone: trainer.phone,
          email: trainer.email,
          address: trainer.address,
          status: trainer.status,
          specialties: trainer.specialties,
          experienceYears: trainer.experienceYears,
          avatarUrl: trainer.avatarUrl,
          startDate: toDateOnly(trainer.startDate),
          deletedAt: toOptionalDateTime(trainer.deletedAt),
        }),
      ),
    );

    await em.flush();

    em.persist(
      dataset.ptContracts.map((contract) =>
        em.create(PtContractEntity, {
          id: contract.id,
          personalTrainer: em.getReference(PersonalTrainerEntity, contract.ptId),
          contractCode:
            contract.contractCode ??
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
        }),
      ),
    );

    em.persist(
      dataset.attendanceLogs.map((attendanceLog) =>
        em.create(AttendanceLogEntity, {
          id: attendanceLog.id,
          personalTrainer: em.getReference(PersonalTrainerEntity, attendanceLog.ptId),
          attendanceDate: toDateOnly(attendanceLog.attendanceDate),
          checkInAt: toDateTime(attendanceLog.checkInAt),
          checkOutAt: attendanceLog.checkOutAt ? toDateTime(attendanceLog.checkOutAt) : null,
          workedHours: toDecimal(attendanceLog.workedHours),
          paidHours: toDecimal(attendanceLog.paidHours ?? attendanceLog.workedHours),
          overtimeHours: toDecimal(attendanceLog.overtimeHours),
          status: attendanceLog.status,
          workCredit: toDecimal(attendanceLog.workCredit),
          note: attendanceLog.note ?? null,
        }),
      ),
    );

    em.persist(
      dataset.payrollPeriods.map((period) =>
        em.create(PayrollPeriodEntity, {
          id: period.id,
          code: period.code,
          fromDate: toDateOnly(period.from),
          toDate: toDateOnly(period.to),
          status: period.status,
          submittedAt: toOptionalDateTime(period.submittedAt),
          approvedByUser: period.approvedByUserId
            ? em.getReference(UserEntity, period.approvedByUserId)
            : null,
          approvedAt: toOptionalDateTime(period.approvedAt),
          paidAt: toOptionalDateTime(period.paidAt),
        }),
      ),
    );

    em.persist(
      dataset.memberMemberships.map((membership) =>
        em.create(MemberMembershipEntity, {
          id: membership.id,
          member: em.getReference(MemberEntity, membership.memberId),
          membershipPlan: em.getReference(MembershipPlanEntity, membership.membershipPlanId),
          startDate: toDateOnly(membership.startDate),
          endDate: toDateOnly(membership.endDate),
          status: membership.status,
          deletedAt: toOptionalDateTime(membership.deletedAt),
        }),
      ),
    );

    await em.flush();

    const periodLookup = new Map(dataset.payrollPeriods.map((period) => [period.id, period]));
    const contractLookup = new Map(dataset.ptContracts.map((contract) => [contract.ptId, contract]));
    const attendanceByPtId = new Map<string, typeof dataset.attendanceLogs>();

    for (const attendanceLog of dataset.attendanceLogs) {
      const current = attendanceByPtId.get(attendanceLog.ptId) ?? [];
      current.push(attendanceLog);
      attendanceByPtId.set(attendanceLog.ptId, current);
    }

    em.persist(
      dataset.payrollEntries.map((entry) => {
        const period = periodLookup.get(entry.payrollPeriodId);
        const contract = contractLookup.get(entry.ptId);
        const paidHours = (attendanceByPtId.get(entry.ptId) ?? [])
          .filter((attendanceLog) => {
            if (!period) {
              return false;
            }

            return (
              attendanceLog.attendanceDate >= period.from &&
              attendanceLog.attendanceDate <= period.to
            );
          })
          .reduce(
            (total, attendanceLog) =>
              total + (attendanceLog.paidHours ?? attendanceLog.workedHours),
            0,
          );

        return em.create(PayrollEntryEntity, {
          id: entry.id,
          payrollPeriod: em.getReference(PayrollPeriodEntity, entry.payrollPeriodId),
          personalTrainer: em.getReference(PersonalTrainerEntity, entry.ptId),
          contract: contract ? em.getReference(PtContractEntity, contract.id) : null,
          validShiftCredits: toDecimal(entry.validShiftCredits),
          paidHours: toDecimal(entry.paidHours ?? paidHours),
          overtimeHours: toDecimal(entry.overtimeHours),
          baseSalaryAmount: toDecimal(entry.baseSalaryAmount ?? contract?.baseSalary ?? 0),
          attendanceBonusAmount: toDecimal(entry.attendanceBonusAmount ?? 0),
          overtimeAmount: toDecimal(
            entry.overtimeAmount ??
            Number((entry.overtimeHours * (contract?.overtimeHourlyRate ?? 0)).toFixed(2)),
          ),
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
      }),
    );

    em.persist(
      dataset.memberPtAssignments.map((assignment) =>
        em.create(MemberPtAssignmentEntity, {
          id: assignment.id,
          member: em.getReference(MemberEntity, assignment.memberId),
          personalTrainer: em.getReference(PersonalTrainerEntity, assignment.ptId),
          memberMembership: em.getReference(MemberMembershipEntity, assignment.memberMembershipId),
          assignedFrom: toDateOnly(assignment.assignedFrom),
          assignedTo: assignment.assignedTo ? toDateOnly(assignment.assignedTo) : null,
          commissionType: assignment.commissionType ?? 'FIXED',
          commissionValue:
            assignment.commissionValue === undefined || assignment.commissionValue === null
              ? null
              : toDecimal(assignment.commissionValue),
          commissionAmount: toDecimal(assignment.commissionAmount),
          status: assignment.status,
          note: assignment.note ?? null,
        }),
      ),
    );

    em.persist(
      dataset.membershipInvoices.map((invoice) =>
        em.create(MembershipInvoiceEntity, {
          id: invoice.id,
          code: invoice.code,
          member: em.getReference(MemberEntity, invoice.memberId),
          memberMembership: em.getReference(MemberMembershipEntity, invoice.memberMembershipId),
          invoiceDate: toDateTime(invoice.invoiceDate),
          totalAmount: toDecimal(invoice.totalAmount),
          paymentMethod: invoice.paymentMethod,
          status: invoice.status,
        }),
      ),
    );

    em.persist(
      dataset.salesInvoices.map((invoice) =>
        em.create(SalesInvoiceEntity, {
          id: invoice.id,
          code: invoice.code,
          invoiceDate: toDateTime(invoice.invoiceDate),
          createdByUser: em.getReference(UserEntity, invoice.createdByUserId),
          member: invoice.memberId ? em.getReference(MemberEntity, invoice.memberId) : null,
          customerName: invoice.customerName,
          status: invoice.status,
          paymentMethod: invoice.paymentMethod,
          discountAmount: toDecimal(invoice.discountAmount),
          totalAmount: toDecimal(invoice.totalAmount),
          note: invoice.note,
          confirmedAt: toOptionalDateTime(invoice.confirmedAt),
          cancelledAt: toOptionalDateTime(invoice.cancelledAt),
          cancellationReason: invoice.cancellationReason ?? null,
        }),
      ),
    );

    em.persist(
      dataset.operatingExpenses.map((expense) =>
        em.create(OperatingExpenseEntity, {
          id: expense.id,
          code: expense.code,
          expenseDate: toDateOnly(expense.expenseDate),
          category: expense.category,
          vendorName: expense.vendorName,
          amount: toDecimal(expense.amount),
          description: expense.description,
          approvedByUser: expense.approvedByUserId
            ? em.getReference(UserEntity, expense.approvedByUserId)
            : null,
          submittedAt: toOptionalDateTime(expense.submittedAt),
          approvedAt: toOptionalDateTime(expense.approvedAt),
          rejectedAt: toOptionalDateTime(expense.rejectedAt),
          rejectionReason: expense.rejectionReason ?? null,
          paidAt: toOptionalDateTime(expense.paidAt),
          attachmentUrl: expense.attachmentUrl,
          status: expense.status,
        }),
      ),
    );

    em.persist(
      dataset.inventoryTransactions.map((transaction) =>
        em.create(InventoryTransactionEntity, {
          id: transaction.id,
          product: em.getReference(ProductEntity, transaction.productId),
          type: transaction.type,
          quantity: transaction.quantity,
          unitCost: toDecimal(transaction.unitCost),
          transactionDate: toDateTime(transaction.transactionDate),
          referenceCode: transaction.referenceCode,
          note: transaction.note,
        }),
      ),
    );

    await em.flush();

    em.persist(
      dataset.salesInvoices.flatMap((invoice) =>
        invoice.items.map((item, index) =>
          em.create(SalesInvoiceItemEntity, {
            id: `${invoice.id}-item-${index + 1}`,
            salesInvoice: em.getReference(SalesInvoiceEntity, invoice.id),
            product: em.getReference(ProductEntity, item.productId),
            quantity: item.quantity,
            unitPrice: toDecimal(item.unitPrice),
            unitCost: toDecimal(item.unitCost),
            lineTotal: toDecimal(item.lineTotal),
          }),
        ),
      ),
    );

    await em.flush();
    this.logger.log(
      (((globalThis.process?.env.POSTGRES_HOST) ?? '').toLowerCase() === 'sqlite')
        ? 'Seeded Gym Manager demo data into local SQLite fallback'
        : 'Seeded Gym Manager demo data into PostgreSQL',
    );
  }
}
