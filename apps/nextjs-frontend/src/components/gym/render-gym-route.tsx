import { cache, type JSX, type ReactNode } from "react";
import { notFound } from "next/navigation";
import {
  type DemoUser,
  type GymManagementSnapshot,
} from "@next-nest-turbo-boilerplate/shared";
import {
  Badge as BaseBadge,
  DataTable as BaseDataTable,
  KeyValueList as BaseKeyValueList,
  PageHeader as BasePageHeader,
  SectionCard as BaseSectionCard,
  StatsGrid as BaseStatsGrid,
} from "./gym-ui.tsx";
import {
  cancelMembershipAction,
  checkInAttendanceAction,
  checkOutAttendanceAction,
  createAssignmentAction,
  createMemberAction,
  createMembershipAction,
  createMembershipPlanAction,
  createPayrollPeriodAction,
  createPersonalTrainerAction,
  createProductAction,
  createSalesInvoiceAction,
  deleteMemberAction,
  deleteMembershipPlanAction,
  deletePersonalTrainerAction,
  deleteProductAction,
  endAssignmentAction,
  generatePayrollAction,
  importInventoryAction,
  loginAction,
  patchPtCompensationAction,
  patchSystemConfigAction,
  renewMembershipAction,
  updateAccountAction,
  updateMemberAction,
  updateMembershipPlanAction,
  updatePersonalTrainerAction,
  updateProductAction,
} from "@/app/[locale]/gym-actions.ts";
import { Link } from "@/i18n/navigation.ts";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatHours,
  getGymSnapshot,
  getMemberName,
  getPlanName,
  getProductName,
  getStatusTone,
  getTrainerName,
  humanizeStatus,
  sortMembersByDate,
  sortProductsByStock,
} from "@/lib/gym-data.ts";
import { translateFromText } from "@/lib/translations.ts";

type UiLocale = "en" | "vi";

const getLocaleStore = cache(() => ({
  locale: "en" as UiLocale,
}));

function setActiveUiLocale(locale: UiLocale): void {
  getLocaleStore().locale = locale;
}

function getActiveUiLocale(): UiLocale {
  return getLocaleStore().locale;
}

function translateText(value: string, locale: "en" | "vi"): string {
  return translateFromText(value, locale);
}

function isRenderableNode(value: unknown): value is ReactNode {
  return (
    value === null
    || value === undefined
    || typeof value === "string"
    || typeof value === "number"
    || typeof value === "boolean"
    || typeof value === "object"
  );
}

function translateNode(node: ReactNode, locale: "en" | "vi"): ReactNode {
  if (typeof node === "string") {
    return translateText(node, locale);
  }

  if (Array.isArray(node)) {
    const translatedItems: ReactNode[] = [];

    for (const item of node) {
      if (isRenderableNode(item)) {
        translatedItems.push(translateNode(item, locale));
      }
    }

    return translatedItems;
  }

  return node;
}

function ActionLink({
  href,
  children,
}: {
  readonly href: string;
  readonly children: string;
}): JSX.Element {
  const locale = getActiveUiLocale();

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-950"
    >
      <span className="pi pi-arrow-up-right text-[11px] text-[var(--accent-600)]" />
      {translateText(children, locale)}
    </Link>
  );
}

function PageHeader(props: {
  readonly eyebrow: string;
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
}): JSX.Element {
  const locale = getActiveUiLocale();

  return (
    <BasePageHeader
      eyebrow={translateText(props.eyebrow, locale)}
      title={translateText(props.title, locale)}
      description={translateText(props.description ?? "", locale)}
      actions={translateNode(props.actions, locale)}
    />
  );
}

function SectionCard(props: {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
}): JSX.Element {
  const locale = getActiveUiLocale();

  return (
    <BaseSectionCard
      title={translateText(props.title, locale)}
      description={props.description ? translateText(props.description, locale) : undefined}
    >
      {translateNode(props.children, locale)}
    </BaseSectionCard>
  );
}

function StatsGrid(props: {
  readonly items: Array<{ readonly label: string; readonly value: string; readonly note: string }>;
}): JSX.Element {
  const locale = getActiveUiLocale();

  return (
    <BaseStatsGrid
      items={props.items.map((item) => ({
        ...item,
        label: translateText(item.label, locale),
        note: translateText(item.note, locale),
      }))}
    />
  );
}

function KeyValueList(props: {
  readonly items: Array<{ readonly label: string; readonly value: ReactNode }>;
}): JSX.Element {
  const locale = getActiveUiLocale();

  return (
    <BaseKeyValueList
      items={props.items.map((item) => ({
        label: translateText(item.label, locale),
        value: translateNode(item.value, locale),
      }))}
    />
  );
}

function DataTable(props: {
  readonly headers: string[];
  readonly rows: ReactNode[][];
  readonly emptyMessage?: string;
}): JSX.Element {
  const locale = getActiveUiLocale();
  const translatedHeaders = props.headers.map((header) => translateText(header, locale));
  const translatedRows: ReactNode[][] = [];

  for (const row of props.rows) {
    const translatedRow: ReactNode[] = [];

    for (const cell of row) {
      translatedRow.push(translateNode(cell, locale));
    }

    translatedRows.push(translatedRow);
  }

  return (
    <BaseDataTable
      headers={translatedHeaders}
      rows={translatedRows}
      emptyMessage={props.emptyMessage ? translateText(props.emptyMessage, locale) : undefined}
    />
  );
}

function Badge({ children, tone = "slate" }: { readonly children: ReactNode; readonly tone?: "slate" | "emerald" | "amber" | "rose" | "sky" }): JSX.Element {
  const locale = getActiveUiLocale();

  return <BaseBadge tone={tone}>{translateNode(children, locale)}</BaseBadge>;
}

type SearchParamsRecord = Record<string, string | string[] | undefined>;

type RenderGymRouteOptions = {
  readonly locale?: string;
  readonly searchParams?: SearchParamsRecord;
  readonly currentUser?: DemoUser;
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

function getAgeFromBirthDate(value?: string | null): number | undefined {
  const normalizedBirthDate = toDateInputValue(value);

  if (!normalizedBirthDate) {
    return undefined;
  }

  const [yearText, monthText, dayText] = normalizedBirthDate.split("-");
  const birthYear = Number(yearText);
  const birthMonth = Number(monthText);
  const birthDay = Number(dayText);

  if (
    !Number.isFinite(birthYear)
    || !Number.isFinite(birthMonth)
    || !Number.isFinite(birthDay)
  ) {
    return undefined;
  }

  const currentDate = new Date();
  let age = currentDate.getUTCFullYear() - birthYear;
  const hasBirthdayPassedInCurrentYear =
    currentDate.getUTCMonth() + 1 > birthMonth
    || (
      currentDate.getUTCMonth() + 1 === birthMonth
      && currentDate.getUTCDate() >= birthDay
    );

  if (!hasBirthdayPassedInCurrentYear) {
    age -= 1;
  }

  return age >= 0 ? age : undefined;
}

function formatBirthDateWithAge(value?: string | null): string {
  const age = getAgeFromBirthDate(value);

  if (age === undefined) {
    return formatDate(value);
  }

  return `${formatDate(value)} (${age} tuổi)`;
}

function getGenderLabel(gender: string): string {
  switch (gender) {
    case "MALE": {
      return "Nam";
    }

    case "FEMALE": {
      return "Nữ";
    }

    default: {
      return "Khác";
    }
  }
}

function getSystemConfigValue(
  snapshot: GymManagementSnapshot,
  key: string,
): string | undefined {
  return snapshot.dataset.systemConfigs.find((config) => config.key === key)?.value;
}

function getSystemConfigNumberValue(
  snapshot: GymManagementSnapshot,
  key: string,
  fallbackValue: number,
): number {
  const rawValue = getSystemConfigValue(snapshot, key);

  if (!rawValue) {
    return fallbackValue;
  }

  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
}

function FormGrid({
  children,
  columns = 2,
}: {
  readonly children: ReactNode;
  readonly columns?: 1 | 2;
}): JSX.Element {
  return (
    <div className={columns === 1 ? "grid gap-5" : "grid gap-5 md:grid-cols-2"}>
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
  iconClassName,
}: {
  readonly label: string;
  readonly name: string;
  readonly type?: string;
  readonly defaultValue?: FieldValue;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly min?: string | number;
  readonly step?: string | number;
  readonly iconClassName?: string;
}): JSX.Element {
  const locale = getActiveUiLocale();

  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {translateText(label, locale)}
      </span>
      <div className="relative mt-2">
        {iconClassName ? (
          <span className={`pi ${iconClassName} pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400`} />
        ) : null}
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder ? translateText(placeholder, locale) : undefined}
          required={required}
          min={min}
          step={step}
          className={`w-full rounded-2xl border border-slate-200/85 bg-white/95 px-4 py-3 text-sm text-slate-800 shadow-[0_10px_26px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:-translate-y-0.5 focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--focus-ring)] ${iconClassName ? "pl-11" : ""}`}
        />
      </div>
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
  const locale = getActiveUiLocale();

  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {translateText(label, locale)}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 w-full rounded-2xl border border-slate-200/85 bg-white/95 px-4 py-3 text-sm text-slate-800 shadow-[0_10px_26px_rgba(15,23,42,0.04)] outline-none transition focus:-translate-y-0.5 focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--focus-ring)]"
      >
        {options.map((option) => (
          <option key={`${name}-${option.value}`} value={option.value}>
            {translateText(option.label, locale)}
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
  const locale = getActiveUiLocale();

  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {translateText(label, locale)}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder ? translateText(placeholder, locale) : undefined}
        rows={rows}
        className="mt-2 w-full rounded-2xl border border-slate-200/85 bg-white/95 px-4 py-3 text-sm text-slate-800 shadow-[0_10px_26px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:-translate-y-0.5 focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--focus-ring)]"
      />
    </label>
  );
}

function SubmitButton({
  label,
  fullWidth = false,
  iconClassName = "pi pi-check",
}: {
  readonly label: string;
  readonly fullWidth?: boolean;
  readonly iconClassName?: string;
}): JSX.Element {
  const locale = getActiveUiLocale();

  return (
    <button
      type="submit"
      className={`inline-flex items-center gap-2 rounded-full bg-[var(--accent-600)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.24)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-700)] ${fullWidth ? "w-full justify-center" : ""}`}
    >
      <span className={`pi ${iconClassName} text-xs text-white/90`} />
      {translateText(label, locale)}
    </button>
  );
}

function CollapsibleCrudPanel({
  triggerLabel,
  helperText,
  children,
}: {
  readonly triggerLabel: string;
  readonly helperText?: string;
  readonly children: ReactNode;
}): JSX.Element {
  const locale = getActiveUiLocale();

  return (
    <details className="group rounded-3xl border border-slate-200/85 bg-slate-50/70 p-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:bg-white/90">
        <span className="inline-flex items-center gap-2">
          <span className="pi pi-table text-[11px] text-[var(--accent-600)]" />
          {translateText(triggerLabel, locale)}
        </span>
        <span className="pi pi-angle-down text-xs transition group-open:rotate-180" />
      </summary>

      <div className="mt-3 rounded-2xl border border-white/80 bg-white/90 p-4">
        {helperText ? (
          <p className="mb-3 text-xs text-slate-500">
            {translateText(helperText, locale)}
          </p>
        ) : null}
        {children}
      </div>
    </details>
  );
}

function buildDashboardPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Vận hành phòng gym"
        title="Tổng quan vận hành"
        actions={
          <ActionLink href="/reports/profit">
            Báo cáo lợi nhuận
          </ActionLink>
        }
      />

      <StatsGrid
        items={[
          {
            label: "Hội viên đang hoạt động",
            value: `${snapshot.dashboard.activeMembers}/${snapshot.dashboard.totalMembers}`,
            note: "Bao gồm hội viên day-pass, gói tháng và gói năm đang hiệu lực.",
          },
          {
            label: "PT trong biên chế",
            value: `${snapshot.dashboard.totalPts}`,
            note: "Toàn bộ PT đang ở trạng thái ACTIVE và có hợp đồng hiệu lực.",
          },
          {
            label: "Doanh thu tháng",
            value: formatCurrency(snapshot.dashboard.revenue.monthly),
            note: `Gói tập ${formatCurrency(snapshot.dashboard.revenue.membership)} + dịch vụ ${formatCurrency(snapshot.dashboard.revenue.services)}.`,
          },
          {
            label: "Quỹ lương hiện tại",
            value: formatCurrency(snapshot.dashboard.totalPtPayroll),
            note: "Tổng lương thực nhận của kỳ lương hiện tại đang duyệt.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Phân tích doanh thu"
        >
          <KeyValueList
            items={[
              {
                label: "Doanh thu ngày",
                value: formatCurrency(snapshot.dashboard.revenue.daily),
              },
              {
                label: "Doanh thu năm",
                value: formatCurrency(snapshot.dashboard.revenue.yearly),
              },
              {
                label: "Chi phí vận hành",
                value: formatCurrency(snapshot.dashboard.totalOperatingExpense),
              },
              {
                label: "Lợi nhuận ròng",
                value: formatCurrency(snapshot.profitReport.netProfit),
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          title="Cảnh báo tồn kho thấp"
        >
          <DataTable
            headers={[
              "Sản phẩm",
              "Tồn kho",
              "Ngưỡng",
              "Trạng thái",
            ]}
            rows={sortProductsByStock(snapshot.dashboard.lowStockProducts).map(
              (product) => [
                product.name,
                `${product.stockOnHand} đơn vị`,
                `${product.minimumStockLevel} đơn vị`,
                <Badge key={product.id} tone="amber">
                  Bổ sung ngay
                </Badge>,
              ],
            )}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Sản phẩm bán chạy"
        >
          <DataTable
            headers={["Sản phẩm", "Số lượng bán", "Tồn kho hiện tại"]}
            rows={snapshot.inventoryOverview.topSellingProducts.map((entry) => [
              entry.product.name,
              `${entry.soldQuantity} đơn vị`,
              `${entry.product.stockOnHand} đơn vị`,
            ])}
          />
        </SectionCard>
      </div>
    </>
  );
}

function buildPtsPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);

  return (
    <>
      <PageHeader
        eyebrow="Quản lý PT"
        title="Huấn luyện viên cá nhân"
        actions={
          <ActionLink href="/pts/attendance">Mở chấm công</ActionLink>
        }
      />

      <StatsGrid
        items={[
          {
            label: "Hội viên được phân công",
            value: `${snapshot.ptOverview.reduce((total, item) => total + item.activeMembers, 0)}`,
            note: "Tổng số hội viên đang có PT phụ trách. Một PT có thể phụ trách nhiều hội viên.",
          },
          {
            label: "Công quy đổi",
            value: `${snapshot.ptOverview.reduce((total, item) => total + item.validShiftCredits, 0)}`,
            note: "Tổng công VALID/HALF quy đổi trong dữ liệu mẫu.",
          },
          {
            label: "Tăng ca",
            value: formatHours(
              snapshot.ptOverview.reduce(
                (total, item) => total + item.overtimeHours,
                0,
              ),
            ),
            note: "Tổng giờ tăng ca được lấy từ nhật ký chấm công.",
          },
          {
            label: "Lương ước tính",
            value: formatCurrency(
              snapshot.ptOverview.reduce(
                (total, item) => total + item.estimatedPayroll,
                0,
              ),
            ),
            note: "Tổng thực lĩnh kỳ gần nhất của tất cả PT.",
          },
        ]}
      />

      {isAdmin(options) ? (
        <SectionCard title="Thêm PT mới">
          <CollapsibleCrudPanel
            triggerLabel="Mở bảng thêm PT"
            helperText="Chỉ cần mã PT, họ tên, số điện thoại. Thông tin khác có thể cập nhật sau."
          >
            <form action={createPersonalTrainerAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <FormGrid>
                <FormField label="Mã PT" name="code" placeholder="PT-NEW" required />
                <FormField
                  label="Họ và tên"
                  name="fullName"
                  placeholder="Nguyen Van A"
                  required
                />
                <FormField label="Số điện thoại" name="phone" required />
              </FormGrid>
              <SubmitButton label="Tạo PT" />
            </form>
          </CollapsibleCrudPanel>
        </SectionCard>
      ) : null}

      <SectionCard
        title="Danh sách PT"
      >
        <DataTable
          headers={[
            "Tên PT",
            "Ngày sinh (tuổi)",
            "Giới tính",
            "Số điện thoại",
            "Hội viên phụ trách",
            "Chi tiết",
          ]}
          rows={snapshot.ptOverview.map((item) => [
            <div key={item.pt.id}>
              <p className="font-semibold text-slate-900">{item.pt.fullName}</p>
            </div>,
            formatBirthDateWithAge(item.pt.birthDate),
            getGenderLabel(item.pt.gender),
            item.pt.phone,
            `${item.activeMembers}`,
            <div key={`${item.pt.id}-links`} className="flex gap-2">
              <ActionLink href={`/pts/${item.pt.id}`}>Hồ sơ</ActionLink>
            </div>,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildPtDetailPage(
  ptId: string,
  options?: RenderGymRouteOptions,
): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);
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
  const activeAssignments = snapshot.dataset.memberPtAssignments
    .filter(
      (assignment) => assignment.ptId === ptId && assignment.status === "ACTIVE",
    );
  const assignedMembers = activeAssignments
    .map((assignment) =>
      snapshot.dataset.members.find(
        (member) => member.id === assignment.memberId,
      ),
    )
    .filter(
      (member): member is (typeof snapshot.dataset.members)[number] =>
        member !== undefined,
    );
  const assignedMemberOverviews = snapshot.memberOverview.filter(
    (overview) => overview.trainer?.id === ptId,
  );
  const managedMembershipRevenue = assignedMemberOverviews.reduce(
    (total, overview) => total + overview.totalMembershipSpend,
    0,
  );
  const managedServiceRevenue = assignedMemberOverviews.reduce(
    (total, overview) => total + overview.totalServiceSpend,
    0,
  );

  const { contract } = ptOverview;
  const compensationDefaults = {
    baseSalary: getSystemConfigNumberValue(
      snapshot,
      `pt_${ptId}_base_salary`,
      contract?.baseSalary ?? 0,
    ),
    overtimeHourlyRate: getSystemConfigNumberValue(
      snapshot,
      `pt_${ptId}_overtime_hourly_rate`,
      contract?.overtimeHourlyRate ?? 0,
    ),
    allowance: getSystemConfigNumberValue(
      snapshot,
      `pt_${ptId}_allowance`,
      contract?.allowances ?? 0,
    ),
    packageCommissionRate: getSystemConfigNumberValue(
      snapshot,
      `pt_${ptId}_package_commission_rate`,
      contract?.packageCommissionRate ?? 0,
    ),
    salesCommissionRate: getSystemConfigNumberValue(
      snapshot,
      `pt_${ptId}_sales_commission_rate`,
      contract?.salesCommissionRate ?? 0,
    ),
    performanceBonusThreshold: getSystemConfigNumberValue(
      snapshot,
      `pt_${ptId}_performance_bonus_threshold`,
      contract?.performanceBonusThreshold ?? 0,
    ),
    performanceBonusAmount: getSystemConfigNumberValue(
      snapshot,
      `pt_${ptId}_performance_bonus_amount`,
      contract?.performanceBonusAmount ?? 0,
    ),
  };

  return (
    <>
      <PageHeader
        eyebrow="Hồ sơ PT"
        title={ptOverview.pt.fullName}
        actions={<ActionLink href="/pts">Quay lại danh sách PT</ActionLink>}
      />

      <StatsGrid
        items={[
          {
            label: "Hội viên đang hoạt động",
            value: `${ptOverview.activeMembers}`,
            note: "Phân công hội viên đang mở.",
          },
          {
            label: "Công quy đổi",
            value: `${ptOverview.validShiftCredits}`,
            note: "Công VALID/HALF trong kỳ.",
          },
          {
            label: "Tăng ca",
            value: formatHours(ptOverview.overtimeHours),
            note: "Tổng giờ tăng ca.",
          },
          {
            label: "Lương kỳ gần nhất",
            value: formatCurrency(ptOverview.estimatedPayroll),
            note: "Thực lĩnh kỳ gần nhất.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Tóm tắt hồ sơ">
          <KeyValueList
            items={[
              { label: "Số điện thoại", value: ptOverview.pt.phone },
              { label: "Giới tính", value: getGenderLabel(ptOverview.pt.gender) },
              {
                label: "Ngày sinh",
                value: formatBirthDateWithAge(ptOverview.pt.birthDate),
              },
              {
                label: "Hội viên đang phụ trách",
                value: `${assignedMembers.length} hội viên`,
              },
              {
                label: "Doanh thu gói tập từ hội viên phụ trách",
                value: formatCurrency(managedMembershipRevenue),
              },
              {
                label: "Doanh thu dịch vụ từ hội viên phụ trách",
                value: formatCurrency(managedServiceRevenue),
              },
              {
                label: "Trạng thái",
                value: (
                  <Badge tone={getStatusTone(ptOverview.pt.status)}>
                    {ptOverview.pt.status}
                  </Badge>
                ),
              },
            ]}
          />
        </SectionCard>

        <SectionCard title="Hội viên được phân công">
          <DataTable
            headers={[
              "Hội viên",
              "Gói hoạt động",
              "Doanh thu gói",
              "Trạng thái",
              "Chi tiết",
            ]}
            rows={assignedMembers.map((member) => {
              const memberOverview = assignedMemberOverviews.find(
                (overview) => overview.member.id === member.id,
              );

              return [
                member.fullName,
                memberOverview?.membershipPlan?.name ?? "Chưa có gói hoạt động",
                formatCurrency(memberOverview?.totalMembershipSpend ?? 0),
                <Badge key={member.id} tone={getStatusTone(member.status)}>
                  {member.status}
                </Badge>,
                <ActionLink
                  key={`${member.id}-detail`}
                  href={`/members/${member.id}`}
                >
                  Mở hội viên
                </ActionLink>,
              ];
            })}
          />
        </SectionCard>
      </div>

      {isAdmin(options) ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <SectionCard title="Cập nhật hồ sơ PT">
            <CollapsibleCrudPanel triggerLabel="Mở bảng sửa hồ sơ PT">
              <form action={updatePersonalTrainerAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="ptId" value={ptId} />
                <FormGrid>
                  <FormField label="Mã PT" name="code" defaultValue={ptOverview.pt.code} required />
                  <FormField label="Họ và tên" name="fullName" defaultValue={ptOverview.pt.fullName} required />
                  <FormSelect
                    label="Giới tính"
                    name="gender"
                    defaultValue={ptOverview.pt.gender}
                    required
                    options={[
                      { value: "MALE", label: "Nam" },
                      { value: "FEMALE", label: "Nữ" },
                      { value: "OTHER", label: "Khác" },
                    ]}
                  />
                  <FormField label="Ngày sinh" name="birthDate" type="date" defaultValue={toDateInputValue(ptOverview.pt.birthDate)} required />
                  <FormField label="Số điện thoại" name="phone" defaultValue={ptOverview.pt.phone} required />
                  <FormField label="Địa chỉ" name="address" defaultValue={ptOverview.pt.address} required />
                  <FormSelect
                    label="Trạng thái"
                    name="status"
                    defaultValue={ptOverview.pt.status}
                    required
                    options={[
                      { value: "ACTIVE", label: "Đang hoạt động" },
                      { value: "INACTIVE", label: "Ngưng hoạt động" },
                    ]}
                  />
                  <FormField label="Số năm kinh nghiệm" name="experienceYears" type="number" min={0} defaultValue={ptOverview.pt.experienceYears} required />
                  <FormField label="Ngày bắt đầu" name="startDate" type="date" defaultValue={toDateInputValue(ptOverview.pt.startDate)} required />
                  <FormField label="Avatar URL" name="avatarUrl" defaultValue={ptOverview.pt.avatarUrl} />
                  <FormField label="User ID liên kết" name="userId" defaultValue={ptOverview.pt.userId} />
                </FormGrid>
                <FormTextArea
                  label="Chuyên môn"
                  name="specialties"
                  defaultValue={ptOverview.pt.specialties.join("\n")}
                  placeholder={"Yoga\nHIIT"}
                />
                <SubmitButton label="Lưu hồ sơ PT" />
              </form>
            </CollapsibleCrudPanel>
          </SectionCard>

          <SectionCard title="Lương PT do Admin quản lý trực tiếp">
            <CollapsibleCrudPanel triggerLabel="Mở bảng cấu hình lương PT">
              <form action={patchPtCompensationAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="ptId" value={ptId} />
                <FormGrid>
                  <FormField
                    label="Lương cơ bản"
                    name="baseSalary"
                    type="number"
                    min={0}
                    step="1000"
                    defaultValue={compensationDefaults.baseSalary}
                    required
                  />
                  <FormField
                    label="Đơn giá tăng ca (giờ)"
                    name="overtimeHourlyRate"
                    type="number"
                    min={0}
                    step="1000"
                    defaultValue={compensationDefaults.overtimeHourlyRate}
                    required
                  />
                  <FormField
                    label="Phụ cấp"
                    name="allowance"
                    type="number"
                    min={0}
                    step="1000"
                    defaultValue={compensationDefaults.allowance}
                    required
                  />
                  <FormField
                    label="Hoa hồng gói (0-1)"
                    name="packageCommissionRate"
                    type="number"
                    min={0}
                    step="0.01"
                    defaultValue={compensationDefaults.packageCommissionRate}
                    required
                  />
                  <FormField
                    label="Hoa hồng bán hàng (0-1)"
                    name="salesCommissionRate"
                    type="number"
                    min={0}
                    step="0.01"
                    defaultValue={compensationDefaults.salesCommissionRate}
                    required
                  />
                  <FormField
                    label="Ngưỡng thưởng hiệu suất"
                    name="performanceBonusThreshold"
                    type="number"
                    min={0}
                    defaultValue={compensationDefaults.performanceBonusThreshold}
                    required
                  />
                  <FormField
                    label="Số tiền thưởng hiệu suất"
                    name="performanceBonusAmount"
                    type="number"
                    min={0}
                    step="1000"
                    defaultValue={compensationDefaults.performanceBonusAmount}
                    required
                  />
                </FormGrid>
                <SubmitButton label="Lưu cấu hình lương PT" />
              </form>
            </CollapsibleCrudPanel>
          </SectionCard>

          <SectionCard title="Ngừng hoạt động PT">
            <CollapsibleCrudPanel triggerLabel="Mở bảng ngừng PT">
              <form action={deletePersonalTrainerAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="ptId" value={ptId} />
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  Hành động này sẽ chuyển PT về trạng thái INACTIVE.
                </p>
                <button
                  type="submit"
                  className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  Ngừng PT
                </button>
              </form>
            </CollapsibleCrudPanel>
          </SectionCard>
        </div>
      ) : null}

      <SectionCard title="Dòng thời gian chấm công">
        <DataTable
          headers={[
            "Ngày",
            "Vào ca",
            "Ra ca",
            "Giờ làm",
            "Tăng ca",
            "Trạng thái",
          ]}
          rows={attendanceLogs.map((attendanceLog) => [
            attendanceLog.attendanceDate,
            formatDateTime(attendanceLog.checkInAt),
            attendanceLog.checkOutAt
              ? formatDateTime(attendanceLog.checkOutAt)
              : "Đang mở",
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

      <SectionCard title="Lịch sử lương">
        <DataTable
          headers={[
            "Kỳ",
            "Công quy đổi",
            "Tăng ca",
            "Hoa hồng gói",
            "Thực lĩnh",
            "Trạng thái",
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

function buildAttendancePage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);
  const { attendanceLogs } = snapshot.dataset;
  const now = new Date();
  const currentVietnamDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const minimumCheckOutHours = 5;
  const trainerOptions = snapshot.dataset.personalTrainers.map((trainer) => ({
    value: trainer.id,
    label: `${trainer.fullName} | ${trainer.code}`,
  }));
  const openShifts = attendanceLogs.filter((attendanceLog) => !attendanceLog.checkOutAt);
  const eligibleCheckoutTrainerIds = new Set(
    openShifts
      .filter((attendanceLog) => {
        const checkInAt = new Date(attendanceLog.checkInAt);

        if (Number.isNaN(checkInAt.getTime())) {
          return false;
        }

        const workedHoursSoFar = (now.getTime() - checkInAt.getTime()) / 36e5;

        return (
          attendanceLog.attendanceDate === currentVietnamDate
          && workedHoursSoFar >= minimumCheckOutHours
        );
      })
      .map((attendanceLog) => attendanceLog.ptId),
  );
  const hasIneligibleOpenShifts = openShifts.length > eligibleCheckoutTrainerIds.size;
  const uniqueOpenShiftTrainerIds = new Set(
    attendanceLogs
      .filter((attendanceLog) => !attendanceLog.checkOutAt)
      .map((attendanceLog) => attendanceLog.ptId),
  );
  const checkoutTrainerOptions = snapshot.dataset.personalTrainers
    .filter((trainer) => eligibleCheckoutTrainerIds.has(trainer.id))
    .map((trainer) => ({
      value: trainer.id,
      label: `${trainer.fullName} | ${trainer.code}`,
    }));
  const uniqueTrainerCount = new Set(
    attendanceLogs.map((attendanceLog) => attendanceLog.ptId),
  ).size;

  return (
    <>
      <PageHeader
        eyebrow="Chấm công PT"
        title="Nhật ký chấm công"
      />

      <StatsGrid
        items={[
          {
            label: "PT có chấm công",
            value: `${uniqueTrainerCount}`,
            note: "Số PT khác nhau có bản ghi trong bảng chấm công.",
          },
          {
            label: "Ca VALID",
            value: `${attendanceLogs.filter((attendanceLog) => attendanceLog.status === "VALID").length}`,
            note: "Ca đủ giờ chuẩn và được tính full credit.",
          },
          {
            label: "Ca HALF",
            value: `${attendanceLogs.filter((attendanceLog) => attendanceLog.status === "HALF").length}`,
            note: "Ca dưới chuẩn nhưng vẫn tính nửa công theo cài đặt.",
          },
          {
            label: "Tăng ca",
            value: formatHours(
              attendanceLogs.reduce(
                (total, attendanceLog) => total + attendanceLog.overtimeHours,
                0,
              ),
            ),
            note: "Tổng giờ vượt ca chuẩn.",
          },
          {
            label: "Công quy đổi",
            value: `${attendanceLogs.reduce((total, attendanceLog) => total + attendanceLog.workCredit, 0)}`,
            note: "Tổng công quy đổi trong kỳ.",
          },
        ]}
      />

      <SectionCard title={`Bảng chấm công (${attendanceLogs.length} bản ghi / ${uniqueTrainerCount} PT)`}>
        <DataTable
          headers={[
            "PT",
            "Ngày",
            "Vào ca",
            "Ra ca",
            "Giờ làm",
            "Tăng ca",
            "Trạng thái",
          ]}
          rows={attendanceLogs.map((attendanceLog) => [
            getTrainerName(snapshot, attendanceLog.ptId),
            attendanceLog.attendanceDate,
            formatDateTime(attendanceLog.checkInAt),
            attendanceLog.checkOutAt
              ? formatDateTime(attendanceLog.checkOutAt)
              : "Đang mở",
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
          title="Thao tác chấm công nhanh"
        >
          <CollapsibleCrudPanel
            triggerLabel="Mở bảng thao tác chấm công"
            helperText="Tất cả thao tác check-in/check-out được gom vào đây để màn hình chính gọn hơn."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <form action={checkInAttendanceAction} className="space-y-4 rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4">
                <input type="hidden" name="locale" value={locale} />
                <FormSelect
                  label="PT"
                  name="ptId"
                  required
                  options={trainerOptions}
                />
                <SubmitButton label="Chấm công vào" />
              </form>

              {checkoutTrainerOptions.length > 0 ? (
                <form action={checkOutAttendanceAction} className="space-y-4 rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4">
                  <input type="hidden" name="locale" value={locale} />
                  <FormSelect
                    label="PT"
                    name="ptId"
                    required
                    options={checkoutTrainerOptions}
                  />
                  <SubmitButton label="Chấm công ra" />
                </form>
              ) : (
                <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4 text-sm text-slate-600">
                  Không có ca đủ điều kiện để chấm công ra (cần ca mở cùng ngày và đã làm đủ tối thiểu 5 giờ).
                </div>
              )}
            </div>
            {hasIneligibleOpenShifts ? (
              <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
                Có {uniqueOpenShiftTrainerIds.size} PT đang có ca mở nhưng chưa đủ điều kiện check-out nhanh. Lý do thường gặp: chưa đủ 5 giờ từ lúc check-in hoặc ca mở không thuộc ngày hiện tại theo múi giờ Việt Nam.
              </p>
            ) : null}
            <p className="mt-3 text-xs text-slate-500">
              Hệ thống tự lấy thời điểm hiện tại khi bấm nút. Chấm công ra chỉ hợp lệ sau tối thiểu 5 giờ từ lúc vào ca.
            </p>
          </CollapsibleCrudPanel>
        </SectionCard>
      ) : null}
    </>
  );
}

function buildPayrollPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);

  return (
    <>
      <PageHeader
        eyebrow="Bảng lương"
        title="Kỳ lương"
      />

      <StatsGrid
        items={[
          {
            label: "Tổng lương",
            value: formatCurrency(snapshot.payrollReport.totalPayroll),
            note: "Tổng thực lĩnh tất cả kỳ.",
          },
          {
            label: "Lương đã duyệt",
            value: formatCurrency(snapshot.payrollReport.approvedPayroll),
            note: "Bao gồm các phiếu đã duyệt và đã chi.",
          },
          {
            label: "Lương chờ duyệt",
            value: formatCurrency(snapshot.payrollReport.pendingPayroll),
            note: "Thực nhận đang chờ duyệt.",
          },
          {
            label: "Các kỳ",
            value: `${snapshot.dataset.payrollPeriods.length}`,
            note: "Số kỳ lương có sẵn trong dữ liệu mẫu.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionCard title="Kỳ lương">
          <DataTable
            headers={["Mã", "Khoảng thời gian", "Trạng thái", "Chi tiết"]}
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
                Mở kỳ
              </ActionLink>,
            ])}
          />
        </SectionCard>

        <SectionCard title="Bảng lương theo PT">
          <DataTable
            headers={["PT", "Kỳ", "Thực lĩnh", "Trạng thái"]}
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
            title="Tạo kỳ lương"
          >
            <CollapsibleCrudPanel triggerLabel="Mở bảng tạo kỳ lương">
              <form action={createPayrollPeriodAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormGrid>
                  <FormField
                    label="Mã"
                    name="code"
                    placeholder="2026-04-A"
                  />
                  <FormField label="Từ ngày" name="from" type="date" required />
                  <FormField label="Đến ngày" name="to" type="date" required />
                </FormGrid>
                <SubmitButton label="Tạo kỳ" />
              </form>
            </CollapsibleCrudPanel>
          </SectionCard>

          <SectionCard
            title="Tạo bảng lương"
          >
            <CollapsibleCrudPanel triggerLabel="Mở bảng tạo bảng lương">
              <form action={generatePayrollAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormSelect
                  label="Kỳ lương"
                  name="payrollPeriodId"
                  required
                  options={snapshot.dataset.payrollPeriods.map((period) => ({
                    value: period.id,
                    label: `${period.code} | ${formatDate(period.from)} - ${formatDate(period.to)} | ${humanizeStatus(period.status)}`,
                  }))}
                />
                <SubmitButton label="Tạo bảng lương" />
              </form>
            </CollapsibleCrudPanel>
          </SectionCard>
        </div>
      ) : null}
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
        eyebrow="Chi tiết kỳ lương"
        title={`Kỳ lương ${period.code}`}
        actions={<ActionLink href="/payroll">Quay lại bảng lương</ActionLink>}
      />

      <SectionCard title="Bản ghi trong kỳ">
        <DataTable
          headers={[
            "PT",
            "Công quy đổi",
            "Tăng ca",
            "Hoa hồng gói",
            "Hoa hồng bán hàng",
            "Thực lĩnh",
            "Trạng thái",
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

function buildMembersPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);
  const membersWithPt = snapshot.memberOverview.filter(
    (item) => item.trainer !== undefined,
  ).length;

  return (
    <>
      <PageHeader
        eyebrow="Quản lý hội viên"
        title="Hội viên"
        actions={
          <ActionLink href="/members/memberships">
            Mở gói tập đã bán
          </ActionLink>
        }
      />

      <StatsGrid
        items={[
          {
            label: "Tổng hội viên",
            value: `${snapshot.dataset.members.length}`,
            note: "Bao gồm cả trạng thái hoạt động và ngưng hoạt động.",
          },
          {
            label: "Hội viên có PT",
            value: `${membersWithPt}`,
            note: "Được tính từ các phân công đang hoạt động.",
          },
          {
            label: "Gói năm đang hoạt động",
            value: `${snapshot.dashboard.activeMemberships.YEAR}`,
            note: "Nhóm gói cao cấp có PT kèm theo.",
          },
          {
            label: "Doanh thu gói tập",
            value: formatCurrency(snapshot.revenueReport.membershipRevenue),
            note: "Tổng thu hóa đơn gói tập đã xác nhận.",
          },
        ]}
      />

      {isAdmin(options) ? (
        <SectionCard title="Thêm hội viên mới">
          <CollapsibleCrudPanel
            triggerLabel="Mở bảng thêm hội viên"
            helperText="Chỉ cần mã hội viên, họ tên, số điện thoại. Hệ thống tự điền thông tin mặc định còn lại."
          >
            <form action={createMemberAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <FormGrid>
                <FormField label="Mã hội viên" name="code" placeholder="MEM-NEW" required />
                <FormField label="Họ và tên" name="fullName" required />
                <FormField label="Số điện thoại" name="phone" required />
              </FormGrid>
              <SubmitButton label="Tạo hội viên" />
            </form>
          </CollapsibleCrudPanel>
        </SectionCard>
      ) : null}

      <SectionCard title="Danh sách hội viên">
        <DataTable
          headers={[
            "Hội viên",
            "Gói hiện tại",
            "Chi cho gói tập",
            "Chi cho dịch vụ",
            "PT phụ trách",
            "Chi tiết",
          ]}
          rows={sortMembersByDate(snapshot.dataset.members).map((member) => {
            const overview = snapshot.memberOverview.find(
              (item) => item.member.id === member.id,
            );

            return [
              <div key={member.id}>
                <p className="font-semibold text-slate-900">{member.fullName}</p>
                <p className="text-xs text-slate-500">
                  {member.phone} | {getGenderLabel(member.gender)}
                </p>
              </div>,
              overview?.membershipPlan?.name ?? "Chưa có gói hoạt động",
              formatCurrency(overview?.totalMembershipSpend ?? 0),
              formatCurrency(overview?.totalServiceSpend ?? 0),
              overview?.trainer?.fullName ?? "Chưa gán",
              <ActionLink
                key={`${member.id}-detail`}
                href={`/members/${member.id}`}
              >
                Mở hội viên
              </ActionLink>,
            ];
          })}
        />
      </SectionCard>
    </>
  );
}

function buildMemberDetailPage(
  memberId: string,
  options?: RenderGymRouteOptions,
): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);
  const member = snapshot.dataset.members.find((item) => item.id === memberId);

  if (!member) {
    notFound();
  }

  const memberOverview = snapshot.memberOverview.find(
    (overview) => overview.member.id === memberId,
  );

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
        eyebrow="Chi tiết hội viên"
        title={member.fullName}
        actions={<ActionLink href="/members">Quay lại danh sách hội viên</ActionLink>}
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Tóm tắt gói & doanh thu">
          <KeyValueList
            items={[
              { label: "Số điện thoại", value: member.phone },
              { label: "Giới tính", value: getGenderLabel(member.gender) },
              {
                label: "Ngày sinh",
                value: formatBirthDateWithAge(member.birthDate),
              },
              {
                label: "Gói đang hoạt động",
                value: memberOverview?.membershipPlan?.name ?? "Chưa có gói hoạt động",
              },
              {
                label: "PT phụ trách",
                value: memberOverview?.trainer?.fullName ?? "Chưa gán",
              },
              {
                label: "Tổng chi gói tập",
                value: formatCurrency(memberOverview?.totalMembershipSpend ?? 0),
              },
              {
                label: "Tổng chi dịch vụ",
                value: formatCurrency(memberOverview?.totalServiceSpend ?? 0),
              },
              {
                label: "Trạng thái",
                value: (
                  <Badge tone={getStatusTone(member.status)}>
                    {member.status}
                  </Badge>
                ),
              },
            ]}
          />
        </SectionCard>

        <SectionCard title="Lịch sử gói tập">
          <DataTable
            headers={[
              "Gói",
              "Bắt đầu",
              "Kết thúc",
              "Buổi PT còn lại",
              "Trạng thái",
            ]}
            rows={memberships.map((membership) => [
              getPlanName(snapshot, membership.membershipPlanId),
              formatDate(membership.startDate),
              formatDate(membership.endDate),
              membership.remainingSessions === null
                ? "Không giới hạn"
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

      {isAdmin(options) ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <SectionCard title="Cập nhật hội viên">
            <CollapsibleCrudPanel triggerLabel="Mở bảng sửa hội viên">
              <form action={updateMemberAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="memberId" value={memberId} />
                <FormGrid>
                  <FormField label="Mã hội viên" name="code" defaultValue={member.code} required />
                  <FormField label="Họ và tên" name="fullName" defaultValue={member.fullName} required />
                  <FormSelect
                    label="Giới tính"
                    name="gender"
                    defaultValue={member.gender}
                    required
                    options={[
                      { value: "MALE", label: "Nam" },
                      { value: "FEMALE", label: "Nữ" },
                      { value: "OTHER", label: "Khác" },
                    ]}
                  />
                  <FormField label="Ngày sinh" name="birthDate" type="date" defaultValue={toDateInputValue(member.birthDate)} required />
                  <FormField label="Số điện thoại" name="phone" defaultValue={member.phone} required />
                  <FormField label="Địa chỉ" name="address" defaultValue={member.address} required />
                  <FormField label="Chiều cao (cm)" name="heightCm" type="number" min={0} defaultValue={member.heightCm} required />
                  <FormField label="Cân nặng (kg)" name="weightKg" type="number" min={0} defaultValue={member.weightKg} required />
                  <FormField label="Mục tiêu" name="goal" defaultValue={member.goal} required />
                  <FormField label="Ghi chú sức khỏe" name="healthNotes" defaultValue={member.healthNotes} required />
                  <FormField label="Ngày đăng ký" name="registeredAt" type="date" defaultValue={toDateInputValue(member.registeredAt)} required />
                  <FormSelect
                    label="Trạng thái"
                    name="status"
                    defaultValue={member.status}
                    required
                    options={[
                      { value: "ACTIVE", label: "Đang hoạt động" },
                      { value: "INACTIVE", label: "Ngưng hoạt động" },
                    ]}
                  />
                </FormGrid>
                <SubmitButton label="Lưu hội viên" />
              </form>
            </CollapsibleCrudPanel>
          </SectionCard>

          <SectionCard title="Ngừng hội viên">
            <CollapsibleCrudPanel triggerLabel="Mở bảng ngừng hội viên">
              <form action={deleteMemberAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="memberId" value={memberId} />
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  Hành động này sẽ chuyển hội viên về trạng thái INACTIVE.
                </p>
                <button
                  type="submit"
                  className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  Ngừng hội viên
                </button>
              </form>
            </CollapsibleCrudPanel>
          </SectionCard>
        </div>
      ) : null}

      <SectionCard title="Phân công PT">
        <DataTable
          headers={["PT", "Từ ngày", "Đến ngày", "Hoa hồng", "Trạng thái"]}
          rows={ptAssignments.map((assignment) => [
            getTrainerName(snapshot, assignment.ptId),
            formatDate(assignment.assignedFrom),
            assignment.assignedTo
              ? formatDate(assignment.assignedTo)
              : "Đang hoạt động",
            formatCurrency(assignment.commissionAmount),
            <Badge key={assignment.id} tone={getStatusTone(assignment.status)}>
              {humanizeStatus(assignment.status)}
            </Badge>,
          ])}
        />
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Hóa đơn gói tập">
          <DataTable
            headers={["Mã", "Ngày", "Số tiền", "Thanh toán"]}
            rows={membershipInvoices.map((invoice) => [
              invoice.code,
              formatDateTime(invoice.invoiceDate),
              formatCurrency(invoice.totalAmount),
              invoice.paymentMethod,
            ])}
          />
        </SectionCard>

        <SectionCard title="Hóa đơn dịch vụ">
          <DataTable
            headers={["Mã", "Ngày", "Tổng", "Trạng thái"]}
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
        eyebrow="Vòng đời gói tập"
        title="Gói tập đã bán"
      />

      {isAdmin(options) ? (
        <>
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <SectionCard
              title="Bán gói tập mới"
            >
              <CollapsibleCrudPanel triggerLabel="Mở bảng bán gói tập">
                <form action={createMembershipAction} className="space-y-4">
                  <input type="hidden" name="locale" value={locale} />
                  <FormGrid>
                    <FormSelect
                      label="Hội viên"
                      name="memberId"
                      required
                      options={snapshot.dataset.members.map((member) => ({
                        value: member.id,
                        label: `${member.code} | ${member.fullName}`,
                      }))}
                    />
                    <FormSelect
                      label="Gói"
                      name="membershipPlanId"
                      required
                      options={snapshot.dataset.membershipPlans.map((plan) => ({
                        value: plan.id,
                        label: `${plan.name} | ${formatCurrency(plan.price)}`,
                      }))}
                    />
                    <FormField
                      label="Ngày bắt đầu"
                      name="startDate"
                      type="date"
                      required
                    />
                    <FormSelect
                      label="Phương thức thanh toán"
                      name="paymentMethod"
                      required
                      defaultValue="BANK_TRANSFER"
                      options={[
                        { value: "CASH", label: "Tiền mặt" },
                        { value: "CARD", label: "Thẻ" },
                        { value: "BANK_TRANSFER", label: "Chuyển khoản" },
                      ]}
                    />
                  </FormGrid>
                  <SubmitButton label="Bán gói tập" />
                </form>
              </CollapsibleCrudPanel>
            </SectionCard>

            <SectionCard
              title="Gia hạn gói tập"
            >
              <CollapsibleCrudPanel triggerLabel="Mở bảng gia hạn gói tập">
                <form action={renewMembershipAction} className="space-y-4">
                  <input type="hidden" name="locale" value={locale} />
                  <FormSelect
                    label="Gói tập hiện có"
                    name="membershipId"
                    required
                    options={manageableMemberships.map((membership) => ({
                      value: membership.id,
                      label: `${getMemberName(snapshot, membership.memberId)} | ${getPlanName(snapshot, membership.membershipPlanId)} | ${humanizeStatus(membership.status)}`,
                    }))}
                  />
                  <FormGrid>
                    <FormField
                      label="Ngày bắt đầu mới"
                      name="startDate"
                      type="date"
                    />
                    <FormSelect
                      label="Phương thức thanh toán"
                      name="paymentMethod"
                      defaultValue="BANK_TRANSFER"
                      options={[
                        { value: "", label: "Giữ mặc định" },
                        { value: "CASH", label: "Tiền mặt" },
                        { value: "CARD", label: "Thẻ" },
                        { value: "BANK_TRANSFER", label: "Chuyển khoản" },
                      ]}
                    />
                  </FormGrid>
                  <SubmitButton label="Gia hạn gói tập" />
                </form>
              </CollapsibleCrudPanel>
            </SectionCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
            <SectionCard
              title="Hủy gói tập"
            >
              <CollapsibleCrudPanel triggerLabel="Mở bảng hủy gói tập">
                <form action={cancelMembershipAction} className="space-y-4">
                  <input type="hidden" name="locale" value={locale} />
                  <FormSelect
                    label="Gói tập"
                    name="membershipId"
                    required
                    options={manageableMemberships.map((membership) => ({
                      value: membership.id,
                      label: `${getMemberName(snapshot, membership.memberId)} | ${getPlanName(snapshot, membership.membershipPlanId)}`,
                    }))}
                  />
                  <FormField
                    label="Thời điểm hủy"
                    name="cancelledAt"
                    type="date"
                  />
                  <SubmitButton label="Hủy gói tập" />
                </form>
              </CollapsibleCrudPanel>
            </SectionCard>

            <SectionCard
              title="Phân công PT"
            >
              <CollapsibleCrudPanel triggerLabel="Mở bảng phân công PT">
                <form action={createAssignmentAction} className="space-y-4">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="commissionType" value="PERCENT" />
                  <input type="hidden" name="commissionValue" value="10" />
                  <FormSelect
                    label="Hội viên"
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
                    label="Gói tập"
                    name="memberMembershipId"
                    required
                    options={manageableMemberships.map((membership) => ({
                      value: membership.id,
                      label: `${getMemberName(snapshot, membership.memberId)} | ${getPlanName(snapshot, membership.membershipPlanId)}`,
                    }))}
                  />
                  <FormGrid>
                    <FormField
                      label="Phân công từ"
                      name="assignedFrom"
                      type="date"
                      required
                    />
                  </FormGrid>
                  <p className="text-xs text-slate-500">
                    Hệ thống mặc định hoa hồng phân công là 10%.
                  </p>
                  <SubmitButton label="Tạo phân công" />
                </form>
              </CollapsibleCrudPanel>
            </SectionCard>

            <SectionCard
              title="Kết thúc phân công PT"
            >
              <CollapsibleCrudPanel triggerLabel="Mở bảng kết thúc phân công">
                <form action={endAssignmentAction} className="space-y-4">
                  <input type="hidden" name="locale" value={locale} />
                  <FormSelect
                    label="Phân công đang hoạt động"
                    name="assignmentId"
                    required
                    options={activeAssignments.map((assignment) => ({
                      value: assignment.id,
                      label: `${getMemberName(snapshot, assignment.memberId)} -> ${getTrainerName(snapshot, assignment.ptId)}`,
                    }))}
                  />
                  <FormField
                    label="Phân công đến"
                    name="assignedTo"
                    type="date"
                  />
                  <SubmitButton label="Kết thúc phân công" />
                </form>
              </CollapsibleCrudPanel>
            </SectionCard>
          </div>
        </>
      ) : null}

      <SectionCard title="Gói tập của hội viên">
        <DataTable
          headers={["Hội viên", "Gói", "Khoảng thời gian", "Kèm PT", "Trạng thái"]}
          rows={snapshot.dataset.memberMemberships.map((membership) => {
            const plan = snapshot.dataset.membershipPlans.find(
              (item) => item.id === membership.membershipPlanId,
            );

            return [
              getMemberName(snapshot, membership.memberId),
              plan?.name ?? membership.membershipPlanId,
              `${formatDate(membership.startDate)} - ${formatDate(membership.endDate)}`,
              plan?.includesPt ? "Có" : "Không",
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

function buildMemberAssignmentsPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);

  return (
    <>
      <PageHeader
        eyebrow="Phân công PT"
        title="Phân công hội viên"
      />

      <StatsGrid
        items={[
          {
            label: "Phân công đang hoạt động",
            value: `${snapshot.dataset.memberPtAssignments.filter(a => a.status === 'ACTIVE').length}`,
            note: "Tổng số PT đang theo dõi hội viên.",
          },
          {
            label: "Tổng phân công",
            value: `${snapshot.dataset.memberPtAssignments.length}`,
            note: "Lịch sử toàn bộ phân công.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Nhật ký phân công">
          <DataTable
            headers={[
              "Hội viên",
              "PT",
              "Hoa hồng",
              "Phân công từ",
              "Đến ngày",
              "Trạng thái",
              "Hành động",
            ]}
            rows={snapshot.dataset.memberPtAssignments.map((assignment) => [
              getMemberName(snapshot, assignment.memberId),
              getTrainerName(snapshot, assignment.ptId),
              assignment.commissionType === "PERCENT"
                ? `${(assignment.commissionValue ?? 0) * 100}%`
                : formatCurrency(assignment.commissionValue ?? 0),
              formatDate(assignment.assignedFrom),
              assignment.assignedTo ? formatDate(assignment.assignedTo) : "-",
              <Badge
                key={assignment.id}
                tone={getStatusTone(assignment.status)}
              >
                {assignment.status}
              </Badge>,
              assignment.status === "ACTIVE" ? (
                <form key={`${assignment.id}-form`} action={endAssignmentAction}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="assignmentId" value={assignment.id} />
                  <button type="submit" className="text-sm font-semibold text-rose-600 hover:text-rose-700">Kết thúc</button>
                </form>
              ) : null,
            ])}
          />
        </SectionCard>

        {isAdmin(options) ? (
          <SectionCard
            title="Tạo phân công"
          >
            <CollapsibleCrudPanel triggerLabel="Mở bảng tạo phân công">
              <form action={createAssignmentAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="commissionType" value="PERCENT" />
                <input type="hidden" name="commissionValue" value="10" />
                <FormGrid>
                  <FormSelect
                    label="Hội viên"
                    name="memberId"
                    options={snapshot.dataset.members.map((m) => ({
                      value: m.id,
                      label: m.fullName,
                    }))}
                    required
                  />
                  <FormSelect
                    label="PT"
                    name="ptId"
                    options={snapshot.dataset.personalTrainers.filter(pt => pt.status === 'ACTIVE').map((pt) => ({
                      value: pt.id,
                      label: pt.fullName,
                    }))}
                    required
                  />
                  <FormSelect
                    label="Gói tập"
                    name="memberMembershipId"
                    options={snapshot.dataset.memberMemberships.filter(m => m.status === 'ACTIVE').map((m) => ({
                      value: m.id,
                      label: `${getPlanName(snapshot, m.membershipPlanId)} (${getMemberName(snapshot, m.memberId)})`,
                    }))}
                    required
                  />
                  <FormField
                    label="Phân công từ"
                    name="assignedFrom"
                    type="date"
                    required
                  />
                  <FormField
                    label="Phân công đến"
                    name="assignedTo"
                    type="date"
                  />
                </FormGrid>
                <p className="text-xs text-slate-500">
                  Hệ thống áp dụng hoa hồng mặc định 10% cho phân công mới.
                </p>
                <SubmitButton label="Tạo phân công" />
              </form>
            </CollapsibleCrudPanel>
          </SectionCard>
        ) : null}
      </div>
    </>
  );
}

function buildMembershipPlansPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);

  return (
    <>
      <PageHeader
        eyebrow="Danh mục"
        title="Gói tập"
      />

      {isAdmin(options) ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <SectionCard title="Thêm gói tập mới">
            <CollapsibleCrudPanel triggerLabel="Mở bảng thêm gói tập">
              <form action={createMembershipPlanAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormGrid>
                  <FormField label="Mã gói" name="code" placeholder="PLAN-NEW" required />
                  <FormField label="Tên gói" name="name" required />
                  <FormSelect
                    label="Loại"
                    name="type"
                    defaultValue="MONTH"
                    options={[
                      { value: "DAY", label: "Ngày" },
                      { value: "MONTH", label: "Tháng" },
                      { value: "YEAR", label: "Năm" },
                    ]}
                    required
                  />
                  <FormField label="Giá bán" name="price" type="number" min={0} step="1000" required />
                  <FormField label="Số ngày" name="durationDays" type="number" min={1} defaultValue={30} required />
                  <FormField label="Giới hạn lượt" name="usageLimit" type="number" min={1} />
                  <FormSelect
                    label="Kèm PT"
                    name="includesPt"
                    defaultValue="false"
                    options={[
                      { value: "false", label: "Không" },
                      { value: "true", label: "Có" },
                    ]}
                    required
                  />
                  <FormField
                    label="Buổi PT kèm theo"
                    name="includedPtSessions"
                    type="number"
                    min={0}
                    defaultValue={0}
                    required
                  />
                  <FormSelect
                    label="Trạng thái"
                    name="status"
                    defaultValue="ON_SALE"
                    options={[
                      { value: "ON_SALE", label: "Đang bán" },
                      { value: "OFF_SALE", label: "Ngừng bán" },
                    ]}
                    required
                  />
                </FormGrid>
                <FormTextArea
                  label="Quyền lợi"
                  name="perks"
                  placeholder={"Tập không giới hạn\nTư vấn dinh dưỡng"}
                />
                <SubmitButton label="Tạo gói tập" />
              </form>
            </CollapsibleCrudPanel>
          </SectionCard>

          <SectionCard title="Ngừng bán gói tập">
            <CollapsibleCrudPanel triggerLabel="Mở bảng ngừng bán gói">
              <form action={deleteMembershipPlanAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormSelect
                  label="Gói tập"
                  name="planId"
                  required
                  options={snapshot.dataset.membershipPlans.map((plan) => ({
                    value: plan.id,
                    label: `${plan.name} | ${humanizeStatus(plan.status)}`,
                  }))}
                />
                <button
                  type="submit"
                  className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  Ngừng bán
                </button>
              </form>
            </CollapsibleCrudPanel>
          </SectionCard>
        </div>
      ) : null}

      <SectionCard title="Danh mục gói tập">
        <DataTable
          headers={[
            "Gói",
            "Loại",
            "Giá",
            "Kèm PT",
            "Quyền lợi",
            "Trạng thái",
            "Cập nhật",
          ]}
          rows={snapshot.dataset.membershipPlans.map((plan) => [
            plan.name,
            plan.type,
            formatCurrency(plan.price),
            plan.includesPt ? `${plan.includedPtSessions} buổi` : "Không",
            plan.perks.join(", "),
            <Badge key={plan.id} tone={getStatusTone(plan.status)}>
              {humanizeStatus(plan.status)}
            </Badge>,
            isAdmin(options) ? (
              <details key={`${plan.id}-edit`} className="group min-w-[12.5rem] rounded-2xl border border-slate-200/80 bg-white/90 p-2">
                <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Chỉnh sửa
                </summary>
                <form action={updateMembershipPlanAction} className="mt-2 flex flex-wrap items-center gap-2">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="planId" value={plan.id} />
                  <input type="hidden" name="code" value={plan.code} />
                  <input type="hidden" name="name" value={plan.name} />
                  <input type="hidden" name="type" value={plan.type} />
                  <input type="hidden" name="durationDays" value={plan.durationDays} />
                  <input type="hidden" name="includesPt" value={plan.includesPt ? "true" : "false"} />
                  <input type="hidden" name="includedPtSessions" value={plan.includedPtSessions} />
                  <input type="hidden" name="perks" value={plan.perks.join("\n")} />
                  <input
                    type="number"
                    name="price"
                    defaultValue={plan.price}
                    min={0}
                    step="1000"
                    className="w-28 rounded-xl border border-slate-200 px-2 py-1 text-xs"
                  />
                  <input
                    type="number"
                    name="usageLimit"
                    defaultValue={plan.usageLimit ?? ""}
                    min={1}
                    className="w-24 rounded-xl border border-slate-200 px-2 py-1 text-xs"
                    placeholder="Lượt"
                  />
                  <select
                    name="status"
                    defaultValue={plan.status}
                    className="rounded-xl border border-slate-200 px-2 py-1 text-xs"
                  >
                    <option value="ON_SALE">ON_SALE</option>
                    <option value="OFF_SALE">OFF_SALE</option>
                  </select>
                  <button type="submit" className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    Lưu
                  </button>
                </form>
              </details>
            ) : "-",
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
        eyebrow="Thanh toán gói tập"
        title="Hóa đơn gói tập"
      />
      <SectionCard title="Danh sách hóa đơn gói tập">
        <DataTable
          headers={["Mã", "Hội viên", "Ngày", "Số tiền", "Thanh toán", "Trạng thái"]}
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

function buildProductsPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);

  return (
    <>
      <PageHeader
        eyebrow="Danh mục bán lẻ"
        title="Sản phẩm"
      />
      <StatsGrid
        items={[
          {
            label: "Tổng sản phẩm",
            value: `${snapshot.inventoryOverview.totalProducts}`,
            note: "Số SKU đang được theo dõi trong phòng gym.",
          },
          {
            label: "Tồn kho thấp",
            value: `${snapshot.inventoryOverview.lowStockCount}`,
            note: "Cần nhập bổ sung ngay trong kỳ.",
          },
          {
            label: "Giá trị tồn kho",
            value: formatCurrency(snapshot.inventoryOverview.stockValue),
            note: "Tồn kho tính theo đơn giá vốn.",
          },
          {
            label: "Doanh thu dịch vụ",
            value: formatCurrency(snapshot.revenueReport.servicesRevenue),
            note: "Doanh thu từ hóa đơn bán hàng đã xác nhận.",
          },
        ]}
      />

      {isAdmin(options) ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <SectionCard title="Thêm sản phẩm">
            <CollapsibleCrudPanel triggerLabel="Mở bảng thêm sản phẩm">
              <form action={createProductAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormGrid>
                  <FormField label="Mã sản phẩm" name="code" placeholder="PRD-NEW" required />
                  <FormField label="Tên sản phẩm" name="name" required />
                  <FormField label="Danh mục" name="category" required />
                  <FormField label="Đơn giá vốn" name="unitCost" type="number" min={0} step="1000" required />
                  <FormField label="Giá bán" name="salePrice" type="number" min={0} step="1000" required />
                  <FormField label="Tồn kho" name="stockOnHand" type="number" min={0} defaultValue={0} required />
                  <FormField label="Ngưỡng cảnh báo" name="minimumStockLevel" type="number" min={0} defaultValue={10} required />
                  <FormSelect
                    label="Trạng thái"
                    name="status"
                    defaultValue="ACTIVE"
                    required
                    options={[
                      { value: "ACTIVE", label: "ACTIVE" },
                      { value: "INACTIVE", label: "INACTIVE" },
                    ]}
                  />
                </FormGrid>
                <SubmitButton label="Tạo sản phẩm" />
              </form>
            </CollapsibleCrudPanel>
          </SectionCard>

          <SectionCard title="Ngừng sản phẩm">
            <CollapsibleCrudPanel triggerLabel="Mở bảng ngừng sản phẩm">
              <form action={deleteProductAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormSelect
                  label="Sản phẩm"
                  name="productId"
                  required
                  options={snapshot.dataset.products.map((product) => ({
                    value: product.id,
                    label: `${product.name} | ${humanizeStatus(product.status)}`,
                  }))}
                />
                <button
                  type="submit"
                  className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  Ngừng sản phẩm
                </button>
              </form>
            </CollapsibleCrudPanel>
          </SectionCard>
        </div>
      ) : null}

      <SectionCard title="Danh sách sản phẩm">
        <DataTable
          headers={[
            "Sản phẩm",
            "Danh mục",
            "Đơn giá vốn",
            "Giá bán",
            "Tồn kho",
            "Ngưỡng",
            "Cập nhật",
          ]}
          rows={sortProductsByStock(snapshot.dataset.products).map(
            (product) => [
              product.name,
              product.category,
              formatCurrency(product.unitCost),
              formatCurrency(product.salePrice),
              `${product.stockOnHand}`,
              `${product.minimumStockLevel}`,
              isAdmin(options) ? (
                <details key={`${product.id}-edit`} className="group min-w-[12.5rem] rounded-2xl border border-slate-200/80 bg-white/90 p-2">
                  <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                    Chỉnh sửa
                  </summary>
                  <form action={updateProductAction} className="mt-2 flex flex-wrap items-center gap-2">
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="code" value={product.code} />
                    <input type="hidden" name="name" value={product.name} />
                    <input type="hidden" name="category" value={product.category} />
                    <input type="hidden" name="unitCost" value={product.unitCost} />
                    <input
                      type="number"
                      name="salePrice"
                      defaultValue={product.salePrice}
                      min={0}
                      step="1000"
                      className="w-24 rounded-xl border border-slate-200 px-2 py-1 text-xs"
                    />
                    <input
                      type="number"
                      name="stockOnHand"
                      defaultValue={product.stockOnHand}
                      min={0}
                      className="w-20 rounded-xl border border-slate-200 px-2 py-1 text-xs"
                    />
                    <input
                      type="number"
                      name="minimumStockLevel"
                      defaultValue={product.minimumStockLevel}
                      min={0}
                      className="w-20 rounded-xl border border-slate-200 px-2 py-1 text-xs"
                    />
                    <select
                      name="status"
                      defaultValue={product.status}
                      className="rounded-xl border border-slate-200 px-2 py-1 text-xs"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                    <button type="submit" className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                      Lưu
                    </button>
                  </form>
                </details>
              ) : "-",
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
        eyebrow="Kho hàng"
        title="Giao dịch kho"
        actions={<ActionLink href="/inventory/import">Mở phiếu nhập</ActionLink>}
      />
      <StatsGrid
        items={[
          {
            label: "Giá trị tồn kho",
            value: formatCurrency(snapshot.inventoryOverview.stockValue),
            note: "Tính theo đơn giá vốn.",
          },
          {
            label: "Giao dịch gần đây",
            value: `${snapshot.inventoryOverview.recentTransactions.length}`,
            note: "6 giao dịch gần nhất.",
          },
          {
            label: "Sản phẩm bán chạy nhất",
            value:
              snapshot.inventoryOverview.topSellingProducts[0]?.product.name ??
              "Không có",
            note: "Sản phẩm bán chạy nhất.",
          },
          {
            label: "Số SKU tồn thấp",
            value: `${snapshot.inventoryOverview.lowStockCount}`,
            note: "Số SKU đang cảnh báo.",
          },
        ]}
      />

      {isAdmin(options) ? (
        <SectionCard
          title="Tạo phiếu nhập"
        >
          <CollapsibleCrudPanel triggerLabel="Mở bảng tạo phiếu nhập">
            <form action={importInventoryAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <FormGrid>
                <FormSelect
                  label="Sản phẩm"
                  name="productId"
                  required
                  options={snapshot.dataset.products.map((product) => ({
                    value: product.id,
                    label: `${product.code} | ${product.name}`,
                  }))}
                />
                <FormField
                  label="Số lượng"
                  name="quantity"
                  type="number"
                  min={1}
                  defaultValue={10}
                  required
                />
                <FormField
                  label="Đơn giá vốn"
                  name="unitCost"
                  type="number"
                  min={0}
                  step="1000"
                  required
                />
                <FormField
                  label="Mã tham chiếu"
                  name="referenceCode"
                  placeholder="PO-2026-04-01"
                />
              </FormGrid>
              <SubmitButton label="Tạo phiếu nhập" />
            </form>
          </CollapsibleCrudPanel>
        </SectionCard>
      ) : null}

      <SectionCard title="Sổ kho">
        <DataTable
          headers={["Ngày", "Sản phẩm", "Loại", "SL", "Tham chiếu", "Ghi chú"]}
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
        eyebrow="Nhập hàng"
        title="Theo dõi nhập kho"
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Giao dịch nhập kho">
          <DataTable
            headers={["Ngày", "Sản phẩm", "SL", "Đơn giá vốn", "Tham chiếu"]}
            rows={importTransactions.map((transaction) => [
              formatDateTime(transaction.transactionDate),
              getProductName(snapshot, transaction.productId),
              `${transaction.quantity}`,
              formatCurrency(transaction.unitCost),
              transaction.referenceCode,
            ])}
          />
        </SectionCard>

        <SectionCard title="Danh sách gợi ý nhập bổ sung">
          <DataTable
            headers={[
              "Sản phẩm",
              "Tồn kho hiện tại",
              "Ngưỡng",
              "Gợi ý hành động",
            ]}
            rows={sortProductsByStock(snapshot.dashboard.lowStockProducts).map(
              (product) => [
                product.name,
                `${product.stockOnHand}`,
                `${product.minimumStockLevel}`,
                "Tạo yêu cầu nhập",
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
        eyebrow="Bán hàng"
        title="Hóa đơn dịch vụ"
      />

      {canManageGym(options) ? (
        <SectionCard
          title="Tạo hóa đơn bán hàng"
        >
          <CollapsibleCrudPanel triggerLabel="Mở bảng tạo hóa đơn">
            <form action={createSalesInvoiceAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <FormGrid>
                <FormSelect
                  label="Hội viên (tùy chọn)"
                  name="memberId"
                  defaultValue=""
                  options={[
                    { value: "", label: "Khách lẻ" },
                    ...snapshot.dataset.members.map((member) => ({
                      value: member.id,
                      label: `${member.code} | ${member.fullName}`,
                    })),
                  ]}
                />
                <FormField
                  label="Tên khách hàng (tùy chọn)"
                  name="customerName"
                  placeholder="Trần Văn A"
                />
                <FormSelect
                  label="Sản phẩm"
                  name="productId"
                  required
                  options={snapshot.dataset.products.map((product) => ({
                    value: product.id,
                    label: `${product.code} | ${product.name} | ${formatCurrency(product.salePrice)}`,
                  }))}
                />
                <FormField
                  label="Số lượng"
                  name="quantity"
                  type="number"
                  min={1}
                  defaultValue={1}
                  required
                />
                <FormSelect
                  label="Phương thức thanh toán"
                  name="paymentMethod"
                  defaultValue="CASH"
                  required
                  options={[
                    { value: "CASH", label: "Tiền mặt" },
                    { value: "CARD", label: "Thẻ" },
                    { value: "BANK_TRANSFER", label: "Chuyển khoản" },
                  ]}
                />
                <input type="hidden" name="discountAmount" value="0" />
              </FormGrid>
              <SubmitButton label="Tạo hóa đơn" />
            </form>
          </CollapsibleCrudPanel>
        </SectionCard>
      ) : null}

      <SectionCard title="Hóa đơn bán hàng">
        <DataTable
          headers={[
            "Mã",
            "Khách hàng",
            "Ngày",
            "Tổng",
            "Thanh toán",
            "Trạng thái",
            "Chi tiết",
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
              Mở hóa đơn
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
        eyebrow="Chi tiết hóa đơn bán hàng"
        title={invoice.code}
        actions={<ActionLink href="/invoices">Quay lại danh sách hóa đơn</ActionLink>}
      />
      <SectionCard title="Tóm tắt hóa đơn">
        <KeyValueList
          items={[
            { label: "Khách hàng", value: invoice.customerName },
            {
              label: "Hội viên",
              value: invoice.memberId
                ? getMemberName(snapshot, invoice.memberId)
                : "Khách lẻ",
            },
            { label: "Phương thức thanh toán", value: invoice.paymentMethod },
            {
              label: "Giảm giá",
              value: formatCurrency(invoice.discountAmount),
            },
            { label: "Tổng", value: formatCurrency(invoice.totalAmount) },
            {
              label: "Trạng thái",
              value: (
                <Badge tone={getStatusTone(invoice.status)}>
                  {humanizeStatus(invoice.status)}
                </Badge>
              ),
            },
          ]}
        />
      </SectionCard>

      <SectionCard title="Chi tiết hóa đơn">
        <DataTable
          headers={["Sản phẩm", "SL", "Đơn giá", "Đơn giá vốn", "Thành tiền"]}
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

function buildRevenueReportPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Báo cáo"
        title="Báo cáo doanh thu"
      />
      <StatsGrid
        items={[
          {
            label: "Tổng doanh thu",
            value: formatCurrency(snapshot.revenueReport.totalRevenue),
            note: "Gói tập và bán lẻ đã xác nhận.",
          },
          {
            label: "Doanh thu gói tập",
            value: formatCurrency(snapshot.revenueReport.membershipRevenue),
            note: "Thứ tự hóa đơn gói tập.",
          },
          {
            label: "Doanh thu dịch vụ",
            value: formatCurrency(snapshot.revenueReport.servicesRevenue),
            note: "Thứ tự hóa đơn bán hàng.",
          },
          {
            label: "Số lượng hóa đơn",
            value: `${snapshot.revenueReport.membershipInvoiceCount + snapshot.revenueReport.salesInvoiceCount}`,
            note: "Tổng hóa đơn đã xác nhận.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Hóa đơn gói tập">
          <DataTable
            headers={["Mã", "Hội viên", "Ngày", "Số tiền"]}
            rows={snapshot.dataset.membershipInvoices.map((invoice) => [
              invoice.code,
              getMemberName(snapshot, invoice.memberId),
              formatDateTime(invoice.invoiceDate),
              formatCurrency(invoice.totalAmount),
            ])}
          />
        </SectionCard>
        <SectionCard title="Hóa đơn bán lẻ">
          <DataTable
            headers={["Mã", "Khách hàng", "Ngày", "Số tiền"]}
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
        eyebrow="Báo cáo"
        title="Báo cáo lương"
      />
      <StatsGrid
        items={[
          {
            label: "Tổng lương",
            value: formatCurrency(snapshot.payrollReport.totalPayroll),
            note: "Tổng thực lĩnh toàn bộ lịch sử.",
          },
          {
            label: "Đã duyệt",
            value: formatCurrency(snapshot.payrollReport.approvedPayroll),
            note: "Đã duyệt hoặc đã chi.",
          },
          {
            label: "Đang chờ",
            value: formatCurrency(snapshot.payrollReport.pendingPayroll),
            note: "Đang chờ duyệt.",
          },
          {
            label: "Bản ghi",
            value: `${snapshot.payrollReport.byTrainer.length}`,
            note: "Số dòng bảng lương trong dữ liệu mẫu.",
          },
        ]}
      />
      <SectionCard title="Bảng lương theo PT">
        <DataTable
          headers={["PT", "Kỳ", "Thực lĩnh", "Trạng thái"]}
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
        eyebrow="Báo cáo"
        title="Báo cáo tồn kho"
      />
      <StatsGrid
        items={[
          {
            label: "Giá trị tồn kho",
            value: formatCurrency(snapshot.inventoryOverview.stockValue),
            note: "Tồn kho theo giá vốn.",
          },
          {
            label: "Số SKU tồn thấp",
            value: `${snapshot.inventoryOverview.lowStockCount}`,
            note: "SKU đang cần cảnh báo.",
          },
          {
            label: "Sản phẩm đang theo dõi",
            value: `${snapshot.inventoryOverview.totalProducts}`,
            note: "Tổng SKU đang hoạt động.",
          },
          {
            label: "Biến động gần đây",
            value: `${snapshot.inventoryOverview.recentTransactions.length}`,
            note: "6 giao dịch gần nhất.",
          },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Sản phẩm bán chạy">
          <DataTable
            headers={["Sản phẩm", "Số lượng bán", "Tồn kho hiện tại"]}
            rows={snapshot.inventoryOverview.topSellingProducts.map((entry) => [
              entry.product.name,
              `${entry.soldQuantity}`,
              `${entry.product.stockOnHand}`,
            ])}
          />
        </SectionCard>
        <SectionCard title="Giao dịch kho gần đây">
          <DataTable
            headers={["Ngày", "Sản phẩm", "Loại", "SL"]}
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
        eyebrow="Báo cáo"
        title="Báo cáo chi phí"
      />
      <StatsGrid
        items={[
          {
            label: "Chi phí được tính",
            value: formatCurrency(snapshot.expenseReport.totalExpense),
            note: "Chỉ tính các phiếu đã duyệt và đã chi.",
          },
          {
            label: "Chờ duyệt",
            value: `${snapshot.expenseReport.pendingApprovalCount}`,
            note: "Cần duyệt bổ sung.",
          },
          {
            label: "Số phiếu đã chi",
            value: `${snapshot.expenseReport.paidCount}`,
            note: "Đã đánh dấu đã chi.",
          },
          {
            label: "Danh mục cao nhất",
            value: "Sửa chữa",
            note: "Danh mục có tổng số tiền lớn nhất hiện tại.",
          },
        ]}
      />
      <SectionCard title="Chi phí theo danh mục">
        <DataTable
          headers={["Danh mục", "Số tiền"]}
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
        eyebrow="Báo cáo"
        title="Báo cáo lợi nhuận"
      />
      <StatsGrid
        items={[
          {
            label: "Doanh thu",
            value: formatCurrency(snapshot.profitReport.totalRevenue),
            note: "Tổng doanh thu đã xác nhận.",
          },
          {
            label: "Giá vốn",
            value: formatCurrency(snapshot.profitReport.cogs),
            note: "Giá vốn từ các mặt hàng bán lẻ đã bán.",
          },
          {
            label: "Lương PT",
            value: formatCurrency(snapshot.profitReport.ptPayroll),
            note: "Kỳ lương hiện tại.",
          },
          {
            label: "Lợi nhuận ròng",
            value: formatCurrency(snapshot.profitReport.netProfit),
            note: "Kết quả sau khi trừ chi phí và lương.",
          },
        ]}
      />
      <SectionCard title="Công thức lợi nhuận">
        <KeyValueList
          items={[
            {
              label: "Tổng doanh thu",
              value: formatCurrency(snapshot.profitReport.totalRevenue),
            },
            {
              label: "Trừ giá vốn",
              value: formatCurrency(snapshot.profitReport.cogs),
            },
            {
              label: "Trừ lương PT",
              value: formatCurrency(snapshot.profitReport.ptPayroll),
            },
            {
              label: "Trừ chi phí vận hành",
              value: formatCurrency(snapshot.profitReport.operatingExpense),
            },
            {
              label: "Kết quả ròng",
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

function buildSettingsPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);
  const currentUsername = options?.currentUser?.username ?? "";

  return (
    <>
      <PageHeader
        eyebrow="Cấu hình hệ thống"
        title="Cấu hình"
      />
      <SectionCard
        title="Tài khoản đăng nhập"
        description="Admin/Staff có thể đổi tên đăng nhập hoặc mật khẩu trực tiếp tại đây"
      >
        <form action={updateAccountAction} className="space-y-4">
          <input type="hidden" name="locale" value={locale} />
          <FormGrid>
            <FormField
              label="Tên đăng nhập"
              name="username"
              defaultValue={currentUsername}
              required
            />
            <FormField
              label="Mật khẩu hiện tại"
              name="currentPassword"
              type="password"
              placeholder="Nhập nếu muốn đổi mật khẩu"
            />
            <FormField
              label="Mật khẩu mới"
              name="newPassword"
              type="password"
              placeholder="Để trống nếu chỉ đổi tên đăng nhập"
            />
          </FormGrid>
          <SubmitButton label="Cập nhật tài khoản" />
        </form>
      </SectionCard>
      <SectionCard title="Cấu hình hệ thống">
        <DataTable
          headers={["Khóa", "Nhãn", "Giá trị", "Mô tả"]}
          rows={snapshot.dataset.systemConfigs.map((config) => [
            config.key,
            config.label,
            isAdmin(options) ? (
              <details key={`${config.key}-edit`} className="group min-w-[14rem] rounded-2xl border border-slate-200/80 bg-white/90 p-2">
                <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Chỉnh sửa
                </summary>
                <form action={patchSystemConfigAction} className="mt-2 flex items-center gap-2">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="configKey" value={config.key} />
                  <input
                    name="value"
                    defaultValue={config.value}
                    className="w-56 rounded-xl border border-slate-200 px-3 py-1 text-xs"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Lưu
                  </button>
                </form>
              </details>
            ) : config.value,
            config.description,
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildLoginPage(options?: RenderGymRouteOptions): JSX.Element {
  const locale = getLocale(options);
  const hasInvalidCredentials =
    getSearchParam(options?.searchParams, "error") === "invalid";

  return (
    <>
      <PageHeader
        eyebrow="Đăng nhập an toàn"
        title="Đăng nhập"
        description="Truy cập nhanh vào workspace để theo dõi vận hành, quản trị hội viên và kiểm soát doanh thu trong thời gian thực."
      />

      <div className="mx-auto grid w-full max-w-4xl gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-6">
        <section className="rounded-[1.8rem] border border-white/70 bg-white/82 p-5 shadow-[0_22px_54px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-600)]">Gym Manager</p>
          <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.85rem]">Bảo mật rõ ràng, thao tác nhanh</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Phiên đăng nhập được tối ưu cho nhân sự vận hành phòng gym trên mobile lẫn desktop.
          </p>
          <div className="mt-5 grid gap-3">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
              <span className="pi pi-shield text-sm text-[var(--accent-600)]" />
              <p className="text-sm text-slate-700">Xác thực tài khoản theo phân quyền Admin và Staff.</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
              <span className="pi pi-mobile text-sm text-[var(--accent-600)]" />
              <p className="text-sm text-slate-700">Biểu mẫu tối ưu nhịp chạm cho màn hình nhỏ.</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
              <span className="pi pi-bolt text-sm text-[var(--accent-600)]" />
              <p className="text-sm text-slate-700">Đăng nhập xong chuyển thẳng về luồng công việc phù hợp vai trò.</p>
            </div>
          </div>
        </section>

        <SectionCard
          title="Biểu mẫu đăng nhập"
          description="Nhập thông tin tài khoản để tiếp tục làm việc"
        >
          {hasInvalidCredentials ? (
            <div className="mb-4 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <span className="pi pi-info-circle mt-0.5 text-rose-500" />
              Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.
            </div>
          ) : null}

          <form action={loginAction} className="space-y-5">
            <input type="hidden" name="locale" value={locale} />
            <FormField
              label="Tên đăng nhập"
              name="username"
              iconClassName="pi-user"
              required
            />
            <FormField
              label="Mật khẩu"
              name="password"
              type="password"
              iconClassName="pi-lock"
              required
            />
            <SubmitButton
              label="Đăng nhập"
              fullWidth
              iconClassName="pi-sign-in"
            />
          </form>
        </SectionCard>
      </div>
    </>
  );
}

export function renderGymRoute(
  slug: string[],
  options?: RenderGymRouteOptions,
): JSX.Element {
  const [section, entityId] = slug;
  const locale: UiLocale = getLocale(options) === "vi" ? "vi" : "en";
  let content: JSX.Element | undefined;

  setActiveUiLocale(locale);

  if (!content && (slug.length === 0 || section === "dashboard")) {
    content = buildDashboardPage();
  }

  if (!content && section === "login") {
    content = buildLoginPage(options);
  }

  if (!content && section === "pts" && slug.length === 1) {
    content = buildPtsPage(options);
  }

  if (!content && section === "pts" && entityId === "attendance") {
    content = buildAttendancePage(options);
  }

  if (!content && section === "pts" && slug.length === 2 && entityId) {
    content = buildPtDetailPage(entityId, options);
  }

  if (!content && section === "payroll" && slug.length === 1) {
    content = buildPayrollPage(options);
  }

  if (!content && section === "payroll" && slug.length === 2 && entityId) {
    content = buildPayrollPeriodPage(entityId);
  }

  if (!content && section === "members" && slug.length === 1) {
    content = buildMembersPage(options);
  }

  if (!content && section === "members" && entityId === "memberships") {
    content = buildMembershipOverviewPage(options);
  }

  if (!content && section === "members" && slug.length === 2 && entityId) {
    content = buildMemberDetailPage(entityId, options);
  }

  if (!content && section === "member-assignments" && slug.length === 1) {
    content = buildMemberAssignmentsPage(options);
  }

  if (!content && section === "membership-plans") {
    content = buildMembershipPlansPage(options);
  }

  if (!content && section === "membership-invoices") {
    content = buildMembershipInvoicesPage();
  }

  if (!content && section === "products") {
    content = buildProductsPage(options);
  }

  if (!content && section === "inventory" && slug.length === 1) {
    content = buildInventoryPage(options);
  }

  if (!content && section === "inventory" && entityId === "import") {
    content = buildInventoryImportPage();
  }

  if (!content && section === "invoices" && slug.length === 1) {
    content = buildInvoicesPage(options);
  }

  if (!content && section === "invoices" && slug.length === 2 && entityId) {
    content = buildInvoiceDetailPage(entityId);
  }

  if (!content && section === "reports" && entityId === "revenue") {
    content = buildRevenueReportPage();
  }

  if (!content && section === "reports" && entityId === "payroll") {
    content = buildPayrollReportPage();
  }

  if (!content && section === "reports" && entityId === "inventory") {
    content = buildInventoryReportPage();
  }

  if (!content && section === "reports" && entityId === "expenses") {
    content = buildExpenseReportPage();
  }

  if (!content && section === "reports" && entityId === "profit") {
    content = buildProfitReportPage();
  }

  if (!content && section === "settings") {
    content = buildSettingsPage(options);
  }

  if (!content) {
    notFound();
  }

  return content;
}

