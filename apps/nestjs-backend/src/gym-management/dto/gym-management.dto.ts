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
  IsString,
  Min,
} from 'class-validator';

export class CreatePersonalTrainerDto {
  @IsString()
  code!: string;

  @IsString()
  fullName!: string;

  @IsString()
  gender!: string;

  @IsDateString()
  birthDate!: string;

  @IsString()
  phone!: string;

  @IsEmail()
  email!: string;

  @IsString()
  address!: string;

  @IsString()
  status!: string;

  @IsArray()
  @IsString({ each: true })
  specialties!: string[];

  @IsInt()
  @Min(0)
  experienceYears!: number;

  @IsString()
  avatarUrl!: string;

  @IsDateString()
  startDate!: string;
}

export class UpdatePersonalTrainerDto extends PartialType(CreatePersonalTrainerDto) { }

export class CreateMemberDto {
  @IsString()
  code!: string;

  @IsString()
  fullName!: string;

  @IsString()
  gender!: string;

  @IsDateString()
  birthDate!: string;

  @IsString()
  phone!: string;

  @IsEmail()
  email!: string;

  @IsString()
  address!: string;

  @IsInt()
  @Min(0)
  heightCm!: number;

  @IsInt()
  @Min(0)
  weightKg!: number;

  @IsString()
  goal!: string;

  @IsString()
  healthNotes!: string;

  @IsDateString()
  registeredAt!: string;

  @IsString()
  status!: string;
}

export class UpdateMemberDto extends PartialType(CreateMemberDto) { }

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

export class UpdateMembershipPlanDto extends PartialType(CreateMembershipPlanDto) { }

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

export class UpdateProductDto extends PartialType(CreateProductDto) { }

export class CreateEquipmentDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsDateString()
  purchasedAt!: string;

  @IsNumber()
  purchaseValue!: number;

  @IsString()
  condition!: string;

  @IsDateString()
  nextMaintenanceAt!: string;

  @IsString()
  note!: string;
}

export class UpdateEquipmentDto extends PartialType(CreateEquipmentDto) { }

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

export class UpdateOperatingExpenseDto extends PartialType(CreateOperatingExpenseDto) { }

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
