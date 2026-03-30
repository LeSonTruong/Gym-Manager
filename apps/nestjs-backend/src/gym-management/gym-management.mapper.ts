import type {
  AttendanceLog,
  DemoUser,
  EquipmentAsset,
  GymManagementDataset,
  InventoryTransaction,
  MaintenanceRecord,
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

function toDateOnlyString(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function toDateTimeString(value: Date): string {
  return value.toISOString();
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

export function mapUserEntity(entity: UserEntity): DemoUser {
  return {
    id: entity.id,
    fullName: entity.fullName,
    email: entity.email,
    role: entity.role as DemoUser['role'],
    status: entity.status as DemoUser['status'],
    passwordHint: entity.passwordHint,
  };
}

export function mapPersonalTrainerEntity(entity: PersonalTrainerEntity): PersonalTrainer {
  return {
    id: entity.id,
    code: entity.code,
    fullName: entity.fullName,
    gender: entity.gender as PersonalTrainer['gender'],
    birthDate: toDateOnlyString(entity.birthDate),
    phone: entity.phone,
    email: entity.email,
    address: entity.address,
    status: entity.status as PersonalTrainer['status'],
    specialties: entity.specialties,
    experienceYears: entity.experienceYears,
    avatarUrl: entity.avatarUrl,
    startDate: toDateOnlyString(entity.startDate),
  };
}

export function mapPtContractEntity(entity: PtContractEntity): PtContract {
  return {
    id: entity.id,
    ptId: entity.personalTrainer.id,
    contractType: entity.contractType,
    salaryType: entity.salaryType as PtContract['salaryType'],
    baseSalary: Number(entity.baseSalary),
    minValidShiftHours: Number(entity.minValidShiftHours),
    standardShiftHours: Number(entity.standardShiftHours),
    overtimeHourlyRate: Number(entity.overtimeHourlyRate),
    performanceBonusThreshold: entity.performanceBonusThreshold,
    performanceBonusAmount: Number(entity.performanceBonusAmount),
    packageCommissionRate: Number(entity.packageCommissionRate),
    salesCommissionRate: Number(entity.salesCommissionRate),
    allowances: Number(entity.allowances),
    penaltyRules: entity.penaltyRules,
    effectiveFrom: toDateOnlyString(entity.effectiveFrom),
    effectiveTo: toDateOnlyString(entity.effectiveTo),
  };
}

export function mapAttendanceLogEntity(entity: AttendanceLogEntity): AttendanceLog {
  return {
    id: entity.id,
    ptId: entity.personalTrainer.id,
    attendanceDate: toDateOnlyString(entity.attendanceDate),
    checkInAt: toDateTimeString(entity.checkInAt),
    checkOutAt: entity.checkOutAt ? toDateTimeString(entity.checkOutAt) : null,
    workedHours: Number(entity.workedHours),
    overtimeHours: Number(entity.overtimeHours),
    status: entity.status as AttendanceLog['status'],
    workCredit: Number(entity.workCredit),
  };
}

export function mapPayrollPeriodEntity(entity: PayrollPeriodEntity): PayrollPeriod {
  return {
    id: entity.id,
    code: entity.code,
    from: toDateOnlyString(entity.fromDate),
    to: toDateOnlyString(entity.toDate),
    status: entity.status as PayrollPeriod['status'],
  };
}

export function mapPayrollEntryEntity(entity: PayrollEntryEntity): PayrollEntry {
  return {
    id: entity.id,
    payrollPeriodId: entity.payrollPeriod.id,
    ptId: entity.personalTrainer.id,
    validShiftCredits: Number(entity.validShiftCredits),
    overtimeHours: Number(entity.overtimeHours),
    packageCommission: Number(entity.packageCommission),
    salesCommission: Number(entity.salesCommission),
    performanceBonus: Number(entity.performanceBonus),
    penalties: Number(entity.penalties),
    grossPay: Number(entity.grossPay),
    netPay: Number(entity.netPay),
    status: entity.status as PayrollEntry['status'],
  };
}

export function mapMemberEntity(entity: MemberEntity): Member {
  return {
    id: entity.id,
    code: entity.code,
    fullName: entity.fullName,
    gender: entity.gender as Member['gender'],
    birthDate: toDateOnlyString(entity.birthDate),
    phone: entity.phone,
    email: entity.email,
    address: entity.address,
    heightCm: entity.heightCm,
    weightKg: entity.weightKg,
    goal: entity.goal,
    healthNotes: entity.healthNotes,
    registeredAt: toDateOnlyString(entity.registeredAt),
    status: entity.status as Member['status'],
  };
}

export function mapMembershipPlanEntity(entity: MembershipPlanEntity): MembershipPlan {
  return {
    id: entity.id,
    code: entity.code,
    name: entity.name,
    type: entity.type as MembershipPlan['type'],
    price: Number(entity.price),
    durationDays: entity.durationDays,
    usageLimit: entity.usageLimit ?? null,
    includesPt: entity.includesPt,
    includedPtSessions: entity.includedPtSessions,
    perks: entity.perks,
    status: entity.status as MembershipPlan['status'],
  };
}

export function mapMemberMembershipEntity(entity: MemberMembershipEntity): MemberMembership {
  return {
    id: entity.id,
    memberId: entity.member.id,
    membershipPlanId: entity.membershipPlan.id,
    startDate: toDateOnlyString(entity.startDate),
    endDate: toDateOnlyString(entity.endDate),
    remainingSessions: entity.remainingSessions ?? null,
    status: entity.status as MemberMembership['status'],
  };
}

export function mapMemberPtAssignmentEntity(entity: MemberPtAssignmentEntity): MemberPtAssignment {
  return {
    id: entity.id,
    memberId: entity.member.id,
    ptId: entity.personalTrainer.id,
    memberMembershipId: entity.memberMembership.id,
    assignedFrom: toDateOnlyString(entity.assignedFrom),
    assignedTo: entity.assignedTo ? toDateOnlyString(entity.assignedTo) : null,
    commissionAmount: Number(entity.commissionAmount),
    status: entity.status as MemberPtAssignment['status'],
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
    paymentMethod: entity.paymentMethod as MembershipInvoice['paymentMethod'],
    status: entity.status as MembershipInvoice['status'],
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
    status: entity.status as Product['status'],
  };
}

export function mapInventoryTransactionEntity(entity: InventoryTransactionEntity): InventoryTransaction {
  return {
    id: entity.id,
    productId: entity.product.id,
    type: entity.type as InventoryTransaction['type'],
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
    memberId: entity.member?.id ?? null,
    customerName: entity.customerName,
    status: entity.status as SalesInvoice['status'],
    paymentMethod: entity.paymentMethod as SalesInvoice['paymentMethod'],
    discountAmount: Number(entity.discountAmount),
    totalAmount: Number(entity.totalAmount),
    note: entity.note,
    items,
  };
}

export function mapEquipmentAssetEntity(entity: EquipmentAssetEntity): EquipmentAsset {
  return {
    id: entity.id,
    code: entity.code,
    name: entity.name,
    purchasedAt: toDateOnlyString(entity.purchasedAt),
    purchaseValue: Number(entity.purchaseValue),
    condition: entity.condition as EquipmentAsset['condition'],
    nextMaintenanceAt: toDateOnlyString(entity.nextMaintenanceAt),
    note: entity.note,
  };
}

export function mapOperatingExpenseEntity(entity: OperatingExpenseEntity): OperatingExpense {
  return {
    id: entity.id,
    code: entity.code,
    expenseDate: toDateOnlyString(entity.expenseDate),
    category: entity.category as OperatingExpense['category'],
    equipmentAssetId: entity.equipmentAsset?.id ?? null,
    vendorName: entity.vendorName,
    amount: Number(entity.amount),
    description: entity.description,
    approvedByUserId: entity.approvedByUser?.id ?? null,
    attachmentUrl: entity.attachmentUrl ?? null,
    status: entity.status as OperatingExpense['status'],
  };
}

export function mapMaintenanceRecordEntity(entity: MaintenanceRecordEntity): MaintenanceRecord {
  return {
    id: entity.id,
    equipmentAssetId: entity.equipmentAsset.id,
    maintenanceDate: toDateOnlyString(entity.maintenanceDate),
    description: entity.description,
    vendorName: entity.vendorName,
    amount: Number(entity.amount),
  };
}

export function mapSystemConfigEntity(entity: SystemConfigEntity): SystemConfig {
  return {
    key: entity.key,
    label: entity.label,
    value: entity.value,
    description: entity.description,
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
  equipmentAssets: EquipmentAssetEntity[];
  maintenanceRecords: MaintenanceRecordEntity[];
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
    equipmentAssets: collections.equipmentAssets.map((entity) => mapEquipmentAssetEntity(entity)),
    maintenanceRecords: collections.maintenanceRecords.map((entity) => mapMaintenanceRecordEntity(entity)),
    systemConfigs: collections.systemConfigs.map((entity) => mapSystemConfigEntity(entity)),
  };
}
