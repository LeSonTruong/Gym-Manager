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
exports.CreateMaintenanceDto = exports.InventoryImportDto = exports.CreateSalesInvoiceDto = exports.CreateSalesInvoiceItemDto = exports.GeneratePayrollDto = exports.CreatePayrollPeriodDto = exports.EndMemberAssignmentDto = exports.CreateMemberAssignmentDto = exports.CancelMemberMembershipDto = exports.RenewMemberMembershipDto = exports.CreateMemberMembershipDto = exports.UpdatePtContractDto = exports.CreatePtContractDto = exports.PatchAttendanceDto = exports.AttendanceCheckOutDto = exports.AttendanceCheckInDto = exports.PatchSystemConfigDto = exports.CancelSalesInvoiceDto = exports.RejectExpenseDto = exports.UpdateOperatingExpenseDto = exports.CreateOperatingExpenseDto = exports.UpdateEquipmentDto = exports.CreateEquipmentDto = exports.UpdateProductDto = exports.CreateProductDto = exports.UpdateMembershipPlanDto = exports.CreateMembershipPlanDto = exports.UpdateMemberDto = exports.CreateMemberDto = exports.UpdatePersonalTrainerDto = exports.CreatePersonalTrainerDto = void 0;
const class_transformer_1 = require("class-transformer");
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
class CreatePersonalTrainerDto {
    code;
    userId;
    fullName;
    gender;
    birthDate;
    phone;
    email;
    address;
    status;
    specialties;
    experienceYears;
    avatarUrl;
    startDate;
}
exports.CreatePersonalTrainerDto = CreatePersonalTrainerDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonalTrainerDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonalTrainerDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonalTrainerDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonalTrainerDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePersonalTrainerDto.prototype, "birthDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonalTrainerDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreatePersonalTrainerDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonalTrainerDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonalTrainerDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePersonalTrainerDto.prototype, "specialties", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePersonalTrainerDto.prototype, "experienceYears", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonalTrainerDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePersonalTrainerDto.prototype, "startDate", void 0);
class UpdatePersonalTrainerDto extends (0, mapped_types_1.PartialType)(CreatePersonalTrainerDto) {
}
exports.UpdatePersonalTrainerDto = UpdatePersonalTrainerDto;
class CreateMemberDto {
    code;
    fullName;
    gender;
    birthDate;
    phone;
    email;
    address;
    heightCm;
    weightKg;
    goal;
    healthNotes;
    registeredAt;
    status;
}
exports.CreateMemberDto = CreateMemberDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "birthDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMemberDto.prototype, "heightCm", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMemberDto.prototype, "weightKg", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "goal", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "healthNotes", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "registeredAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "status", void 0);
class UpdateMemberDto extends (0, mapped_types_1.PartialType)(CreateMemberDto) {
}
exports.UpdateMemberDto = UpdateMemberDto;
class CreateMembershipPlanDto {
    code;
    name;
    type;
    price;
    durationDays;
    usageLimit;
    includesPt;
    includedPtSessions;
    perks;
    status;
}
exports.CreateMembershipPlanDto = CreateMembershipPlanDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMembershipPlanDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMembershipPlanDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMembershipPlanDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMembershipPlanDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateMembershipPlanDto.prototype, "durationDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateMembershipPlanDto.prototype, "usageLimit", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMembershipPlanDto.prototype, "includesPt", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMembershipPlanDto.prototype, "includedPtSessions", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateMembershipPlanDto.prototype, "perks", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMembershipPlanDto.prototype, "status", void 0);
class UpdateMembershipPlanDto extends (0, mapped_types_1.PartialType)(CreateMembershipPlanDto) {
}
exports.UpdateMembershipPlanDto = UpdateMembershipPlanDto;
class CreateProductDto {
    code;
    name;
    category;
    unitCost;
    salePrice;
    stockOnHand;
    minimumStockLevel;
    status;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "unitCost", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "salePrice", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "stockOnHand", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "minimumStockLevel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "status", void 0);
class UpdateProductDto extends (0, mapped_types_1.PartialType)(CreateProductDto) {
}
exports.UpdateProductDto = UpdateProductDto;
class CreateEquipmentDto {
    code;
    name;
    category;
    purchasedAt;
    purchaseValue;
    status;
    condition;
    location;
    nextMaintenanceAt;
    note;
}
exports.CreateEquipmentDto = CreateEquipmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "purchasedAt", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEquipmentDto.prototype, "purchaseValue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "condition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "nextMaintenanceAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "note", void 0);
class UpdateEquipmentDto extends (0, mapped_types_1.PartialType)(CreateEquipmentDto) {
}
exports.UpdateEquipmentDto = UpdateEquipmentDto;
class CreateOperatingExpenseDto {
    code;
    expenseDate;
    category;
    equipmentAssetId;
    vendorName;
    amount;
    description;
    attachmentUrl;
}
exports.CreateOperatingExpenseDto = CreateOperatingExpenseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOperatingExpenseDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateOperatingExpenseDto.prototype, "expenseDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOperatingExpenseDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOperatingExpenseDto.prototype, "equipmentAssetId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOperatingExpenseDto.prototype, "vendorName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateOperatingExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOperatingExpenseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOperatingExpenseDto.prototype, "attachmentUrl", void 0);
class UpdateOperatingExpenseDto extends (0, mapped_types_1.PartialType)(CreateOperatingExpenseDto) {
}
exports.UpdateOperatingExpenseDto = UpdateOperatingExpenseDto;
class RejectExpenseDto {
    rejectionReason;
}
exports.RejectExpenseDto = RejectExpenseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RejectExpenseDto.prototype, "rejectionReason", void 0);
class CancelSalesInvoiceDto {
    cancellationReason;
}
exports.CancelSalesInvoiceDto = CancelSalesInvoiceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CancelSalesInvoiceDto.prototype, "cancellationReason", void 0);
class PatchSystemConfigDto {
    value;
}
exports.PatchSystemConfigDto = PatchSystemConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PatchSystemConfigDto.prototype, "value", void 0);
class AttendanceCheckInDto {
    ptId;
    checkInAt;
}
exports.AttendanceCheckInDto = AttendanceCheckInDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AttendanceCheckInDto.prototype, "ptId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AttendanceCheckInDto.prototype, "checkInAt", void 0);
class AttendanceCheckOutDto {
    ptId;
    attendanceLogId;
    checkOutAt;
}
exports.AttendanceCheckOutDto = AttendanceCheckOutDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AttendanceCheckOutDto.prototype, "ptId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AttendanceCheckOutDto.prototype, "attendanceLogId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AttendanceCheckOutDto.prototype, "checkOutAt", void 0);
class PatchAttendanceDto {
    checkInAt;
    checkOutAt;
    note;
}
exports.PatchAttendanceDto = PatchAttendanceDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PatchAttendanceDto.prototype, "checkInAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PatchAttendanceDto.prototype, "checkOutAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PatchAttendanceDto.prototype, "note", void 0);
class CreatePtContractDto {
    contractCode;
    contractType;
    salaryType;
    baseSalary;
    minValidShiftHours;
    standardShiftHours;
    overtimeHourlyRate;
    performanceBonusThreshold;
    performanceBonusAmount;
    packageCommissionRate;
    salesCommissionRate;
    allowances;
    penaltyRules;
    effectiveFrom;
    effectiveTo;
}
exports.CreatePtContractDto = CreatePtContractDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePtContractDto.prototype, "contractCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePtContractDto.prototype, "contractType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePtContractDto.prototype, "salaryType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePtContractDto.prototype, "baseSalary", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePtContractDto.prototype, "minValidShiftHours", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePtContractDto.prototype, "standardShiftHours", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePtContractDto.prototype, "overtimeHourlyRate", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePtContractDto.prototype, "performanceBonusThreshold", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePtContractDto.prototype, "performanceBonusAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePtContractDto.prototype, "packageCommissionRate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePtContractDto.prototype, "salesCommissionRate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePtContractDto.prototype, "allowances", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePtContractDto.prototype, "penaltyRules", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePtContractDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePtContractDto.prototype, "effectiveTo", void 0);
class UpdatePtContractDto extends (0, mapped_types_1.PartialType)(CreatePtContractDto) {
}
exports.UpdatePtContractDto = UpdatePtContractDto;
class CreateMemberMembershipDto {
    memberId;
    membershipPlanId;
    startDate;
    paymentMethod;
    totalAmount;
}
exports.CreateMemberMembershipDto = CreateMemberMembershipDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberMembershipDto.prototype, "memberId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberMembershipDto.prototype, "membershipPlanId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMemberMembershipDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberMembershipDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMemberMembershipDto.prototype, "totalAmount", void 0);
class RenewMemberMembershipDto {
    startDate;
    paymentMethod;
}
exports.RenewMemberMembershipDto = RenewMemberMembershipDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RenewMemberMembershipDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RenewMemberMembershipDto.prototype, "paymentMethod", void 0);
class CancelMemberMembershipDto {
    cancelledAt;
}
exports.CancelMemberMembershipDto = CancelMemberMembershipDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CancelMemberMembershipDto.prototype, "cancelledAt", void 0);
class CreateMemberAssignmentDto {
    memberId;
    ptId;
    memberMembershipId;
    assignedFrom;
    commissionType;
    commissionValue;
    commissionAmount;
    note;
}
exports.CreateMemberAssignmentDto = CreateMemberAssignmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberAssignmentDto.prototype, "memberId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberAssignmentDto.prototype, "ptId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberAssignmentDto.prototype, "memberMembershipId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMemberAssignmentDto.prototype, "assignedFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberAssignmentDto.prototype, "commissionType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMemberAssignmentDto.prototype, "commissionValue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMemberAssignmentDto.prototype, "commissionAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberAssignmentDto.prototype, "note", void 0);
class EndMemberAssignmentDto {
    assignedTo;
}
exports.EndMemberAssignmentDto = EndMemberAssignmentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], EndMemberAssignmentDto.prototype, "assignedTo", void 0);
class CreatePayrollPeriodDto {
    code;
    from;
    to;
}
exports.CreatePayrollPeriodDto = CreatePayrollPeriodDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePayrollPeriodDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePayrollPeriodDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePayrollPeriodDto.prototype, "to", void 0);
class GeneratePayrollDto {
    payrollPeriodId;
}
exports.GeneratePayrollDto = GeneratePayrollDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GeneratePayrollDto.prototype, "payrollPeriodId", void 0);
class CreateSalesInvoiceItemDto {
    productId;
    quantity;
}
exports.CreateSalesInvoiceItemDto = CreateSalesInvoiceItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSalesInvoiceItemDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateSalesInvoiceItemDto.prototype, "quantity", void 0);
class CreateSalesInvoiceDto {
    code;
    invoiceDate;
    memberId;
    customerName;
    paymentMethod;
    discountAmount;
    note;
    items;
}
exports.CreateSalesInvoiceDto = CreateSalesInvoiceDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSalesInvoiceDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSalesInvoiceDto.prototype, "invoiceDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSalesInvoiceDto.prototype, "memberId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSalesInvoiceDto.prototype, "customerName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSalesInvoiceDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSalesInvoiceDto.prototype, "discountAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSalesInvoiceDto.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateSalesInvoiceItemDto),
    __metadata("design:type", Array)
], CreateSalesInvoiceDto.prototype, "items", void 0);
class InventoryImportDto {
    productId;
    quantity;
    unitCost;
    transactionDate;
    referenceCode;
    note;
}
exports.InventoryImportDto = InventoryImportDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InventoryImportDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], InventoryImportDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], InventoryImportDto.prototype, "unitCost", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], InventoryImportDto.prototype, "transactionDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InventoryImportDto.prototype, "referenceCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InventoryImportDto.prototype, "note", void 0);
class CreateMaintenanceDto {
    equipmentAssetId;
    maintenanceType;
    maintenanceDate;
    description;
    vendorName;
    amount;
    resultStatus;
    note;
    equipmentStatus;
    equipmentCondition;
    nextMaintenanceAt;
}
exports.CreateMaintenanceDto = CreateMaintenanceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "equipmentAssetId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "maintenanceType", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "maintenanceDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "vendorName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMaintenanceDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "resultStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "equipmentStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "equipmentCondition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "nextMaintenanceAt", void 0);
//# sourceMappingURL=gym-management.dto.js.map