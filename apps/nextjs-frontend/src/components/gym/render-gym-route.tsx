import process from "node:process";
import { type JSX, type ReactNode } from "react";
import { notFound } from "next/navigation";
import {
  type DemoUser,
  type GymManagementSnapshot,
} from "@next-nest-turbo-boilerplate/shared";
import {
  Badge,
  DataTable,
  KeyValueList,
  PageHeader,
  SectionCard,
  StatsGrid,
} from "./gym-ui.tsx";
import {
  cancelMembershipAction,
  checkInAttendanceAction,
  checkOutAttendanceAction,
  createAssignmentAction,
  createMaintenanceAction,
  createMembershipAction,
  createPayrollPeriodAction,
  createPtContractAction,
  createSalesInvoiceAction,
  endAssignmentAction,
  generatePayrollAction,
  importInventoryAction,
  loginAction,
  patchAttendanceAction,
  renewMembershipAction,
  updatePtContractAction,
} from "@/app/[locale]/gym-actions.ts";
import { Link } from "@/i18n/navigation.ts";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatHours,
  getContractForTrainer,
  getEquipmentName,
  getGymSnapshot,
  getMemberName,
  getPlanName,
  getProductName,
  getStatusTone,
  getTrainerName,
  humanizeStatus,
  sortEquipmentByMaintenance,
  sortMembersByDate,
  sortProductsByStock,
} from "@/lib/gym-data.ts";

function ActionLink({
  href,
  children,
}: {
  readonly href: string;
  readonly children: string;
}): JSX.Element {
  return (
    <Link
      href={href}
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
    >
      {children}
    </Link>
  );
}

type SearchParamsRecord = Record<string, string | string[] | undefined>;

type RenderGymRouteOptions = {
  readonly locale?: string;
  readonly searchParams?: SearchParamsRecord;
  readonly currentUser?: DemoUser;
  readonly ptAttendance?: GymManagementSnapshot["dataset"]["attendanceLogs"];
  readonly ptPayrollEntries?: GymManagementSnapshot["dataset"]["payrollEntries"];
};

type FieldValue = string | number | undefined;

function getLocale(options?: RenderGymRouteOptions): string {
  return options?.locale ?? "en";
}

function getSearchParam(
  searchParams: SearchParamsRecord | undefined,
  key: string,
): string | undefined {
  const value = searchParams?.[key];

  return Array.isArray(value) ? value[0] : value;
}

function canManageGym(options?: RenderGymRouteOptions): boolean {
  return (
    options?.currentUser?.role === "ADMIN" ||
    options?.currentUser?.role === "STAFF"
  );
}

function isAdmin(options?: RenderGymRouteOptions): boolean {
  return options?.currentUser?.role === "ADMIN";
}

function toDateInputValue(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  return value.slice(0, 10);
}

function FormGrid({
  children,
  columns = 2,
}: {
  readonly children: ReactNode;
  readonly columns?: 1 | 2;
}): JSX.Element {
  return (
    <div className={columns === 1 ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
      {children}
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required = false,
  min,
  step,
}: {
  readonly label: string;
  readonly name: string;
  readonly type?: string;
  readonly defaultValue?: FieldValue;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly min?: string | number;
  readonly step?: string | number;
}): JSX.Element {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}

function FormSelect({
  label,
  name,
  options,
  defaultValue,
  required = false,
}: {
  readonly label: string;
  readonly name: string;
  readonly options: Array<{ readonly label: string; readonly value: string }>;
  readonly defaultValue?: string;
  readonly required?: boolean;
}): JSX.Element {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      >
        {options.map((option) => (
          <option key={`${name}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function FormTextArea({
  label,
  name,
  defaultValue,
  placeholder,
  rows = 4,
}: {
  readonly label: string;
  readonly name: string;
  readonly defaultValue?: string;
  readonly placeholder?: string;
  readonly rows?: number;
}): JSX.Element {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}

function SubmitButton({ label }: { readonly label: string }): JSX.Element {
  return (
    <button
      type="submit"
      className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      {label}
    </button>
  );
}

function buildDashboardPage(): JSX.Element {
  const snapshot = getGymSnapshot();
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

  return (
    <>
      <PageHeader
        eyebrow="Gym operations"
        title="Dashboard overview"
        description="Tong hop doanh thu, nhan su, ton kho, payroll va cac canh bao van hanh tu bo du lieu Gym Manager."
        actions={
          <>
            <a
              href={`${backendUrl}/api/docs`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open API docs
            </a>
            <ActionLink href="/reports/profit">Profit report</ActionLink>
          </>
        }
      />

      <StatsGrid
        items={[
          {
            label: "Active members",
            value: `${snapshot.dashboard.activeMembers}/${snapshot.dashboard.totalMembers}`,
            note: "Bao gom 1 day pass, 2 monthly va 2 yearly memberships dang active.",
          },
          {
            label: "PT on roster",
            value: `${snapshot.dashboard.totalPts}`,
            note: "Tat ca PT hien dang o trang thai ACTIVE va co contract hieu luc.",
          },
          {
            label: "Monthly revenue",
            value: formatCurrency(snapshot.dashboard.revenue.monthly),
            note: `Membership ${formatCurrency(snapshot.dashboard.revenue.membership)} + services ${formatCurrency(snapshot.dashboard.revenue.services)}.`,
          },
          {
            label: "Current payroll",
            value: formatCurrency(snapshot.dashboard.totalPtPayroll),
            note: "Tong net pay cua ky luong hien tai dang review.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Revenue split"
          description="Nhom chi so nhanh cho doanh thu ngay, thang, nam va tong chi phi van hanh duoc tinh vao dashboard."
        >
          <KeyValueList
            items={[
              {
                label: "Daily revenue",
                value: formatCurrency(snapshot.dashboard.revenue.daily),
              },
              {
                label: "Yearly revenue",
                value: formatCurrency(snapshot.dashboard.revenue.yearly),
              },
              {
                label: "Operating expense",
                value: formatCurrency(snapshot.dashboard.totalOperatingExpense),
              },
              {
                label: "Net profit",
                value: formatCurrency(snapshot.profitReport.netProfit),
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          title="Low stock alerts"
          description="Cac san pham can uu tien restock trong ngay."
        >
          <DataTable
            headers={["Product", "Stock", "Threshold", "Status"]}
            rows={sortProductsByStock(snapshot.dashboard.lowStockProducts).map(
              (product) => [
                product.name,
                `${product.stockOnHand} units`,
                `${product.minimumStockLevel} units`,
                <Badge key={product.id} tone="amber">
                  Restock now
                </Badge>,
              ],
            )}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Maintenance alerts"
          description="Thiet bi can bao tri hoac thay the som."
        >
          <DataTable
            headers={["Equipment", "Condition", "Next maintenance", "Action"]}
            rows={sortEquipmentByMaintenance(
              snapshot.dashboard.maintenanceAlerts,
            ).map((equipmentAsset) => [
              equipmentAsset.name,
              <Badge
                key={equipmentAsset.id}
                tone={getStatusTone(equipmentAsset.condition)}
              >
                {humanizeStatus(equipmentAsset.condition)}
              </Badge>,
              formatDate(equipmentAsset.nextMaintenanceAt),
              <ActionLink
                key={`${equipmentAsset.id}-action`}
                href={`/equipment/${equipmentAsset.id}`}
              >
                Open asset
              </ActionLink>,
            ])}
          />
        </SectionCard>

        <SectionCard
          title="Top selling products"
          description="San pham dang tao doanh so cao nhat trong ky hien tai."
        >
          <DataTable
            headers={["Product", "Sold qty", "Current stock"]}
            rows={snapshot.inventoryOverview.topSellingProducts.map((entry) => [
              entry.product.name,
              `${entry.soldQuantity} units`,
              `${entry.product.stockOnHand} units`,
            ])}
          />
        </SectionCard>
      </div>
    </>
  );
}

function buildPtsPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="PT management"
        title="Personal trainers"
        description="Danh sach PT, tai trong member, cong cham cong va payroll tam tinh cua Gym Manager."
        actions={
          <ActionLink href="/pts/attendance">Open attendance</ActionLink>
        }
      />

      <StatsGrid
        items={[
          {
            label: "Assigned members",
            value: `${snapshot.ptOverview.reduce((total, item) => total + item.activeMembers, 0)}`,
            note: "Tong so member dang co PT active assignment.",
          },
          {
            label: "Shift credits",
            value: `${snapshot.ptOverview.reduce((total, item) => total + item.validShiftCredits, 0)}`,
            note: "Tong cong VALID/HALF quy doi trong dataset.",
          },
          {
            label: "Overtime",
            value: formatHours(
              snapshot.ptOverview.reduce(
                (total, item) => total + item.overtimeHours,
                0,
              ),
            ),
            note: "Tong gio tang ca duoc lay tu attendance logs.",
          },
          {
            label: "Estimated payroll",
            value: formatCurrency(
              snapshot.ptOverview.reduce(
                (total, item) => total + item.estimatedPayroll,
                0,
              ),
            ),
            note: "Tong net pay ky gan nhat cua tat ca PT.",
          },
        ]}
      />

      <SectionCard
        title="PT roster"
        description="Mo tung profile de xem contract, attendance va payroll chi tiet."
      >
        <DataTable
          headers={[
            "PT",
            "Specialties",
            "Active members",
            "Shift credits",
            "Overtime",
            "Net pay",
            "Detail",
          ]}
          rows={snapshot.ptOverview.map((item) => [
            <div key={item.pt.id}>
              <p className="font-semibold text-slate-900">{item.pt.fullName}</p>
              <p className="text-xs text-slate-500">{item.pt.code}</p>
            </div>,
            item.pt.specialties.join(", "),
            `${item.activeMembers}`,
            `${item.validShiftCredits}`,
            formatHours(item.overtimeHours),
            formatCurrency(item.estimatedPayroll),
            <div key={`${item.pt.id}-links`} className="flex gap-2">
              <ActionLink href={`/pts/${item.pt.id}`}>Profile</ActionLink>
              <ActionLink href={`/pts/${item.pt.id}/contracts`}>
                Contract
              </ActionLink>
            </div>,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildPtDetailPage(ptId: string): JSX.Element {
  const snapshot = getGymSnapshot();
  const ptOverview = snapshot.ptOverview.find((item) => item.pt.id === ptId);

  if (!ptOverview) {
    notFound();
  }

  const attendanceLogs = snapshot.dataset.attendanceLogs.filter(
    (attendanceLog) => attendanceLog.ptId === ptId,
  );
  const payrollEntries = snapshot.dataset.payrollEntries.filter(
    (entry) => entry.ptId === ptId,
  );
  const assignedMembers = snapshot.dataset.memberPtAssignments
    .filter((assignment) => assignment.ptId === ptId)
    .map((assignment) =>
      snapshot.dataset.members.find(
        (member) => member.id === assignment.memberId,
      ),
    )
    .filter(
      (member): member is (typeof snapshot.dataset.members)[number] =>
        member !== undefined,
    );

  return (
    <>
      <PageHeader
        eyebrow="PT profile"
        title={ptOverview.pt.fullName}
        description={`${ptOverview.pt.code} | ${ptOverview.pt.specialties.join(", ")} | Started ${formatDate(ptOverview.pt.startDate)}`}
        actions={
          <ActionLink href={`/pts/${ptId}/contracts`}>View contract</ActionLink>
        }
      />

      <StatsGrid
        items={[
          {
            label: "Active members",
            value: `${ptOverview.activeMembers}`,
            note: "Member assignments dang mo.",
          },
          {
            label: "Shift credits",
            value: `${ptOverview.validShiftCredits}`,
            note: "Cong VALID/HALF trong ky.",
          },
          {
            label: "Overtime",
            value: formatHours(ptOverview.overtimeHours),
            note: "Tong gio tang ca.",
          },
          {
            label: "Latest payroll",
            value: formatCurrency(ptOverview.estimatedPayroll),
            note: "Net pay ky gan nhat.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Profile summary">
          <KeyValueList
            items={[
              { label: "Email", value: ptOverview.pt.email },
              { label: "Phone", value: ptOverview.pt.phone },
              { label: "Address", value: ptOverview.pt.address },
              {
                label: "Experience",
                value: `${ptOverview.pt.experienceYears} years`,
              },
              {
                label: "Status",
                value: (
                  <Badge tone={getStatusTone(ptOverview.pt.status)}>
                    {ptOverview.pt.status}
                  </Badge>
                ),
              },
              {
                label: "Contract type",
                value: ptOverview.contract?.contractType ?? "No contract",
              },
            ]}
          />
        </SectionCard>

        <SectionCard title="Assigned members">
          <DataTable
            headers={["Member", "Status", "Joined", "Detail"]}
            rows={assignedMembers.map((member) => [
              member.fullName,
              <Badge key={member.id} tone={getStatusTone(member.status)}>
                {member.status}
              </Badge>,
              formatDate(member.registeredAt),
              <ActionLink
                key={`${member.id}-detail`}
                href={`/members/${member.id}`}
              >
                Open member
              </ActionLink>,
            ])}
          />
        </SectionCard>
      </div>

      <SectionCard title="Attendance timeline">
        <DataTable
          headers={[
            "Date",
            "Check in",
            "Check out",
            "Worked",
            "Overtime",
            "Status",
          ]}
          rows={attendanceLogs.map((attendanceLog) => [
            attendanceLog.attendanceDate,
            formatDateTime(attendanceLog.checkInAt),
            attendanceLog.checkOutAt
              ? formatDateTime(attendanceLog.checkOutAt)
              : "Open",
            formatHours(attendanceLog.workedHours),
            formatHours(attendanceLog.overtimeHours),
            <Badge
              key={attendanceLog.id}
              tone={getStatusTone(attendanceLog.status)}
            >
              {attendanceLog.status}
            </Badge>,
          ])}
        />
      </SectionCard>

      <SectionCard title="Payroll history">
        <DataTable
          headers={[
            "Period",
            "Shift credits",
            "Overtime",
            "Package commission",
            "Net pay",
            "Status",
          ]}
          rows={payrollEntries.map((entry) => [
            snapshot.dataset.payrollPeriods.find(
              (period) => period.id === entry.payrollPeriodId,
            )?.code ?? entry.payrollPeriodId,
            `${entry.validShiftCredits}`,
            formatHours(entry.overtimeHours),
            formatCurrency(entry.packageCommission),
            formatCurrency(entry.netPay),
            <Badge key={entry.id} tone={getStatusTone(entry.status)}>
              {humanizeStatus(entry.status)}
            </Badge>,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildPtContractsPage(
  ptId: string,
  options?: RenderGymRouteOptions,
): JSX.Element {
  const snapshot = getGymSnapshot();
  const trainer = snapshot.dataset.personalTrainers.find(
    (item) => item.id === ptId,
  );
  const contract = getContractForTrainer(snapshot, ptId);
  const locale = getLocale(options);

  if (!trainer || !contract) {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow="PT contract"
        title={`${trainer.fullName} contract`}
        description="Cau hinh luong, overtime, commission va performance bonus dang duoc ap dung."
        actions={<ActionLink href={`/pts/${ptId}`}>Back to profile</ActionLink>}
      />

      <SectionCard title="Contract settings">
        <KeyValueList
          items={[
            { label: "Salary type", value: contract.salaryType },
            {
              label: "Base salary",
              value: formatCurrency(contract.baseSalary),
            },
            {
              label: "Min valid shift",
              value: formatHours(contract.minValidShiftHours),
            },
            {
              label: "Standard shift",
              value: formatHours(contract.standardShiftHours),
            },
            {
              label: "Overtime rate",
              value: `${formatCurrency(contract.overtimeHourlyRate)} / hour`,
            },
            {
              label: "Package commission",
              value: `${contract.packageCommissionRate * 100}%`,
            },
            {
              label: "Sales commission",
              value: `${contract.salesCommissionRate * 100}%`,
            },
            {
              label: "Performance bonus",
              value: `${formatCurrency(contract.performanceBonusAmount)} at ${contract.performanceBonusThreshold} active members`,
            },
            { label: "Allowances", value: formatCurrency(contract.allowances) },
            {
              label: "Effective",
              value: `${formatDate(contract.effectiveFrom)} - ${contract.effectiveTo ? formatDate(contract.effectiveTo) : "Open ended"}`,
            },
          ]}
        />
      </SectionCard>

      {isAdmin(options) ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <SectionCard
            title="Update active contract"
            description="Chinh sua directly contract dang ap dung cho PT nay."
          >
            <form action={updatePtContractAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="ptId" value={ptId} />
              <input type="hidden" name="contractId" value={contract.id} />
              <FormGrid>
                <FormField
                  label="Contract code"
                  name="contractCode"
                  defaultValue={contract.contractCode}
                />
                <FormField
                  label="Contract type"
                  name="contractType"
                  defaultValue={contract.contractType}
                  required
                />
                <FormField
                  label="Salary type"
                  name="salaryType"
                  defaultValue={contract.salaryType}
                  required
                />
                <FormField
                  label="Base salary"
                  name="baseSalary"
                  type="number"
                  defaultValue={contract.baseSalary}
                  step="1000"
                  required
                />
                <FormField
                  label="Min valid shift hours"
                  name="minValidShiftHours"
                  type="number"
                  defaultValue={contract.minValidShiftHours}
                  step="0.5"
                  required
                />
                <FormField
                  label="Standard shift hours"
                  name="standardShiftHours"
                  type="number"
                  defaultValue={contract.standardShiftHours}
                  step="0.5"
                  required
                />
                <FormField
                  label="Overtime hourly rate"
                  name="overtimeHourlyRate"
                  type="number"
                  defaultValue={contract.overtimeHourlyRate}
                  step="1000"
                  required
                />
                <FormField
                  label="Performance threshold"
                  name="performanceBonusThreshold"
                  type="number"
                  defaultValue={contract.performanceBonusThreshold}
                  required
                />
                <FormField
                  label="Performance bonus"
                  name="performanceBonusAmount"
                  type="number"
                  defaultValue={contract.performanceBonusAmount}
                  step="1000"
                  required
                />
                <FormField
                  label="Package commission rate"
                  name="packageCommissionRate"
                  type="number"
                  defaultValue={contract.packageCommissionRate}
                  step="0.01"
                  required
                />
                <FormField
                  label="Sales commission rate"
                  name="salesCommissionRate"
                  type="number"
                  defaultValue={contract.salesCommissionRate}
                  step="0.01"
                  required
                />
                <FormField
                  label="Allowances"
                  name="allowances"
                  type="number"
                  defaultValue={contract.allowances}
                  step="1000"
                  required
                />
                <FormField
                  label="Effective from"
                  name="effectiveFrom"
                  type="date"
                  defaultValue={toDateInputValue(contract.effectiveFrom)}
                  required
                />
                <FormField
                  label="Effective to"
                  name="effectiveTo"
                  type="date"
                  defaultValue={toDateInputValue(contract.effectiveTo)}
                />
              </FormGrid>
              <FormTextArea
                label="Penalty rules"
                name="penaltyRules"
                defaultValue={contract.penaltyRules.join("\n")}
                placeholder="One rule per line"
              />
              <SubmitButton label="Update contract" />
            </form>
          </SectionCard>

          <SectionCard
            title="Issue next contract"
            description="Tao contract moi cho dot luong tiep theo cua PT."
          >
            <form action={createPtContractAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="ptId" value={ptId} />
              <FormGrid>
                <FormField
                  label="Contract code"
                  name="contractCode"
                  placeholder="PTC-2026-APR"
                />
                <FormField
                  label="Contract type"
                  name="contractType"
                  defaultValue={contract.contractType}
                  required
                />
                <FormField
                  label="Salary type"
                  name="salaryType"
                  defaultValue={contract.salaryType}
                  required
                />
                <FormField
                  label="Base salary"
                  name="baseSalary"
                  type="number"
                  defaultValue={contract.baseSalary}
                  step="1000"
                  required
                />
                <FormField
                  label="Min valid shift hours"
                  name="minValidShiftHours"
                  type="number"
                  defaultValue={contract.minValidShiftHours}
                  step="0.5"
                  required
                />
                <FormField
                  label="Standard shift hours"
                  name="standardShiftHours"
                  type="number"
                  defaultValue={contract.standardShiftHours}
                  step="0.5"
                  required
                />
                <FormField
                  label="Overtime hourly rate"
                  name="overtimeHourlyRate"
                  type="number"
                  defaultValue={contract.overtimeHourlyRate}
                  step="1000"
                  required
                />
                <FormField
                  label="Performance threshold"
                  name="performanceBonusThreshold"
                  type="number"
                  defaultValue={contract.performanceBonusThreshold}
                  required
                />
                <FormField
                  label="Performance bonus"
                  name="performanceBonusAmount"
                  type="number"
                  defaultValue={contract.performanceBonusAmount}
                  step="1000"
                  required
                />
                <FormField
                  label="Package commission rate"
                  name="packageCommissionRate"
                  type="number"
                  defaultValue={contract.packageCommissionRate}
                  step="0.01"
                  required
                />
                <FormField
                  label="Sales commission rate"
                  name="salesCommissionRate"
                  type="number"
                  defaultValue={contract.salesCommissionRate}
                  step="0.01"
                  required
                />
                <FormField
                  label="Allowances"
                  name="allowances"
                  type="number"
                  defaultValue={contract.allowances}
                  step="1000"
                  required
                />
                <FormField
                  label="Effective from"
                  name="effectiveFrom"
                  type="date"
                  defaultValue={toDateInputValue(contract.effectiveTo)}
                  required
                />
                <FormField
                  label="Effective to"
                  name="effectiveTo"
                  type="date"
                />
              </FormGrid>
              <FormTextArea
                label="Penalty rules"
                name="penaltyRules"
                defaultValue={contract.penaltyRules.join("\n")}
                placeholder="One rule per line"
              />
              <p className="text-sm leading-6 text-slate-500">
                Neu contract hien tai van open-ended, hay cap nhat `effective to`
                truoc khi tao contract moi de tranh overlap.
              </p>
              <SubmitButton label="Create next contract" />
            </form>
          </SectionCard>
        </div>
      ) : null}
    </>
  );
}

function buildAttendancePage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);

  return (
    <>
      <PageHeader
        eyebrow="PT attendance"
        title="Attendance logs"
        description="Tat ca check-in/check-out duoc phan loai VALID, HALF hoac INVALID de tinh payroll."
      />

      <StatsGrid
        items={[
          {
            label: "VALID shifts",
            value: `${snapshot.dataset.attendanceLogs.filter((attendanceLog) => attendanceLog.status === "VALID").length}`,
            note: "Ca du gio chuan va duoc tinh full credit.",
          },
          {
            label: "HALF shifts",
            value: `${snapshot.dataset.attendanceLogs.filter((attendanceLog) => attendanceLog.status === "HALF").length}`,
            note: "Ca duoi chuan nhung van tinh nua cong theo setting.",
          },
          {
            label: "Overtime",
            value: formatHours(
              snapshot.dataset.attendanceLogs.reduce(
                (total, attendanceLog) => total + attendanceLog.overtimeHours,
                0,
              ),
            ),
            note: "Tong gio vuot standard shift.",
          },
          {
            label: "Work credits",
            value: `${snapshot.dataset.attendanceLogs.reduce((total, attendanceLog) => total + attendanceLog.workCredit, 0)}`,
            note: "Tong cong quy doi trong ky.",
          },
        ]}
      />

      <SectionCard title="Attendance table">
        <DataTable
          headers={[
            "PT",
            "Date",
            "Check in",
            "Check out",
            "Worked",
            "Overtime",
            "Status",
          ]}
          rows={snapshot.dataset.attendanceLogs.map((attendanceLog) => [
            getTrainerName(snapshot, attendanceLog.ptId),
            attendanceLog.attendanceDate,
            formatDateTime(attendanceLog.checkInAt),
            attendanceLog.checkOutAt
              ? formatDateTime(attendanceLog.checkOutAt)
              : "Open",
            formatHours(attendanceLog.workedHours),
            formatHours(attendanceLog.overtimeHours),
            <Badge
              key={attendanceLog.id}
              tone={getStatusTone(attendanceLog.status)}
            >
              {attendanceLog.status}
            </Badge>,
          ])}
        />
      </SectionCard>

      {canManageGym(options) ? (
        <SectionCard
          title="Manual correction"
          description="Admin va Staff co the chinh lai moc check-in/check-out cho cac ca da ghi."
        >
          <form action={patchAttendanceAction} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <FormGrid>
              <FormSelect
                label="Attendance log"
                name="attendanceLogId"
                required
                options={snapshot.dataset.attendanceLogs.map((attendanceLog) => ({
                  value: attendanceLog.id,
                  label: `${getTrainerName(snapshot, attendanceLog.ptId)} | ${attendanceLog.attendanceDate} | ${attendanceLog.status}`,
                }))}
              />
              <FormField
                label="Check in"
                name="checkInAt"
                type="datetime-local"
              />
              <FormField
                label="Check out"
                name="checkOutAt"
                type="datetime-local"
              />
            </FormGrid>
            <FormTextArea
              label="Note"
              name="note"
              placeholder="Explain why this correction was made"
              rows={3}
            />
            <SubmitButton label="Patch attendance" />
          </form>
        </SectionCard>
      ) : null}
    </>
  );
}

function buildPtSelfAttendancePage(
  options?: RenderGymRouteOptions,
): JSX.Element {
  const attendanceLogs = options?.ptAttendance ?? [];
  const locale = getLocale(options);
  const openShift = attendanceLogs.find((attendanceLog) => !attendanceLog.checkOutAt);

  return (
    <>
      <PageHeader
        eyebrow="PT attendance"
        title="My attendance"
        description="Cham cong duoc scope theo session hien tai. Ban co the check-in, check-out va xem lich su ca lam cua minh."
        actions={<ActionLink href="/payroll">Open payroll</ActionLink>}
      />

      <StatsGrid
        items={[
          {
            label: "Open shift",
            value: openShift ? "1 shift" : "No open shift",
            note: openShift
              ? `Started at ${formatDateTime(openShift.checkInAt)}`
              : "Ban co the bat dau ca moi ngay tai day.",
          },
          {
            label: "Completed shifts",
            value: `${attendanceLogs.filter((attendanceLog) => attendanceLog.checkOutAt).length}`,
            note: "Tong so ca da dong trong lich su session nay.",
          },
          {
            label: "Paid hours",
            value: formatHours(
              attendanceLogs.reduce(
                (total, attendanceLog) => total + (attendanceLog.paidHours ?? attendanceLog.workedHours),
                0,
              ),
            ),
            note: "Tong gio duoc tinh luong sau khi ap quy tac valid/half shift.",
          },
          {
            label: "Overtime",
            value: formatHours(
              attendanceLogs.reduce(
                (total, attendanceLog) => total + attendanceLog.overtimeHours,
                0,
              ),
            ),
            note: "Tong gio tang ca da duoc ghi nhan.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionCard
          title="Attendance actions"
          description="Su dung thao tac nay de dong/mo ca thay vi ghi nhap thu cong."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <form action={checkInAttendanceAction} className="space-y-4 rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4">
              <input type="hidden" name="locale" value={locale} />
              <FormField
                label="Check in time"
                name="checkInAt"
                type="datetime-local"
              />
              <SubmitButton label="Check in" />
            </form>

            <form action={checkOutAttendanceAction} className="space-y-4 rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4">
              <input type="hidden" name="locale" value={locale} />
              {openShift ? (
                <input type="hidden" name="attendanceLogId" value={openShift.id} />
              ) : null}
              <FormField
                label="Check out time"
                name="checkOutAt"
                type="datetime-local"
              />
              <SubmitButton label="Check out" />
            </form>
          </div>
        </SectionCard>

        <SectionCard title="My attendance log">
          <DataTable
            headers={[
              "Date",
              "Check in",
              "Check out",
              "Paid",
              "Overtime",
              "Status",
            ]}
            rows={attendanceLogs.map((attendanceLog) => [
              attendanceLog.attendanceDate,
              formatDateTime(attendanceLog.checkInAt),
              attendanceLog.checkOutAt
                ? formatDateTime(attendanceLog.checkOutAt)
                : "Open",
              formatHours(attendanceLog.paidHours ?? attendanceLog.workedHours),
              formatHours(attendanceLog.overtimeHours),
              <Badge
                key={attendanceLog.id}
                tone={getStatusTone(attendanceLog.status)}
              >
                {humanizeStatus(attendanceLog.status)}
              </Badge>,
            ])}
          />
        </SectionCard>
      </div>
    </>
  );
}

function buildPayrollPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);

  return (
    <>
      <PageHeader
        eyebrow="Payroll"
        title="Payroll periods"
        description="Tong quan cac ky luong PT va phan bo net pay theo tung PT."
      />

      <StatsGrid
        items={[
          {
            label: "Total payroll",
            value: formatCurrency(snapshot.payrollReport.totalPayroll),
            note: "Tong net pay tat ca ky.",
          },
          {
            label: "Approved payroll",
            value: formatCurrency(snapshot.payrollReport.approvedPayroll),
            note: "Bao gom APPROVED va PAID.",
          },
          {
            label: "Pending payroll",
            value: formatCurrency(snapshot.payrollReport.pendingPayroll),
            note: "Net pay dang cho review.",
          },
          {
            label: "Periods",
            value: `${snapshot.dataset.payrollPeriods.length}`,
            note: "So ky luong co san trong demo dataset.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionCard title="Payroll periods">
          <DataTable
            headers={["Code", "Range", "Status", "Detail"]}
            rows={snapshot.dataset.payrollPeriods.map((period) => [
              period.code,
              `${formatDate(period.from)} - ${formatDate(period.to)}`,
              <Badge key={period.id} tone={getStatusTone(period.status)}>
                {humanizeStatus(period.status)}
              </Badge>,
              <ActionLink
                key={`${period.id}-detail`}
                href={`/payroll/${period.id}`}
              >
                Open period
              </ActionLink>,
            ])}
          />
        </SectionCard>

        <SectionCard title="Payroll by trainer">
          <DataTable
            headers={["PT", "Period", "Net pay", "Status"]}
            rows={snapshot.payrollReport.byTrainer.map((item) => [
              item.ptName,
              item.payrollPeriodCode,
              formatCurrency(item.netPay),
              <Badge
                key={`${item.ptId}-${item.payrollPeriodId}`}
                tone={getStatusTone(item.status)}
              >
                {humanizeStatus(item.status)}
              </Badge>,
            ])}
          />
        </SectionCard>
      </div>

      {isAdmin(options) ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <SectionCard
            title="Create payroll period"
            description="Tao ky luong moi truoc khi chay generate payroll."
          >
            <form action={createPayrollPeriodAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <FormGrid>
                <FormField
                  label="Code"
                  name="code"
                  placeholder="2026-04-A"
                />
                <FormField label="From" name="from" type="date" required />
                <FormField label="To" name="to" type="date" required />
              </FormGrid>
              <SubmitButton label="Create period" />
            </form>
          </SectionCard>

          <SectionCard
            title="Generate payroll"
            description="Tinh lai payroll entries cho mot ky da tao."
          >
            <form action={generatePayrollAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <FormSelect
                label="Payroll period"
                name="payrollPeriodId"
                required
                options={snapshot.dataset.payrollPeriods.map((period) => ({
                  value: period.id,
                  label: `${period.code} | ${formatDate(period.from)} - ${formatDate(period.to)} | ${humanizeStatus(period.status)}`,
                }))}
              />
              <SubmitButton label="Generate payroll" />
            </form>
          </SectionCard>
        </div>
      ) : null}
    </>
  );
}

function buildPtSelfPayrollPage(options?: RenderGymRouteOptions): JSX.Element {
  const payrollEntries = options?.ptPayrollEntries ?? [];

  return (
    <>
      <PageHeader
        eyebrow="PT payroll"
        title="My payroll"
        description="Danh sach payroll entry da scope theo tai khoan PT hien tai."
        actions={<ActionLink href="/pts/attendance">Open attendance</ActionLink>}
      />

      <StatsGrid
        items={[
          {
            label: "Entries",
            value: `${payrollEntries.length}`,
            note: "Tong so dong payroll da duoc tao cho PT nay.",
          },
          {
            label: "Approved or paid",
            value: formatCurrency(
              payrollEntries
                .filter((entry) => entry.status === "APPROVED" || entry.status === "PAID")
                .reduce((total, entry) => total + entry.netPay, 0),
            ),
            note: "So tien da duoc duyet hoac da thanh toan.",
          },
          {
            label: "Pending",
            value: formatCurrency(
              payrollEntries
                .filter((entry) => entry.status === "PENDING_APPROVAL")
                .reduce((total, entry) => total + entry.netPay, 0),
            ),
            note: "Net pay dang cho review hoac generate lai.",
          },
          {
            label: "Paid hours",
            value: formatHours(
              payrollEntries.reduce(
                (total, entry) => total + (entry.paidHours ?? 0),
                0,
              ),
            ),
            note: "Tong gio da dua vao bang luong.",
          },
        ]}
      />

      <SectionCard title="My payroll entries">
        <DataTable
          headers={[
            "Period ref",
            "Paid hours",
            "Base",
            "Package commission",
            "Sales commission",
            "Net pay",
            "Status",
          ]}
          rows={payrollEntries.map((entry) => [
            entry.payrollPeriodId,
            formatHours(entry.paidHours ?? 0),
            formatCurrency(entry.baseSalaryAmount ?? 0),
            formatCurrency(entry.packageCommission),
            formatCurrency(entry.salesCommission),
            formatCurrency(entry.netPay),
            <Badge key={entry.id} tone={getStatusTone(entry.status)}>
              {humanizeStatus(entry.status)}
            </Badge>,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildPayrollPeriodPage(periodId: string): JSX.Element {
  const snapshot = getGymSnapshot();
  const period = snapshot.dataset.payrollPeriods.find(
    (item) => item.id === periodId,
  );

  if (!period) {
    notFound();
  }

  const entries = snapshot.dataset.payrollEntries.filter(
    (entry) => entry.payrollPeriodId === periodId,
  );

  return (
    <>
      <PageHeader
        eyebrow="Payroll detail"
        title={`Payroll period ${period.code}`}
        description={`${formatDate(period.from)} - ${formatDate(period.to)} | ${humanizeStatus(period.status)}`}
        actions={<ActionLink href="/payroll">Back to payroll</ActionLink>}
      />

      <SectionCard title="Entries in period">
        <DataTable
          headers={[
            "PT",
            "Shift credits",
            "Overtime",
            "Package commission",
            "Sales commission",
            "Net pay",
            "Status",
          ]}
          rows={entries.map((entry) => [
            getTrainerName(snapshot, entry.ptId),
            `${entry.validShiftCredits}`,
            formatHours(entry.overtimeHours),
            formatCurrency(entry.packageCommission),
            formatCurrency(entry.salesCommission),
            formatCurrency(entry.netPay),
            <Badge key={entry.id} tone={getStatusTone(entry.status)}>
              {humanizeStatus(entry.status)}
            </Badge>,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildMembersPage(): JSX.Element {
  const snapshot = getGymSnapshot();
  const membersWithPt = snapshot.memberOverview.filter(
    (item) => item.trainer !== undefined,
  ).length;

  return (
    <>
      <PageHeader
        eyebrow="Member management"
        title="Members"
        description="Danh sach member, membership active va PT phu trach hien tai."
        actions={
          <ActionLink href="/members/memberships">
            Open sold memberships
          </ActionLink>
        }
      />

      <StatsGrid
        items={[
          {
            label: "Total members",
            value: `${snapshot.dataset.members.length}`,
            note: "Bao gom ca active va inactive.",
          },
          {
            label: "Members with PT",
            value: `${membersWithPt}`,
            note: "Duoc tinh tu ACTIVE assignments.",
          },
          {
            label: "Active yearly plans",
            value: `${snapshot.dashboard.activeMemberships.YEAR}`,
            note: "Nhom premium membership co PT kem theo.",
          },
          {
            label: "Membership revenue",
            value: formatCurrency(snapshot.revenueReport.membershipRevenue),
            note: "Tong thu membership invoices da confirm.",
          },
        ]}
      />

      <SectionCard title="Member roster">
        <DataTable
          headers={[
            "Member",
            "Current plan",
            "Assigned PT",
            "Membership spend",
            "Service spend",
            "Detail",
          ]}
          rows={sortMembersByDate(snapshot.dataset.members).map((member) => {
            const overview = snapshot.memberOverview.find(
              (item) => item.member.id === member.id,
            );

            return [
              <div key={member.id}>
                <p className="font-semibold text-slate-900">
                  {member.fullName}
                </p>
                <p className="text-xs text-slate-500">{member.code}</p>
              </div>,
              overview?.membershipPlan?.name ?? "No active plan",
              overview?.trainer?.fullName ?? "Chua gan",
              formatCurrency(overview?.totalMembershipSpend ?? 0),
              formatCurrency(overview?.totalServiceSpend ?? 0),
              <ActionLink
                key={`${member.id}-detail`}
                href={`/members/${member.id}`}
              >
                Open member
              </ActionLink>,
            ];
          })}
        />
      </SectionCard>
    </>
  );
}

function buildMemberDetailPage(memberId: string): JSX.Element {
  const snapshot = getGymSnapshot();
  const member = snapshot.dataset.members.find((item) => item.id === memberId);

  if (!member) {
    notFound();
  }

  const memberships = snapshot.dataset.memberMemberships.filter(
    (membership) => membership.memberId === memberId,
  );
  const ptAssignments = snapshot.dataset.memberPtAssignments.filter(
    (assignment) => assignment.memberId === memberId,
  );
  const membershipInvoices = snapshot.dataset.membershipInvoices.filter(
    (invoice) => invoice.memberId === memberId,
  );
  const salesInvoices = snapshot.dataset.salesInvoices.filter(
    (invoice) => invoice.memberId === memberId,
  );

  return (
    <>
      <PageHeader
        eyebrow="Member detail"
        title={member.fullName}
        description={`${member.goal} | Registered ${formatDate(member.registeredAt)}`}
        actions={<ActionLink href="/members">Back to members</ActionLink>}
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Profile summary">
          <KeyValueList
            items={[
              { label: "Phone", value: member.phone },
              { label: "Email", value: member.email },
              { label: "Address", value: member.address },
              {
                label: "Body profile",
                value: `${member.heightCm} cm | ${member.weightKg} kg`,
              },
              { label: "Health notes", value: member.healthNotes },
              {
                label: "Status",
                value: (
                  <Badge tone={getStatusTone(member.status)}>
                    {member.status}
                  </Badge>
                ),
              },
            ]}
          />
        </SectionCard>

        <SectionCard title="Membership history">
          <DataTable
            headers={[
              "Plan",
              "Start",
              "End",
              "Remaining PT sessions",
              "Status",
            ]}
            rows={memberships.map((membership) => [
              getPlanName(snapshot, membership.membershipPlanId),
              formatDate(membership.startDate),
              formatDate(membership.endDate),
              membership.remainingSessions === null
                ? "Unlimited"
                : `${membership.remainingSessions}`,
              <Badge
                key={membership.id}
                tone={getStatusTone(membership.status)}
              >
                {humanizeStatus(membership.status)}
              </Badge>,
            ])}
          />
        </SectionCard>
      </div>

      <SectionCard title="PT assignments">
        <DataTable
          headers={["PT", "From", "To", "Commission", "Status"]}
          rows={ptAssignments.map((assignment) => [
            getTrainerName(snapshot, assignment.ptId),
            formatDate(assignment.assignedFrom),
            assignment.assignedTo
              ? formatDate(assignment.assignedTo)
              : "Active now",
            formatCurrency(assignment.commissionAmount),
            <Badge key={assignment.id} tone={getStatusTone(assignment.status)}>
              {humanizeStatus(assignment.status)}
            </Badge>,
          ])}
        />
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Membership invoices">
          <DataTable
            headers={["Code", "Date", "Amount", "Payment"]}
            rows={membershipInvoices.map((invoice) => [
              invoice.code,
              formatDateTime(invoice.invoiceDate),
              formatCurrency(invoice.totalAmount),
              invoice.paymentMethod,
            ])}
          />
        </SectionCard>

        <SectionCard title="Service invoices">
          <DataTable
            headers={["Code", "Date", "Total", "Status"]}
            rows={salesInvoices.map((invoice) => [
              invoice.code,
              formatDateTime(invoice.invoiceDate),
              formatCurrency(invoice.totalAmount),
              <Badge key={invoice.id} tone={getStatusTone(invoice.status)}>
                {humanizeStatus(invoice.status)}
              </Badge>,
            ])}
          />
        </SectionCard>
      </div>
    </>
  );
}

function buildMembershipOverviewPage(
  options?: RenderGymRouteOptions,
): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);
  const manageableMemberships = snapshot.dataset.memberMemberships.filter(
    (membership) => membership.status !== "CANCELLED",
  );
  const activeAssignments = snapshot.dataset.memberPtAssignments.filter(
    (assignment) => assignment.status === "ACTIVE",
  );

  return (
    <>
      <PageHeader
        eyebrow="Membership lifecycle"
        title="Sold memberships"
        description="Nguon su that cho goi tap da ban, PT assignments va membership invoice confirmations."
      />

      {canManageGym(options) ? (
        <>
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <SectionCard
              title="Sell new membership"
              description="Ban goi tap moi va tao membership invoice confirm ngay."
            >
              <form action={createMembershipAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormGrid>
                  <FormSelect
                    label="Member"
                    name="memberId"
                    required
                    options={snapshot.dataset.members.map((member) => ({
                      value: member.id,
                      label: `${member.code} | ${member.fullName}`,
                    }))}
                  />
                  <FormSelect
                    label="Plan"
                    name="membershipPlanId"
                    required
                    options={snapshot.dataset.membershipPlans.map((plan) => ({
                      value: plan.id,
                      label: `${plan.name} | ${formatCurrency(plan.price)}`,
                    }))}
                  />
                  <FormField
                    label="Start date"
                    name="startDate"
                    type="date"
                    required
                  />
                  <FormSelect
                    label="Payment method"
                    name="paymentMethod"
                    required
                    defaultValue="BANK_TRANSFER"
                    options={[
                      { value: "CASH", label: "Cash" },
                      { value: "CARD", label: "Card" },
                      { value: "BANK_TRANSFER", label: "Bank transfer" },
                    ]}
                  />
                </FormGrid>
                <SubmitButton label="Sell membership" />
              </form>
            </SectionCard>

            <SectionCard
              title="Renew membership"
              description="Gia han goi tap dang hoat dong hoac sap het han."
            >
              <form action={renewMembershipAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormSelect
                  label="Existing membership"
                  name="membershipId"
                  required
                  options={manageableMemberships.map((membership) => ({
                    value: membership.id,
                    label: `${getMemberName(snapshot, membership.memberId)} | ${getPlanName(snapshot, membership.membershipPlanId)} | ${humanizeStatus(membership.status)}`,
                  }))}
                />
                <FormGrid>
                  <FormField
                    label="New start date"
                    name="startDate"
                    type="date"
                  />
                  <FormSelect
                    label="Payment method"
                    name="paymentMethod"
                    defaultValue="BANK_TRANSFER"
                    options={[
                      { value: "", label: "Keep default" },
                      { value: "CASH", label: "Cash" },
                      { value: "CARD", label: "Card" },
                      { value: "BANK_TRANSFER", label: "Bank transfer" },
                    ]}
                  />
                </FormGrid>
                <SubmitButton label="Renew membership" />
              </form>
            </SectionCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
            <SectionCard
              title="Cancel membership"
              description="Dong goi tap som va cap nhat lifecycle."
            >
              <form action={cancelMembershipAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormSelect
                  label="Membership"
                  name="membershipId"
                  required
                  options={manageableMemberships.map((membership) => ({
                    value: membership.id,
                    label: `${getMemberName(snapshot, membership.memberId)} | ${getPlanName(snapshot, membership.membershipPlanId)}`,
                  }))}
                />
                <FormField
                  label="Cancelled at"
                  name="cancelledAt"
                  type="date"
                />
                <SubmitButton label="Cancel membership" />
              </form>
            </SectionCard>

            <SectionCard
              title="Assign PT"
              description="Gan member vao PT theo membership dang con hieu luc."
            >
              <form action={createAssignmentAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormSelect
                  label="Member"
                  name="memberId"
                  required
                  options={snapshot.dataset.members.map((member) => ({
                    value: member.id,
                    label: `${member.code} | ${member.fullName}`,
                  }))}
                />
                <FormSelect
                  label="PT"
                  name="ptId"
                  required
                  options={snapshot.dataset.personalTrainers.map((trainer) => ({
                    value: trainer.id,
                    label: `${trainer.code} | ${trainer.fullName}`,
                  }))}
                />
                <FormSelect
                  label="Membership"
                  name="memberMembershipId"
                  required
                  options={manageableMemberships.map((membership) => ({
                    value: membership.id,
                    label: `${getMemberName(snapshot, membership.memberId)} | ${getPlanName(snapshot, membership.membershipPlanId)}`,
                  }))}
                />
                <FormGrid>
                  <FormField
                    label="Assigned from"
                    name="assignedFrom"
                    type="date"
                    required
                  />
                  <FormSelect
                    label="Commission type"
                    name="commissionType"
                    defaultValue="PERCENTAGE"
                    options={[
                      { value: "PERCENTAGE", label: "Percentage" },
                      { value: "FIXED", label: "Fixed" },
                    ]}
                  />
                  <FormField
                    label="Commission value"
                    name="commissionValue"
                    type="number"
                    defaultValue={10}
                    step="0.5"
                  />
                </FormGrid>
                <SubmitButton label="Create assignment" />
              </form>
            </SectionCard>

            <SectionCard
              title="End PT assignment"
              description="Ket thuc assignment active khi member chuyen PT hoac dung dich vu."
            >
              <form action={endAssignmentAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormSelect
                  label="Active assignment"
                  name="assignmentId"
                  required
                  options={activeAssignments.map((assignment) => ({
                    value: assignment.id,
                    label: `${getMemberName(snapshot, assignment.memberId)} -> ${getTrainerName(snapshot, assignment.ptId)}`,
                  }))}
                />
                <FormField
                  label="Assigned to"
                  name="assignedTo"
                  type="date"
                />
                <SubmitButton label="End assignment" />
              </form>
            </SectionCard>
          </div>
        </>
      ) : null}

      <SectionCard title="Member memberships">
        <DataTable
          headers={["Member", "Plan", "Range", "PT included", "Status"]}
          rows={snapshot.dataset.memberMemberships.map((membership) => {
            const plan = snapshot.dataset.membershipPlans.find(
              (item) => item.id === membership.membershipPlanId,
            );

            return [
              getMemberName(snapshot, membership.memberId),
              plan?.name ?? membership.membershipPlanId,
              `${formatDate(membership.startDate)} - ${formatDate(membership.endDate)}`,
              plan?.includesPt ? "Yes" : "No",
              <Badge
                key={membership.id}
                tone={getStatusTone(membership.status)}
              >
                {humanizeStatus(membership.status)}
              </Badge>,
            ];
          })}
        />
      </SectionCard>
    </>
  );
}

function buildMembershipPlansPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Membership plans"
        description="Danh muc plan DAY / MONTH / YEAR va perks di kem cho tung goi."
      />
      <SectionCard title="Plan catalog">
        <DataTable
          headers={["Plan", "Type", "Price", "PT included", "Perks", "Status"]}
          rows={snapshot.dataset.membershipPlans.map((plan) => [
            plan.name,
            plan.type,
            formatCurrency(plan.price),
            plan.includesPt ? `${plan.includedPtSessions} sessions` : "No",
            plan.perks.join(", "),
            <Badge key={plan.id} tone={getStatusTone(plan.status)}>
              {humanizeStatus(plan.status)}
            </Badge>,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildMembershipInvoicesPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Membership billing"
        title="Membership invoices"
        description="Danh sach hoa don membership da tao khi member mua hoac gia han goi tap."
      />
      <SectionCard title="Membership invoice list">
        <DataTable
          headers={["Code", "Member", "Date", "Amount", "Payment", "Status"]}
          rows={snapshot.dataset.membershipInvoices.map((invoice) => [
            invoice.code,
            getMemberName(snapshot, invoice.memberId),
            formatDateTime(invoice.invoiceDate),
            formatCurrency(invoice.totalAmount),
            invoice.paymentMethod,
            <Badge key={invoice.id} tone={getStatusTone(invoice.status)}>
              {humanizeStatus(invoice.status)}
            </Badge>,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildProductsPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Retail catalog"
        title="Products"
        description="San pham dich vu trong gym, gia ban, gia von va trang thai ton kho hien tai."
      />
      <StatsGrid
        items={[
          {
            label: "Total products",
            value: `${snapshot.inventoryOverview.totalProducts}`,
            note: "So SKU dang duoc track trong phong gym.",
          },
          {
            label: "Low stock",
            value: `${snapshot.inventoryOverview.lowStockCount}`,
            note: "Can restock ngay trong ky.",
          },
          {
            label: "Stock value",
            value: formatCurrency(snapshot.inventoryOverview.stockValue),
            note: "Ton kho tinh theo unit cost.",
          },
          {
            label: "Service revenue",
            value: formatCurrency(snapshot.revenueReport.servicesRevenue),
            note: "Doanh thu tu sales invoices confirmed.",
          },
        ]}
      />

      <SectionCard title="Product list">
        <DataTable
          headers={[
            "Product",
            "Category",
            "Unit cost",
            "Sale price",
            "Stock",
            "Threshold",
          ]}
          rows={sortProductsByStock(snapshot.dataset.products).map(
            (product) => [
              product.name,
              product.category,
              formatCurrency(product.unitCost),
              formatCurrency(product.salePrice),
              `${product.stockOnHand}`,
              `${product.minimumStockLevel}`,
            ],
          )}
        />
      </SectionCard>
    </>
  );
}

function buildInventoryPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);

  return (
    <>
      <PageHeader
        eyebrow="Inventory"
        title="Inventory transactions"
        description="Theo doi bien dong import, sale, adjustment va muc ton kho hien tai."
        actions={<ActionLink href="/inventory/import">Open imports</ActionLink>}
      />
      <StatsGrid
        items={[
          {
            label: "Stock value",
            value: formatCurrency(snapshot.inventoryOverview.stockValue),
            note: "Tinh theo unit cost.",
          },
          {
            label: "Recent transactions",
            value: `${snapshot.inventoryOverview.recentTransactions.length}`,
            note: "6 giao dich gan nhat.",
          },
          {
            label: "Top seller",
            value:
              snapshot.inventoryOverview.topSellingProducts[0]?.product.name ??
              "N/A",
            note: "San pham ban chay nhat.",
          },
          {
            label: "Low stock count",
            value: `${snapshot.inventoryOverview.lowStockCount}`,
            note: "So SKU dang canh bao.",
          },
        ]}
      />

      {canManageGym(options) ? (
        <SectionCard
          title="Create import"
          description="Nhap kho nhanh cho mot SKU dang duoc track trong he thong."
        >
          <form action={importInventoryAction} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <FormGrid>
              <FormSelect
                label="Product"
                name="productId"
                required
                options={snapshot.dataset.products.map((product) => ({
                  value: product.id,
                  label: `${product.code} | ${product.name}`,
                }))}
              />
              <FormField
                label="Quantity"
                name="quantity"
                type="number"
                min={1}
                defaultValue={10}
                required
              />
              <FormField
                label="Unit cost"
                name="unitCost"
                type="number"
                min={0}
                step="1000"
                required
              />
              <FormField
                label="Reference code"
                name="referenceCode"
                placeholder="PO-2026-04-01"
              />
            </FormGrid>
            <SubmitButton label="Create import" />
          </form>
        </SectionCard>
      ) : null}

      <SectionCard title="Inventory ledger">
        <DataTable
          headers={["Date", "Product", "Type", "Qty", "Reference", "Note"]}
          rows={snapshot.dataset.inventoryTransactions.map((transaction) => [
            formatDateTime(transaction.transactionDate),
            getProductName(snapshot, transaction.productId),
            transaction.type,
            `${transaction.quantity}`,
            transaction.referenceCode,
            transaction.note,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildInventoryImportPage(): JSX.Element {
  const snapshot = getGymSnapshot();
  const importTransactions = snapshot.dataset.inventoryTransactions.filter(
    (transaction) => transaction.type === "IMPORT",
  );

  return (
    <>
      <PageHeader
        eyebrow="Restocking"
        title="Import tracker"
        description="Tap trung vao cac giao dich nhap kho va danh sach san pham can mua them."
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Import transactions">
          <DataTable
            headers={["Date", "Product", "Qty", "Unit cost", "Reference"]}
            rows={importTransactions.map((transaction) => [
              formatDateTime(transaction.transactionDate),
              getProductName(snapshot, transaction.productId),
              `${transaction.quantity}`,
              formatCurrency(transaction.unitCost),
              transaction.referenceCode,
            ])}
          />
        </SectionCard>

        <SectionCard title="Suggested restock queue">
          <DataTable
            headers={[
              "Product",
              "Current stock",
              "Threshold",
              "Suggested action",
            ]}
            rows={sortProductsByStock(snapshot.dashboard.lowStockProducts).map(
              (product) => [
                product.name,
                `${product.stockOnHand}`,
                `${product.minimumStockLevel}`,
                "Create import request",
              ],
            )}
          />
        </SectionCard>
      </div>
    </>
  );
}

function buildInvoicesPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);

  return (
    <>
      <PageHeader
        eyebrow="Sales"
        title="Service invoices"
        description="Hoa don ban san pham dich vu cho member hoac khach le."
      />

      {canManageGym(options) ? (
        <SectionCard
          title="Create sales invoice"
          description="Lap hoa don draft moi cho retail invoice, dong thoi tru ton kho cho item da chon."
        >
          <form action={createSalesInvoiceAction} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <FormGrid>
              <FormSelect
                label="Customer type"
                name="memberId"
                defaultValue=""
                options={[
                  { value: "", label: "Walk-in customer" },
                  ...snapshot.dataset.members.map((member) => ({
                    value: member.id,
                    label: `${member.code} | ${member.fullName}`,
                  })),
                ]}
              />
              <FormField
                label="Customer name"
                name="customerName"
                placeholder="Tran Van A"
                required
              />
              <FormSelect
                label="Product"
                name="productId"
                required
                options={snapshot.dataset.products.map((product) => ({
                  value: product.id,
                  label: `${product.code} | ${product.name} | ${formatCurrency(product.salePrice)}`,
                }))}
              />
              <FormField
                label="Quantity"
                name="quantity"
                type="number"
                min={1}
                defaultValue={1}
                required
              />
              <FormSelect
                label="Payment method"
                name="paymentMethod"
                defaultValue="CASH"
                required
                options={[
                  { value: "CASH", label: "Cash" },
                  { value: "CARD", label: "Card" },
                  { value: "BANK_TRANSFER", label: "Bank transfer" },
                ]}
              />
              <FormField
                label="Discount amount"
                name="discountAmount"
                type="number"
                min={0}
                step="1000"
                defaultValue={0}
              />
            </FormGrid>
            <SubmitButton label="Create invoice" />
          </form>
        </SectionCard>
      ) : null}

      <SectionCard title="Sales invoices">
        <DataTable
          headers={[
            "Code",
            "Customer",
            "Date",
            "Total",
            "Payment",
            "Status",
            "Detail",
          ]}
          rows={snapshot.dataset.salesInvoices.map((invoice) => [
            invoice.code,
            invoice.customerName,
            formatDateTime(invoice.invoiceDate),
            formatCurrency(invoice.totalAmount),
            invoice.paymentMethod,
            <Badge key={invoice.id} tone={getStatusTone(invoice.status)}>
              {humanizeStatus(invoice.status)}
            </Badge>,
            <ActionLink
              key={`${invoice.id}-detail`}
              href={`/invoices/${invoice.id}`}
            >
              Open invoice
            </ActionLink>,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildInvoiceDetailPage(invoiceId: string): JSX.Element {
  const snapshot = getGymSnapshot();
  const invoice = snapshot.dataset.salesInvoices.find(
    (item) => item.id === invoiceId,
  );

  if (!invoice) {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow="Sales invoice detail"
        title={invoice.code}
        description={`${invoice.customerName} | ${formatDateTime(invoice.invoiceDate)}`}
        actions={<ActionLink href="/invoices">Back to invoices</ActionLink>}
      />
      <SectionCard title="Invoice summary">
        <KeyValueList
          items={[
            { label: "Customer", value: invoice.customerName },
            {
              label: "Member",
              value: invoice.memberId
                ? getMemberName(snapshot, invoice.memberId)
                : "Walk-in",
            },
            { label: "Payment method", value: invoice.paymentMethod },
            {
              label: "Discount",
              value: formatCurrency(invoice.discountAmount),
            },
            { label: "Total", value: formatCurrency(invoice.totalAmount) },
            {
              label: "Status",
              value: (
                <Badge tone={getStatusTone(invoice.status)}>
                  {humanizeStatus(invoice.status)}
                </Badge>
              ),
            },
          ]}
        />
      </SectionCard>

      <SectionCard title="Invoice items">
        <DataTable
          headers={["Product", "Qty", "Unit price", "Unit cost", "Line total"]}
          rows={invoice.items.map((item) => [
            getProductName(snapshot, item.productId),
            `${item.quantity}`,
            formatCurrency(item.unitPrice),
            formatCurrency(item.unitCost),
            <span
              key={`${invoice.id}-${item.productId}`}
              className="font-semibold text-slate-900"
            >
              {formatCurrency(item.lineTotal)}
            </span>,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildExpensesPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Operating expenses"
        title="Expense requests"
        description="Theo doi phi cleaning, maintenance, repair va utility theo vong doi approval."
      />
      <StatsGrid
        items={[
          {
            label: "Counted expense",
            value: formatCurrency(snapshot.expenseReport.totalExpense),
            note: "Chi tinh APPROVED va PAID.",
          },
          {
            label: "Pending approval",
            value: `${snapshot.expenseReport.pendingApprovalCount}`,
            note: "Can Admin review.",
          },
          {
            label: "Paid slips",
            value: `${snapshot.expenseReport.paidCount}`,
            note: "Da thanh toan xong.",
          },
          {
            label: "Largest category",
            value: "Repair",
            note: "Chi phi repair dang chiem ty trong lon nhat trong ky.",
          },
        ]}
      />

      <SectionCard title="Expense slips">
        <DataTable
          headers={[
            "Code",
            "Date",
            "Category",
            "Equipment",
            "Amount",
            "Status",
            "Detail",
          ]}
          rows={snapshot.dataset.operatingExpenses.map((expense) => [
            expense.code,
            formatDate(expense.expenseDate),
            expense.category,
            getEquipmentName(snapshot, expense.equipmentAssetId ?? undefined),
            formatCurrency(expense.amount),
            <Badge key={expense.id} tone={getStatusTone(expense.status)}>
              {humanizeStatus(expense.status)}
            </Badge>,
            <ActionLink
              key={`${expense.id}-detail`}
              href={`/expenses/${expense.id}`}
            >
              Open slip
            </ActionLink>,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildExpenseDetailPage(expenseId: string): JSX.Element {
  const snapshot = getGymSnapshot();
  const expense = snapshot.dataset.operatingExpenses.find(
    (item) => item.id === expenseId,
  );

  if (!expense) {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow="Expense detail"
        title={expense.code}
        description={`${expense.category} | ${expense.vendorName}`}
        actions={<ActionLink href="/expenses">Back to expenses</ActionLink>}
      />
      <SectionCard title="Expense summary">
        <KeyValueList
          items={[
            { label: "Expense date", value: formatDate(expense.expenseDate) },
            { label: "Vendor", value: expense.vendorName },
            {
              label: "Equipment",
              value: getEquipmentName(
                snapshot,
                expense.equipmentAssetId ?? undefined,
              ),
            },
            { label: "Amount", value: formatCurrency(expense.amount) },
            { label: "Description", value: expense.description },
            {
              label: "Status",
              value: (
                <Badge tone={getStatusTone(expense.status)}>
                  {humanizeStatus(expense.status)}
                </Badge>
              ),
            },
          ]}
        />
      </SectionCard>
    </>
  );
}

function buildEquipmentPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Assets"
        title="Equipment register"
        description="Danh muc thiet bi, tinh trang su dung va lich bao tri ke tiep."
      />
      <StatsGrid
        items={[
          {
            label: "Assets tracked",
            value: `${snapshot.dataset.equipmentAssets.length}`,
            note: "Tong so thiet bi trong registry.",
          },
          {
            label: "Need attention",
            value: `${snapshot.dataset.equipmentAssets.filter((asset) => asset.condition !== "GOOD").length}`,
            note: "Asset can bao tri hoac thay the.",
          },
          {
            label: "Maintenance records",
            value: `${snapshot.dataset.maintenanceRecords.length}`,
            note: "Tong event bao tri da ghi nhan.",
          },
          {
            label: "Open alerts",
            value: `${snapshot.dashboard.maintenanceAlerts.length}`,
            note: "Can xu ly trong 14 ngay.",
          },
        ]}
      />

      <SectionCard title="Equipment list">
        <DataTable
          headers={[
            "Equipment",
            "Purchased",
            "Value",
            "Condition",
            "Next maintenance",
            "Detail",
          ]}
          rows={sortEquipmentByMaintenance(
            snapshot.dataset.equipmentAssets,
          ).map((equipmentAsset) => [
            equipmentAsset.name,
            formatDate(equipmentAsset.purchasedAt),
            formatCurrency(equipmentAsset.purchaseValue),
            <Badge
              key={equipmentAsset.id}
              tone={getStatusTone(equipmentAsset.condition)}
            >
              {humanizeStatus(equipmentAsset.condition)}
            </Badge>,
            formatDate(equipmentAsset.nextMaintenanceAt),
            <ActionLink
              key={`${equipmentAsset.id}-detail`}
              href={`/equipment/${equipmentAsset.id}`}
            >
              Open asset
            </ActionLink>,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildEquipmentDetailPage(equipmentId: string): JSX.Element {
  const snapshot = getGymSnapshot();
  const equipmentAsset = snapshot.dataset.equipmentAssets.find(
    (item) => item.id === equipmentId,
  );

  if (!equipmentAsset) {
    notFound();
  }

  const maintenanceRecords = snapshot.dataset.maintenanceRecords.filter(
    (record) => record.equipmentAssetId === equipmentId,
  );

  return (
    <>
      <PageHeader
        eyebrow="Equipment detail"
        title={equipmentAsset.name}
        description={equipmentAsset.note}
        actions={<ActionLink href="/equipment">Back to equipment</ActionLink>}
      />
      <SectionCard title="Asset summary">
        <KeyValueList
          items={[
            { label: "Code", value: equipmentAsset.code },
            {
              label: "Purchased at",
              value: formatDate(equipmentAsset.purchasedAt),
            },
            {
              label: "Purchase value",
              value: formatCurrency(equipmentAsset.purchaseValue),
            },
            {
              label: "Condition",
              value: (
                <Badge tone={getStatusTone(equipmentAsset.condition)}>
                  {humanizeStatus(equipmentAsset.condition)}
                </Badge>
              ),
            },
            {
              label: "Next maintenance",
              value: formatDate(equipmentAsset.nextMaintenanceAt),
            },
            { label: "Note", value: equipmentAsset.note },
          ]}
        />
      </SectionCard>

      <SectionCard title="Maintenance history">
        <DataTable
          headers={["Date", "Vendor", "Description", "Amount"]}
          rows={maintenanceRecords.map((record) => [
            formatDate(record.maintenanceDate),
            record.vendorName,
            record.description,
            formatCurrency(record.amount),
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildMaintenancePage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);

  return (
    <>
      <PageHeader
        eyebrow="Maintenance log"
        title="Maintenance history"
        description="Tat ca event bao tri, repair va recommendation replacement cho thiet bi."
      />

      {canManageGym(options) ? (
        <SectionCard
          title="Log maintenance"
          description="Ghi nhan mot lan bao tri moi va cap nhat ngay bao tri tiep theo neu can."
        >
          <form action={createMaintenanceAction} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <FormGrid>
              <FormSelect
                label="Equipment"
                name="equipmentAssetId"
                required
                options={snapshot.dataset.equipmentAssets.map((equipmentAsset) => ({
                  value: equipmentAsset.id,
                  label: `${equipmentAsset.code} | ${equipmentAsset.name}`,
                }))}
              />
              <FormSelect
                label="Maintenance type"
                name="maintenanceType"
                defaultValue="PREVENTIVE"
                options={[
                  { value: "PREVENTIVE", label: "Preventive" },
                  { value: "CORRECTIVE", label: "Corrective" },
                  { value: "INSPECTION", label: "Inspection" },
                ]}
              />
              <FormField
                label="Maintenance date"
                name="maintenanceDate"
                type="date"
                required
              />
              <FormField
                label="Vendor name"
                name="vendorName"
                placeholder="Fit Service Co."
                required
              />
              <FormField
                label="Amount"
                name="amount"
                type="number"
                min={0}
                step="1000"
                required
              />
              <FormSelect
                label="Result status"
                name="resultStatus"
                defaultValue="COMPLETED"
                options={[
                  { value: "COMPLETED", label: "Completed" },
                  { value: "FOLLOW_UP_REQUIRED", label: "Follow-up required" },
                  { value: "REPLACEMENT_RECOMMENDED", label: "Replacement recommended" },
                ]}
              />
              <FormField
                label="Next maintenance"
                name="nextMaintenanceAt"
                type="date"
              />
            </FormGrid>
            <FormTextArea
              label="Description"
              name="description"
              placeholder="Mo ta cong viec da thuc hien"
              rows={3}
            />
            <SubmitButton label="Create maintenance record" />
          </form>
        </SectionCard>
      ) : null}

      <SectionCard title="Maintenance records">
        <DataTable
          headers={[
            "Date",
            "Equipment",
            "Type",
            "Vendor",
            "Result",
            "Amount",
          ]}
          rows={snapshot.dataset.maintenanceRecords.map((record) => [
            formatDate(record.maintenanceDate),
            getEquipmentName(snapshot, record.equipmentAssetId ?? undefined),
            humanizeStatus(record.maintenanceType ?? "PREVENTIVE"),
            record.vendorName,
            humanizeStatus(record.resultStatus ?? "COMPLETED"),
            formatCurrency(record.amount),
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildRevenueReportPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Revenue report"
        description="Tong hop doanh thu membership va doanh thu retail tren cung mot dashboard."
      />
      <StatsGrid
        items={[
          {
            label: "Total revenue",
            value: formatCurrency(snapshot.revenueReport.totalRevenue),
            note: "Membership + retail confirmed.",
          },
          {
            label: "Membership revenue",
            value: formatCurrency(snapshot.revenueReport.membershipRevenue),
            note: "Thu tu membership invoices.",
          },
          {
            label: "Service revenue",
            value: formatCurrency(snapshot.revenueReport.servicesRevenue),
            note: "Thu tu sales invoices.",
          },
          {
            label: "Invoice count",
            value: `${snapshot.revenueReport.membershipInvoiceCount + snapshot.revenueReport.salesInvoiceCount}`,
            note: "Tong invoice da confirm.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Membership invoices">
          <DataTable
            headers={["Code", "Member", "Date", "Amount"]}
            rows={snapshot.dataset.membershipInvoices.map((invoice) => [
              invoice.code,
              getMemberName(snapshot, invoice.memberId),
              formatDateTime(invoice.invoiceDate),
              formatCurrency(invoice.totalAmount),
            ])}
          />
        </SectionCard>
        <SectionCard title="Retail invoices">
          <DataTable
            headers={["Code", "Customer", "Date", "Amount"]}
            rows={snapshot.dataset.salesInvoices
              .filter((invoice) => invoice.status === "CONFIRMED")
              .map((invoice) => [
                invoice.code,
                invoice.customerName,
                formatDateTime(invoice.invoiceDate),
                formatCurrency(invoice.totalAmount),
              ])}
          />
        </SectionCard>
      </div>
    </>
  );
}

function buildPayrollReportPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Payroll report"
        description="Tong chi luong PT, status approval va phan bo net pay theo trainer."
      />
      <StatsGrid
        items={[
          {
            label: "Total payroll",
            value: formatCurrency(snapshot.payrollReport.totalPayroll),
            note: "Tong net pay toan bo history.",
          },
          {
            label: "Approved",
            value: formatCurrency(snapshot.payrollReport.approvedPayroll),
            note: "Da approved hoac paid.",
          },
          {
            label: "Pending",
            value: formatCurrency(snapshot.payrollReport.pendingPayroll),
            note: "Dang cho duyet.",
          },
          {
            label: "Entries",
            value: `${snapshot.payrollReport.byTrainer.length}`,
            note: "So dong payroll trong dataset.",
          },
        ]}
      />
      <SectionCard title="Payroll by trainer">
        <DataTable
          headers={["PT", "Period", "Net pay", "Status"]}
          rows={snapshot.payrollReport.byTrainer.map((item) => [
            item.ptName,
            item.payrollPeriodCode,
            formatCurrency(item.netPay),
            <Badge
              key={`${item.ptId}-${item.payrollPeriodId}`}
              tone={getStatusTone(item.status)}
            >
              {humanizeStatus(item.status)}
            </Badge>,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildInventoryReportPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Inventory report"
        description="Ton kho hien tai, top sellers va transaction flow trong ky."
      />
      <StatsGrid
        items={[
          {
            label: "Stock value",
            value: formatCurrency(snapshot.inventoryOverview.stockValue),
            note: "Ton kho theo cost.",
          },
          {
            label: "Low stock count",
            value: `${snapshot.inventoryOverview.lowStockCount}`,
            note: "SKU dang can canh bao.",
          },
          {
            label: "Products tracked",
            value: `${snapshot.inventoryOverview.totalProducts}`,
            note: "Tong SKU dang active.",
          },
          {
            label: "Recent moves",
            value: `${snapshot.inventoryOverview.recentTransactions.length}`,
            note: "6 giao dich gan nhat.",
          },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Top sellers">
          <DataTable
            headers={["Product", "Sold qty", "Current stock"]}
            rows={snapshot.inventoryOverview.topSellingProducts.map((entry) => [
              entry.product.name,
              `${entry.soldQuantity}`,
              `${entry.product.stockOnHand}`,
            ])}
          />
        </SectionCard>
        <SectionCard title="Recent inventory transactions">
          <DataTable
            headers={["Date", "Product", "Type", "Qty"]}
            rows={snapshot.inventoryOverview.recentTransactions.map(
              (transaction) => [
                formatDateTime(transaction.transactionDate),
                getProductName(snapshot, transaction.productId),
                transaction.type,
                `${transaction.quantity}`,
              ],
            )}
          />
        </SectionCard>
      </div>
    </>
  );
}

function buildExpenseReportPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Expense report"
        description="Chi phi van hanh theo category va trang thai approval."
      />
      <StatsGrid
        items={[
          {
            label: "Counted expense",
            value: formatCurrency(snapshot.expenseReport.totalExpense),
            note: "Chi APPROVED + PAID.",
          },
          {
            label: "Pending approval",
            value: `${snapshot.expenseReport.pendingApprovalCount}`,
            note: "Can duyet bo sung.",
          },
          {
            label: "Paid expense count",
            value: `${snapshot.expenseReport.paidCount}`,
            note: "Da mark paid.",
          },
          {
            label: "Top category",
            value: "Repair",
            note: "Category co tong amount lon nhat hien tai.",
          },
        ]}
      />
      <SectionCard title="Expense by category">
        <DataTable
          headers={["Category", "Amount"]}
          rows={Object.entries(snapshot.expenseReport.byCategory).map(
            ([category, amount]) => [category, formatCurrency(amount)],
          )}
        />
      </SectionCard>
    </>
  );
}

function buildProfitReportPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Profit report"
        description="Cong thuc: revenue - COGS - PT payroll - operating expense."
      />
      <StatsGrid
        items={[
          {
            label: "Revenue",
            value: formatCurrency(snapshot.profitReport.totalRevenue),
            note: "Tong doanh thu confirmed.",
          },
          {
            label: "COGS",
            value: formatCurrency(snapshot.profitReport.cogs),
            note: "Gia von tu retail items da ban.",
          },
          {
            label: "PT payroll",
            value: formatCurrency(snapshot.profitReport.ptPayroll),
            note: "Ky payroll hien tai.",
          },
          {
            label: "Net profit",
            value: formatCurrency(snapshot.profitReport.netProfit),
            note: "Ket qua sau khi tru chi phi va payroll.",
          },
        ]}
      />
      <SectionCard title="Profit formula">
        <KeyValueList
          items={[
            {
              label: "Total revenue",
              value: formatCurrency(snapshot.profitReport.totalRevenue),
            },
            {
              label: "Minus COGS",
              value: formatCurrency(snapshot.profitReport.cogs),
            },
            {
              label: "Minus PT payroll",
              value: formatCurrency(snapshot.profitReport.ptPayroll),
            },
            {
              label: "Minus operating expense",
              value: formatCurrency(snapshot.profitReport.operatingExpense),
            },
            {
              label: "Net result",
              value: (
                <span className="font-semibold text-slate-950">
                  {formatCurrency(snapshot.profitReport.netProfit)}
                </span>
              ),
            },
          ]}
        />
      </SectionCard>
    </>
  );
}

function buildSettingsPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="System config"
        title="Settings"
        description="Cac tham so policy can Admin co the chinh sua trong he thong."
      />
      <SectionCard title="System configs">
        <DataTable
          headers={["Key", "Label", "Value", "Description"]}
          rows={snapshot.dataset.systemConfigs.map((config) => [
            config.key,
            config.label,
            config.value,
            config.description,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildLoginPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
  const hasInvalidCredentials =
    getSearchParam(options?.searchParams, "error") === "invalid";

  return (
    <>
      <PageHeader
        eyebrow="Secure access"
        title="Sign in"
        description="Frontend hien dang dung session that voi access token short-lived va refresh token cookie de goi backend Gym Manager."
        actions={
          <a
            href={`${backendUrl}/api/docs`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open auth docs
          </a>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <SectionCard
          title="Login form"
          description="Dang nhap vao admin/staff portal hoac PT self-service view."
        >
          {hasInvalidCredentials ? (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              Email hoac mat khau khong dung. Thu lai bang mot tai khoan demo ben canh.
            </div>
          ) : null}

          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <FormField
              label="Email"
              name="email"
              type="email"
              defaultValue="admin@gymmanager.local"
              required
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              defaultValue="demo123"
              required
            />
            <SubmitButton label="Sign in" />
          </form>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Demo accounts">
            <DataTable
              headers={["Role", "Name", "Email", "Password"]}
              rows={snapshot.dataset.users.map((user) => [
                user.role,
                user.fullName,
                user.email,
                "demo123",
              ])}
            />
          </SectionCard>

          <SectionCard title="Quick API test">
            <pre className="overflow-x-auto rounded-[1.25rem] bg-slate-950 p-4 text-sm leading-7 text-slate-100">
              {`POST ${backendUrl}/api/auth/login
{
  "email": "admin@gymmanager.local",
  "password": "demo123"
}`}
            </pre>
          </SectionCard>
        </div>
      </div>
    </>
  );
}

export function renderGymRoute(
  slug: string[],
  options?: RenderGymRouteOptions,
): JSX.Element {
  const section = slug[0];
  const entityId = slug[1];
  const nestedSection = slug[2];

  if (options?.currentUser?.role === "PT") {
    if (section === "pts" && entityId === "attendance") {
      return buildPtSelfAttendancePage(options);
    }

    if (section === "payroll" && slug.length === 1) {
      return buildPtSelfPayrollPage(options);
    }
  }

  if (slug.length === 0 || section === "dashboard") {
    return buildDashboardPage();
  }

  if (section === "login") {
    return buildLoginPage(options);
  }

  if (section === "pts" && slug.length === 1) {
    return buildPtsPage();
  }

  if (section === "pts" && entityId === "attendance") {
    return buildAttendancePage(options);
  }

  if (section === "pts" && slug.length === 2 && entityId) {
    return buildPtDetailPage(entityId);
  }

  if (
    section === "pts" &&
    slug.length === 3 &&
    entityId &&
    nestedSection === "contracts"
  ) {
    return buildPtContractsPage(entityId, options);
  }

  if (section === "payroll" && slug.length === 1) {
    return buildPayrollPage(options);
  }

  if (section === "payroll" && slug.length === 2 && entityId) {
    return buildPayrollPeriodPage(entityId);
  }

  if (section === "members" && slug.length === 1) {
    return buildMembersPage();
  }

  if (section === "members" && entityId === "memberships") {
    return buildMembershipOverviewPage(options);
  }

  if (section === "members" && slug.length === 2 && entityId) {
    return buildMemberDetailPage(entityId);
  }

  if (section === "membership-plans") {
    return buildMembershipPlansPage();
  }

  if (section === "membership-invoices") {
    return buildMembershipInvoicesPage();
  }

  if (section === "products") {
    return buildProductsPage();
  }

  if (section === "inventory" && slug.length === 1) {
    return buildInventoryPage(options);
  }

  if (section === "inventory" && entityId === "import") {
    return buildInventoryImportPage();
  }

  if (section === "invoices" && slug.length === 1) {
    return buildInvoicesPage(options);
  }

  if (section === "invoices" && slug.length === 2 && entityId) {
    return buildInvoiceDetailPage(entityId);
  }

  if (section === "expenses" && slug.length === 1) {
    return buildExpensesPage();
  }

  if (section === "expenses" && slug.length === 2 && entityId) {
    return buildExpenseDetailPage(entityId);
  }

  if (section === "equipment" && slug.length === 1) {
    return buildEquipmentPage();
  }

  if (section === "equipment" && slug.length === 2 && entityId) {
    return buildEquipmentDetailPage(entityId);
  }

  if (section === "maintenance") {
    return buildMaintenancePage(options);
  }

  if (section === "reports" && entityId === "revenue") {
    return buildRevenueReportPage();
  }

  if (section === "reports" && entityId === "payroll") {
    return buildPayrollReportPage();
  }

  if (section === "reports" && entityId === "inventory") {
    return buildInventoryReportPage();
  }

  if (section === "reports" && entityId === "expenses") {
    return buildExpenseReportPage();
  }

  if (section === "reports" && entityId === "profit") {
    return buildProfitReportPage();
  }

  if (section === "settings") {
    return buildSettingsPage();
  }

  notFound();
}
