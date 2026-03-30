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
exports.PatchSystemConfigDto = exports.UpdateOperatingExpenseDto = exports.CreateOperatingExpenseDto = exports.UpdateEquipmentDto = exports.CreateEquipmentDto = exports.UpdateProductDto = exports.CreateProductDto = exports.UpdateMembershipPlanDto = exports.CreateMembershipPlanDto = exports.UpdateMemberDto = exports.CreateMemberDto = exports.UpdatePersonalTrainerDto = exports.CreatePersonalTrainerDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
class CreatePersonalTrainerDto {
    code;
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
    purchasedAt;
    purchaseValue;
    condition;
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
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "purchasedAt", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEquipmentDto.prototype, "purchaseValue", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "condition", void 0);
__decorate([
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
    approvedByUserId;
    attachmentUrl;
    status;
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
], CreateOperatingExpenseDto.prototype, "approvedByUserId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOperatingExpenseDto.prototype, "attachmentUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOperatingExpenseDto.prototype, "status", void 0);
class UpdateOperatingExpenseDto extends (0, mapped_types_1.PartialType)(CreateOperatingExpenseDto) {
}
exports.UpdateOperatingExpenseDto = UpdateOperatingExpenseDto;
class PatchSystemConfigDto {
    value;
}
exports.PatchSystemConfigDto = PatchSystemConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PatchSystemConfigDto.prototype, "value", void 0);
//# sourceMappingURL=gym-management.dto.js.map