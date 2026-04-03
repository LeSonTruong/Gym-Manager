export declare class CreatePersonalTrainerDto {
    code: string;
    userId?: string;
    fullName: string;
    gender?: string;
    birthDate?: string;
    phone: string;
    email?: string;
    address?: string;
    status?: string;
    specialties?: string[];
    experienceYears?: number;
    avatarUrl?: string;
    startDate?: string;
}
declare const UpdatePersonalTrainerDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePersonalTrainerDto>>;
export declare class UpdatePersonalTrainerDto extends UpdatePersonalTrainerDto_base {
}
export declare class CreateMemberDto {
    code: string;
    fullName: string;
    gender?: string;
    birthDate?: string;
    phone: string;
    email?: string;
    address?: string;
    heightCm?: number;
    weightKg?: number;
    goal?: string;
    healthNotes?: string;
    registeredAt?: string;
    status?: string;
}
declare const UpdateMemberDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateMemberDto>>;
export declare class UpdateMemberDto extends UpdateMemberDto_base {
}
export declare class CreateMembershipPlanDto {
    code: string;
    name: string;
    type: string;
    price: number;
    durationDays: number;
    usageLimit?: number;
    includesPt: boolean;
    includedPtSessions: number;
    perks: string[];
    status: string;
}
declare const UpdateMembershipPlanDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateMembershipPlanDto>>;
export declare class UpdateMembershipPlanDto extends UpdateMembershipPlanDto_base {
}
export declare class CreateProductDto {
    code: string;
    name: string;
    category: string;
    unitCost: number;
    salePrice: number;
    stockOnHand: number;
    minimumStockLevel: number;
    status: string;
}
declare const UpdateProductDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateProductDto>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
}
export declare class CreateEquipmentDto {
    code: string;
    name: string;
    category?: string;
    purchasedAt: string;
    purchaseValue: number;
    status?: string;
    condition: string;
    location?: string;
    nextMaintenanceAt?: string;
    note: string;
}
declare const UpdateEquipmentDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateEquipmentDto>>;
export declare class UpdateEquipmentDto extends UpdateEquipmentDto_base {
}
export declare class CreateOperatingExpenseDto {
    code: string;
    expenseDate: string;
    category: string;
    equipmentAssetId?: string;
    vendorName: string;
    amount: number;
    description: string;
    attachmentUrl?: string;
}
declare const UpdateOperatingExpenseDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateOperatingExpenseDto>>;
export declare class UpdateOperatingExpenseDto extends UpdateOperatingExpenseDto_base {
}
export declare class RejectExpenseDto {
    rejectionReason: string;
}
export declare class CancelSalesInvoiceDto {
    cancellationReason: string;
}
export declare class PatchSystemConfigDto {
    value: string;
}
export declare class AttendanceCheckInDto {
    ptId?: string;
    checkInAt?: string;
}
export declare class AttendanceCheckOutDto {
    ptId?: string;
    attendanceLogId?: string;
    checkOutAt?: string;
}
export declare class PatchAttendanceDto {
    checkInAt?: string;
    checkOutAt?: string;
    note?: string;
}
export declare class CreatePtContractDto {
    contractCode?: string;
    contractType: string;
    salaryType: string;
    baseSalary: number;
    minValidShiftHours: number;
    standardShiftHours: number;
    overtimeHourlyRate: number;
    performanceBonusThreshold: number;
    performanceBonusAmount: number;
    packageCommissionRate: number;
    salesCommissionRate: number;
    allowances: number;
    penaltyRules: string[];
    effectiveFrom: string;
    effectiveTo?: string;
}
declare const UpdatePtContractDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePtContractDto>>;
export declare class UpdatePtContractDto extends UpdatePtContractDto_base {
}
export declare class CreateMemberMembershipDto {
    memberId: string;
    membershipPlanId: string;
    startDate: string;
    paymentMethod: string;
    totalAmount?: number;
}
export declare class RenewMemberMembershipDto {
    startDate?: string;
    paymentMethod?: string;
}
export declare class CancelMemberMembershipDto {
    cancelledAt?: string;
}
export declare class CreateMemberAssignmentDto {
    memberId?: string;
    ptId: string;
    memberMembershipId: string;
    assignedFrom: string;
    commissionType?: string;
    commissionValue?: number;
    commissionAmount?: number;
    note?: string;
}
export declare class EndMemberAssignmentDto {
    assignedTo?: string;
}
export declare class CreatePayrollPeriodDto {
    code?: string;
    from: string;
    to: string;
}
export declare class GeneratePayrollDto {
    payrollPeriodId: string;
}
export declare class CreateSalesInvoiceItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateSalesInvoiceDto {
    code?: string;
    invoiceDate?: string;
    memberId?: string;
    customerName: string;
    paymentMethod: string;
    discountAmount?: number;
    note?: string;
    items: CreateSalesInvoiceItemDto[];
}
export declare class InventoryImportDto {
    productId: string;
    quantity: number;
    unitCost: number;
    transactionDate?: string;
    referenceCode?: string;
    note?: string;
}
export declare class CreateMaintenanceDto {
    equipmentAssetId: string;
    maintenanceType?: string;
    maintenanceDate: string;
    description: string;
    vendorName: string;
    amount: number;
    resultStatus?: string;
    note?: string;
    equipmentStatus?: string;
    equipmentCondition?: string;
    nextMaintenanceAt?: string;
}
export {};
