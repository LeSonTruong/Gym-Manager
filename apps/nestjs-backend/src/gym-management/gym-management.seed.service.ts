import {MikroORM} from '@mikro-orm/core';
import {createGymManagementMockData} from '@next-nest-turbo-boilerplate/shared';
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {
  AttendanceLogEntity,
  EquipmentAssetEntity,
  InventoryTransactionEntity,
  MaintenanceRecordEntity,
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

function toDateOnly(value: string): Date {
  return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
}

function toDateTime(value: string): Date {
  return new Date(value);
}

function toDecimal(value: number): string {
  return value.toString();
}

@Injectable()
export class GymManagementSeedService implements OnModuleInit {
  private readonly logger = new Logger(GymManagementSeedService.name);

  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.migrator.up();
    await this.seedIfEmpty();
  }

  private async seedIfEmpty(): Promise<void> {
    const em = this.orm.em.fork();
    const userCount = await em.count(UserEntity, {});

    if (userCount > 0) {
      return;
    }

    const dataset = createGymManagementMockData();

    em.persist(
      dataset.users.map((user) =>
        em.create(UserEntity, {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
          passwordHint: user.passwordHint,
        }),
      ),
    );

    em.persist(
      dataset.personalTrainers.map((trainer) =>
        em.create(PersonalTrainerEntity, {
          id: trainer.id,
          code: trainer.code,
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
          usageLimit: plan.usageLimit,
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
        }),
      ),
    );

    em.persist(
      dataset.equipmentAssets.map((equipmentAsset) =>
        em.create(EquipmentAssetEntity, {
          id: equipmentAsset.id,
          code: equipmentAsset.code,
          name: equipmentAsset.name,
          purchasedAt: toDateOnly(equipmentAsset.purchasedAt),
          purchaseValue: toDecimal(equipmentAsset.purchaseValue),
          condition: equipmentAsset.condition,
          nextMaintenanceAt: toDateOnly(equipmentAsset.nextMaintenanceAt),
          note: equipmentAsset.note,
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
        }),
      ),
    );

    await em.flush();

    em.persist(
      dataset.ptContracts.map((contract) =>
        em.create(PtContractEntity, {
          id: contract.id,
          personalTrainer: em.getReference(PersonalTrainerEntity, contract.ptId),
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
          penaltyRules: contract.penaltyRules,
          effectiveFrom: toDateOnly(contract.effectiveFrom),
          effectiveTo: toDateOnly(contract.effectiveTo),
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
          overtimeHours: toDecimal(attendanceLog.overtimeHours),
          status: attendanceLog.status,
          workCredit: toDecimal(attendanceLog.workCredit),
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
          remainingSessions: membership.remainingSessions,
          status: membership.status,
        }),
      ),
    );

    em.persist(
      dataset.maintenanceRecords.map((maintenanceRecord) =>
        em.create(MaintenanceRecordEntity, {
          id: maintenanceRecord.id,
          equipmentAsset: em.getReference(EquipmentAssetEntity, maintenanceRecord.equipmentAssetId),
          maintenanceDate: toDateOnly(maintenanceRecord.maintenanceDate),
          description: maintenanceRecord.description,
          vendorName: maintenanceRecord.vendorName,
          amount: toDecimal(maintenanceRecord.amount),
        }),
      ),
    );

    await em.flush();

    em.persist(
      dataset.payrollEntries.map((entry) =>
        em.create(PayrollEntryEntity, {
          id: entry.id,
          payrollPeriod: em.getReference(PayrollPeriodEntity, entry.payrollPeriodId),
          personalTrainer: em.getReference(PersonalTrainerEntity, entry.ptId),
          validShiftCredits: toDecimal(entry.validShiftCredits),
          overtimeHours: toDecimal(entry.overtimeHours),
          packageCommission: toDecimal(entry.packageCommission),
          salesCommission: toDecimal(entry.salesCommission),
          performanceBonus: toDecimal(entry.performanceBonus),
          penalties: toDecimal(entry.penalties),
          grossPay: toDecimal(entry.grossPay),
          netPay: toDecimal(entry.netPay),
          status: entry.status,
        }),
      ),
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
          commissionAmount: toDecimal(assignment.commissionAmount),
          status: assignment.status,
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
          equipmentAsset: expense.equipmentAssetId
            ? em.getReference(EquipmentAssetEntity, expense.equipmentAssetId)
            : null,
          vendorName: expense.vendorName,
          amount: toDecimal(expense.amount),
          description: expense.description,
          approvedByUser: expense.approvedByUserId
            ? em.getReference(UserEntity, expense.approvedByUserId)
            : null,
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
    this.logger.log('Seeded Gym Manager demo data into PostgreSQL');
  }
}
