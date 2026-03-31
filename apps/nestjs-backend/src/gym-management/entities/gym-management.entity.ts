/* eslint-disable @typescript-eslint/no-restricted-types */
import { Entity, ManyToOne, PrimaryKey, Property, types } from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity {
  @Property({ length: 160 })
  fullName!: string;

  @Property({ length: 180, unique: true })
  email!: string;

  @Property({ length: 30 })
  role!: string;

  @Property({ length: 30 })
  status!: string;

  @Property({ length: 200 })
  passwordHint!: string;
}

@Entity({ tableName: 'personal_trainers' })
export class PersonalTrainerEntity extends BaseEntity {
  @Property({ length: 30, unique: true })
  code!: string;

  @Property({ length: 160 })
  fullName!: string;

  @Property({ length: 30 })
  gender!: string;

  @Property({ type: types.date, columnType: 'date' })
  birthDate!: Date;

  @Property({ length: 40 })
  phone!: string;

  @Property({ length: 180, unique: true })
  email!: string;

  @Property({ length: 255 })
  address!: string;

  @Property({ length: 30 })
  status!: string;

  @Property({ type: types.json })
  specialties!: string[];

  @Property()
  experienceYears!: number;

  @Property({ length: 500 })
  avatarUrl!: string;

  @Property({ type: types.date, columnType: 'date' })
  startDate!: Date;
}

@Entity({ tableName: 'pt_contracts' })
export class PtContractEntity extends BaseEntity {
  @ManyToOne(() => PersonalTrainerEntity, { fieldName: 'pt_id' })
  personalTrainer!: PersonalTrainerEntity;

  @Property({ length: 160 })
  contractType!: string;

  @Property({ length: 30 })
  salaryType!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  baseSalary!: string;

  @Property({ type: types.decimal, precision: 6, scale: 2 })
  minValidShiftHours!: string;

  @Property({ type: types.decimal, precision: 6, scale: 2 })
  standardShiftHours!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  overtimeHourlyRate!: string;

  @Property()
  performanceBonusThreshold!: number;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  performanceBonusAmount!: string;

  @Property({ type: types.decimal, precision: 6, scale: 4 })
  packageCommissionRate!: string;

  @Property({ type: types.decimal, precision: 6, scale: 4 })
  salesCommissionRate!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  allowances!: string;

  @Property({ type: types.json })
  penaltyRules!: string[];

  @Property({ type: types.date, columnType: 'date' })
  effectiveFrom!: Date;

  @Property({ type: types.date, columnType: 'date' })
  effectiveTo!: Date;
}

@Entity({ tableName: 'attendance_logs' })
export class AttendanceLogEntity extends BaseEntity {
  @ManyToOne(() => PersonalTrainerEntity, { fieldName: 'pt_id' })
  personalTrainer!: PersonalTrainerEntity;

  @Property({ type: types.date, columnType: 'date' })
  attendanceDate!: Date;

  @Property({ type: types.datetime, columnType: 'timestamp' })
  checkInAt!: Date;

  @Property({ type: types.datetime, columnType: 'timestamp', nullable: true })
  checkOutAt?: Date | null;

  @Property({ type: types.decimal, precision: 6, scale: 2 })
  workedHours!: string;

  @Property({ type: types.decimal, precision: 6, scale: 2 })
  overtimeHours!: string;

  @Property({ length: 30 })
  status!: string;

  @Property({ type: types.decimal, precision: 6, scale: 2 })
  workCredit!: string;
}

@Entity({ tableName: 'payroll_periods' })
export class PayrollPeriodEntity extends BaseEntity {
  @Property({ length: 30, unique: true })
  code!: string;

  @Property({ type: types.date, columnType: 'date' })
  fromDate!: Date;

  @Property({ type: types.date, columnType: 'date' })
  toDate!: Date;

  @Property({ length: 30 })
  status!: string;

  @Property({ type: types.datetime, columnType: 'timestamp', nullable: true })
  submittedAt?: Date | null;

  @ManyToOne(() => UserEntity, { fieldName: 'approved_by_user_id', nullable: true })
  approvedByUser?: UserEntity | null;

  @Property({ type: types.datetime, columnType: 'timestamp', nullable: true })
  approvedAt?: Date | null;

  @Property({ type: types.datetime, columnType: 'timestamp', nullable: true })
  paidAt?: Date | null;
}

@Entity({ tableName: 'payroll_entries' })
export class PayrollEntryEntity extends BaseEntity {
  @ManyToOne(() => PayrollPeriodEntity, { fieldName: 'payroll_period_id' })
  payrollPeriod!: PayrollPeriodEntity;

  @ManyToOne(() => PersonalTrainerEntity, { fieldName: 'pt_id' })
  personalTrainer!: PersonalTrainerEntity;

  @Property({ type: types.decimal, precision: 8, scale: 2 })
  validShiftCredits!: string;

  @Property({ type: types.decimal, precision: 8, scale: 2 })
  overtimeHours!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  packageCommission!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  salesCommission!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  performanceBonus!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  penalties!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  grossPay!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  netPay!: string;

  @Property({ length: 30 })
  status!: string;
}

@Entity({ tableName: 'members' })
export class MemberEntity extends BaseEntity {
  @Property({ length: 30, unique: true })
  code!: string;

  @Property({ length: 160 })
  fullName!: string;

  @Property({ length: 30 })
  gender!: string;

  @Property({ type: types.date, columnType: 'date' })
  birthDate!: Date;

  @Property({ length: 40 })
  phone!: string;

  @Property({ length: 180, unique: true })
  email!: string;

  @Property({ length: 255 })
  address!: string;

  @Property()
  heightCm!: number;

  @Property()
  weightKg!: number;

  @Property({ length: 255 })
  goal!: string;

  @Property({ type: types.text })
  healthNotes!: string;

  @Property({ type: types.date, columnType: 'date' })
  registeredAt!: Date;

  @Property({ length: 30 })
  status!: string;
}

@Entity({ tableName: 'membership_plans' })
export class MembershipPlanEntity extends BaseEntity {
  @Property({ length: 40, unique: true })
  code!: string;

  @Property({ length: 160 })
  name!: string;

  @Property({ length: 30 })
  type!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  price!: string;

  @Property()
  durationDays!: number;

  @Property({ nullable: true })
  usageLimit?: number | null;

  @Property()
  includesPt!: boolean;

  @Property()
  includedPtSessions!: number;

  @Property({ type: types.json })
  perks!: string[];

  @Property({ length: 30 })
  status!: string;
}

@Entity({ tableName: 'member_memberships' })
export class MemberMembershipEntity extends BaseEntity {
  @ManyToOne(() => MemberEntity, { fieldName: 'member_id' })
  member!: MemberEntity;

  @ManyToOne(() => MembershipPlanEntity, { fieldName: 'membership_plan_id' })
  membershipPlan!: MembershipPlanEntity;

  @Property({ type: types.date, columnType: 'date' })
  startDate!: Date;

  @Property({ type: types.date, columnType: 'date' })
  endDate!: Date;

  @Property({ nullable: true })
  remainingSessions?: number | null;

  @Property({ length: 30 })
  status!: string;
}

@Entity({ tableName: 'member_pt_assignments' })
export class MemberPtAssignmentEntity extends BaseEntity {
  @ManyToOne(() => MemberEntity, { fieldName: 'member_id' })
  member!: MemberEntity;

  @ManyToOne(() => PersonalTrainerEntity, { fieldName: 'pt_id' })
  personalTrainer!: PersonalTrainerEntity;

  @ManyToOne(() => MemberMembershipEntity, { fieldName: 'member_membership_id' })
  memberMembership!: MemberMembershipEntity;

  @Property({ type: types.date, columnType: 'date' })
  assignedFrom!: Date;

  @Property({ type: types.date, columnType: 'date', nullable: true })
  assignedTo?: Date | null;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  commissionAmount!: string;

  @Property({ length: 30 })
  status!: string;
}

@Entity({ tableName: 'membership_invoices' })
export class MembershipInvoiceEntity extends BaseEntity {
  @Property({ length: 40, unique: true })
  code!: string;

  @ManyToOne(() => MemberEntity, { fieldName: 'member_id' })
  member!: MemberEntity;

  @ManyToOne(() => MemberMembershipEntity, { fieldName: 'member_membership_id' })
  memberMembership!: MemberMembershipEntity;

  @Property({ type: types.datetime, columnType: 'timestamp' })
  invoiceDate!: Date;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  totalAmount!: string;

  @Property({ length: 30 })
  paymentMethod!: string;

  @Property({ length: 30 })
  status!: string;
}

@Entity({ tableName: 'products' })
export class ProductEntity extends BaseEntity {
  @Property({ length: 40, unique: true })
  code!: string;

  @Property({ length: 160 })
  name!: string;

  @Property({ length: 80 })
  category!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  unitCost!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  salePrice!: string;

  @Property()
  stockOnHand!: number;

  @Property()
  minimumStockLevel!: number;

  @Property({ length: 30 })
  status!: string;
}

@Entity({ tableName: 'inventory_transactions' })
export class InventoryTransactionEntity extends BaseEntity {
  @ManyToOne(() => ProductEntity, { fieldName: 'product_id' })
  product!: ProductEntity;

  @Property({ length: 30 })
  type!: string;

  @Property()
  quantity!: number;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  unitCost!: string;

  @Property({ type: types.datetime, columnType: 'timestamp' })
  transactionDate!: Date;

  @Property({ length: 60 })
  referenceCode!: string;

  @Property({ type: types.text })
  note!: string;
}

@Entity({ tableName: 'sales_invoices' })
export class SalesInvoiceEntity extends BaseEntity {
  @Property({ length: 40, unique: true })
  code!: string;

  @Property({ type: types.datetime, columnType: 'timestamp' })
  invoiceDate!: Date;

  @ManyToOne(() => UserEntity, { fieldName: 'created_by_user_id' })
  createdByUser!: UserEntity;

  @ManyToOne(() => MemberEntity, { fieldName: 'member_id', nullable: true })
  member?: MemberEntity | null;

  @Property({ length: 160 })
  customerName!: string;

  @Property({ length: 30 })
  status!: string;

  @Property({ length: 30 })
  paymentMethod!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  discountAmount!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  totalAmount!: string;

  @Property({ type: types.text })
  note!: string;

  @Property({ type: types.datetime, columnType: 'timestamp', nullable: true })
  confirmedAt?: Date | null;

  @Property({ type: types.datetime, columnType: 'timestamp', nullable: true })
  cancelledAt?: Date | null;

  @Property({ type: types.text, nullable: true })
  cancellationReason?: string | null;
}

@Entity({ tableName: 'sales_invoice_items' })
export class SalesInvoiceItemEntity extends BaseEntity {
  @ManyToOne(() => SalesInvoiceEntity, { fieldName: 'sales_invoice_id' })
  salesInvoice!: SalesInvoiceEntity;

  @ManyToOne(() => ProductEntity, { fieldName: 'product_id' })
  product!: ProductEntity;

  @Property()
  quantity!: number;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  unitPrice!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  unitCost!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  lineTotal!: string;
}

@Entity({ tableName: 'equipment_assets' })
export class EquipmentAssetEntity extends BaseEntity {
  @Property({ length: 40, unique: true })
  code!: string;

  @Property({ length: 160 })
  name!: string;

  @Property({ type: types.date, columnType: 'date' })
  purchasedAt!: Date;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  purchaseValue!: string;

  @Property({ length: 40 })
  condition!: string;

  @Property({ type: types.date, columnType: 'date' })
  nextMaintenanceAt!: Date;

  @Property({ type: types.text })
  note!: string;
}

@Entity({ tableName: 'operating_expenses' })
export class OperatingExpenseEntity extends BaseEntity {
  @Property({ length: 40, unique: true })
  code!: string;

  @Property({ type: types.date, columnType: 'date' })
  expenseDate!: Date;

  @Property({ length: 40 })
  category!: string;

  @ManyToOne(() => EquipmentAssetEntity, { fieldName: 'equipment_asset_id', nullable: true })
  equipmentAsset?: EquipmentAssetEntity | null;

  @Property({ length: 160 })
  vendorName!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  amount!: string;

  @Property({ type: types.text })
  description!: string;

  @ManyToOne(() => UserEntity, { fieldName: 'approved_by_user_id', nullable: true })
  approvedByUser?: UserEntity | null;

  @Property({ type: types.datetime, columnType: 'timestamp', nullable: true })
  submittedAt?: Date | null;

  @Property({ type: types.datetime, columnType: 'timestamp', nullable: true })
  approvedAt?: Date | null;

  @Property({ type: types.datetime, columnType: 'timestamp', nullable: true })
  rejectedAt?: Date | null;

  @Property({ type: types.text, nullable: true })
  rejectionReason?: string | null;

  @Property({ type: types.datetime, columnType: 'timestamp', nullable: true })
  paidAt?: Date | null;

  @Property({ length: 500, nullable: true })
  attachmentUrl?: string | null;

  @Property({ length: 30 })
  status!: string;
}

@Entity({ tableName: 'maintenance_records' })
export class MaintenanceRecordEntity extends BaseEntity {
  @ManyToOne(() => EquipmentAssetEntity, { fieldName: 'equipment_asset_id' })
  equipmentAsset!: EquipmentAssetEntity;

  @Property({ type: types.date, columnType: 'date' })
  maintenanceDate!: Date;

  @Property({ type: types.text })
  description!: string;

  @Property({ length: 160 })
  vendorName!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  amount!: string;
}

@Entity({ tableName: 'audit_logs' })
export class AuditLogEntity extends BaseEntity {
  @Property({ length: 120 })
  action!: string;

  @Property({ length: 120 })
  resource!: string;

  @Property({ length: 120, nullable: true })
  recordId?: string | null;

  @ManyToOne(() => UserEntity, { fieldName: 'changed_by_user_id', nullable: true })
  changedByUser?: UserEntity | null;

  @Property({ length: 16 })
  method!: string;

  @Property({ length: 255 })
  path!: string;

  @Property()
  statusCode!: number;

  @Property({ type: types.json, nullable: true })
  requestBody?: unknown;

  @Property({ type: types.json, nullable: true })
  responseBody?: unknown;
}

@Entity({ tableName: 'system_configs' })
export class SystemConfigEntity {
  @PrimaryKey({ type: types.string, length: 120 })
  key!: string;

  @Property({ length: 160 })
  label!: string;

  @Property({ type: types.text })
  value!: string;

  @Property({ type: types.text })
  description!: string;
}
