import { Buffer } from "node:buffer";
import { randomBytes, randomUUID } from "node:crypto";
import { MikroORM, type RequiredEntityData, wrap } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import {
  createGymManagementSnapshot,
  findEquipmentAssetById,
  findMemberById,
  findOperatingExpenseById,
  findPayrollPeriodById,
  findPersonalTrainerById,
  findPtContractByPtId,
  findSalesInvoiceById,
  getAttendanceByPtId,
  getMemberAssignmentsByMemberId,
  getMembershipInvoicesByMemberId,
  getPayrollEntriesByPeriodId,
  getSalesInvoicesByMemberId,
  type DemoUser,
  type GymManagementDataset,
  type GymManagementSnapshot,
  type UserRole,
} from "@next-nest-turbo-boilerplate/shared";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import PDFDocument = require("pdfkit");
import * as XLSX from "xlsx";
import { RedisService } from "../redis/redis.service";
import {
  AttendanceCheckInDto,
  AttendanceCheckOutDto,
  CreateEquipmentDto,
  CreateMemberDto,
  CreateMembershipPlanDto,
  CreateOperatingExpenseDto,
  CreatePersonalTrainerDto,
  CreateProductDto,
  PatchSystemConfigDto,
  UpdateEquipmentDto,
  UpdateMemberDto,
  UpdateMembershipPlanDto,
  UpdateOperatingExpenseDto,
  UpdatePersonalTrainerDto,
  UpdateProductDto,
} from "./dto/gym-management.dto";
import {
  AttendanceLogEntity,
  EquipmentAssetEntity,
  InventoryTransactionEntity,
  MaintenanceRecordEntity,
  MemberEntity,
  MemberMembershipEntity,
  MemberPtAssignmentEntity,
  MembershipInvoiceEntity,
  MembershipPlanEntity,
  OperatingExpenseEntity,
  PayrollEntryEntity,
  PayrollPeriodEntity,
  PersonalTrainerEntity,
  ProductEntity,
  PtContractEntity,
  SalesInvoiceEntity,
  SalesInvoiceItemEntity,
  SystemConfigEntity,
  UserEntity,
} from "./entities/gym-management.entity";
import {
  mapAttendanceLogEntity,
  mapDatasetFromEntities,
  mapEquipmentAssetEntity,
  mapMemberEntity,
  mapMembershipPlanEntity,
  mapOperatingExpenseEntity,
  mapPersonalTrainerEntity,
  mapProductEntity,
  mapSystemConfigEntity,
  mapUserEntity,
  parseDateOnly,
  toDecimalString,
} from "./gym-management.mapper";
import type { AuthenticatedUser } from "./auth/authenticated-user.type";

type LoginResult = {
  user: DemoUser;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
};

type AuthTokenPayload = {
  sessionId: string;
  userId: string;
  role: UserRole;
  ptId?: string;
};

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

type TrainerRecord = GymManagementDataset["personalTrainers"][number];
type MemberRecord = GymManagementDataset["members"][number];
type MembershipPlanRecord = GymManagementDataset["membershipPlans"][number];
type ProductRecord = GymManagementDataset["products"][number];
type EquipmentAssetRecord = GymManagementDataset["equipmentAssets"][number];
type OperatingExpenseRecord = GymManagementDataset["operatingExpenses"][number];
type SystemConfigRecord = GymManagementDataset["systemConfigs"][number];
type AttendanceRecord = GymManagementDataset["attendanceLogs"][number];
type PayrollPeriodStatus =
  GymManagementDataset["payrollPeriods"][number]["status"];
type PayrollEntryStatus =
  GymManagementDataset["payrollEntries"][number]["status"];
type OperatingExpenseStatus =
  GymManagementDataset["operatingExpenses"][number]["status"];
type SalesInvoiceStatus =
  GymManagementDataset["salesInvoices"][number]["status"];

type ExportedReport = {
  content: Uint8Array;
  fileName: string;
  mimeType: string;
};

type PayrollPeriodTransitionResult = {
  period: GymManagementSnapshot["dataset"]["payrollPeriods"][number];
  entries: GymManagementSnapshot["dataset"]["payrollEntries"];
};

type ReportType = "payroll" | "revenue" | "expenses" | "profit";
type ExportFormat = "pdf" | "xlsx";

const payrollPeriodTransitions: Readonly<
  Record<PayrollPeriodStatus, PayrollPeriodStatus[]>
> = {
  OPEN: ["PENDING_APPROVAL"],
  PENDING_APPROVAL: ["APPROVED"],
  APPROVED: ["PAID"],
  PAID: [],
};

const payrollEntryTransitions: Readonly<
  Record<PayrollEntryStatus, PayrollEntryStatus[]>
> = {
  PENDING_APPROVAL: ["APPROVED"],
  APPROVED: ["PAID"],
  PAID: [],
};

const operatingExpenseTransitions: Readonly<
  Record<OperatingExpenseStatus, OperatingExpenseStatus[]>
> = {
  DRAFT: ["PENDING_APPROVAL"],
  PENDING_APPROVAL: ["APPROVED", "REJECTED"],
  APPROVED: ["PAID"],
  REJECTED: ["DRAFT"],
  PAID: [],
};

const salesInvoiceTransitions: Readonly<
  Record<SalesInvoiceStatus, SalesInvoiceStatus[]>
> = {
  DRAFT: ["CONFIRMED"],
  CONFIRMED: ["CANCELLED"],
  CANCELLED: [],
};

@Injectable()
export class GymManagementService {
  constructor(
    private readonly orm: MikroORM,
    private readonly redisService: RedisService,
  ) {}

  async getSnapshot(): Promise<GymManagementSnapshot> {
    return createGymManagementSnapshot(await this.loadDataset());
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const em = this.createEntityManager();
    const userEntity = await em.findOne(UserEntity, { email });

    if (!userEntity || password !== userEntity.passwordHint) {
      throw new UnauthorizedException("Invalid demo credentials");
    }

    if (userEntity.status !== "ACTIVE") {
      throw new UnauthorizedException("User account is inactive");
    }

    const user = mapUserEntity(userEntity);
    const ptId =
      user.role === "PT"
        ? await this.resolvePtIdForUser(em, userEntity)
        : undefined;
    const { accessToken, refreshToken } = await this.issueAuthTokens({
      sessionId: randomUUID(),
      userId: user.id,
      role: user.role,
      ptId,
    });

    return {
      user,
      accessToken,
      refreshToken,
      accessTokenExpiresIn: ACCESS_TOKEN_TTL_SECONDS,
      refreshTokenExpiresIn: REFRESH_TOKEN_TTL_SECONDS,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<LoginResult> {
    const payload = await this.redisService.getJson<AuthTokenPayload>(
      this.toRefreshTokenKey(refreshToken),
    );

    if (!payload) {
      throw new UnauthorizedException("Refresh token is invalid or expired");
    }

    const em = this.createEntityManager();
    const userEntity = await em.findOne(UserEntity, { id: payload.userId });

    if (!userEntity || userEntity.status !== "ACTIVE") {
      throw new UnauthorizedException("User account is inactive");
    }

    await this.redisService.deleteKey(this.toRefreshTokenKey(refreshToken));
    const user = mapUserEntity(userEntity);
    const ptId =
      user.role === "PT"
        ? await this.resolvePtIdForUser(em, userEntity)
        : undefined;
    const issuedTokens = await this.issueAuthTokens({
      sessionId: payload.sessionId,
      userId: user.id,
      role: user.role,
      ptId,
    });

    return {
      user,
      accessToken: issuedTokens.accessToken,
      refreshToken: issuedTokens.refreshToken,
      accessTokenExpiresIn: ACCESS_TOKEN_TTL_SECONDS,
      refreshTokenExpiresIn: REFRESH_TOKEN_TTL_SECONDS,
    };
  }

  async logout(refreshToken: string, accessToken?: string): Promise<void> {
    await this.redisService.deleteKey(this.toRefreshTokenKey(refreshToken));

    if (accessToken) {
      await this.redisService.deleteKey(this.toAccessTokenKey(accessToken));
      await this.redisService.setValue(
        this.toRevokedAccessTokenKey(accessToken),
        "1",
        ACCESS_TOKEN_TTL_SECONDS,
      );
    }
  }

  async validateAccessToken(accessToken: string): Promise<AuthenticatedUser> {
    const isRevoked = await this.redisService.getValue(
      this.toRevokedAccessTokenKey(accessToken),
    );

    if (isRevoked) {
      throw new UnauthorizedException("Access token has been revoked");
    }

    const payload = await this.redisService.getJson<AuthTokenPayload>(
      this.toAccessTokenKey(accessToken),
    );

    if (!payload) {
      throw new UnauthorizedException("Access token is invalid or expired");
    }

    const em = this.createEntityManager();
    const userEntity = await em.findOne(UserEntity, { id: payload.userId });

    if (!userEntity || userEntity.status !== "ACTIVE") {
      throw new UnauthorizedException("User account is inactive");
    }

    return {
      user: mapUserEntity(userEntity),
      role: payload.role,
      ptId: payload.ptId,
      sessionId: payload.sessionId,
      accessToken,
    };
  }

  async getCurrentUser(accessToken: string): Promise<DemoUser> {
    const authenticatedUser = await this.validateAccessToken(accessToken);

    return authenticatedUser.user;
  }

  async getCurrentUserById(userId: string): Promise<DemoUser> {
    const em = this.createEntityManager();
    const currentUser = await em.findOne(UserEntity, { id: userId });

    if (!currentUser || currentUser.status !== "ACTIVE") {
      throw new UnauthorizedException("No demo users configured");
    }

    return mapUserEntity(currentUser);
  }

  async checkInAttendance(
    attendanceCheckInDto: AttendanceCheckInDto,
  ): Promise<AttendanceRecord> {
    const em = this.createEntityManager();
    if (!attendanceCheckInDto.ptId) {
      throw new BadRequestException("ptId is required");
    }

    const pt = await this.getRequiredPersonalTrainerEntity(
      em,
      attendanceCheckInDto.ptId,
    );

    const openedShift = await em.findOne(AttendanceLogEntity, {
      personalTrainer: pt,
      checkOutAt: null,
    });

    if (openedShift) {
      throw new ConflictException(
        `PT ${attendanceCheckInDto.ptId} already has an open shift`,
      );
    }

    const checkInAt = attendanceCheckInDto.checkInAt
      ? new Date(attendanceCheckInDto.checkInAt)
      : new Date();

    if (Number.isNaN(checkInAt.getTime())) {
      throw new BadRequestException("Invalid check in time");
    }

    const allowMultipleShifts = await this.getBooleanSystemConfig(
      em,
      "allow_multiple_shifts_per_day",
      false,
    );
    const attendanceDate = this.toVietnamDate(checkInAt);

    if (!allowMultipleShifts) {
      const existingShift = await em.findOne(AttendanceLogEntity, {
        personalTrainer: pt,
        attendanceDate,
      });

      if (existingShift) {
        throw new ConflictException(
          `PT ${attendanceCheckInDto.ptId} already has a shift for ${attendanceDate.toISOString().slice(0, 10)}`,
        );
      }
    }

    const attendanceLog = em.create(AttendanceLogEntity, {
      personalTrainer: pt,
      attendanceDate,
      checkInAt,
      checkOutAt: null,
      workedHours: "0",
      overtimeHours: "0",
      status: "OPEN",
      workCredit: "0",
    } as RequiredEntityData<AttendanceLogEntity>);

    em.persist(attendanceLog);
    await em.flush();

    return mapAttendanceLogEntity(attendanceLog);
  }

  async checkOutAttendance(
    attendanceCheckOutDto: AttendanceCheckOutDto,
  ): Promise<AttendanceRecord> {
    const em = this.createEntityManager();
    if (!attendanceCheckOutDto.ptId) {
      throw new BadRequestException("ptId is required");
    }

    const pt = await this.getRequiredPersonalTrainerEntity(
      em,
      attendanceCheckOutDto.ptId,
    );

    const attendanceLog = await this.findAttendanceLogForCheckOut(
      em,
      pt,
      attendanceCheckOutDto.attendanceLogId,
    );

    if (!attendanceLog) {
      throw new NotFoundException(
        `Open shift for PT ${attendanceCheckOutDto.ptId} not found`,
      );
    }

    if (attendanceLog.checkOutAt) {
      throw new ConflictException(
        `Shift ${attendanceLog.id} is already checked out`,
      );
    }

    const checkOutAt = attendanceCheckOutDto.checkOutAt
      ? new Date(attendanceCheckOutDto.checkOutAt)
      : new Date();

    if (Number.isNaN(checkOutAt.getTime())) {
      throw new BadRequestException("Invalid check out time");
    }

    if (checkOutAt <= attendanceLog.checkInAt) {
      throw new BadRequestException(
        "Check out time must be after check in time",
      );
    }

    const workedHours = Number(
      (
        (checkOutAt.getTime() - attendanceLog.checkInAt.getTime()) /
        36e5
      ).toFixed(2),
    );

    const ptContract = await this.findActivePtContractEntity(
      em,
      pt.id,
      attendanceLog.attendanceDate,
    );
    const minValidShiftHours = ptContract
      ? Number(ptContract.minValidShiftHours)
      : await this.getNumberSystemConfig(em, "min_valid_shift_hours", 5);
    const standardShiftHours = ptContract
      ? Number(ptContract.standardShiftHours)
      : 8;
    const halfShiftPolicy = await this.getStringSystemConfig(
      em,
      "half_shift_policy",
      "NO_COUNT",
    );

    let status: AttendanceLogEntity["status"];
    let workCredit: number;

    if (workedHours >= minValidShiftHours) {
      status = "VALID";
      workCredit = 1;
    } else if (halfShiftPolicy === "HALF_COUNT") {
      status = "HALF";
      workCredit = 0.5;
    } else {
      status = "INVALID";
      workCredit = 0;
    }

    const overtimeHours =
      workedHours > standardShiftHours
        ? Number((workedHours - standardShiftHours).toFixed(2))
        : 0;

    attendanceLog.checkOutAt = checkOutAt;
    attendanceLog.workedHours = workedHours.toString();
    attendanceLog.overtimeHours = overtimeHours.toString();
    attendanceLog.status = status;
    attendanceLog.workCredit = workCredit.toString();

    await em.flush();

    return mapAttendanceLogEntity(attendanceLog);
  }

  async getPtDetail(ptId: string): Promise<{
    trainer: TrainerRecord;
    contract:
      | GymManagementSnapshot["dataset"]["ptContracts"][number]
      | undefined;
    attendance: GymManagementSnapshot["dataset"]["attendanceLogs"];
    payrollEntries: GymManagementSnapshot["dataset"]["payrollEntries"];
    assignedMembers: GymManagementSnapshot["dataset"]["members"];
  }> {
    const dataset = await this.loadDataset();
    const trainer = findPersonalTrainerById(dataset, ptId);

    if (!trainer) {
      throw new NotFoundException(`PT ${ptId} not found`);
    }

    const assignedMembers = dataset.memberPtAssignments
      .filter((assignment) => assignment.ptId === ptId)
      .map((assignment) => findMemberById(dataset, assignment.memberId))
      .filter(
        (
          member,
        ): member is GymManagementSnapshot["dataset"]["members"][number] =>
          member !== undefined,
      );

    return {
      trainer,
      contract: findPtContractByPtId(dataset, ptId),
      attendance: getAttendanceByPtId(dataset, ptId),
      payrollEntries: dataset.payrollEntries.filter(
        (entry) => entry.ptId === ptId,
      ),
      assignedMembers,
    };
  }

  async getMemberDetail(memberId: string): Promise<{
    member: MemberRecord;
    memberships: GymManagementSnapshot["dataset"]["memberMemberships"];
    ptAssignments: GymManagementSnapshot["dataset"]["memberPtAssignments"];
    membershipInvoices: GymManagementSnapshot["dataset"]["membershipInvoices"];
    salesInvoices: GymManagementSnapshot["dataset"]["salesInvoices"];
  }> {
    const dataset = await this.loadDataset();
    const member = findMemberById(dataset, memberId);

    if (!member) {
      throw new NotFoundException(`Member ${memberId} not found`);
    }

    return {
      member,
      memberships: dataset.memberMemberships.filter(
        (membership) => membership.memberId === memberId,
      ),
      ptAssignments: getMemberAssignmentsByMemberId(dataset, memberId),
      membershipInvoices: getMembershipInvoicesByMemberId(dataset, memberId),
      salesInvoices: getSalesInvoicesByMemberId(dataset, memberId),
    };
  }

  async getPayrollPeriodDetail(payrollPeriodId: string): Promise<{
    period: GymManagementSnapshot["dataset"]["payrollPeriods"][number];
    entries: GymManagementSnapshot["dataset"]["payrollEntries"];
  }> {
    const dataset = await this.loadDataset();
    const period = findPayrollPeriodById(dataset, payrollPeriodId);

    if (!period) {
      throw new NotFoundException(
        `Payroll period ${payrollPeriodId} not found`,
      );
    }

    return {
      period,
      entries: getPayrollEntriesByPeriodId(dataset, payrollPeriodId),
    };
  }

  async getSalesInvoiceDetail(
    salesInvoiceId: string,
  ): Promise<GymManagementSnapshot["dataset"]["salesInvoices"][number]> {
    const dataset = await this.loadDataset();
    const salesInvoice = findSalesInvoiceById(dataset, salesInvoiceId);

    if (!salesInvoice) {
      throw new NotFoundException(`Sales invoice ${salesInvoiceId} not found`);
    }

    return salesInvoice;
  }

  async getExpenseDetail(expenseId: string): Promise<OperatingExpenseRecord> {
    const dataset = await this.loadDataset();
    const expense = findOperatingExpenseById(dataset, expenseId);

    if (!expense) {
      throw new NotFoundException(`Expense ${expenseId} not found`);
    }

    return expense;
  }

  async getEquipmentDetail(
    equipmentAssetId: string,
  ): Promise<EquipmentAssetRecord> {
    const dataset = await this.loadDataset();
    const equipmentAsset = findEquipmentAssetById(dataset, equipmentAssetId);

    if (!equipmentAsset) {
      throw new NotFoundException(`Equipment ${equipmentAssetId} not found`);
    }

    return equipmentAsset;
  }

  async submitPayrollPeriod(
    payrollPeriodId: string,
    submittedByUserId: string,
  ): Promise<PayrollPeriodTransitionResult> {
    return this.transitionPayrollPeriodStatus(
      payrollPeriodId,
      "PENDING_APPROVAL",
      submittedByUserId,
    );
  }

  async approvePayrollPeriod(
    payrollPeriodId: string,
    approvedByUserId: string,
  ): Promise<PayrollPeriodTransitionResult> {
    return this.transitionPayrollPeriodStatus(
      payrollPeriodId,
      "APPROVED",
      approvedByUserId,
    );
  }

  async markPayrollPeriodPaid(
    payrollPeriodId: string,
    paidByUserId: string,
  ): Promise<PayrollPeriodTransitionResult> {
    return this.transitionPayrollPeriodStatus(
      payrollPeriodId,
      "PAID",
      paidByUserId,
    );
  }

  async submitExpense(expenseId: string): Promise<OperatingExpenseRecord> {
    return this.transitionExpenseStatus(expenseId, "PENDING_APPROVAL");
  }

  async approveExpense(
    expenseId: string,
    approvedByUserId: string,
  ): Promise<OperatingExpenseRecord> {
    return this.transitionExpenseStatus(expenseId, "APPROVED", {
      approvedByUserId,
    });
  }

  async rejectExpense(
    expenseId: string,
    rejectionReason: string,
  ): Promise<OperatingExpenseRecord> {
    return this.transitionExpenseStatus(expenseId, "REJECTED", {
      rejectionReason,
    });
  }

  async markExpensePaid(expenseId: string): Promise<OperatingExpenseRecord> {
    return this.transitionExpenseStatus(expenseId, "PAID");
  }

  async confirmSalesInvoice(
    salesInvoiceId: string,
  ): Promise<GymManagementSnapshot["dataset"]["salesInvoices"][number]> {
    return this.transitionSalesInvoiceStatus(salesInvoiceId, "CONFIRMED");
  }

  async cancelSalesInvoice(
    salesInvoiceId: string,
    cancellationReason: string,
  ): Promise<GymManagementSnapshot["dataset"]["salesInvoices"][number]> {
    return this.transitionSalesInvoiceStatus(
      salesInvoiceId,
      "CANCELLED",
      cancellationReason,
    );
  }

  async exportReport(
    reportType: ReportType,
    format: ExportFormat,
  ): Promise<ExportedReport> {
    const snapshot = await this.getSnapshot();
    const reportData = this.getReportData(snapshot, reportType);
    const exportedAt = new Date().toISOString();
    const rows = this.toExportRows(reportData);

    if (format === "xlsx") {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(rows);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

      return {
        content: XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }),
        fileName: `${reportType}-report-${exportedAt.slice(0, 10)}.xlsx`,
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
    }

    return {
      content: await this.toPdfBuffer(reportType, exportedAt, rows),
      fileName: `${reportType}-report-${exportedAt.slice(0, 10)}.pdf`,
      mimeType: "application/pdf",
    };
  }

  async createPersonalTrainer(
    createPersonalTrainerDto: CreatePersonalTrainerDto,
  ): Promise<TrainerRecord> {
    const em = this.createEntityManager();
    const trainerData = this.toPersonalTrainerEntityData(
      createPersonalTrainerDto,
    ) as unknown as RequiredEntityData<PersonalTrainerEntity>;
    const trainer = em.create(PersonalTrainerEntity, trainerData);

    em.persist(trainer);
    await em.flush();

    return mapPersonalTrainerEntity(trainer);
  }

  async updatePersonalTrainer(
    ptId: string,
    updatePersonalTrainerDto: UpdatePersonalTrainerDto,
  ): Promise<TrainerRecord> {
    const em = this.createEntityManager();
    const trainer = await this.getRequiredPersonalTrainerEntity(em, ptId);

    wrap(trainer).assign(
      this.toPersonalTrainerEntityData(updatePersonalTrainerDto),
      { ignoreUndefined: true },
    );
    await em.flush();

    return mapPersonalTrainerEntity(trainer);
  }

  async deletePersonalTrainer(ptId: string): Promise<TrainerRecord> {
    const em = this.createEntityManager();
    const trainer = await this.getRequiredPersonalTrainerEntity(em, ptId);

    trainer.status = "INACTIVE";
    await em.flush();

    return mapPersonalTrainerEntity(trainer);
  }

  async createMember(createMemberDto: CreateMemberDto): Promise<MemberRecord> {
    const em = this.createEntityManager();
    const memberData = this.toMemberEntityData(
      createMemberDto,
    ) as unknown as RequiredEntityData<MemberEntity>;
    const member = em.create(MemberEntity, memberData);

    em.persist(member);
    await em.flush();

    return mapMemberEntity(member);
  }

  async updateMember(
    memberId: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<MemberRecord> {
    const em = this.createEntityManager();
    const member = await this.getRequiredMemberEntity(em, memberId);

    wrap(member).assign(this.toMemberEntityData(updateMemberDto), {
      ignoreUndefined: true,
    });
    await em.flush();

    return mapMemberEntity(member);
  }

  async deleteMember(memberId: string): Promise<MemberRecord> {
    const em = this.createEntityManager();
    const member = await this.getRequiredMemberEntity(em, memberId);

    member.status = "INACTIVE";
    await em.flush();

    return mapMemberEntity(member);
  }

  async createMembershipPlan(
    createMembershipPlanDto: CreateMembershipPlanDto,
  ): Promise<MembershipPlanRecord> {
    const em = this.createEntityManager();
    const membershipPlanData = this.toMembershipPlanEntityData(
      createMembershipPlanDto,
    ) as unknown as RequiredEntityData<MembershipPlanEntity>;
    const membershipPlan = em.create(MembershipPlanEntity, membershipPlanData);

    em.persist(membershipPlan);
    await em.flush();

    return mapMembershipPlanEntity(membershipPlan);
  }

  async updateMembershipPlan(
    membershipPlanId: string,
    updateMembershipPlanDto: UpdateMembershipPlanDto,
  ): Promise<MembershipPlanRecord> {
    const em = this.createEntityManager();
    const membershipPlan = await this.getRequiredMembershipPlanEntity(
      em,
      membershipPlanId,
    );

    wrap(membershipPlan).assign(
      this.toMembershipPlanEntityData(updateMembershipPlanDto),
      { ignoreUndefined: true },
    );
    await em.flush();

    return mapMembershipPlanEntity(membershipPlan);
  }

  async deleteMembershipPlan(
    membershipPlanId: string,
  ): Promise<MembershipPlanRecord> {
    const em = this.createEntityManager();
    const membershipPlan = await this.getRequiredMembershipPlanEntity(
      em,
      membershipPlanId,
    );

    membershipPlan.status = "OFF_SALE";
    await em.flush();

    return mapMembershipPlanEntity(membershipPlan);
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductRecord> {
    const em = this.createEntityManager();
    const productData = this.toProductEntityData(
      createProductDto,
    ) as unknown as RequiredEntityData<ProductEntity>;
    const product = em.create(ProductEntity, productData);

    em.persist(product);
    await em.flush();

    return mapProductEntity(product);
  }

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductRecord> {
    const em = this.createEntityManager();
    const product = await this.getRequiredProductEntity(em, productId);

    wrap(product).assign(this.toProductEntityData(updateProductDto), {
      ignoreUndefined: true,
    });
    await em.flush();

    return mapProductEntity(product);
  }

  async deleteProduct(productId: string): Promise<ProductRecord> {
    const em = this.createEntityManager();
    const product = await this.getRequiredProductEntity(em, productId);

    product.status = "INACTIVE";
    await em.flush();

    return mapProductEntity(product);
  }

  async createEquipment(
    createEquipmentDto: CreateEquipmentDto,
  ): Promise<EquipmentAssetRecord> {
    const em = this.createEntityManager();
    const equipmentAssetData = this.toEquipmentAssetEntityData(
      createEquipmentDto,
    ) as unknown as RequiredEntityData<EquipmentAssetEntity>;
    const equipmentAsset = em.create(EquipmentAssetEntity, equipmentAssetData);

    em.persist(equipmentAsset);
    await em.flush();

    return mapEquipmentAssetEntity(equipmentAsset);
  }

  async updateEquipment(
    equipmentAssetId: string,
    updateEquipmentDto: UpdateEquipmentDto,
  ): Promise<EquipmentAssetRecord> {
    const em = this.createEntityManager();
    const equipmentAsset = await this.getRequiredEquipmentAssetEntity(
      em,
      equipmentAssetId,
    );

    wrap(equipmentAsset).assign(
      this.toEquipmentAssetEntityData(updateEquipmentDto),
      { ignoreUndefined: true },
    );
    await em.flush();

    return mapEquipmentAssetEntity(equipmentAsset);
  }

  async createOperatingExpense(
    createOperatingExpenseDto: CreateOperatingExpenseDto,
  ): Promise<OperatingExpenseRecord> {
    const em = this.createEntityManager();
    const operatingExpenseData = (await this.toOperatingExpenseEntityData(
      em,
      createOperatingExpenseDto,
    )) as unknown as RequiredEntityData<OperatingExpenseEntity>;
    const operatingExpense = em.create(
      OperatingExpenseEntity,
      operatingExpenseData,
    );

    this.resetOperatingExpenseWorkflow(operatingExpense);
    em.persist(operatingExpense);
    await em.flush();

    return mapOperatingExpenseEntity(operatingExpense);
  }

  async updateOperatingExpense(
    expenseId: string,
    updateOperatingExpenseDto: UpdateOperatingExpenseDto,
  ): Promise<OperatingExpenseRecord> {
    const em = this.createEntityManager();
    const operatingExpense = await this.getRequiredOperatingExpenseEntity(
      em,
      expenseId,
    );

    if (!["DRAFT", "REJECTED"].includes(operatingExpense.status)) {
      throw new BadRequestException(
        "Only draft or rejected expenses can be updated",
      );
    }

    wrap(operatingExpense).assign(
      await this.toOperatingExpenseEntityData(em, updateOperatingExpenseDto),
      {
        ignoreUndefined: true,
      },
    );
    this.resetOperatingExpenseWorkflow(operatingExpense);
    await em.flush();

    return mapOperatingExpenseEntity(operatingExpense);
  }

  async patchSystemConfig(
    configKey: string,
    patchSystemConfigDto: PatchSystemConfigDto,
  ): Promise<SystemConfigRecord> {
    const em = this.createEntityManager();
    const systemConfig = await this.getRequiredSystemConfigEntity(
      em,
      configKey,
    );

    systemConfig.value = patchSystemConfigDto.value;
    await em.flush();

    return mapSystemConfigEntity(systemConfig);
  }

  private createEntityManager(): EntityManager {
    return this.orm.em.fork() as EntityManager;
  }

  private async transitionPayrollPeriodStatus(
    payrollPeriodId: string,
    nextStatus: PayrollPeriodStatus,
    actorUserId: string,
  ): Promise<PayrollPeriodTransitionResult> {
    const em = this.createEntityManager();
    const payrollPeriod = await em.findOne(PayrollPeriodEntity, {
      id: payrollPeriodId,
    });

    if (!payrollPeriod) {
      throw new NotFoundException(
        `Payroll period ${payrollPeriodId} not found`,
      );
    }

    this.ensureAllowedTransition(
      "Payroll period",
      payrollPeriod.status as PayrollPeriodStatus,
      nextStatus,
      payrollPeriodTransitions,
    );

    const actor = await this.resolveApprovedByUser(em, actorUserId);

    if (!actor) {
      throw new NotFoundException(`User ${actorUserId} not found`);
    }

    const payrollEntries = await em.find(PayrollEntryEntity, { payrollPeriod });

    if (nextStatus === "PENDING_APPROVAL") {
      payrollPeriod.submittedAt = new Date();
      payrollPeriod.approvedByUser = null;
      payrollPeriod.approvedAt = null;
      payrollPeriod.paidAt = null;
    }

    if (nextStatus === "APPROVED") {
      if (!payrollPeriod.submittedAt) {
        throw new BadRequestException(
          "Payroll period must be submitted before approval",
        );
      }

      for (const entry of payrollEntries) {
        this.ensureAllowedTransition(
          "Payroll entry",
          entry.status as PayrollEntryStatus,
          "APPROVED",
          payrollEntryTransitions,
        );
        entry.status = "APPROVED";
      }

      payrollPeriod.approvedByUser = actor;
      payrollPeriod.approvedAt = new Date();
      payrollPeriod.paidAt = null;
    }

    if (nextStatus === "PAID") {
      if (!payrollPeriod.approvedAt || !payrollPeriod.approvedByUser) {
        throw new BadRequestException(
          "Payroll period must be approved before payout",
        );
      }

      for (const entry of payrollEntries) {
        this.ensureAllowedTransition(
          "Payroll entry",
          entry.status as PayrollEntryStatus,
          "PAID",
          payrollEntryTransitions,
        );
        entry.status = "PAID";
      }

      payrollPeriod.paidAt = new Date();
    }

    payrollPeriod.status = nextStatus;
    await em.flush();

    return this.getPayrollPeriodDetail(payrollPeriodId);
  }

  private async transitionExpenseStatus(
    expenseId: string,
    nextStatus: OperatingExpenseStatus,
    options?: {
      approvedByUserId?: string;
      rejectionReason?: string;
    },
  ): Promise<OperatingExpenseRecord> {
    const em = this.createEntityManager();
    const expense = await this.getRequiredOperatingExpenseEntity(em, expenseId);

    this.ensureAllowedTransition(
      "Operating expense",
      expense.status as OperatingExpenseStatus,
      nextStatus,
      operatingExpenseTransitions,
    );

    if (nextStatus === "PENDING_APPROVAL") {
      expense.submittedAt = new Date();
      expense.approvedByUser = null;
      expense.approvedAt = null;
      expense.rejectedAt = null;
      expense.rejectionReason = null;
      expense.paidAt = null;
    }

    if (nextStatus === "APPROVED") {
      if (!expense.submittedAt) {
        throw new BadRequestException(
          "Expense must be submitted before approval",
        );
      }

      const approvedByUser = await this.resolveApprovedByUser(
        em,
        options?.approvedByUserId,
      );

      if (!approvedByUser) {
        throw new BadRequestException(
          "approvedByUserId is required when approving expenses",
        );
      }

      expense.approvedByUser = approvedByUser;
      expense.approvedAt = new Date();
      expense.rejectedAt = null;
      expense.rejectionReason = null;
      expense.paidAt = null;
    }

    if (nextStatus === "REJECTED") {
      if (!options?.rejectionReason?.trim()) {
        throw new BadRequestException(
          "rejectionReason is required when rejecting expenses",
        );
      }

      expense.approvedByUser = null;
      expense.approvedAt = null;
      expense.rejectedAt = new Date();
      expense.rejectionReason = options.rejectionReason.trim();
      expense.paidAt = null;
    }

    if (nextStatus === "DRAFT") {
      expense.submittedAt = null;
      expense.approvedByUser = null;
      expense.approvedAt = null;
      expense.rejectedAt = null;
      expense.rejectionReason = null;
      expense.paidAt = null;
    }

    if (nextStatus === "PAID") {
      if (!expense.approvedAt || !expense.approvedByUser) {
        throw new BadRequestException("Expense must be approved before payout");
      }

      expense.paidAt = new Date();
    }

    expense.status = nextStatus;
    await em.flush();

    return mapOperatingExpenseEntity(expense);
  }

  private resetOperatingExpenseWorkflow(expense: OperatingExpenseEntity): void {
    expense.status = "DRAFT";
    expense.submittedAt = null;
    expense.approvedByUser = null;
    expense.approvedAt = null;
    expense.rejectedAt = null;
    expense.rejectionReason = null;
    expense.paidAt = null;
  }

  private async transitionSalesInvoiceStatus(
    salesInvoiceId: string,
    nextStatus: SalesInvoiceStatus,
    cancellationReason?: string,
  ): Promise<GymManagementSnapshot["dataset"]["salesInvoices"][number]> {
    const em = this.createEntityManager();
    const salesInvoice = await em.findOne(
      SalesInvoiceEntity,
      { id: salesInvoiceId },
      { populate: ["createdByUser", "member"] },
    );

    if (!salesInvoice) {
      throw new NotFoundException(`Sales invoice ${salesInvoiceId} not found`);
    }

    this.ensureAllowedTransition(
      "Sales invoice",
      salesInvoice.status as SalesInvoiceStatus,
      nextStatus,
      salesInvoiceTransitions,
    );

    const invoiceItems = await em.find(
      SalesInvoiceItemEntity,
      { salesInvoice },
      { populate: ["product", "salesInvoice"] },
    );

    if (nextStatus === "CONFIRMED") {
      for (const invoiceItem of invoiceItems) {
        if (invoiceItem.product.stockOnHand < invoiceItem.quantity) {
          throw new ConflictException(
            `Insufficient stock for product ${invoiceItem.product.code}`,
          );
        }
      }

      for (const invoiceItem of invoiceItems) {
        invoiceItem.product.stockOnHand -= invoiceItem.quantity;
        em.persist(
          this.toInventoryTransactionForInvoice(
            em,
            invoiceItem,
            "SALE",
            -invoiceItem.quantity,
          ),
        );
      }

      salesInvoice.confirmedAt = new Date();
      salesInvoice.cancelledAt = null;
      salesInvoice.cancellationReason = null;
    }

    if (nextStatus === "CANCELLED") {
      if (!salesInvoice.confirmedAt) {
        throw new BadRequestException(
          "Sales invoice must be confirmed before cancellation",
        );
      }

      if (!cancellationReason?.trim()) {
        throw new BadRequestException(
          "cancellationReason is required when cancelling sales invoice",
        );
      }

      for (const invoiceItem of invoiceItems) {
        invoiceItem.product.stockOnHand += invoiceItem.quantity;
        em.persist(
          this.toInventoryTransactionForInvoice(
            em,
            invoiceItem,
            "ADJUSTMENT",
            invoiceItem.quantity,
          ),
        );
      }

      salesInvoice.cancelledAt = new Date();
      salesInvoice.cancellationReason = cancellationReason.trim();
    }

    salesInvoice.status = nextStatus;
    await em.flush();

    return this.getSalesInvoiceDetail(salesInvoiceId);
  }

  private toInventoryTransactionForInvoice(
    em: EntityManager,
    invoiceItem: SalesInvoiceItemEntity,
    type: "SALE" | "ADJUSTMENT",
    quantity: number,
  ): InventoryTransactionEntity {
    return em.create(InventoryTransactionEntity, {
      product: invoiceItem.product,
      type,
      quantity,
      unitCost: invoiceItem.unitCost,
      transactionDate: new Date(),
      referenceCode: invoiceItem.salesInvoice.code,
      note: `${type} from invoice ${invoiceItem.salesInvoice.code}`,
    } as RequiredEntityData<InventoryTransactionEntity>);
  }

  private ensureAllowedTransition<StatusValue extends string>(
    resourceLabel: string,
    currentStatus: StatusValue,
    nextStatus: StatusValue,
    transitions: Readonly<Record<StatusValue, StatusValue[]>>,
  ): void {
    if (!transitions[currentStatus].includes(nextStatus)) {
      throw new BadRequestException(
        `${resourceLabel} transition ${currentStatus} -> ${nextStatus} is not allowed`,
      );
    }
  }

  private getReportData(
    snapshot: GymManagementSnapshot,
    reportType: ReportType,
  ): unknown {
    if (reportType === "payroll") {
      return snapshot.payrollReport;
    }

    if (reportType === "revenue") {
      return snapshot.revenueReport;
    }

    if (reportType === "expenses") {
      return snapshot.expenseReport;
    }

    return snapshot.profitReport;
  }

  private toExportRows(
    reportData: unknown,
  ): Array<Record<string, boolean | number | string>> {
    if (Array.isArray(reportData)) {
      return reportData.map((entry, index) =>
        this.flattenToRow(entry, { index: index + 1 }),
      );
    }

    if (reportData && typeof reportData === "object") {
      return [this.flattenToRow(reportData)];
    }

    return [{ value: String(reportData) }];
  }

  private flattenToRow(
    value: unknown,
    seed: Record<string, boolean | number | string> = {},
    prefix = "",
  ): Record<string, boolean | number | string> {
    const row = { ...seed };

    if (!value || typeof value !== "object") {
      if (prefix) {
        row[prefix] = String(value);
      }

      return row;
    }

    for (const [entryKey, entryValue] of Object.entries(
      value as Record<string, unknown>,
    )) {
      const nextKey = prefix ? `${prefix}.${entryKey}` : entryKey;

      if (
        entryValue === null ||
        typeof entryValue === "string" ||
        typeof entryValue === "number" ||
        typeof entryValue === "boolean"
      ) {
        row[nextKey] = entryValue ?? "";
        continue;
      }

      if (Array.isArray(entryValue)) {
        row[nextKey] = JSON.stringify(entryValue);
        continue;
      }

      Object.assign(row, this.flattenToRow(entryValue, {}, nextKey));
    }

    return row;
  }

  private async toPdfBuffer(
    reportType: ReportType,
    exportedAt: string,
    rows: Array<Record<string, boolean | number | string>>,
  ): Promise<Uint8Array> {
    const document = new PDFDocument({ margin: 36, size: "A4" });
    const buffers: Uint8Array[] = [];

    document.on("data", (chunk: Uint8Array) => {
      buffers.push(chunk);
    });

    const completion = new Promise<Uint8Array>((resolve) => {
      document.on("end", () => {
        resolve(Buffer.concat(buffers));
      });
    });

    document
      .fontSize(16)
      .text(`${reportType.toUpperCase()} REPORT`, { underline: true });
    document.moveDown(0.5);
    document.fontSize(10).text(`Generated at: ${exportedAt}`);
    document.moveDown();

    for (const row of rows) {
      for (const [key, value] of Object.entries(row)) {
        document.fontSize(9).text(`${key}: ${String(value)}`);
      }

      document.moveDown(0.75);
    }

    document.end();

    return completion;
  }

  private toVietnamDate(value: Date): Date {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const [year, month, day] = formatter.format(value).split("-");

    return parseDateOnly(`${year}-${month}-${day}`);
  }

  private async findActivePtContractEntity(
    em: EntityManager,
    ptId: string,
    attendanceDate: Date,
  ): Promise<PtContractEntity | undefined> {
    const dateOnly = attendanceDate.toISOString().slice(0, 10);
    const contract = await em.findOne(
      PtContractEntity,
      {
        personalTrainer: ptId,
        effectiveFrom: { $lte: parseDateOnly(dateOnly) },
        effectiveTo: { $gte: parseDateOnly(dateOnly) },
      },
      { orderBy: { effectiveFrom: "desc", createdAt: "desc" } },
    );

    return contract ?? undefined;
  }

  private async findAttendanceLogForCheckOut(
    em: EntityManager,
    pt: PersonalTrainerEntity,
    attendanceLogId?: string,
  ): Promise<AttendanceLogEntity | undefined> {
    if (attendanceLogId) {
      return (
        (await em.findOne(AttendanceLogEntity, {
          id: attendanceLogId,
          personalTrainer: pt,
        })) ?? undefined
      );
    }

    return (
      (await em.findOne(
        AttendanceLogEntity,
        { personalTrainer: pt, checkOutAt: null },
        { orderBy: { checkInAt: "desc", createdAt: "desc" } },
      )) ?? undefined
    );
  }

  private async getStringSystemConfig(
    em: EntityManager,
    key: string,
    fallbackValue: string,
  ): Promise<string> {
    const systemConfig = await em.findOne(SystemConfigEntity, { key });

    return systemConfig?.value?.trim() || fallbackValue;
  }

  private async getNumberSystemConfig(
    em: EntityManager,
    key: string,
    fallbackValue: number,
  ): Promise<number> {
    const rawValue = await this.getStringSystemConfig(
      em,
      key,
      fallbackValue.toString(),
    );
    const numericValue = Number(rawValue);

    return Number.isFinite(numericValue) ? numericValue : fallbackValue;
  }

  private async getBooleanSystemConfig(
    em: EntityManager,
    key: string,
    fallbackValue: boolean,
  ): Promise<boolean> {
    const rawValue = (
      await this.getStringSystemConfig(em, key, fallbackValue.toString())
    ).toLowerCase();

    if (rawValue === "true") {
      return true;
    }

    if (rawValue === "false") {
      return false;
    }

    return fallbackValue;
  }

  private async issueAuthTokens(
    payload: AuthTokenPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.generateOpaqueToken("access");
    const refreshToken = this.generateOpaqueToken("refresh");

    await this.redisService.setJson(
      this.toAccessTokenKey(accessToken),
      payload,
      ACCESS_TOKEN_TTL_SECONDS,
    );
    await this.redisService.setJson(
      this.toRefreshTokenKey(refreshToken),
      payload,
      REFRESH_TOKEN_TTL_SECONDS,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateOpaqueToken(prefix: string): string {
    return `${prefix}_${randomBytes(32).toString("base64url")}`;
  }

  private toAccessTokenKey(accessToken: string): string {
    return `auth:access:${accessToken}`;
  }

  private toRefreshTokenKey(refreshToken: string): string {
    return `auth:refresh:${refreshToken}`;
  }

  private toRevokedAccessTokenKey(accessToken: string): string {
    return `auth:revoked:access:${accessToken}`;
  }

  private async resolvePtIdForUser(
    em: EntityManager,
    user: Pick<UserEntity, "email" | "id">,
  ): Promise<string | undefined> {
    const trainer = await em.findOne(PersonalTrainerEntity, {
      email: user.email,
    });

    return trainer?.id;
  }

  private async loadDataset(): Promise<GymManagementDataset> {
    const em = this.createEntityManager();

    const [
      users,
      personalTrainers,
      ptContracts,
      attendanceLogs,
      payrollPeriods,
      payrollEntries,
      members,
      membershipPlans,
      memberMemberships,
      memberPtAssignments,
      membershipInvoices,
      products,
      inventoryTransactions,
      salesInvoices,
      salesInvoiceItems,
      operatingExpenses,
      equipmentAssets,
      maintenanceRecords,
      systemConfigs,
    ] = await Promise.all([
      em.findAll(UserEntity, { orderBy: { createdAt: "asc", id: "asc" } }),
      em.findAll(PersonalTrainerEntity, { orderBy: { code: "asc" } }),
      em.findAll(PtContractEntity, {
        orderBy: { effectiveFrom: "asc", id: "asc" },
      }),
      em.findAll(AttendanceLogEntity, {
        orderBy: { attendanceDate: "asc", checkInAt: "asc", id: "asc" },
      }),
      em.findAll(PayrollPeriodEntity, {
        orderBy: { fromDate: "asc", id: "asc" },
      }),
      em.findAll(PayrollEntryEntity, {
        orderBy: { createdAt: "asc", id: "asc" },
      }),
      em.findAll(MemberEntity, { orderBy: { code: "asc" } }),
      em.findAll(MembershipPlanEntity, { orderBy: { code: "asc" } }),
      em.findAll(MemberMembershipEntity, {
        orderBy: { startDate: "asc", id: "asc" },
      }),
      em.findAll(MemberPtAssignmentEntity, {
        orderBy: { assignedFrom: "asc", id: "asc" },
      }),
      em.findAll(MembershipInvoiceEntity, {
        orderBy: { invoiceDate: "asc", id: "asc" },
      }),
      em.findAll(ProductEntity, { orderBy: { code: "asc" } }),
      em.findAll(InventoryTransactionEntity, {
        orderBy: { transactionDate: "asc", id: "asc" },
      }),
      em.findAll(SalesInvoiceEntity, {
        orderBy: { invoiceDate: "asc", id: "asc" },
      }),
      em.findAll(SalesInvoiceItemEntity, {
        orderBy: { createdAt: "asc", id: "asc" },
      }),
      em.findAll(OperatingExpenseEntity, {
        orderBy: { expenseDate: "asc", id: "asc" },
      }),
      em.findAll(EquipmentAssetEntity, { orderBy: { code: "asc" } }),
      em.findAll(MaintenanceRecordEntity, {
        orderBy: { maintenanceDate: "asc", id: "asc" },
      }),
      em.findAll(SystemConfigEntity, { orderBy: { key: "asc" } }),
    ]);

    return mapDatasetFromEntities({
      users,
      personalTrainers,
      ptContracts,
      attendanceLogs,
      payrollPeriods,
      payrollEntries,
      members,
      membershipPlans,
      memberMemberships,
      memberPtAssignments,
      membershipInvoices,
      products,
      inventoryTransactions,
      salesInvoices,
      salesInvoiceItems,
      operatingExpenses,
      equipmentAssets,
      maintenanceRecords,
      systemConfigs,
    });
  }

  private toPersonalTrainerEntityData(
    dto: CreatePersonalTrainerDto | UpdatePersonalTrainerDto,
  ): Partial<PersonalTrainerEntity> {
    const data: Partial<PersonalTrainerEntity> = {};

    if (dto.code !== undefined) {
      data.code = dto.code;
    }

    if (dto.fullName !== undefined) {
      data.fullName = dto.fullName;
    }

    if (dto.gender !== undefined) {
      data.gender = dto.gender;
    }

    if (dto.birthDate !== undefined) {
      data.birthDate = parseDateOnly(dto.birthDate);
    }

    if (dto.phone !== undefined) {
      data.phone = dto.phone;
    }

    if (dto.email !== undefined) {
      data.email = dto.email;
    }

    if (dto.address !== undefined) {
      data.address = dto.address;
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    if (dto.specialties !== undefined) {
      data.specialties = dto.specialties;
    }

    if (dto.experienceYears !== undefined) {
      data.experienceYears = dto.experienceYears;
    }

    if (dto.avatarUrl !== undefined) {
      data.avatarUrl = dto.avatarUrl;
    }

    if (dto.startDate !== undefined) {
      data.startDate = parseDateOnly(dto.startDate);
    }

    return data;
  }

  private toMemberEntityData(
    dto: CreateMemberDto | UpdateMemberDto,
  ): Partial<MemberEntity> {
    const data: Partial<MemberEntity> = {};

    if (dto.code !== undefined) {
      data.code = dto.code;
    }

    if (dto.fullName !== undefined) {
      data.fullName = dto.fullName;
    }

    if (dto.gender !== undefined) {
      data.gender = dto.gender;
    }

    if (dto.birthDate !== undefined) {
      data.birthDate = parseDateOnly(dto.birthDate);
    }

    if (dto.phone !== undefined) {
      data.phone = dto.phone;
    }

    if (dto.email !== undefined) {
      data.email = dto.email;
    }

    if (dto.address !== undefined) {
      data.address = dto.address;
    }

    if (dto.heightCm !== undefined) {
      data.heightCm = dto.heightCm;
    }

    if (dto.weightKg !== undefined) {
      data.weightKg = dto.weightKg;
    }

    if (dto.goal !== undefined) {
      data.goal = dto.goal;
    }

    if (dto.healthNotes !== undefined) {
      data.healthNotes = dto.healthNotes;
    }

    if (dto.registeredAt !== undefined) {
      data.registeredAt = parseDateOnly(dto.registeredAt);
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    return data;
  }

  private toMembershipPlanEntityData(
    dto: CreateMembershipPlanDto | UpdateMembershipPlanDto,
  ): Partial<MembershipPlanEntity> {
    const data: Partial<MembershipPlanEntity> = {};

    if (dto.code !== undefined) {
      data.code = dto.code;
    }

    if (dto.name !== undefined) {
      data.name = dto.name;
    }

    if (dto.type !== undefined) {
      data.type = dto.type;
    }

    if (dto.price !== undefined) {
      data.price = toDecimalString(dto.price);
    }

    if (dto.durationDays !== undefined) {
      data.durationDays = dto.durationDays;
    }

    if (dto.usageLimit !== undefined) {
      data.usageLimit = dto.usageLimit;
    }

    if (dto.includesPt !== undefined) {
      data.includesPt = dto.includesPt;
    }

    if (dto.includedPtSessions !== undefined) {
      data.includedPtSessions = dto.includedPtSessions;
    }

    if (dto.perks !== undefined) {
      data.perks = dto.perks;
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    return data;
  }

  private toProductEntityData(
    dto: CreateProductDto | UpdateProductDto,
  ): Partial<ProductEntity> {
    const data: Partial<ProductEntity> = {};

    if (dto.code !== undefined) {
      data.code = dto.code;
    }

    if (dto.name !== undefined) {
      data.name = dto.name;
    }

    if (dto.category !== undefined) {
      data.category = dto.category;
    }

    if (dto.unitCost !== undefined) {
      data.unitCost = toDecimalString(dto.unitCost);
    }

    if (dto.salePrice !== undefined) {
      data.salePrice = toDecimalString(dto.salePrice);
    }

    if (dto.stockOnHand !== undefined) {
      data.stockOnHand = dto.stockOnHand;
    }

    if (dto.minimumStockLevel !== undefined) {
      data.minimumStockLevel = dto.minimumStockLevel;
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    return data;
  }

  private toEquipmentAssetEntityData(
    dto: CreateEquipmentDto | UpdateEquipmentDto,
  ): Partial<EquipmentAssetEntity> {
    const data: Partial<EquipmentAssetEntity> = {};

    if (dto.code !== undefined) {
      data.code = dto.code;
    }

    if (dto.name !== undefined) {
      data.name = dto.name;
    }

    if (dto.purchasedAt !== undefined) {
      data.purchasedAt = parseDateOnly(dto.purchasedAt);
    }

    if (dto.purchaseValue !== undefined) {
      data.purchaseValue = toDecimalString(dto.purchaseValue);
    }

    if (dto.condition !== undefined) {
      data.condition = dto.condition;
    }

    if (dto.nextMaintenanceAt !== undefined) {
      data.nextMaintenanceAt = parseDateOnly(dto.nextMaintenanceAt);
    }

    if (dto.note !== undefined) {
      data.note = dto.note;
    }

    return data;
  }

  private async toOperatingExpenseEntityData(
    em: EntityManager,
    dto: CreateOperatingExpenseDto | UpdateOperatingExpenseDto,
  ): Promise<Partial<OperatingExpenseEntity>> {
    const data: Partial<OperatingExpenseEntity> = {};

    if (dto.code !== undefined) {
      data.code = dto.code;
    }

    if (dto.expenseDate !== undefined) {
      data.expenseDate = parseDateOnly(dto.expenseDate);
    }

    if (dto.category !== undefined) {
      data.category = dto.category;
    }

    if (dto.equipmentAssetId !== undefined) {
      data.equipmentAsset =
        (await this.resolveEquipmentAsset(em, dto.equipmentAssetId)) ?? null;
    }

    if (dto.vendorName !== undefined) {
      data.vendorName = dto.vendorName;
    }

    if (dto.amount !== undefined) {
      data.amount = toDecimalString(dto.amount);
    }

    if (dto.description !== undefined) {
      data.description = dto.description;
    }

    if (dto.attachmentUrl !== undefined) {
      data.attachmentUrl = dto.attachmentUrl;
    }

    return data;
  }

  private async resolveEquipmentAsset(
    em: EntityManager,
    equipmentAssetId?: string,
  ): Promise<EquipmentAssetEntity | undefined> {
    if (equipmentAssetId === undefined || equipmentAssetId === null) {
      return undefined;
    }

    const equipmentAsset = await em.findOne(EquipmentAssetEntity, {
      id: equipmentAssetId,
    });

    if (!equipmentAsset) {
      throw new NotFoundException(`Equipment ${equipmentAssetId} not found`);
    }

    return equipmentAsset;
  }

  private async resolveApprovedByUser(
    em: EntityManager,
    approvedByUserId?: string,
  ): Promise<UserEntity | undefined> {
    if (approvedByUserId === undefined || approvedByUserId === null) {
      return undefined;
    }

    const approvedByUser = await em.findOne(UserEntity, {
      id: approvedByUserId,
    });

    if (!approvedByUser) {
      throw new NotFoundException(`User ${approvedByUserId} not found`);
    }

    return approvedByUser;
  }

  private async getRequiredPersonalTrainerEntity(
    em: EntityManager,
    ptId: string,
  ): Promise<PersonalTrainerEntity> {
    const personalTrainer = await em.findOne(PersonalTrainerEntity, {
      id: ptId,
    });

    if (!personalTrainer) {
      throw new NotFoundException(`PT ${ptId} not found`);
    }

    return personalTrainer;
  }

  private async getRequiredMemberEntity(
    em: EntityManager,
    memberId: string,
  ): Promise<MemberEntity> {
    const member = await em.findOne(MemberEntity, { id: memberId });

    if (!member) {
      throw new NotFoundException(`Member ${memberId} not found`);
    }

    return member;
  }

  private async getRequiredMembershipPlanEntity(
    em: EntityManager,
    membershipPlanId: string,
  ): Promise<MembershipPlanEntity> {
    return this.findMembershipPlanOrThrow(em, membershipPlanId);
  }

  private async findMembershipPlanOrThrow(
    em: EntityManager,
    membershipPlanId: string,
  ): Promise<MembershipPlanEntity> {
    const membershipPlan = await em.findOne(MembershipPlanEntity, {
      id: membershipPlanId,
    });

    if (!membershipPlan) {
      throw new NotFoundException(
        `Membership plan ${membershipPlanId} not found`,
      );
    }

    return membershipPlan;
  }

  private async getRequiredProductEntity(
    em: EntityManager,
    productId: string,
  ): Promise<ProductEntity> {
    const product = await em.findOne(ProductEntity, { id: productId });

    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    return product;
  }

  private async getRequiredOperatingExpenseEntity(
    em: EntityManager,
    expenseId: string,
  ): Promise<OperatingExpenseEntity> {
    return this.findOperatingExpenseOrThrow(em, expenseId);
  }

  private async getRequiredEquipmentAssetEntity(
    em: EntityManager,
    equipmentAssetId: string,
  ): Promise<EquipmentAssetEntity> {
    const equipmentAsset = await em.findOne(EquipmentAssetEntity, {
      id: equipmentAssetId,
    });

    if (!equipmentAsset) {
      throw new NotFoundException(`Equipment ${equipmentAssetId} not found`);
    }

    return equipmentAsset;
  }

  private async findOperatingExpenseOrThrow(
    em: EntityManager,
    expenseId: string,
  ): Promise<OperatingExpenseEntity> {
    const operatingExpense = await em.findOne(OperatingExpenseEntity, {
      id: expenseId,
    });

    if (!operatingExpense) {
      throw new NotFoundException(`Expense ${expenseId} not found`);
    }

    return operatingExpense;
  }

  private async getRequiredSystemConfigEntity(
    em: EntityManager,
    configKey: string,
  ): Promise<SystemConfigEntity> {
    const systemConfig = await em.findOne(SystemConfigEntity, {
      key: configKey,
    });

    if (!systemConfig) {
      throw new NotFoundException(`System config ${configKey} not found`);
    }

    return systemConfig;
  }
}
