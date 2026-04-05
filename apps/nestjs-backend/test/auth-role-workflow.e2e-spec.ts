import { MikroORM } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { ValidationPipe, type INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AuditLogInterceptor } from "../src/gym-management/audit/audit-log.interceptor";
import { AuditLogService } from "../src/gym-management/audit/audit-log.service";
import { hashPassword } from "../src/gym-management/auth/auth-crypto";
import { GymManagementController } from "../src/gym-management/gym-management.controller";
import { GymAuthGuard } from "../src/gym-management/auth/gym-auth.guard";
import { GymRolesGuard } from "../src/gym-management/auth/gym-roles.guard";
import {
  AuditLogEntity,
  AttendanceLogEntity,
  InventoryTransactionEntity,
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
  RefreshTokenEntity,
  SalesInvoiceEntity,
  SalesInvoiceItemEntity,
  SystemConfigEntity,
  UserEntity,
} from "../src/gym-management/entities/gym-management.entity";
import { GymManagementService } from "../src/gym-management/gym-management.service";
import { RedisService } from "../src/redis/redis.service";

class InMemoryRedisService {
  private readonly storage = new Map<string, unknown>();

  async setValue(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async getValue(key: string): Promise<string | undefined> {
    const value = this.storage.get(key);

    return typeof value === "string" ? value : undefined;
  }

  async deleteKey(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async setJson(key: string, value: unknown): Promise<void> {
    this.storage.set(key, value);
  }

  async getJson(key: string): Promise<unknown | undefined> {
    return this.storage.get(key);
  }
}

function toVietnamIsoAtHour(offsetDays: number, hour: number): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [year, month, day] = formatter.format(new Date()).split("-");
  const base = new Date(
    `${year}-${month}-${day}T${String(hour).padStart(2, "0")}:00:00+07:00`,
  );

  base.setUTCDate(base.getUTCDate() + offsetDays);

  return base.toISOString();
}

type UnknownRecord = Record<string, unknown>;
type MutationMethod = "post" | "patch";

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function expectRecord(value: unknown, label: string): UnknownRecord {
  if (!isRecord(value)) {
    throw new TypeError(`${label} must be an object`);
  }

  return value;
}

function expectString(value: unknown, label: string): string {
  if (typeof value !== "string") {
    throw new TypeError(`${label} must be a string`);
  }

  return value;
}

function expectNumber(value: unknown, label: string): number {
  if (typeof value !== "number") {
    throw new TypeError(`${label} must be a number`);
  }

  return value;
}

function expectArray(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`${label} must be an array`);
  }

  return value;
}

function getRecordField(
  source: UnknownRecord,
  field: string,
  label: string,
): UnknownRecord {
  return expectRecord(source[field], `${label}.${field}`);
}

function getStringField(
  source: UnknownRecord,
  field: string,
  label: string,
): string {
  return expectString(source[field], `${label}.${field}`);
}

function getNumberField(
  source: UnknownRecord,
  field: string,
  label: string,
): number {
  return expectNumber(source[field], `${label}.${field}`);
}

function getArrayField(
  source: UnknownRecord,
  field: string,
  label: string,
): unknown[] {
  return expectArray(source[field], `${label}.${field}`);
}

function getResponseBody(response: request.Response): UnknownRecord {
  return expectRecord(response.body, "response.body");
}

function getResponseDataRecord(response: request.Response): UnknownRecord {
  return getRecordField(getResponseBody(response), "data", "response.body");
}

function getResponseDataArray(response: request.Response): unknown[] {
  return getArrayField(getResponseBody(response), "data", "response.body");
}

function getAccessToken(response: request.Response): string {
  return getStringField(
    getResponseDataRecord(response),
    "accessToken",
    "response.body.data",
  );
}

async function expectMutationStatus(options: {
  app: INestApplication;
  method: MutationMethod;
  path: string;
  expectedStatus: number;
  payload?: UnknownRecord;
  token?: string;
}): Promise<void> {
  const { app, method, path, expectedStatus, payload, token } = options;

  let requestBuilder =
    method === "post"
      ? request(app.getHttpServer()).post(path)
      : request(app.getHttpServer()).patch(path);

  if (token) {
    requestBuilder = requestBuilder.set("Authorization", `Bearer ${token}`);
  }

  if (payload) {
    requestBuilder = requestBuilder.send(payload);
  }

  await requestBuilder.expect(expectedStatus);
}

describe("Auth/RBAC/Workflow (e2e + DB assertions)", () => {
  let app: INestApplication;
  let orm: MikroORM;
  let adminToken: string;
  let adminRefreshToken: string;
  let staffToken: string;
  let scopedStaffToken: string;
  let payrollPeriodId: string;
  let expenseApproveFlowId: string;
  let expenseRejectFlowId: string;
  let salesInvoiceId: string;
  let ptId: string;
  let scopedPtId: string;
  let memberId: string;
  let membershipPlanId: string;
  let productId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          entities: [
            UserEntity,
            PersonalTrainerEntity,
            PtContractEntity,
            AttendanceLogEntity,
            PayrollPeriodEntity,
            PayrollEntryEntity,
            RefreshTokenEntity,
            MemberEntity,
            MembershipPlanEntity,
            MemberMembershipEntity,
            MemberPtAssignmentEntity,
            MembershipInvoiceEntity,
            ProductEntity,
            InventoryTransactionEntity,
            SalesInvoiceEntity,
            SalesInvoiceItemEntity,
            OperatingExpenseEntity,
            AuditLogEntity,
            SystemConfigEntity,
          ],
          dbName: ":memory:",
          driver: SqliteDriver,
          debug: false,
        }),
        MikroOrmModule.forFeature([
          UserEntity,
          PersonalTrainerEntity,
          PtContractEntity,
          AttendanceLogEntity,
          PayrollPeriodEntity,
          PayrollEntryEntity,
          RefreshTokenEntity,
          MemberEntity,
          MembershipPlanEntity,
          MemberMembershipEntity,
          MemberPtAssignmentEntity,
          MembershipInvoiceEntity,
          ProductEntity,
          InventoryTransactionEntity,
          SalesInvoiceEntity,
          SalesInvoiceItemEntity,
          OperatingExpenseEntity,
          AuditLogEntity,
          SystemConfigEntity,
        ]),
      ],
      controllers: [GymManagementController],
      providers: [
        GymManagementService,
        GymAuthGuard,
        GymRolesGuard,
        AuditLogService,
        AuditLogInterceptor,
        { provide: RedisService, useValue: new InMemoryRedisService() },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    orm = moduleFixture.get(MikroORM);
    await orm.schema.createSchema();

    await seedData(orm);

    const adminLogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "admin", password: "password" })
      .expect(201);

    const adminLoginData = getResponseDataRecord(adminLogin);
    adminToken = getStringField(
      adminLoginData,
      "accessToken",
      "response.body.data",
    );
    adminRefreshToken = getStringField(
      adminLoginData,
      "refreshToken",
      "response.body.data",
    );

    const staffLogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "staff", password: "password" })
      .expect(201);

    staffToken = getAccessToken(staffLogin);

    const scopedStaffLogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "staff_pt", password: "password" })
      .expect(201);

    scopedStaffToken = getAccessToken(scopedStaffLogin);

    const em = orm.em.fork();

    const payrollPeriod = await em.findOne(PayrollPeriodEntity, {
      code: "PP-2026-03",
    });
    const expenseA = await em.findOne(OperatingExpenseEntity, {
      code: "EXP-A",
    });
    const expenseB = await em.findOne(OperatingExpenseEntity, {
      code: "EXP-B",
    });
    const salesInvoice = await em.findOne(SalesInvoiceEntity, {
      code: "SI-001",
    });
    const trainer = await em.findOne(PersonalTrainerEntity, { code: "PT-001" });
    const scopedTrainer = await em.findOne(PersonalTrainerEntity, {
      code: "PT-STAFF",
    });
    const member = await em.findOne(MemberEntity, { code: "MB-001" });
    const membershipPlan = await em.findOne(MembershipPlanEntity, {
      code: "PLAN-001",
    });
    const product = await em.findOne(ProductEntity, { code: "PR-001" });

    if (
      !payrollPeriod ||
      !expenseA ||
      !expenseB ||
      !salesInvoice ||
      !trainer ||
      !scopedTrainer ||
      !member ||
      !membershipPlan ||
      !product
    ) {
      throw new Error("Seed records were not created for e2e tests");
    }

    payrollPeriodId = payrollPeriod.id;
    expenseApproveFlowId = expenseA.id;
    expenseRejectFlowId = expenseB.id;
    salesInvoiceId = salesInvoice.id;
    ptId = trainer.id;
    scopedPtId = scopedTrainer.id;
    memberId = member.id;
    membershipPlanId = membershipPlan.id;
    productId = product.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it("supports refresh and revoke on logout", async () => {
    await request(app.getHttpServer())
      .post("/auth/refresh")
      .send({ refreshToken: adminRefreshToken })
      .expect(201);

    await request(app.getHttpServer())
      .post("/auth/logout")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ refreshToken: adminRefreshToken })
      .expect(201);

    await request(app.getHttpServer())
      .get("/auth/me")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(401);
  });

  it("allows staff to check-in/check-out operations", async () => {
    const checkInResponse = await request(app.getHttpServer())
      .post("/attendance/check-in")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ ptId, checkInAt: toVietnamIsoAtHour(0, 9) })
      .expect(201);

    const attendanceLogId = getStringField(
      getResponseDataRecord(checkInResponse),
      "id",
      "response.body.data",
    );

    await request(app.getHttpServer())
      .post("/attendance/check-out")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        ptId,
        attendanceLogId,
        checkOutAt: toVietnamIsoAtHour(0, 15),
      })
      .expect(201);
  });

  it("enforces attendance scope for staff accounts linked to a PT", async () => {
    await request(app.getHttpServer())
      .post("/attendance/check-in")
      .set("Authorization", `Bearer ${scopedStaffToken}`)
      .send({ ptId, checkInAt: toVietnamIsoAtHour(0, 10) })
      .expect(403);

    const scopedCheckInResponse = await request(app.getHttpServer())
      .post("/attendance/check-in")
      .set("Authorization", `Bearer ${scopedStaffToken}`)
      .send({ checkInAt: toVietnamIsoAtHour(0, 10) })
      .expect(201);

    const scopedAttendanceLogId = getStringField(
      getResponseDataRecord(scopedCheckInResponse),
      "id",
      "response.body.data",
    );

    await request(app.getHttpServer())
      .post("/attendance/check-out")
      .set("Authorization", `Bearer ${scopedStaffToken}`)
      .send({
        attendanceLogId: scopedAttendanceLogId,
        checkOutAt: toVietnamIsoAtHour(0, 16),
      })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/attendance/pt/${ptId}`)
      .set("Authorization", `Bearer ${scopedStaffToken}`)
      .expect(403);

    await request(app.getHttpServer())
      .get(`/attendance/pt/${scopedPtId}`)
      .set("Authorization", `Bearer ${scopedStaffToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/attendance/me?ptId=${ptId}`)
      .set("Authorization", `Bearer ${scopedStaffToken}`)
      .expect(403);

    await request(app.getHttpServer())
      .get("/attendance/me")
      .set("Authorization", `Bearer ${scopedStaffToken}`)
      .expect(200);
  });

  it("blocks attendance check-in/check-out for past or future dates", async () => {
    const relogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "admin", password: "password" })
      .expect(201);
    const activeAdminToken = getAccessToken(relogin);

    const tempPtResponse = await request(app.getHttpServer())
      .post("/pts")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        code: `PT-TEMP-${Date.now()}`,
        fullName: "Temp Attendance PT",
        gender: "MALE",
        birthDate: "1995-01-01",
        phone: "0900000001",
        address: "HCMC",
        status: "ACTIVE",
        specialties: ["Yoga"],
        experienceYears: 2,
        avatarUrl: "https://example.com/avatar-temp-attendance.png",
        startDate: "2026-01-01",
      })
      .expect(201);
    const tempPtId = getStringField(
      getResponseDataRecord(tempPtResponse),
      "id",
      "response.body.data",
    );

    const yesterday = toVietnamIsoAtHour(-1, 9);
    const tomorrow = toVietnamIsoAtHour(1, 9);

    await request(app.getHttpServer())
      .post("/attendance/check-in")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({ ptId: tempPtId, checkInAt: yesterday })
      .expect(400);

    await request(app.getHttpServer())
      .post("/attendance/check-in")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({ ptId: tempPtId, checkInAt: tomorrow })
      .expect(400);

    const checkInResponse = await request(app.getHttpServer())
      .post("/attendance/check-in")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({ ptId: tempPtId, checkInAt: toVietnamIsoAtHour(0, 9) })
      .expect(201);
    const attendanceLogId = getStringField(
      getResponseDataRecord(checkInResponse),
      "id",
      "response.body.data",
    );

    await request(app.getHttpServer())
      .post("/attendance/check-out")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        ptId: tempPtId,
        attendanceLogId,
        checkOutAt: tomorrow,
      })
      .expect(400);

    const shortShiftCheckOutResponse = await request(app.getHttpServer())
      .post("/attendance/check-out")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        ptId: tempPtId,
        attendanceLogId,
        checkOutAt: toVietnamIsoAtHour(0, 12),
      })
      .expect(201);

    expect(
      getStringField(
        getResponseDataRecord(shortShiftCheckOutResponse),
        "status",
        "response.body.data",
      ),
    ).toBe("HALF");
  });

  it("applies payroll field invariants across transitions", async () => {
    const relogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "admin", password: "password" })
      .expect(201);
    const activeAdminToken = getAccessToken(relogin);

    await request(app.getHttpServer())
      .post(`/payroll/periods/${payrollPeriodId}/submit`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({})
      .expect(201);

    let em = orm.em.fork();
    let payrollPeriod = await em.findOne(
      PayrollPeriodEntity,
      { id: payrollPeriodId },
      { populate: ["approvedByUser"] },
    );
    expect(payrollPeriod?.submittedAt).toBeTruthy();
    expect(payrollPeriod?.approvedAt).toBeNull();
    expect(payrollPeriod?.paidAt).toBeNull();

    await request(app.getHttpServer())
      .post(`/payroll/periods/${payrollPeriodId}/approve`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({})
      .expect(201);

    em = orm.em.fork();
    payrollPeriod = await em.findOne(
      PayrollPeriodEntity,
      { id: payrollPeriodId },
      { populate: ["approvedByUser"] },
    );
    expect(payrollPeriod?.approvedAt).toBeTruthy();
    expect(payrollPeriod?.approvedByUser?.username).toBe("admin");

    await request(app.getHttpServer())
      .post(`/payroll/periods/${payrollPeriodId}/mark-paid`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({})
      .expect(201);

    em = orm.em.fork();
    payrollPeriod = await em.findOne(PayrollPeriodEntity, {
      id: payrollPeriodId,
    });
    expect(payrollPeriod?.paidAt).toBeTruthy();
  });

  it("applies expense invariants and role checks", async () => {
    await request(app.getHttpServer())
      .post(`/expenses/${expenseApproveFlowId}/approve`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({})
      .expect(403);

    const relogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "admin", password: "password" })
      .expect(201);
    const activeAdminToken = getAccessToken(relogin);

    await request(app.getHttpServer())
      .post(`/expenses/${expenseApproveFlowId}/submit`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({})
      .expect(201);

    await request(app.getHttpServer())
      .post(`/expenses/${expenseApproveFlowId}/approve`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({})
      .expect(201);

    await request(app.getHttpServer())
      .post(`/expenses/${expenseApproveFlowId}/mark-paid`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({})
      .expect(201);

    await request(app.getHttpServer())
      .post(`/expenses/${expenseRejectFlowId}/submit`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({})
      .expect(201);

    await request(app.getHttpServer())
      .post(`/expenses/${expenseRejectFlowId}/reject`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({ rejectionReason: "Invalid invoice attachment" })
      .expect(201);

    const em = orm.em.fork();
    const approvedExpense = await em.findOne(
      OperatingExpenseEntity,
      { id: expenseApproveFlowId },
      { populate: ["approvedByUser"] },
    );
    const rejectedExpense = await em.findOne(OperatingExpenseEntity, {
      id: expenseRejectFlowId,
    });

    expect(approvedExpense?.submittedAt).toBeTruthy();
    expect(approvedExpense?.approvedAt).toBeTruthy();
    expect(approvedExpense?.paidAt).toBeTruthy();
    expect(approvedExpense?.approvedByUser?.username).toBe("admin");

    expect(rejectedExpense?.rejectedAt).toBeTruthy();
    expect(rejectedExpense?.rejectionReason).toBe("Invalid invoice attachment");
    expect(rejectedExpense?.approvedAt).toBeNull();
  });

  it("blocks workflow fields on generic expense CRUD and reopens rejected edits as draft", async () => {
    const relogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "admin", password: "password" })
      .expect(201);
    const activeAdminToken = getAccessToken(relogin);

    await request(app.getHttpServer())
      .post("/expenses")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        code: "EXP-BYPASS",
        expenseDate: "2026-03-31",
        category: "Utilities",
        vendorName: "Power Company",
        amount: 150_000,
        description: "Attempted workflow bypass",
        status: "APPROVED",
      })
      .expect(400);

    await request(app.getHttpServer())
      .patch(`/expenses/${expenseRejectFlowId}`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        description: "Attempted workflow bypass update",
        approvedByUserId: "malicious-user-id",
      })
      .expect(400);

    const updateResponse = await request(app.getHttpServer())
      .patch(`/expenses/${expenseRejectFlowId}`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        description: "Corrected invoice attachment and amount",
        amount: 425_000,
        attachmentUrl: "https://example.com/expenses/exp-b-corrected.pdf",
      })
      .expect(200);

    expect(
      getStringField(
        getResponseDataRecord(updateResponse),
        "status",
        "response.body.data",
      ),
    ).toBe("DRAFT");

    const em = orm.em.fork();
    const reopenedExpense = await em.findOne(OperatingExpenseEntity, {
      id: expenseRejectFlowId,
    });

    expect(reopenedExpense?.status).toBe("DRAFT");
    expect(reopenedExpense?.submittedAt).toBeNull();
    expect(reopenedExpense?.approvedAt).toBeNull();
    expect(reopenedExpense?.rejectedAt).toBeNull();
    expect(reopenedExpense?.rejectionReason).toBeNull();
    expect(reopenedExpense?.paidAt).toBeNull();
    expect(reopenedExpense?.description).toBe(
      "Corrected invoice attachment and amount",
    );
    expect(Number(reopenedExpense?.amount)).toBe(425_000);
  });

  it("enforces 401/403 for ADMIN-only sensitive mutations", async () => {
    const adminOnlyCases: Array<{
      method: MutationMethod;
      path: string;
      payload?: UnknownRecord;
    }> = [
      {
        method: "post",
        path: "/member-assignments",
        payload: {
          memberId,
          ptId,
          memberMembershipId: "rbac-membership",
          assignedFrom: "2026-04-01",
        },
      },
      {
        method: "post",
        path: `/sales/invoices/${salesInvoiceId}/confirm`,
      },
      {
        method: "post",
        path: `/sales/invoices/${salesInvoiceId}/cancel`,
        payload: { cancellationReason: "RBAC check" },
      },
      {
        method: "patch",
        path: "/settings/rbac-test-key",
        payload: { value: "enabled" },
      },
      {
        method: "post",
        path: "/settings/cleanup-trash",
      },
    ];
    const staffAllowedCases: Array<{
      method: MutationMethod;
      path: string;
      expectedStatus: number;
      payload?: UnknownRecord;
    }> = [
      {
        method: "post",
        path: "/member-memberships",
        expectedStatus: 404,
        payload: {
          memberId: "rbac-member",
          membershipPlanId,
          ptId,
          startDate: "2026-04-01",
          paymentMethod: "CASH",
        },
      },
      {
        method: "post",
        path: "/member-memberships/rbac-membership/renew",
        expectedStatus: 404,
        payload: {
          ptId,
        },
      },
      {
        method: "post",
        path: "/member-memberships/rbac-membership/cancel",
        expectedStatus: 404,
      },
      {
        method: "post",
        path: "/inventory/import",
        expectedStatus: 201,
        payload: {
          productId,
          quantity: 1,
          unitCost: 10,
        },
      },
    ];

    await Promise.all(adminOnlyCases.map(async (adminOnlyCase) => {
      await expectMutationStatus({
        app,
        method: adminOnlyCase.method,
        path: adminOnlyCase.path,
        payload: adminOnlyCase.payload,
        expectedStatus: 401,
      });

      await expectMutationStatus({
        app,
        method: adminOnlyCase.method,
        path: adminOnlyCase.path,
        payload: adminOnlyCase.payload,
        token: staffToken,
        expectedStatus: 403,
      });
    }));

    const assertStaffAllowedCase = async (index: number): Promise<void> => {
      if (index >= staffAllowedCases.length) {
        return;
      }

      const staffAllowedCase = staffAllowedCases[index];

      await expectMutationStatus({
        app,
        method: staffAllowedCase.method,
        path: staffAllowedCase.path,
        payload: staffAllowedCase.payload,
        expectedStatus: 401,
      });

      await expectMutationStatus({
        app,
        method: staffAllowedCase.method,
        path: staffAllowedCase.path,
        payload: staffAllowedCase.payload,
        token: staffToken,
        expectedStatus: staffAllowedCase.expectedStatus,
      });

      await assertStaffAllowedCase(index + 1);
    };

    await assertStaffAllowedCase(0);
  });

  it("applies sales invariants and cancellation reason", async () => {
    await request(app.getHttpServer())
      .post(`/sales/invoices/${salesInvoiceId}/confirm`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({})
      .expect(403);

    await request(app.getHttpServer())
      .post(`/sales/invoices/${salesInvoiceId}/cancel`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ cancellationReason: "Customer request" })
      .expect(403);

    const relogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "admin", password: "password" })
      .expect(201);
    const activeAdminToken = getAccessToken(relogin);

    await request(app.getHttpServer())
      .post(`/sales/invoices/${salesInvoiceId}/confirm`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({})
      .expect(201);

    await request(app.getHttpServer())
      .post(`/sales/invoices/${salesInvoiceId}/cancel`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({ cancellationReason: "Customer request" })
      .expect(201);

    const em = orm.em.fork();
    const salesInvoice = await em.findOne(SalesInvoiceEntity, {
      id: salesInvoiceId,
    });

    expect(salesInvoice?.confirmedAt).toBeTruthy();
    expect(salesInvoice?.cancelledAt).toBeTruthy();
    expect(salesInvoice?.cancellationReason).toBe("Customer request");
  });

  it("exports reports in PDF and XLSX", async () => {
    const relogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "admin", password: "password" })
      .expect(201);
    const activeAdminToken = getAccessToken(relogin);

    const pdfResponse = await request(app.getHttpServer())
      .get("/reports/payroll/export?format=pdf")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .expect(200);

    expect(String(pdfResponse.headers["content-type"])).toContain(
      "application/pdf",
    );
    expect(Number(pdfResponse.headers["content-length"])).toBeGreaterThan(0);

    const xlsxResponse = await request(app.getHttpServer())
      .get("/reports/payroll/export?format=xlsx")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .expect(200);

    expect(String(xlsxResponse.headers["content-type"])).toContain(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    expect(Number(xlsxResponse.headers["content-length"])).toBeGreaterThan(0);
  });

  it("persists audit logs and redacts secrets", async () => {
    const em = orm.em.fork();
    const loginAuditLogs = await em.find(
      AuditLogEntity,
      { action: "AUTH_LOGIN" },
      { orderBy: { createdAt: "desc" } },
    );
    const loginAuditLog = loginAuditLogs[0];

    expect(loginAuditLog).toBeDefined();

    if (!loginAuditLog) {
      throw new Error("Missing AUTH_LOGIN audit log record");
    }

    const requestBody = expectRecord(
      loginAuditLog.requestBody,
      "auditLog.requestBody",
    );
    const responseBody = expectRecord(
      loginAuditLog.responseBody,
      "auditLog.responseBody",
    );
    const responseData = getRecordField(
      responseBody,
      "data",
      "auditLog.responseBody",
    );

    expect(getStringField(requestBody, "password", "auditLog.requestBody")).toBe(
      "[REDACTED]",
    );
    expect(
      getStringField(responseData, "accessToken", "auditLog.responseBody.data"),
    ).toBe("[REDACTED]");
    expect(
      getStringField(responseData, "refreshToken", "auditLog.responseBody.data"),
    ).toBe("[REDACTED]");

    const expenseAuditLogs = await em.find(AuditLogEntity, {
      resource: "operating_expenses",
      recordId: expenseApproveFlowId,
    });
    expect(expenseAuditLogs.length).toBeGreaterThan(0);
  });

  it("supports the new core business APIs", async () => {
    const relogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "admin", password: "password" })
      .expect(201);
    const activeAdminToken = getAccessToken(relogin);
    const createdMemberResponse = await request(app.getHttpServer())
      .post("/members")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        code: `MB-API-${Date.now()}`,
        fullName: "API Member",
        gender: "OTHER",
        birthDate: "1999-09-09",
        phone: "0911999999",
        registeredAt: "2026-04-01",
      })
      .expect(201);
    const apiMemberId = getStringField(
      getResponseDataRecord(createdMemberResponse),
      "id",
      "response.body.data",
    );
    expect(
      getStringField(
        getResponseDataRecord(createdMemberResponse),
        "gender",
        "response.body.data",
      ),
    ).toBe("OTHER");

    const membershipResponse = await request(app.getHttpServer())
      .post("/member-memberships")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        memberId: apiMemberId,
        membershipPlanId,
        ptId,
        startDate: "2026-04-01",
        paymentMethod: "CASH",
      })
      .expect(201);

    const membershipData = getResponseDataRecord(membershipResponse);
    const membership = getRecordField(
      membershipData,
      "membership",
      "response.body.data",
    );
    const membershipInvoice = getRecordField(
      membershipData,
      "invoice",
      "response.body.data",
    );
    const membershipId = getStringField(
      membership,
      "id",
      "response.body.data.membership",
    );
    expect(
      getNumberField(
        membershipInvoice,
        "totalAmount",
        "response.body.data.invoice",
      ),
    ).toBe(1_500_000);

    const assignmentResponse = await request(app.getHttpServer())
      .post("/member-assignments")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        memberId: apiMemberId,
        ptId,
        memberMembershipId: membershipId,
        assignedFrom: "2026-04-01",
      })
      .expect(201);

    expect(
      getNumberField(
        getResponseDataRecord(assignmentResponse),
        "commissionAmount",
        "response.body.data",
      ),
    ).toBe(150_000);

    const salesResponse = await request(app.getHttpServer())
      .post("/sales/invoices")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        customerName: "Gym member",
        memberId: apiMemberId,
        paymentMethod: "CASH",
        discountAmount: 10,
        items: [{ productId, quantity: 2 }],
      })
      .expect(201);

    const salesResponseData = getResponseDataRecord(salesResponse);
    expect(
      getStringField(salesResponseData, "status", "response.body.data"),
    ).toBe("DRAFT");
    expect(
      getNumberField(salesResponseData, "totalAmount", "response.body.data"),
    ).toBe(50);

    const importResponse = await request(app.getHttpServer())
      .post("/inventory/import")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        productId,
        quantity: 5,
        unitCost: 18,
      })
      .expect(201);

    expect(
      getStringField(
        getResponseDataRecord(importResponse),
        "type",
        "response.body.data",
      ),
    ).toBe("IMPORT");

    const maintenanceResponse = await request(app.getHttpServer())
      .post("/maintenance")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({})
      .expect(404);

    expect(
      getStringField(getResponseBody(maintenanceResponse), "error", "response.body"),
    ).toBe("Not Found");

    const payrollPeriodResponse = await request(app.getHttpServer())
      .post("/payroll/periods")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        code: "PP-2026-04",
        from: "2026-04-01",
        to: "2026-04-30",
      })
      .expect(201);

    const generatedResponse = await request(app.getHttpServer())
      .post("/payroll/generate")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        payrollPeriodId: getStringField(
          getResponseDataRecord(payrollPeriodResponse),
          "id",
          "response.body.data",
        ),
      })
      .expect(201);

    expect(
      getArrayField(
        getResponseDataRecord(generatedResponse),
        "entries",
        "response.body.data",
      ).length,
    ).toBeGreaterThan(0);

    const patchPtResponse = await request(app.getHttpServer())
      .post("/pts")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        code: `PT-PATCH-${Date.now()}`,
        fullName: "Temp Patch PT",
        gender: "MALE",
        birthDate: "1993-01-01",
        phone: "0900000002",
        address: "HCMC",
        status: "ACTIVE",
        specialties: ["Cardio"],
        experienceYears: 3,
        avatarUrl: "https://example.com/avatar-temp-patch.png",
        startDate: "2026-01-01",
      })
      .expect(201);

    const patchPtId = getStringField(
      getResponseDataRecord(patchPtResponse),
      "id",
      "response.body.data",
    );
    expect(
      getStringField(
        getResponseDataRecord(patchPtResponse),
        "birthDate",
        "response.body.data",
      ),
    ).toBe("1993-01-01");

    const deactivatePtResponse = await request(app.getHttpServer())
      .delete(`/pts/${patchPtId}`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .expect(200);
    expect(
      getStringField(
        getResponseDataRecord(deactivatePtResponse),
        "status",
        "response.body.data",
      ),
    ).toBe("INACTIVE");

    const ptListResponse = await request(app.getHttpServer())
      .get("/pts")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .expect(200);
    const listedPatchPt = getResponseDataArray(ptListResponse)
      .map((item, index) => expectRecord(item, `response.body.data[${index}]`))
      .find((item) => {
        const ptRecord = getRecordField(item, "pt", "response.body.data[]");

        return getStringField(ptRecord, "id", "response.body.data[].pt") === patchPtId;
      });
    expect(listedPatchPt).toBeDefined();
    expect(
      getStringField(
        getRecordField(
          expectRecord(listedPatchPt, "response.body.data[]"),
          "pt",
          "response.body.data[]",
        ),
        "status",
        "response.body.data[].pt",
      ),
    ).toBe("INACTIVE");

    const reactivatePtResponse = await request(app.getHttpServer())
      .patch(`/pts/${patchPtId}`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({ status: "ACTIVE" })
      .expect(200);
    expect(
      getStringField(
        getResponseDataRecord(reactivatePtResponse),
        "status",
        "response.body.data",
      ),
    ).toBe("ACTIVE");

    const checkInForPatchResponse = await request(app.getHttpServer())
      .post("/attendance/check-in")
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({ ptId: patchPtId })
      .expect(201);
    const patchedAttendanceId = getStringField(
      getResponseDataRecord(checkInForPatchResponse),
      "id",
      "response.body.data",
    );

    const patchedAttendanceResponse = await request(app.getHttpServer())
      .patch(`/attendance/${patchedAttendanceId}`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        checkInAt: toVietnamIsoAtHour(0, 8),
        checkOutAt: toVietnamIsoAtHour(0, 17),
        note: "Adjusted by admin",
      })
      .expect(200);

    expect(
      getStringField(
        getResponseDataRecord(patchedAttendanceResponse),
        "status",
        "response.body.data",
      ),
    ).toBe("VALID");

    const updatedMemberResponse = await request(app.getHttpServer())
      .patch(`/members/${apiMemberId}`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({
        gender: "FEMALE",
        status: "INACTIVE",
      })
      .expect(200);
    expect(
      getStringField(
        getResponseDataRecord(updatedMemberResponse),
        "gender",
        "response.body.data",
      ),
    ).toBe("FEMALE");
    expect(
      getStringField(
        getResponseDataRecord(updatedMemberResponse),
        "status",
        "response.body.data",
      ),
    ).toBe("INACTIVE");

    const reactivateMemberResponse = await request(app.getHttpServer())
      .patch(`/members/${apiMemberId}`)
      .set("Authorization", `Bearer ${activeAdminToken}`)
      .send({ status: "ACTIVE" })
      .expect(200);
    expect(
      getStringField(
        getResponseDataRecord(reactivateMemberResponse),
        "status",
        "response.body.data",
      ),
    ).toBe("ACTIVE");

    const staffPayrollLogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "staff", password: "password" })
      .expect(201);

    const payrollMeResponse = await request(app.getHttpServer())
      .get("/payroll/me")
      .set(
        "Authorization",
        `Bearer ${getAccessToken(staffPayrollLogin)}`,
      )
      .expect(200);

    expect(getResponseDataArray(payrollMeResponse).length).toBe(0);
  });
});

async function seedData(orm: MikroORM): Promise<void> {
  const em = orm.em.fork();

  const admin = em.create(UserEntity, {
    fullName: "Admin",
    username: "admin",
    role: "ADMIN",
    status: "ACTIVE",
    passwordHash: hashPassword("password"),
  });
  const staff = em.create(UserEntity, {
    fullName: "Staff",
    username: "staff",
    role: "STAFF",
    status: "ACTIVE",
    passwordHash: hashPassword("password"),
  });
  const scopedStaff = em.create(UserEntity, {
    fullName: "Scoped Staff",
    username: "staff_pt",
    role: "STAFF",
    status: "ACTIVE",
    passwordHash: hashPassword("password"),
  });

  const pt = em.create(PersonalTrainerEntity, {
    code: "PT-001",
    fullName: "PT Demo",
    gender: "MALE",
    birthDate: new Date("1995-01-01T00:00:00.000Z"),
    phone: "0900000000",
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    status: "ACTIVE",
  });
  const scopedPt = em.create(PersonalTrainerEntity, {
    code: "PT-STAFF",
    user: scopedStaff,
    fullName: "Scoped PT",
    gender: "MALE",
    birthDate: new Date("1994-01-01T00:00:00.000Z"),
    phone: "0900000009",
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    status: "ACTIVE",
  });
  const ptContract = em.create(PtContractEntity, {
    personalTrainer: pt,
    contractCode: "PTC-001",
    contractType: "Full time",
    salaryType: "MONTHLY",
    baseSalary: "400",
    minValidShiftHours: "5",
    standardShiftHours: "8",
    overtimeHourlyRate: "10",
    performanceBonusThreshold: 1,
    performanceBonusAmount: "50",
    packageCommissionRate: "0.1",
    salesCommissionRate: "0.05",
    allowances: "80",
    penaltyRules: [],
    effectiveFrom: new Date("2026-01-01T00:00:00.000Z"),
    effectiveTo: new Date("2026-12-31T00:00:00.000Z"),
  });
  const member = em.create(MemberEntity, {
    code: "MB-001",
    fullName: "Member Demo",
    gender: "FEMALE",
    birthDate: new Date("1998-01-01T00:00:00.000Z"),
    phone: "0911000000",
    registeredAt: new Date("2026-03-01T00:00:00.000Z"),
    status: "ACTIVE",
  });
  const membershipPlan = em.create(MembershipPlanEntity, {
    code: "PLAN-001",
    name: "Monthly PT",
    type: "MONTH",
    price: "1500000",
    durationDays: 30,
    includesPt: true,
    perks: ["PT sessions"],
    status: "ON_SALE",
  });
  const payrollPeriod = em.create(PayrollPeriodEntity, {
    code: "PP-2026-03",
    fromDate: new Date("2026-03-01T00:00:00.000Z"),
    toDate: new Date("2026-03-31T00:00:00.000Z"),
    status: "OPEN",
  });

  const payrollEntry = em.create(PayrollEntryEntity, {
    payrollPeriod,
    personalTrainer: pt,
    contract: ptContract,
    validShiftCredits: "10",
    paidHours: "80",
    overtimeHours: "2",
    baseSalaryAmount: "400",
    attendanceBonusAmount: "0",
    overtimeAmount: "20",
    packageCommission: "0",
    salesCommission: "0",
    performanceBonus: "0",
    allowanceAmount: "80",
    deductionAmount: "0",
    penalties: "0",
    grossPay: "500",
    netPay: "500",
    status: "PENDING_APPROVAL",
  });

  const expenseA = em.create(OperatingExpenseEntity, {
    code: "EXP-A",
    expenseDate: new Date("2026-03-15T00:00:00.000Z"),
    category: "MAINTENANCE",
    vendorName: "Vendor A",
    amount: "100",
    description: "Expense for approve/pay flow",
    status: "DRAFT",
  });

  const expenseB = em.create(OperatingExpenseEntity, {
    code: "EXP-B",
    expenseDate: new Date("2026-03-16T00:00:00.000Z"),
    category: "REPAIR",
    vendorName: "Vendor B",
    amount: "120",
    description: "Expense for reject flow",
    status: "DRAFT",
  });

  const product = em.create(ProductEntity, {
    code: "PR-001",
    name: "Whey Protein",
    category: "SUPPLEMENT",
    unitCost: "20",
    salePrice: "30",
    stockOnHand: 100,
    minimumStockLevel: 5,
    status: "ACTIVE",
  });

  const salesInvoice = em.create(SalesInvoiceEntity, {
    code: "SI-001",
    invoiceDate: new Date("2026-03-20T08:00:00.000Z"),
    createdByUser: staff,
    customerName: "Walk-in customer",
    status: "DRAFT",
    paymentMethod: "CASH",
    discountAmount: "0",
    totalAmount: "60",
    note: "Initial draft invoice",
  });

  const salesInvoiceItem = em.create(SalesInvoiceItemEntity, {
    salesInvoice,
    product,
    quantity: 2,
    unitPrice: "30",
    unitCost: "20",
    lineTotal: "60",
  });

  em.persist([
    admin,
    staff,
    scopedStaff,
    pt,
    scopedPt,
    payrollPeriod,
    payrollEntry,
    expenseA,
    expenseB,
    product,
    member,
    salesInvoice,
    salesInvoiceItem,
    ptContract,
    membershipPlan,
  ]);
  await em.flush();
}
