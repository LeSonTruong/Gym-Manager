/* eslint-disable @typescript-eslint/no-restricted-types */
import {
  Entity,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
  types,
} from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity {
  @Property({ length: 160 })
  fullName!: string;

  @Property({ length: 180, unique: true })
  username!: string;

  @Property({ length: 30 })
  role!: string;

  @Property({ length: 30 })
  status!: string;

  @Property({ length: 255 })
  passwordHash!: string;

  @Property({
    type: types.datetime,
    columnType: 'timestamp',
    nullable: true,
    fieldName: 'deleted_at',
  })
  deletedAt?: Date | null;
}

@Entity({ tableName: 'refresh_tokens' })
export class RefreshTokenEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { fieldName: 'user_id' })
  user!: UserEntity;

  @Property({ length: 255, unique: true, fieldName: 'token_hash' })
  tokenHash!: string;

  @Property({ length: 120, fieldName: 'session_id' })
  sessionId!: string;

  @Property({ type: types.datetime, columnType: 'timestamp', fieldName: 'expires_at' })
  expiresAt!: Date;

  @Property({
    type: types.datetime,
    columnType: 'timestamp',
    nullable: true,
    fieldName: 'revoked_at',
  })
  revokedAt?: Date | null;
}

@Entity({ tableName: 'personal_trainers' })
export class PersonalTrainerEntity extends BaseEntity {
  @Property({ length: 30, unique: true })
  code!: string;

  @ManyToOne(() => UserEntity, { fieldName: 'user_id', nullable: true, unique: true })
  user?: UserEntity | null;

  @Property({ length: 160 })
  fullName!: string;

  @Property({ length: 30, default: 'OTHER' })
  gender!: string;

  @Property({ type: types.date, columnType: 'date', fieldName: 'birth_date' })
  birthDate!: Date;

  @Property({ length: 40 })
  phone!: string;

  @Property({ type: types.date, columnType: 'date', fieldName: 'start_date' })
  startDate!: Date;

  @Property({ length: 30 })
  status!: string;

  @Property({
    type: types.datetime,
    columnType: 'timestamp',
    nullable: true,
    fieldName: 'deleted_at',
  })
  deletedAt?: Date | null;
}

@Entity({ tableName: 'pt_contracts' })
export class PtContractEntity extends BaseEntity {
  @ManyToOne(() => PersonalTrainerEntity, { fieldName: 'pt_id' })
  personalTrainer!: PersonalTrainerEntity;

  @Property({ length: 60, unique: true, fieldName: 'contract_code' })
  contractCode!: string;

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

  @Property({ type: types.date, columnType: 'date', nullable: true })
  effectiveTo?: Date | null;
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

  @Property({ type: types.decimal, precision: 6, scale: 2, fieldName: 'paid_hours' })
  paidHours!: string;

  @Property({ type: types.decimal, precision: 6, scale: 2 })
  overtimeHours!: string;

  @Property({ length: 30 })
  status!: string;

  @Property({ type: types.decimal, precision: 6, scale: 2 })
  workCredit!: string;

  @Property({ type: types.text, nullable: true })
  note?: string | null;
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

  @ManyToOne(() => PtContractEntity, { fieldName: 'contract_id', nullable: true })
  contract?: PtContractEntity | null;

  @Property({ type: types.decimal, precision: 8, scale: 2 })
  validShiftCredits!: string;

  @Property({ type: types.decimal, precision: 8, scale: 2, fieldName: 'paid_hours_total' })
  paidHours!: string;

  @Property({ type: types.decimal, precision: 8, scale: 2 })
  overtimeHours!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2, fieldName: 'base_salary_amount' })
  baseSalaryAmount!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2, fieldName: 'attendance_bonus_amount' })
  attendanceBonusAmount!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2, fieldName: 'overtime_amount' })
  overtimeAmount!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  packageCommission!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  salesCommission!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  performanceBonus!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2, fieldName: 'allowance_amount' })
  allowanceAmount!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2, fieldName: 'deduction_amount' })
  deductionAmount!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2, fieldName: 'penalty_amount' })
  penalties!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2 })
  grossPay!: string;

  @Property({ type: types.decimal, precision: 15, scale: 2, fieldName: 'total_amount' })
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

  @Property({ length: 30, default: 'OTHER' })
  gender!: string;

  @Property({ type: types.date, columnType: 'date', fieldName: 'birth_date' })
  birthDate!: Date;

  @Property({ length: 40 })
  phone!: string;

  @Property({ type: types.date, columnType: 'date', fieldName: 'registered_at' })
  registeredAt!: Date;

  @Property({ length: 30 })
  status!: string;

  @Property({
    type: types.datetime,
    columnType: 'timestamp',
    nullable: true,
    fieldName: 'deleted_at',
  })
  deletedAt?: Date | null;
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

  @Property()
  includesPt!: boolean;

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

  @Property({ length: 30 })
  status!: string;

  @Property({
    type: types.datetime,
    columnType: 'timestamp',
    nullable: true,
    fieldName: 'deleted_at',
  })
  deletedAt?: Date | null;
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

  @Property({ type: types.text, nullable: true })
  note?: string | null;
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

  @Property({
    type: types.datetime,
    columnType: 'timestamp',
    nullable: true,
    fieldName: 'deleted_at',
  })
  deletedAt?: Date | null;
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

@Entity({ tableName: 'operating_expenses' })
export class OperatingExpenseEntity extends BaseEntity {
  @Property({ length: 40, unique: true })
  code!: string;

  @Property({ type: types.date, columnType: 'date' })
  expenseDate!: Date;

  @Property({ length: 40 })
  category!: string;

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

  @ManyToOne(() => UserEntity, {
    fieldName: 'updated_by_user_id',
    nullable: true,
  })
  updatedByUser?: UserEntity | null;

  @Property({
    onCreate: () => new Date(),
    type: types.datetime,
    columnType: 'timestamp',
    fieldName: 'created_at',
  })
  createdAt = new Date();

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    type: types.datetime,
    columnType: 'timestamp',
    fieldName: 'updated_at',
  })
  updatedAt = new Date();

  [OptionalProps]?: 'createdAt' | 'updatedAt';
}
