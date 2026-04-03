import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePersonalTrainerDto {
  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  fullName!: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  experienceYears?: number;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;
}

export class UpdatePersonalTrainerDto extends PartialType(CreatePersonalTrainerDto) {

}

export class CreateMemberDto {
  @IsString()
  code!: string;

  @IsString()
  fullName!: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  heightCm?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  weightKg?: number;

  @IsOptional()
  @IsString()
  goal?: string;

  @IsOptional()
  @IsString()
  healthNotes?: string;

  @IsOptional()
  @IsDateString()
  registeredAt?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateMemberDto extends PartialType(CreateMemberDto) {

}

export class CreateMembershipPlanDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsString()
  type!: string;

  @IsNumber()
  price!: number;

  @IsInt()
  @Min(1)
  durationDays!: number;

  @IsOptional()
  @IsInt()
  usageLimit?: number;

  @IsBoolean()
  includesPt!: boolean;

  @IsInt()
  @Min(0)
  includedPtSessions!: number;

  @IsArray()
  @IsString({ each: true })
  perks!: string[];

  @IsString()
  status!: string;
}

export class UpdateMembershipPlanDto extends PartialType(CreateMembershipPlanDto) {

}

export class CreateProductDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsString()
  category!: string;

  @IsNumber()
  unitCost!: number;

  @IsNumber()
  salePrice!: number;

  @IsInt()
  stockOnHand!: number;

  @IsInt()
  @Min(0)
  minimumStockLevel!: number;

  @IsString()
  status!: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {

}

export class CreateEquipmentDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsDateString()
  purchasedAt!: string;

  @IsNumber()
  purchaseValue!: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsString()
  condition!: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  nextMaintenanceAt?: string;

  @IsString()
  note!: string;
}

export class UpdateEquipmentDto extends PartialType(CreateEquipmentDto) {

}

export class CreateOperatingExpenseDto {
  @IsString()
  code!: string;

  @IsDateString()
  expenseDate!: string;

  @IsString()
  category!: string;

  @IsOptional()
  @IsString()
  equipmentAssetId?: string;

  @IsString()
  vendorName!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;
}

export class UpdateOperatingExpenseDto extends PartialType(CreateOperatingExpenseDto) {

}

export class RejectExpenseDto {
  @IsString()
  @IsNotEmpty()
  rejectionReason!: string;
}

export class CancelSalesInvoiceDto {
  @IsString()
  @IsNotEmpty()
  cancellationReason!: string;
}

export class PatchSystemConfigDto {
  @IsString()
  value!: string;
}

export class AttendanceCheckInDto {
  @IsOptional()
  @IsString()
  ptId?: string;

  @IsOptional()
  @IsDateString()
  checkInAt?: string;
}

export class AttendanceCheckOutDto {
  @IsOptional()
  @IsString()
  ptId?: string;

  @IsOptional()
  @IsString()
  attendanceLogId?: string;

  @IsOptional()
  @IsDateString()
  checkOutAt?: string;
}

export class PatchAttendanceDto {
  @IsOptional()
  @IsDateString()
  checkInAt?: string;

  @IsOptional()
  @IsDateString()
  checkOutAt?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class CreatePtContractDto {
  @IsOptional()
  @IsString()
  contractCode?: string;

  @IsString()
  contractType!: string;

  @IsString()
  salaryType!: string;

  @IsNumber()
  baseSalary!: number;

  @IsNumber()
  minValidShiftHours!: number;

  @IsNumber()
  standardShiftHours!: number;

  @IsNumber()
  overtimeHourlyRate!: number;

  @IsInt()
  @Min(0)
  performanceBonusThreshold!: number;

  @IsNumber()
  performanceBonusAmount!: number;

  @IsNumber()
  packageCommissionRate!: number;

  @IsNumber()
  salesCommissionRate!: number;

  @IsNumber()
  allowances!: number;

  @IsArray()
  @IsString({ each: true })
  penaltyRules!: string[];

  @IsDateString()
  effectiveFrom!: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;
}

export class UpdatePtContractDto extends PartialType(CreatePtContractDto) {

}

export class CreateMemberMembershipDto {
  @IsString()
  memberId!: string;

  @IsString()
  membershipPlanId!: string;

  @IsDateString()
  startDate!: string;

  @IsString()
  paymentMethod!: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;
}

export class RenewMemberMembershipDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export class CancelMemberMembershipDto {
  @IsOptional()
  @IsDateString()
  cancelledAt?: string;
}

export class CreateMemberAssignmentDto {
  @IsString()
  memberId!: string;

  @IsString()
  ptId!: string;

  @IsString()
  memberMembershipId!: string;

  @IsDateString()
  assignedFrom!: string;

  @IsOptional()
  @IsString()
  commissionType?: string;

  @IsOptional()
  @IsNumber()
  commissionValue?: number;

  @IsOptional()
  @IsNumber()
  commissionAmount?: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class EndMemberAssignmentDto {
  @IsOptional()
  @IsDateString()
  assignedTo?: string;
}

export class CreatePayrollPeriodDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsDateString()
  from!: string;

  @IsDateString()
  to!: string;
}

export class GeneratePayrollDto {
  @IsString()
  payrollPeriodId!: string;
}

export class CreateSalesInvoiceItemDto {
  @IsString()
  productId!: string;

  @IsInt()
  @IsPositive()
  quantity!: number;
}

export class CreateSalesInvoiceDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsDateString()
  invoiceDate?: string;

  @IsOptional()
  @IsString()
  memberId?: string;

  @IsString()
  customerName!: string;

  @IsString()
  paymentMethod!: string;

  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSalesInvoiceItemDto)
  items!: CreateSalesInvoiceItemDto[];
}

export class InventoryImportDto {
  @IsString()
  productId!: string;

  @IsInt()
  @IsPositive()
  quantity!: number;

  @IsNumber()
  unitCost!: number;

  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @IsOptional()
  @IsString()
  referenceCode?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateMaintenanceDto {
  @IsString()
  equipmentAssetId!: string;

  @IsOptional()
  @IsString()
  maintenanceType?: string;

  @IsDateString()
  maintenanceDate!: string;

  @IsString()
  description!: string;

  @IsString()
  vendorName!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  resultStatus?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  equipmentStatus?: string;

  @IsOptional()
  @IsString()
  equipmentCondition?: string;

  @IsOptional()
  @IsDateString()
  nextMaintenanceAt?: string;
}
