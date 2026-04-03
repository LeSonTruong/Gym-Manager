import type {
  AttendanceLog,
  DemoUser,
  GymManagementDataset,
  InventoryTransaction,
  Member,
  MemberMembership,
  MemberPtAssignment,
  MembershipInvoice,
  MembershipPlan,
  OperatingExpense,
  PayrollEntry,
  PayrollPeriod,
  PersonalTrainer,
  Product,
  PtContract,
  SalesInvoice,
  SalesInvoiceItem,
  SystemConfig,
} from '@next-nest-turbo-boilerplate/shared';
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

function toDateOnlyString(value: Date | string | number): string {
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return new Date(value).toISOString().slice(0, 10);
}

function toDateTimeString(value: Date | string | number): string {
  if (typeof value === 'string') {
    return new Date(value).toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

export function parseDateOnly(value: string): Date {
  return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
}

export function parseDateTime(value: string): Date {
  return new Date(value);
}

export function toDecimalString(value: number): string {
  return value.toString();
}

const userRoles = ["ADMIN", "STAFF"] as const;
const userStatuses = ["ACTIVE", "INACTIVE"] as const;
const genders = ["MALE", "FEMALE", "OTHER"] as const;
const salaryTypes = ["MONTHLY", "DAILY", "HOURLY"] as const;
const attendanceStatuses = ["OPEN", "VALID", "HALF", "INVALID"] as const;
const payrollPeriodStatuses = ["OPEN", "PENDING_APPROVAL", "APPROVED", "PAID"] as const;
const payrollEntryStatuses = ["PENDING_APPROVAL", "APPROVED", "PAID"] as const;
const membershipPlanTypes = ["DAY", "MONTH", "YEAR"] as const;
const membershipPlanStatuses = ["ON_SALE", "OFF_SALE"] as const;
const membershipStatuses = ["ACTIVE", "EXPIRED", "CANCELLED"] as const;
const commissionTypes = ["PERCENT", "FIXED"] as const;
const assignmentStatuses = ["ACTIVE", "ENDED"] as const;
const paymentMethods = ["CASH", "BANK_TRANSFER", "CARD"] as const;
const membershipInvoiceStatuses = ["CONFIRMED", "CANCELLED"] as const;
const productStatuses = ["ACTIVE", "INACTIVE"] as const;
const inventoryTransactionTypes = ["IMPORT", "SALE", "ADJUSTMENT"] as const;
const salesInvoiceStatuses = ["DRAFT", "CONFIRMED", "CANCELLED"] as const;
const expenseCategories = ["CLEANING", "UTILITY", "SALARY", "RENT", "OTHER"] as const;
const expenseStatuses = ["DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED", "PAID"] as const;

function isOneOf<T extends readonly string[]>(
  value: string,
  acceptedValues: T,
): value is T[number] {
  return (acceptedValues as readonly string[]).includes(value);
}

function coerceEnumValue<T extends readonly string[]>(
  value: string,
  acceptedValues: T,
  fallback: T[number],
): T[number] {
  return isOneOf(value, acceptedValues) ? value : fallback;
}

export function mapUserEntity(entity: UserEntity): DemoUser {
  return {
    id: entity.id,
    fullName: entity.fullName,
    username: entity.username,
    role: coerceEnumValue(entity.role, userRoles, "STAFF"),
    status: coerceEnumValue(entity.status, userStatuses, "ACTIVE"),
    deletedAt: entity.deletedAt ? toDateTimeString(entity.deletedAt) : undefined,
  };
}

export function mapPersonalTrainerEntity(entity: PersonalTrainerEntity): PersonalTrainer {
  return {
    id: entity.id,
    code: entity.code,
    userId: entity.user?.id ?? undefined,
    fullName: entity.fullName,
    gender: coerceEnumValue(entity.gender, genders, "OTHER"),
    birthDate: toDateOnlyString(entity.birthDate),
    phone: entity.phone,
    email: entity.email,
    address: entity.address,
    status: coerceEnumValue(entity.status, userStatuses, "ACTIVE"),
    specialties: entity.specialties,
    experienceYears: entity.experienceYears,
    avatarUrl: entity.avatarUrl,
    startDate: toDateOnlyString(entity.startDate),
    deletedAt: entity.deletedAt ? toDateTimeString(entity.deletedAt) : undefined,
  };
}

export function mapPtContractEntity(entity: PtContractEntity): PtContract {
  return {
    id: entity.id,
    ptId: entity.personalTrainer.id,
    contractCode: entity.contractCode,
    contractType: entity.contractType,
    salaryType: coerceEnumValue(entity.salaryType, salaryTypes, "MONTHLY"),
    baseSalary: Number(entity.baseSalary),
    minValidShiftHours: Number(entity.minValidShiftHours),
    standardShiftHours: Number(entity.standardShiftHours),
    overtimeHourlyRate: Number(entity.overtimeHourlyRate),
    performanceBonusThreshold: entity.performanceBonusThreshold,
    performanceBonusAmount: Number(entity.performanceBonusAmount),
    packageCommissionRate: Number(entity.packageCommissionRate),
    salesCommissionRate: Number(entity.salesCommissionRate),
    allowances: Number(entity.allowances),
    effectiveFrom: toDateOnlyString(entity.effectiveFrom),
    effectiveTo: entity.effectiveTo ? toDateOnlyString(entity.effectiveTo) : undefined,
  };
}

export function mapAttendanceLogEntity(entity: AttendanceLogEntity): AttendanceLog {
  return {
    id: entity.id,
    ptId: entity.personalTrainer.id,
    attendanceDate: toDateOnlyString(entity.attendanceDate),
    checkInAt: toDateTimeString(entity.checkInAt),
    checkOutAt: entity.checkOutAt ? toDateTimeString(entity.checkOutAt) : undefined,
    workedHours: Number(entity.workedHours),
    paidHours: Number(entity.paidHours),
    overtimeHours: Number(entity.overtimeHours),
    status: coerceEnumValue(entity.status, attendanceStatuses, "OPEN"),
    workCredit: Number(entity.workCredit),
    note: entity.note ?? undefined,
  };
}

export function mapPayrollPeriodEntity(entity: PayrollPeriodEntity): PayrollPeriod {
  return {
    id: entity.id,
    code: entity.code,
    from: toDateOnlyString(entity.fromDate),
    to: toDateOnlyString(entity.toDate),
    status: coerceEnumValue(entity.status, payrollPeriodStatuses, "OPEN"),
    submittedAt: entity.submittedAt ? toDateTimeString(entity.submittedAt) : undefined,
    approvedByUserId: entity.approvedByUser?.id ?? undefined,
    approvedAt: entity.approvedAt ? toDateTimeString(entity.approvedAt) : undefined,
    paidAt: entity.paidAt ? toDateTimeString(entity.paidAt) : undefined,
  };
}

export function mapPayrollEntryEntity(entity: PayrollEntryEntity): PayrollEntry {
  return {
    id: entity.id,
    payrollPeriodId: entity.payrollPeriod.id,
    ptId: entity.personalTrainer.id,
    contractId: entity.contract?.id ?? undefined,
    validShiftCredits: Number(entity.validShiftCredits),
    paidHours: Number(entity.paidHours),
    overtimeHours: Number(entity.overtimeHours),
    baseSalaryAmount: Number(entity.baseSalaryAmount),
    attendanceBonusAmount: Number(entity.attendanceBonusAmount),
    overtimeAmount: Number(entity.overtimeAmount),
    packageCommission: Number(entity.packageCommission),
    salesCommission: Number(entity.salesCommission),
    performanceBonus: Number(entity.performanceBonus),
    allowanceAmount: Number(entity.allowanceAmount),
    deductionAmount: Number(entity.deductionAmount),
    penalties: Number(entity.penalties),
    grossPay: Number(entity.grossPay),
    netPay: Number(entity.netPay),
    status: coerceEnumValue(entity.status, payrollEntryStatuses, "PENDING_APPROVAL"),
  };
}

export function mapMemberEntity(entity: MemberEntity): Member {
  return {
    id: entity.id,
    code: entity.code,
    fullName: entity.fullName,
    gender: coerceEnumValue(entity.gender, genders, "OTHER"),
    birthDate: toDateOnlyString(entity.birthDate),
    phone: entity.phone,
    email: entity.email,
    address: entity.address,
    heightCm: entity.heightCm,
    weightKg: entity.weightKg,
    goal: entity.goal,
    healthNotes: entity.healthNotes,
    registeredAt: toDateOnlyString(entity.registeredAt),
    status: coerceEnumValue(entity.status, userStatuses, "ACTIVE"),
    deletedAt: entity.deletedAt ? toDateTimeString(entity.deletedAt) : undefined,
  };
}

export function mapMembershipPlanEntity(entity: MembershipPlanEntity): MembershipPlan {
  return {
    id: entity.id,
    code: entity.code,
    name: entity.name,
    type: coerceEnumValue(entity.type, membershipPlanTypes, "MONTH"),
    price: Number(entity.price),
    durationDays: entity.durationDays,
    includesPt: entity.includesPt,
    includedPtSessions: entity.includedPtSessions,
    perks: entity.perks,
    status: coerceEnumValue(entity.status, membershipPlanStatuses, "ON_SALE"),
  };
}

export function mapMemberMembershipEntity(entity: MemberMembershipEntity): MemberMembership {
  return {
    id: entity.id,
    memberId: entity.member.id,
    membershipPlanId: entity.membershipPlan.id,
    startDate: toDateOnlyString(entity.startDate),
    endDate: toDateOnlyString(entity.endDate),
    status: coerceEnumValue(entity.status, membershipStatuses, "ACTIVE"),
    deletedAt: entity.deletedAt ? toDateTimeString(entity.deletedAt) : undefined,
  };
}

export function mapMemberPtAssignmentEntity(entity: MemberPtAssignmentEntity): MemberPtAssignment {
  return {
    id: entity.id,
    memberId: entity.member.id,
    ptId: entity.personalTrainer.id,
    memberMembershipId: entity.memberMembership.id,
    assignedFrom: toDateOnlyString(entity.assignedFrom),
    assignedTo: entity.assignedTo ? toDateOnlyString(entity.assignedTo) : undefined,
    commissionType:
      typeof entity.commissionType === "string" &&
        isOneOf(entity.commissionType, commissionTypes)
        ? entity.commissionType
        : undefined,
    commissionValue: entity.commissionValue ? Number(entity.commissionValue) : undefined,
    commissionAmount: Number(entity.commissionAmount),
    status: coerceEnumValue(entity.status, assignmentStatuses, "ACTIVE"),
    note: entity.note ?? undefined,
  };
}

export function mapMembershipInvoiceEntity(entity: MembershipInvoiceEntity): MembershipInvoice {
  return {
    id: entity.id,
    code: entity.code,
    memberId: entity.member.id,
    memberMembershipId: entity.memberMembership.id,
    invoiceDate: toDateTimeString(entity.invoiceDate),
    totalAmount: Number(entity.totalAmount),
    paymentMethod: coerceEnumValue(entity.paymentMethod, paymentMethods, "CASH"),
    status: coerceEnumValue(entity.status, membershipInvoiceStatuses, "CONFIRMED"),
  };
}

export function mapProductEntity(entity: ProductEntity): Product {
  return {
    id: entity.id,
    code: entity.code,
    name: entity.name,
    category: entity.category,
    unitCost: Number(entity.unitCost),
    salePrice: Number(entity.salePrice),
    stockOnHand: entity.stockOnHand,
    minimumStockLevel: entity.minimumStockLevel,
    status: coerceEnumValue(entity.status, productStatuses, "ACTIVE"),
    deletedAt: entity.deletedAt ? toDateTimeString(entity.deletedAt) : undefined,
  };
}

export function mapInventoryTransactionEntity(entity: InventoryTransactionEntity): InventoryTransaction {
  return {
    id: entity.id,
    productId: entity.product.id,
    type: coerceEnumValue(entity.type, inventoryTransactionTypes, "IMPORT"),
    quantity: entity.quantity,
    unitCost: Number(entity.unitCost),
    transactionDate: toDateTimeString(entity.transactionDate),
    referenceCode: entity.referenceCode,
    note: entity.note,
  };
}

export function mapSalesInvoiceItemEntity(entity: SalesInvoiceItemEntity): SalesInvoiceItem {
  return {
    productId: entity.product.id,
    quantity: entity.quantity,
    unitPrice: Number(entity.unitPrice),
    unitCost: Number(entity.unitCost),
    lineTotal: Number(entity.lineTotal),
  };
}

export function mapSalesInvoiceEntity(entity: SalesInvoiceEntity, items: SalesInvoiceItem[]): SalesInvoice {
  return {
    id: entity.id,
    code: entity.code,
    invoiceDate: toDateTimeString(entity.invoiceDate),
    createdByUserId: entity.createdByUser.id,
    memberId: entity.member?.id ?? undefined,
    customerName: entity.customerName,
    status: coerceEnumValue(entity.status, salesInvoiceStatuses, "DRAFT"),
    paymentMethod: coerceEnumValue(entity.paymentMethod, paymentMethods, "CASH"),
    discountAmount: Number(entity.discountAmount),
    totalAmount: Number(entity.totalAmount),
    note: entity.note,
    items,
    confirmedAt: entity.confirmedAt ? toDateTimeString(entity.confirmedAt) : undefined,
    cancelledAt: entity.cancelledAt ? toDateTimeString(entity.cancelledAt) : undefined,
    cancellationReason: entity.cancellationReason ?? undefined,
  };
}

export function mapOperatingExpenseEntity(entity: OperatingExpenseEntity): OperatingExpense {
  return {
    id: entity.id,
    code: entity.code,
    expenseDate: toDateOnlyString(entity.expenseDate),
    category: coerceEnumValue(entity.category, expenseCategories, "OTHER"),
    vendorName: entity.vendorName,
    amount: Number(entity.amount),
    description: entity.description,
    approvedByUserId: entity.approvedByUser?.id ?? undefined,
    attachmentUrl: entity.attachmentUrl ?? undefined,
    status: coerceEnumValue(entity.status, expenseStatuses, "DRAFT"),
    submittedAt: entity.submittedAt ? toDateTimeString(entity.submittedAt) : undefined,
    approvedAt: entity.approvedAt ? toDateTimeString(entity.approvedAt) : undefined,
    rejectedAt: entity.rejectedAt ? toDateTimeString(entity.rejectedAt) : undefined,
    rejectionReason: entity.rejectionReason ?? undefined,
    paidAt: entity.paidAt ? toDateTimeString(entity.paidAt) : undefined,
  };
}

export function mapEquipmentAssetEntity(entity: EquipmentAssetEntity): Record<string, unknown> {
  return {
    id: entity.id,
    code: entity.code,
    name: entity.name,
    category: entity.category ?? undefined,
    purchasedAt: toDateOnlyString(entity.purchasedAt),
    purchaseValue: Number(entity.purchaseValue),
    status: entity.status ?? undefined,
    condition: entity.condition,
    location: entity.location ?? undefined,
    nextMaintenanceAt: entity.nextMaintenanceAt
      ? toDateOnlyString(entity.nextMaintenanceAt)
      : undefined,
    note: entity.note,
    deletedAt: entity.deletedAt ? toDateTimeString(entity.deletedAt) : undefined,
  };
}

export function mapMaintenanceRecordEntity(entity: MaintenanceRecordEntity): Record<string, unknown> {
  return {
    id: entity.id,
    equipmentAssetId: entity.equipmentAsset.id,
    maintenanceDate: toDateOnlyString(entity.maintenanceDate),
    maintenanceType: entity.maintenanceType ?? undefined,
    description: entity.description,
    vendorName: entity.vendorName,
    amount: Number(entity.amount),
    resultStatus: entity.resultStatus ?? undefined,
    note: entity.note ?? undefined,
    createdByUserId: entity.createdByUser?.id ?? undefined,
  };
}

export function mapSystemConfigEntity(entity: SystemConfigEntity): SystemConfig {
  return {
    key: entity.key,
    label: entity.label,
    value: entity.value,
    description: entity.description,
    updatedByUserId: entity.updatedByUser?.id ?? undefined,
    updatedAt: toDateTimeString(entity.updatedAt),
  };
}

export type GymManagementEntityCollections = {
  users: UserEntity[];
  personalTrainers: PersonalTrainerEntity[];
  ptContracts: PtContractEntity[];
  attendanceLogs: AttendanceLogEntity[];
  payrollPeriods: PayrollPeriodEntity[];
  payrollEntries: PayrollEntryEntity[];
  members: MemberEntity[];
  membershipPlans: MembershipPlanEntity[];
  memberMemberships: MemberMembershipEntity[];
  memberPtAssignments: MemberPtAssignmentEntity[];
  membershipInvoices: MembershipInvoiceEntity[];
  products: ProductEntity[];
  inventoryTransactions: InventoryTransactionEntity[];
  salesInvoices: SalesInvoiceEntity[];
  salesInvoiceItems: SalesInvoiceItemEntity[];
  operatingExpenses: OperatingExpenseEntity[];
  systemConfigs: SystemConfigEntity[];
};

export function mapDatasetFromEntities(
  collections: GymManagementEntityCollections,
  generatedAt = new Date().toISOString(),
): GymManagementDataset {
  const salesInvoiceItemsByInvoiceId = new Map<string, SalesInvoiceItem[]>();

  for (const item of collections.salesInvoiceItems) {
    const salesInvoiceId = item.salesInvoice.id;
    const currentItems = salesInvoiceItemsByInvoiceId.get(salesInvoiceId) ?? [];
    currentItems.push(mapSalesInvoiceItemEntity(item));
    salesInvoiceItemsByInvoiceId.set(salesInvoiceId, currentItems);
  }

  return {
    generatedAt,
    users: collections.users.map((entity) => mapUserEntity(entity)),
    personalTrainers: collections.personalTrainers.map((entity) => mapPersonalTrainerEntity(entity)),
    ptContracts: collections.ptContracts.map((entity) => mapPtContractEntity(entity)),
    attendanceLogs: collections.attendanceLogs.map((entity) => mapAttendanceLogEntity(entity)),
    payrollPeriods: collections.payrollPeriods.map((entity) => mapPayrollPeriodEntity(entity)),
    payrollEntries: collections.payrollEntries.map((entity) => mapPayrollEntryEntity(entity)),
    members: collections.members.map((entity) => mapMemberEntity(entity)),
    membershipPlans: collections.membershipPlans.map((entity) => mapMembershipPlanEntity(entity)),
    memberMemberships: collections.memberMemberships.map((entity) => mapMemberMembershipEntity(entity)),
    memberPtAssignments: collections.memberPtAssignments.map((entity) => mapMemberPtAssignmentEntity(entity)),
    membershipInvoices: collections.membershipInvoices.map((entity) => mapMembershipInvoiceEntity(entity)),
    products: collections.products.map((entity) => mapProductEntity(entity)),
    inventoryTransactions: collections.inventoryTransactions.map((entity) => mapInventoryTransactionEntity(entity)),
    salesInvoices: collections.salesInvoices.map((invoice) =>
      mapSalesInvoiceEntity(invoice, salesInvoiceItemsByInvoiceId.get(invoice.id) ?? []),
    ),
    operatingExpenses: collections.operatingExpenses.map((entity) => mapOperatingExpenseEntity(entity)),
    memberCheckIns: [],
    ptBookingSessions: [],
    paymentTransactions: [],
    equipmentAssets: [],
    maintenanceRecords: [],
    systemConfigs: collections.systemConfigs.map((entity) => mapSystemConfigEntity(entity)),
  };
}

