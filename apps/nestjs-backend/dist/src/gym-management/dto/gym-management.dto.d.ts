export declare class CreatePersonalTrainerDto {
    code: string;
    fullName: string;
    gender: string;
    birthDate: string;
    phone: string;
    email: string;
    address: string;
    status: string;
    specialties: string[];
    experienceYears: number;
    avatarUrl: string;
    startDate: string;
}
declare const UpdatePersonalTrainerDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePersonalTrainerDto>>;
export declare class UpdatePersonalTrainerDto extends UpdatePersonalTrainerDto_base {
}
export declare class CreateMemberDto {
    code: string;
    fullName: string;
    gender: string;
    birthDate: string;
    phone: string;
    email: string;
    address: string;
    heightCm: number;
    weightKg: number;
    goal: string;
    healthNotes: string;
    registeredAt: string;
    status: string;
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
    purchasedAt: string;
    purchaseValue: number;
    condition: string;
    nextMaintenanceAt: string;
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
export {};
