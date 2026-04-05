import { OptionalProps } from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
export declare class UserEntity extends BaseEntity {
    fullName: string;
    username: string;
    role: string;
    status: string;
    passwordHash: string;
    deletedAt?: Date | null;
}
export declare class RefreshTokenEntity extends BaseEntity {
    user: UserEntity;
    tokenHash: string;
    sessionId: string;
    expiresAt: Date;
    revokedAt?: Date | null;
}
export declare class PersonalTrainerEntity extends BaseEntity {
    code: string;
    user?: UserEntity | null;
    fullName: string;
    gender: string;
    birthDate: Date;
    phone: string;
    startDate: Date;
    status: string;
    deletedAt?: Date | null;
}
export declare class PtContractEntity extends BaseEntity {
    personalTrainer: PersonalTrainerEntity;
    contractCode: string;
    contractType: string;
    salaryType: string;
    baseSalary: string;
    minValidShiftHours: string;
    standardShiftHours: string;
    overtimeHourlyRate: string;
    performanceBonusThreshold: number;
    performanceBonusAmount: string;
    packageCommissionRate: string;
    salesCommissionRate: string;
    allowances: string;
    penaltyRules: string[];
    effectiveFrom: Date;
    effectiveTo?: Date | null;
}
export declare class AttendanceLogEntity extends BaseEntity {
    personalTrainer: PersonalTrainerEntity;
    attendanceDate: Date;
    checkInAt: Date;
    checkOutAt?: Date | null;
    workedHours: string;
    paidHours: string;
    overtimeHours: string;
    status: string;
    workCredit: string;
    note?: string | null;
}
export declare class PayrollPeriodEntity extends BaseEntity {
    code: string;
    fromDate: Date;
    toDate: Date;
    status: string;
    submittedAt?: Date | null;
    approvedByUser?: UserEntity | null;
    approvedAt?: Date | null;
    paidAt?: Date | null;
}
export declare class PayrollEntryEntity extends BaseEntity {
    payrollPeriod: PayrollPeriodEntity;
    personalTrainer: PersonalTrainerEntity;
    contract?: PtContractEntity | null;
    validShiftCredits: string;
    paidHours: string;
    overtimeHours: string;
    baseSalaryAmount: string;
    attendanceBonusAmount: string;
    overtimeAmount: string;
    packageCommission: string;
    salesCommission: string;
    performanceBonus: string;
    allowanceAmount: string;
    deductionAmount: string;
    penalties: string;
    grossPay: string;
    netPay: string;
    status: string;
}
export declare class MemberEntity extends BaseEntity {
    code: string;
    fullName: string;
    gender: string;
    birthDate: Date;
    phone: string;
    registeredAt: Date;
    status: string;
    deletedAt?: Date | null;
}
export declare class MembershipPlanEntity extends BaseEntity {
    code: string;
    name: string;
    type: string;
    price: string;
    durationDays: number;
    includesPt: boolean;
    perks: string[];
    status: string;
}
export declare class MemberMembershipEntity extends BaseEntity {
    member: MemberEntity;
    membershipPlan: MembershipPlanEntity;
    startDate: Date;
    endDate: Date;
    status: string;
    deletedAt?: Date | null;
}
export declare class MemberPtAssignmentEntity extends BaseEntity {
    member: MemberEntity;
    personalTrainer: PersonalTrainerEntity;
    memberMembership: MemberMembershipEntity;
    assignedFrom: Date;
    assignedTo?: Date | null;
    commissionAmount: string;
    status: string;
    note?: string | null;
}
export declare class MembershipInvoiceEntity extends BaseEntity {
    code: string;
    member: MemberEntity;
    memberMembership: MemberMembershipEntity;
    invoiceDate: Date;
    totalAmount: string;
    paymentMethod: string;
    status: string;
}
export declare class ProductEntity extends BaseEntity {
    code: string;
    name: string;
    category: string;
    unitCost: string;
    salePrice: string;
    stockOnHand: number;
    minimumStockLevel: number;
    status: string;
    deletedAt?: Date | null;
}
export declare class InventoryTransactionEntity extends BaseEntity {
    product: ProductEntity;
    type: string;
    quantity: number;
    unitCost: string;
    transactionDate: Date;
    referenceCode: string;
    note: string;
}
export declare class SalesInvoiceEntity extends BaseEntity {
    code: string;
    invoiceDate: Date;
    createdByUser: UserEntity;
    member?: MemberEntity | null;
    customerName: string;
    status: string;
    paymentMethod: string;
    discountAmount: string;
    totalAmount: string;
    note: string;
    confirmedAt?: Date | null;
    cancelledAt?: Date | null;
    cancellationReason?: string | null;
}
export declare class SalesInvoiceItemEntity extends BaseEntity {
    salesInvoice: SalesInvoiceEntity;
    product: ProductEntity;
    quantity: number;
    unitPrice: string;
    unitCost: string;
    lineTotal: string;
}
export declare class OperatingExpenseEntity extends BaseEntity {
    code: string;
    expenseDate: Date;
    category: string;
    vendorName: string;
    amount: string;
    description: string;
    approvedByUser?: UserEntity | null;
    submittedAt?: Date | null;
    approvedAt?: Date | null;
    rejectedAt?: Date | null;
    rejectionReason?: string | null;
    paidAt?: Date | null;
    attachmentUrl?: string | null;
    status: string;
}
export declare class AuditLogEntity extends BaseEntity {
    action: string;
    resource: string;
    recordId?: string | null;
    changedByUser?: UserEntity | null;
    method: string;
    path: string;
    statusCode: number;
    requestBody?: unknown;
    responseBody?: unknown;
}
export declare class SystemConfigEntity {
    key: string;
    label: string;
    value: string;
    description: string;
    updatedByUser?: UserEntity | null;
    createdAt: Date;
    updatedAt: Date;
    [OptionalProps]?: 'createdAt' | 'updatedAt';
}
