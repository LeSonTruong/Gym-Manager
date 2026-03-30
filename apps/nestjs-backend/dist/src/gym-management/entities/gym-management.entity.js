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
exports.SystemConfigEntity = exports.MaintenanceRecordEntity = exports.OperatingExpenseEntity = exports.EquipmentAssetEntity = exports.SalesInvoiceItemEntity = exports.SalesInvoiceEntity = exports.InventoryTransactionEntity = exports.ProductEntity = exports.MembershipInvoiceEntity = exports.MemberPtAssignmentEntity = exports.MemberMembershipEntity = exports.MembershipPlanEntity = exports.MemberEntity = exports.PayrollEntryEntity = exports.PayrollPeriodEntity = exports.AttendanceLogEntity = exports.PtContractEntity = exports.PersonalTrainerEntity = exports.UserEntity = void 0;
const core_1 = require("@mikro-orm/core");
const base_entity_1 = require("../../common/entities/base.entity");
let UserEntity = class UserEntity extends base_entity_1.BaseEntity {
    fullName;
    email;
    role;
    status;
    passwordHint;
};
exports.UserEntity = UserEntity;
__decorate([
    (0, core_1.Property)({ length: 160 }),
    __metadata("design:type", String)
], UserEntity.prototype, "fullName", void 0);
__decorate([
    (0, core_1.Property)({ length: 180, unique: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], UserEntity.prototype, "status", void 0);
__decorate([
    (0, core_1.Property)({ length: 200 }),
    __metadata("design:type", String)
], UserEntity.prototype, "passwordHint", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'users' })
], UserEntity);
let PersonalTrainerEntity = class PersonalTrainerEntity extends base_entity_1.BaseEntity {
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
};
exports.PersonalTrainerEntity = PersonalTrainerEntity;
__decorate([
    (0, core_1.Property)({ length: 30, unique: true }),
    __metadata("design:type", String)
], PersonalTrainerEntity.prototype, "code", void 0);
__decorate([
    (0, core_1.Property)({ length: 160 }),
    __metadata("design:type", String)
], PersonalTrainerEntity.prototype, "fullName", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], PersonalTrainerEntity.prototype, "gender", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], PersonalTrainerEntity.prototype, "birthDate", void 0);
__decorate([
    (0, core_1.Property)({ length: 40 }),
    __metadata("design:type", String)
], PersonalTrainerEntity.prototype, "phone", void 0);
__decorate([
    (0, core_1.Property)({ length: 180, unique: true }),
    __metadata("design:type", String)
], PersonalTrainerEntity.prototype, "email", void 0);
__decorate([
    (0, core_1.Property)({ length: 255 }),
    __metadata("design:type", String)
], PersonalTrainerEntity.prototype, "address", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], PersonalTrainerEntity.prototype, "status", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.json }),
    __metadata("design:type", Array)
], PersonalTrainerEntity.prototype, "specialties", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], PersonalTrainerEntity.prototype, "experienceYears", void 0);
__decorate([
    (0, core_1.Property)({ length: 500 }),
    __metadata("design:type", String)
], PersonalTrainerEntity.prototype, "avatarUrl", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], PersonalTrainerEntity.prototype, "startDate", void 0);
exports.PersonalTrainerEntity = PersonalTrainerEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'personal_trainers' })
], PersonalTrainerEntity);
let PtContractEntity = class PtContractEntity extends base_entity_1.BaseEntity {
    personalTrainer;
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
};
exports.PtContractEntity = PtContractEntity;
__decorate([
    (0, core_1.ManyToOne)(() => PersonalTrainerEntity, { fieldName: 'pt_id' }),
    __metadata("design:type", PersonalTrainerEntity)
], PtContractEntity.prototype, "personalTrainer", void 0);
__decorate([
    (0, core_1.Property)({ length: 160 }),
    __metadata("design:type", String)
], PtContractEntity.prototype, "contractType", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], PtContractEntity.prototype, "salaryType", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], PtContractEntity.prototype, "baseSalary", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 6, scale: 2 }),
    __metadata("design:type", String)
], PtContractEntity.prototype, "minValidShiftHours", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 6, scale: 2 }),
    __metadata("design:type", String)
], PtContractEntity.prototype, "standardShiftHours", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], PtContractEntity.prototype, "overtimeHourlyRate", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], PtContractEntity.prototype, "performanceBonusThreshold", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], PtContractEntity.prototype, "performanceBonusAmount", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 6, scale: 4 }),
    __metadata("design:type", String)
], PtContractEntity.prototype, "packageCommissionRate", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 6, scale: 4 }),
    __metadata("design:type", String)
], PtContractEntity.prototype, "salesCommissionRate", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], PtContractEntity.prototype, "allowances", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.json }),
    __metadata("design:type", Array)
], PtContractEntity.prototype, "penaltyRules", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], PtContractEntity.prototype, "effectiveFrom", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], PtContractEntity.prototype, "effectiveTo", void 0);
exports.PtContractEntity = PtContractEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'pt_contracts' })
], PtContractEntity);
let AttendanceLogEntity = class AttendanceLogEntity extends base_entity_1.BaseEntity {
    personalTrainer;
    attendanceDate;
    checkInAt;
    checkOutAt;
    workedHours;
    overtimeHours;
    status;
    workCredit;
};
exports.AttendanceLogEntity = AttendanceLogEntity;
__decorate([
    (0, core_1.ManyToOne)(() => PersonalTrainerEntity, { fieldName: 'pt_id' }),
    __metadata("design:type", PersonalTrainerEntity)
], AttendanceLogEntity.prototype, "personalTrainer", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], AttendanceLogEntity.prototype, "attendanceDate", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.datetime, columnType: 'timestamp' }),
    __metadata("design:type", Date)
], AttendanceLogEntity.prototype, "checkInAt", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.datetime, columnType: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], AttendanceLogEntity.prototype, "checkOutAt", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 6, scale: 2 }),
    __metadata("design:type", String)
], AttendanceLogEntity.prototype, "workedHours", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 6, scale: 2 }),
    __metadata("design:type", String)
], AttendanceLogEntity.prototype, "overtimeHours", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], AttendanceLogEntity.prototype, "status", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 6, scale: 2 }),
    __metadata("design:type", String)
], AttendanceLogEntity.prototype, "workCredit", void 0);
exports.AttendanceLogEntity = AttendanceLogEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'attendance_logs' })
], AttendanceLogEntity);
let PayrollPeriodEntity = class PayrollPeriodEntity extends base_entity_1.BaseEntity {
    code;
    fromDate;
    toDate;
    status;
};
exports.PayrollPeriodEntity = PayrollPeriodEntity;
__decorate([
    (0, core_1.Property)({ length: 30, unique: true }),
    __metadata("design:type", String)
], PayrollPeriodEntity.prototype, "code", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], PayrollPeriodEntity.prototype, "fromDate", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], PayrollPeriodEntity.prototype, "toDate", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], PayrollPeriodEntity.prototype, "status", void 0);
exports.PayrollPeriodEntity = PayrollPeriodEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'payroll_periods' })
], PayrollPeriodEntity);
let PayrollEntryEntity = class PayrollEntryEntity extends base_entity_1.BaseEntity {
    payrollPeriod;
    personalTrainer;
    validShiftCredits;
    overtimeHours;
    packageCommission;
    salesCommission;
    performanceBonus;
    penalties;
    grossPay;
    netPay;
    status;
};
exports.PayrollEntryEntity = PayrollEntryEntity;
__decorate([
    (0, core_1.ManyToOne)(() => PayrollPeriodEntity, { fieldName: 'payroll_period_id' }),
    __metadata("design:type", PayrollPeriodEntity)
], PayrollEntryEntity.prototype, "payrollPeriod", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => PersonalTrainerEntity, { fieldName: 'pt_id' }),
    __metadata("design:type", PersonalTrainerEntity)
], PayrollEntryEntity.prototype, "personalTrainer", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 8, scale: 2 }),
    __metadata("design:type", String)
], PayrollEntryEntity.prototype, "validShiftCredits", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 8, scale: 2 }),
    __metadata("design:type", String)
], PayrollEntryEntity.prototype, "overtimeHours", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], PayrollEntryEntity.prototype, "packageCommission", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], PayrollEntryEntity.prototype, "salesCommission", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], PayrollEntryEntity.prototype, "performanceBonus", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], PayrollEntryEntity.prototype, "penalties", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], PayrollEntryEntity.prototype, "grossPay", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], PayrollEntryEntity.prototype, "netPay", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], PayrollEntryEntity.prototype, "status", void 0);
exports.PayrollEntryEntity = PayrollEntryEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'payroll_entries' })
], PayrollEntryEntity);
let MemberEntity = class MemberEntity extends base_entity_1.BaseEntity {
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
};
exports.MemberEntity = MemberEntity;
__decorate([
    (0, core_1.Property)({ length: 30, unique: true }),
    __metadata("design:type", String)
], MemberEntity.prototype, "code", void 0);
__decorate([
    (0, core_1.Property)({ length: 160 }),
    __metadata("design:type", String)
], MemberEntity.prototype, "fullName", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], MemberEntity.prototype, "gender", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], MemberEntity.prototype, "birthDate", void 0);
__decorate([
    (0, core_1.Property)({ length: 40 }),
    __metadata("design:type", String)
], MemberEntity.prototype, "phone", void 0);
__decorate([
    (0, core_1.Property)({ length: 180, unique: true }),
    __metadata("design:type", String)
], MemberEntity.prototype, "email", void 0);
__decorate([
    (0, core_1.Property)({ length: 255 }),
    __metadata("design:type", String)
], MemberEntity.prototype, "address", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], MemberEntity.prototype, "heightCm", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], MemberEntity.prototype, "weightKg", void 0);
__decorate([
    (0, core_1.Property)({ length: 255 }),
    __metadata("design:type", String)
], MemberEntity.prototype, "goal", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.text }),
    __metadata("design:type", String)
], MemberEntity.prototype, "healthNotes", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], MemberEntity.prototype, "registeredAt", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], MemberEntity.prototype, "status", void 0);
exports.MemberEntity = MemberEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'members' })
], MemberEntity);
let MembershipPlanEntity = class MembershipPlanEntity extends base_entity_1.BaseEntity {
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
};
exports.MembershipPlanEntity = MembershipPlanEntity;
__decorate([
    (0, core_1.Property)({ length: 40, unique: true }),
    __metadata("design:type", String)
], MembershipPlanEntity.prototype, "code", void 0);
__decorate([
    (0, core_1.Property)({ length: 160 }),
    __metadata("design:type", String)
], MembershipPlanEntity.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], MembershipPlanEntity.prototype, "type", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], MembershipPlanEntity.prototype, "price", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], MembershipPlanEntity.prototype, "durationDays", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Object)
], MembershipPlanEntity.prototype, "usageLimit", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Boolean)
], MembershipPlanEntity.prototype, "includesPt", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], MembershipPlanEntity.prototype, "includedPtSessions", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.json }),
    __metadata("design:type", Array)
], MembershipPlanEntity.prototype, "perks", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], MembershipPlanEntity.prototype, "status", void 0);
exports.MembershipPlanEntity = MembershipPlanEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'membership_plans' })
], MembershipPlanEntity);
let MemberMembershipEntity = class MemberMembershipEntity extends base_entity_1.BaseEntity {
    member;
    membershipPlan;
    startDate;
    endDate;
    remainingSessions;
    status;
};
exports.MemberMembershipEntity = MemberMembershipEntity;
__decorate([
    (0, core_1.ManyToOne)(() => MemberEntity, { fieldName: 'member_id' }),
    __metadata("design:type", MemberEntity)
], MemberMembershipEntity.prototype, "member", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => MembershipPlanEntity, { fieldName: 'membership_plan_id' }),
    __metadata("design:type", MembershipPlanEntity)
], MemberMembershipEntity.prototype, "membershipPlan", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], MemberMembershipEntity.prototype, "startDate", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], MemberMembershipEntity.prototype, "endDate", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Object)
], MemberMembershipEntity.prototype, "remainingSessions", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], MemberMembershipEntity.prototype, "status", void 0);
exports.MemberMembershipEntity = MemberMembershipEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'member_memberships' })
], MemberMembershipEntity);
let MemberPtAssignmentEntity = class MemberPtAssignmentEntity extends base_entity_1.BaseEntity {
    member;
    personalTrainer;
    memberMembership;
    assignedFrom;
    assignedTo;
    commissionAmount;
    status;
};
exports.MemberPtAssignmentEntity = MemberPtAssignmentEntity;
__decorate([
    (0, core_1.ManyToOne)(() => MemberEntity, { fieldName: 'member_id' }),
    __metadata("design:type", MemberEntity)
], MemberPtAssignmentEntity.prototype, "member", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => PersonalTrainerEntity, { fieldName: 'pt_id' }),
    __metadata("design:type", PersonalTrainerEntity)
], MemberPtAssignmentEntity.prototype, "personalTrainer", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => MemberMembershipEntity, { fieldName: 'member_membership_id' }),
    __metadata("design:type", MemberMembershipEntity)
], MemberPtAssignmentEntity.prototype, "memberMembership", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], MemberPtAssignmentEntity.prototype, "assignedFrom", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date', nullable: true }),
    __metadata("design:type", Object)
], MemberPtAssignmentEntity.prototype, "assignedTo", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], MemberPtAssignmentEntity.prototype, "commissionAmount", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], MemberPtAssignmentEntity.prototype, "status", void 0);
exports.MemberPtAssignmentEntity = MemberPtAssignmentEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'member_pt_assignments' })
], MemberPtAssignmentEntity);
let MembershipInvoiceEntity = class MembershipInvoiceEntity extends base_entity_1.BaseEntity {
    code;
    member;
    memberMembership;
    invoiceDate;
    totalAmount;
    paymentMethod;
    status;
};
exports.MembershipInvoiceEntity = MembershipInvoiceEntity;
__decorate([
    (0, core_1.Property)({ length: 40, unique: true }),
    __metadata("design:type", String)
], MembershipInvoiceEntity.prototype, "code", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => MemberEntity, { fieldName: 'member_id' }),
    __metadata("design:type", MemberEntity)
], MembershipInvoiceEntity.prototype, "member", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => MemberMembershipEntity, { fieldName: 'member_membership_id' }),
    __metadata("design:type", MemberMembershipEntity)
], MembershipInvoiceEntity.prototype, "memberMembership", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.datetime, columnType: 'timestamp' }),
    __metadata("design:type", Date)
], MembershipInvoiceEntity.prototype, "invoiceDate", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], MembershipInvoiceEntity.prototype, "totalAmount", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], MembershipInvoiceEntity.prototype, "paymentMethod", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], MembershipInvoiceEntity.prototype, "status", void 0);
exports.MembershipInvoiceEntity = MembershipInvoiceEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'membership_invoices' })
], MembershipInvoiceEntity);
let ProductEntity = class ProductEntity extends base_entity_1.BaseEntity {
    code;
    name;
    category;
    unitCost;
    salePrice;
    stockOnHand;
    minimumStockLevel;
    status;
};
exports.ProductEntity = ProductEntity;
__decorate([
    (0, core_1.Property)({ length: 40, unique: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "code", void 0);
__decorate([
    (0, core_1.Property)({ length: 160 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ length: 80 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "category", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "unitCost", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "salePrice", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], ProductEntity.prototype, "stockOnHand", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], ProductEntity.prototype, "minimumStockLevel", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "status", void 0);
exports.ProductEntity = ProductEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'products' })
], ProductEntity);
let InventoryTransactionEntity = class InventoryTransactionEntity extends base_entity_1.BaseEntity {
    product;
    type;
    quantity;
    unitCost;
    transactionDate;
    referenceCode;
    note;
};
exports.InventoryTransactionEntity = InventoryTransactionEntity;
__decorate([
    (0, core_1.ManyToOne)(() => ProductEntity, { fieldName: 'product_id' }),
    __metadata("design:type", ProductEntity)
], InventoryTransactionEntity.prototype, "product", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], InventoryTransactionEntity.prototype, "type", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], InventoryTransactionEntity.prototype, "quantity", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], InventoryTransactionEntity.prototype, "unitCost", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.datetime, columnType: 'timestamp' }),
    __metadata("design:type", Date)
], InventoryTransactionEntity.prototype, "transactionDate", void 0);
__decorate([
    (0, core_1.Property)({ length: 60 }),
    __metadata("design:type", String)
], InventoryTransactionEntity.prototype, "referenceCode", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.text }),
    __metadata("design:type", String)
], InventoryTransactionEntity.prototype, "note", void 0);
exports.InventoryTransactionEntity = InventoryTransactionEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'inventory_transactions' })
], InventoryTransactionEntity);
let SalesInvoiceEntity = class SalesInvoiceEntity extends base_entity_1.BaseEntity {
    code;
    invoiceDate;
    createdByUser;
    member;
    customerName;
    status;
    paymentMethod;
    discountAmount;
    totalAmount;
    note;
};
exports.SalesInvoiceEntity = SalesInvoiceEntity;
__decorate([
    (0, core_1.Property)({ length: 40, unique: true }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "code", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.datetime, columnType: 'timestamp' }),
    __metadata("design:type", Date)
], SalesInvoiceEntity.prototype, "invoiceDate", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => UserEntity, { fieldName: 'created_by_user_id' }),
    __metadata("design:type", UserEntity)
], SalesInvoiceEntity.prototype, "createdByUser", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => MemberEntity, { fieldName: 'member_id', nullable: true }),
    __metadata("design:type", Object)
], SalesInvoiceEntity.prototype, "member", void 0);
__decorate([
    (0, core_1.Property)({ length: 160 }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "customerName", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "status", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "paymentMethod", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "discountAmount", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "totalAmount", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.text }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "note", void 0);
exports.SalesInvoiceEntity = SalesInvoiceEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'sales_invoices' })
], SalesInvoiceEntity);
let SalesInvoiceItemEntity = class SalesInvoiceItemEntity extends base_entity_1.BaseEntity {
    salesInvoice;
    product;
    quantity;
    unitPrice;
    unitCost;
    lineTotal;
};
exports.SalesInvoiceItemEntity = SalesInvoiceItemEntity;
__decorate([
    (0, core_1.ManyToOne)(() => SalesInvoiceEntity, { fieldName: 'sales_invoice_id' }),
    __metadata("design:type", SalesInvoiceEntity)
], SalesInvoiceItemEntity.prototype, "salesInvoice", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => ProductEntity, { fieldName: 'product_id' }),
    __metadata("design:type", ProductEntity)
], SalesInvoiceItemEntity.prototype, "product", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "quantity", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], SalesInvoiceItemEntity.prototype, "unitPrice", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], SalesInvoiceItemEntity.prototype, "unitCost", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], SalesInvoiceItemEntity.prototype, "lineTotal", void 0);
exports.SalesInvoiceItemEntity = SalesInvoiceItemEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'sales_invoice_items' })
], SalesInvoiceItemEntity);
let EquipmentAssetEntity = class EquipmentAssetEntity extends base_entity_1.BaseEntity {
    code;
    name;
    purchasedAt;
    purchaseValue;
    condition;
    nextMaintenanceAt;
    note;
};
exports.EquipmentAssetEntity = EquipmentAssetEntity;
__decorate([
    (0, core_1.Property)({ length: 40, unique: true }),
    __metadata("design:type", String)
], EquipmentAssetEntity.prototype, "code", void 0);
__decorate([
    (0, core_1.Property)({ length: 160 }),
    __metadata("design:type", String)
], EquipmentAssetEntity.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], EquipmentAssetEntity.prototype, "purchasedAt", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], EquipmentAssetEntity.prototype, "purchaseValue", void 0);
__decorate([
    (0, core_1.Property)({ length: 40 }),
    __metadata("design:type", String)
], EquipmentAssetEntity.prototype, "condition", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], EquipmentAssetEntity.prototype, "nextMaintenanceAt", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.text }),
    __metadata("design:type", String)
], EquipmentAssetEntity.prototype, "note", void 0);
exports.EquipmentAssetEntity = EquipmentAssetEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'equipment_assets' })
], EquipmentAssetEntity);
let OperatingExpenseEntity = class OperatingExpenseEntity extends base_entity_1.BaseEntity {
    code;
    expenseDate;
    category;
    equipmentAsset;
    vendorName;
    amount;
    description;
    approvedByUser;
    attachmentUrl;
    status;
};
exports.OperatingExpenseEntity = OperatingExpenseEntity;
__decorate([
    (0, core_1.Property)({ length: 40, unique: true }),
    __metadata("design:type", String)
], OperatingExpenseEntity.prototype, "code", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], OperatingExpenseEntity.prototype, "expenseDate", void 0);
__decorate([
    (0, core_1.Property)({ length: 40 }),
    __metadata("design:type", String)
], OperatingExpenseEntity.prototype, "category", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => EquipmentAssetEntity, { fieldName: 'equipment_asset_id', nullable: true }),
    __metadata("design:type", Object)
], OperatingExpenseEntity.prototype, "equipmentAsset", void 0);
__decorate([
    (0, core_1.Property)({ length: 160 }),
    __metadata("design:type", String)
], OperatingExpenseEntity.prototype, "vendorName", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], OperatingExpenseEntity.prototype, "amount", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.text }),
    __metadata("design:type", String)
], OperatingExpenseEntity.prototype, "description", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => UserEntity, { fieldName: 'approved_by_user_id', nullable: true }),
    __metadata("design:type", Object)
], OperatingExpenseEntity.prototype, "approvedByUser", void 0);
__decorate([
    (0, core_1.Property)({ length: 500, nullable: true }),
    __metadata("design:type", Object)
], OperatingExpenseEntity.prototype, "attachmentUrl", void 0);
__decorate([
    (0, core_1.Property)({ length: 30 }),
    __metadata("design:type", String)
], OperatingExpenseEntity.prototype, "status", void 0);
exports.OperatingExpenseEntity = OperatingExpenseEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'operating_expenses' })
], OperatingExpenseEntity);
let MaintenanceRecordEntity = class MaintenanceRecordEntity extends base_entity_1.BaseEntity {
    equipmentAsset;
    maintenanceDate;
    description;
    vendorName;
    amount;
};
exports.MaintenanceRecordEntity = MaintenanceRecordEntity;
__decorate([
    (0, core_1.ManyToOne)(() => EquipmentAssetEntity, { fieldName: 'equipment_asset_id' }),
    __metadata("design:type", EquipmentAssetEntity)
], MaintenanceRecordEntity.prototype, "equipmentAsset", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.date, columnType: 'date' }),
    __metadata("design:type", Date)
], MaintenanceRecordEntity.prototype, "maintenanceDate", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.text }),
    __metadata("design:type", String)
], MaintenanceRecordEntity.prototype, "description", void 0);
__decorate([
    (0, core_1.Property)({ length: 160 }),
    __metadata("design:type", String)
], MaintenanceRecordEntity.prototype, "vendorName", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.decimal, precision: 15, scale: 2 }),
    __metadata("design:type", String)
], MaintenanceRecordEntity.prototype, "amount", void 0);
exports.MaintenanceRecordEntity = MaintenanceRecordEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'maintenance_records' })
], MaintenanceRecordEntity);
let SystemConfigEntity = class SystemConfigEntity {
    key;
    label;
    value;
    description;
};
exports.SystemConfigEntity = SystemConfigEntity;
__decorate([
    (0, core_1.PrimaryKey)({ type: core_1.types.string, length: 120 }),
    __metadata("design:type", String)
], SystemConfigEntity.prototype, "key", void 0);
__decorate([
    (0, core_1.Property)({ length: 160 }),
    __metadata("design:type", String)
], SystemConfigEntity.prototype, "label", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.text }),
    __metadata("design:type", String)
], SystemConfigEntity.prototype, "value", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.types.text }),
    __metadata("design:type", String)
], SystemConfigEntity.prototype, "description", void 0);
exports.SystemConfigEntity = SystemConfigEntity = __decorate([
    (0, core_1.Entity)({ tableName: 'system_configs' })
], SystemConfigEntity);
//# sourceMappingURL=gym-management.entity.js.map