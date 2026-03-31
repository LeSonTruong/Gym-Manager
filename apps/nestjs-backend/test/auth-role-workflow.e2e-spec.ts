import { MikroORM } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { ValidationPipe, type INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AuditLogInterceptor } from "../src/gym-management/audit/audit-log.interceptor";
import { AuditLogService } from "../src/gym-management/audit/audit-log.service";
import { GymManagementController } from "../src/gym-management/gym-management.controller";
import { GymAuthGuard } from "../src/gym-management/auth/gym-auth.guard";
import { GymRolesGuard } from "../src/gym-management/auth/gym-roles.guard";
import {
  AuditLogEntity,
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
} from "../src/gym-management/entities/gym-management.entity";
import { GymManagementService } from "../src/gym-management/gym-management.service";
import { RedisService } from "../src/redis/redis.service";

class InMemoryRedisService {
  private readonly storage = new Map<string, string>();

  async setValue(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async getValue(key: string): Promise<string | undefined> {
    return this.storage.get(key) ?? undefined;
  }

  async deleteKey(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async setJson<T>(key: string, value: T): Promise<void> {
    this.storage.set(key, JSON.stringify(value));
  }

  async getJson<T>(key: string): Promise<T | undefined> {
    const value = this.storage.get(key);

    if (!value) {
      return undefined;
    }

    return JSON.parse(value) as T;
  }
}

describe("Auth/RBAC/Workflow (e2e + DB assertions)", () => {
  let app: INestApplication;
  let orm: MikroORM;
  let adminToken: string;
  let adminRefreshToken: string;
  let staffToken: string;
  let ptToken: string;
  let payrollPeriodId: string;
  let expenseApproveFlowId: string;
  let expenseRejectFlowId: string;
  let salesInvoiceId: string;
  let ptId: string;

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
            MemberEntity,
            MembershipPlanEntity,
            MemberMembershipEntity,
            MemberPtAssignmentEntity,
            MembershipInvoiceEntity,
            ProductEntity,
            InventoryTransactionEntity,
            SalesInvoiceEntity,
            SalesInvoiceItemEntity,
            EquipmentAssetEntity,
            OperatingExpenseEntity,
            MaintenanceRecordEntity,
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
          MemberEntity,
          MembershipPlanEntity,
          MemberMembershipEntity,
          MemberPtAssignmentEntity,
          MembershipInvoiceEntity,
          ProductEntity,
          InventoryTransactionEntity,
          SalesInvoiceEntity,
          SalesInvoiceItemEntity,
          EquipmentAssetEntity,
          OperatingExpenseEntity,
          MaintenanceRecordEntity,
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
      .send({ email: "admin@gym.local", password: "password" })
      .expect(201);

    adminToken = adminLogin.body.data.accessToken as string;
    adminRefreshToken = adminLogin.body.data.refreshToken as string;

    const staffLogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "staff@gym.local", password: "password" })
      .expect(201);

    staffToken = staffLogin.body.data.accessToken as string;

    const ptLogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "pt@gym.local", password: "password" })
      .expect(201);

    ptToken = ptLogin.body.data.accessToken as string;

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

    if (!payrollPeriod || !expenseA || !expenseB || !salesInvoice || !trainer) {
      throw new Error("Seed records were not created for e2e tests");
    }

    payrollPeriodId = payrollPeriod.id;
    expenseApproveFlowId = expenseA.id;
    expenseRejectFlowId = expenseB.id;
    salesInvoiceId = salesInvoice.id;
    ptId = trainer.id;
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

  it("enforces PT self-scope", async () => {
    await request(app.getHttpServer())
      .post("/attendance/check-in")
      .set("Authorization", `Bearer ${ptToken}`)
      .send({ ptId: "different-pt-id" })
      .expect(403);

    const response = await request(app.getHttpServer())
      .post("/attendance/check-in")
      .set("Authorization", `Bearer ${ptToken}`)
      .send({})
      .expect(201);

    expect(response.body.data.ptId).toBe(ptId);
  });

  it("applies payroll field invariants across transitions", async () => {
    const relogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "admin@gym.local", password: "password" })
      .expect(201);
    const activeAdminToken = relogin.body.data.accessToken as string;

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
    expect(payrollPeriod?.approvedByUser?.email).toBe("admin@gym.local");

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
      .send({ email: "admin@gym.local", password: "password" })
      .expect(201);
    const activeAdminToken = relogin.body.data.accessToken as string;

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
    expect(approvedExpense?.approvedByUser?.email).toBe("admin@gym.local");

    expect(rejectedExpense?.rejectedAt).toBeTruthy();
    expect(rejectedExpense?.rejectionReason).toBe("Invalid invoice attachment");
    expect(rejectedExpense?.approvedAt).toBeNull();
  });

  it("blocks workflow fields on generic expense CRUD and reopens rejected edits as draft", async () => {
    const relogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "admin@gym.local", password: "password" })
      .expect(201);
    const activeAdminToken = relogin.body.data.accessToken as string;

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

    expect(updateResponse.body.data.status).toBe("DRAFT");

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

  it("applies sales invariants and cancellation reason", async () => {
    await request(app.getHttpServer())
      .post(`/sales/invoices/${salesInvoiceId}/confirm`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({})
      .expect(201);

    await request(app.getHttpServer())
      .post(`/sales/invoices/${salesInvoiceId}/cancel`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ cancellationReason: "Customer request" })
      .expect(403);

    const relogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "admin@gym.local", password: "password" })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/sales/invoices/${salesInvoiceId}/cancel`)
      .set("Authorization", `Bearer ${relogin.body.data.accessToken as string}`)
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
      .send({ email: "admin@gym.local", password: "password" })
      .expect(201);
    const activeAdminToken = relogin.body.data.accessToken as string;

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

    const requestBody = loginAuditLog.requestBody as { password?: string };
    const responseBody = loginAuditLog.responseBody as {
      data?: { accessToken?: string; refreshToken?: string };
    };

    expect(requestBody.password).toBe("[REDACTED]");
    expect(responseBody.data?.accessToken).toBe("[REDACTED]");
    expect(responseBody.data?.refreshToken).toBe("[REDACTED]");

    const expenseAuditLogs = await em.find(AuditLogEntity, {
      resource: "operating_expenses",
      recordId: expenseApproveFlowId,
    });
    expect(expenseAuditLogs.length).toBeGreaterThan(0);
  });
});

async function seedData(orm: MikroORM): Promise<void> {
  const em = orm.em.fork();

  const admin = em.create(UserEntity, {
    fullName: "Admin",
    email: "admin@gym.local",
    role: "ADMIN",
    status: "ACTIVE",
    passwordHint: "password",
  });
  const staff = em.create(UserEntity, {
    fullName: "Staff",
    email: "staff@gym.local",
    role: "STAFF",
    status: "ACTIVE",
    passwordHint: "password",
  });
  const ptUser = em.create(UserEntity, {
    fullName: "PT User",
    email: "pt@gym.local",
    role: "PT",
    status: "ACTIVE",
    passwordHint: "password",
  });

  const pt = em.create(PersonalTrainerEntity, {
    code: "PT-001",
    fullName: "PT Demo",
    gender: "MALE",
    birthDate: new Date("1990-01-01T00:00:00.000Z"),
    phone: "0900000000",
    email: "pt@gym.local",
    address: "HCM",
    status: "ACTIVE",
    specialties: ["Strength"],
    experienceYears: 3,
    avatarUrl: "/avatar.png",
    startDate: new Date("2025-01-01T00:00:00.000Z"),
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
    validShiftCredits: "10",
    overtimeHours: "2",
    packageCommission: "0",
    salesCommission: "0",
    performanceBonus: "0",
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
    ptUser,
    pt,
    payrollPeriod,
    payrollEntry,
    expenseA,
    expenseB,
    product,
    salesInvoice,
    salesInvoiceItem,
  ]);
  await em.flush();
}
