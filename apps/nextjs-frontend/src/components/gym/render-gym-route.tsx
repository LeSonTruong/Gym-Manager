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
import { FormAutocompleteSelect as BaseFormAutocompleteSelect } from "./form-autocomplete-select.component.tsx";
import {
  cancelMembershipAction,
  checkInAttendanceAction,
  checkOutAttendanceAction,
  cleanupSystemConfigTrashAction,
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
  setMemberStatusAction,
  setPersonalTrainerStatusAction,
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
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "object"
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

function ReportDownloadActions({
  reportType,
}: {
  readonly reportType: "payroll" | "revenue" | "expenses" | "profit";
}): JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      <ActionLink href={`/reports/${reportType}/download?format=pdf`}>
        In PDF mẫu
      </ActionLink>
      <ActionLink href={`/reports/${reportType}/download?format=xlsx`}>
        Tải Excel
      </ActionLink>
    </div>
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
      description={
        props.description ? translateText(props.description, locale) : undefined
      }
    >
      {translateNode(props.children, locale)}
    </BaseSectionCard>
  );
}

function StatsGrid(props: {
  readonly items: Array<{
    readonly label: string;
    readonly value: string;
    readonly note: string;
  }>;
}): JSX.Element {
  const locale = getActiveUiLocale();
  const summaryTitle = translateText("Thống kê tổng hợp (tuỳ chọn)", locale);
  const summaryDescription = translateText(
    "Mặc định ẩn để ưu tiên xem bảng dữ liệu chính.",
    locale,
  );

  return (
    <details className="group mb-6 rounded-3xl border border-slate-200/80 bg-white/85 p-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:bg-slate-50">
        <span className="inline-flex items-center gap-2">
          <span className="pi pi-chart-bar text-[11px] text-[var(--accent-600)]" />
          {summaryTitle}
        </span>
        <span className="pi pi-angle-down text-xs transition group-open:rotate-180" />
      </summary>
      <p className="mt-2 px-3 text-xs text-slate-500">{summaryDescription}</p>
      <div className="mt-3">
        <BaseStatsGrid
          items={props.items.map((item) => ({
            ...item,
            label: translateText(item.label, locale),
            note: translateText(item.note, locale),
          }))}
        />
      </div>
    </details>
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
  const translatedHeaders = props.headers.map((header) =>
    translateText(header, locale),
  );
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
      emptyMessage={
        props.emptyMessage
          ? translateText(props.emptyMessage, locale)
          : undefined
      }
    />
  );
}

function ModuleFilterForm({
  query,
  placeholder,
  children,
}: {
  readonly query: string;
  readonly placeholder: string;
  readonly children?: ReactNode;
}): JSX.Element {
  const locale = getActiveUiLocale();

  return (
    <form
      method="get"
      className="mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3"
    >
      <label className="min-w-[15.5rem] flex-1">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {translateText("Tìm kiếm", locale)}
        </span>
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder={translateText(placeholder, locale)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--focus-ring)]"
        />
      </label>
      {children}
      <button
        type="submit"
        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-slate-800"
      >
        {translateText("Lọc", locale)}
      </button>
    </form>
  );
}

function ModuleFilterSelect({
  label,
  name,
  defaultValue,
  options,
}: {
  readonly label: string;
  readonly name: string;
  readonly defaultValue: string;
  readonly options: Array<{ readonly label: string; readonly value: string }>;
}): JSX.Element {
  const locale = getActiveUiLocale();

  return (
    <label className="min-w-[12rem]">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {translateText(label, locale)}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--focus-ring)]"
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

function Badge({
  children,
  tone = "slate",
}: {
  readonly children: ReactNode;
  readonly tone?: "slate" | "emerald" | "amber" | "rose" | "sky";
}): JSX.Element {
  const locale = getActiveUiLocale();

  return <BaseBadge tone={tone}>{translateNode(children, locale)}</BaseBadge>;
}

type SearchParametersRecord = Record<string, string | string[] | undefined>;

type RenderGymRouteOptions = {
  readonly locale?: string;
  readonly searchParams?: SearchParametersRecord;
  readonly currentUser?: DemoUser;
};

type FieldValue = string | number | undefined;

function getLocale(options?: RenderGymRouteOptions): string {
  return options?.locale ?? "en";
}

function getSearchParameter(
  searchParameters: SearchParametersRecord | undefined,
  key: string,
): string | undefined {
  const value = searchParameters?.[key];

  return Array.isArray(value) ? value[0] : value;
}

function normalizeSearchText(value?: string | number): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .normalize("NFD")
    .replaceAll(/\p{Diacritic}/gv, "")
    .replaceAll("đ", "d")
    .replaceAll("Đ", "D")
    .trim()
    .toLowerCase();
}

function normalizeSearchQuery(value?: string): string {
  return normalizeSearchText(value);
}

function getModuleSearchQuery(options?: RenderGymRouteOptions): string {
  return normalizeSearchQuery(getSearchParameter(options?.searchParams, "q"));
}

function getScopedSearchQuery(
  options: RenderGymRouteOptions | undefined,
  key: string,
): string {
  return normalizeSearchQuery(getSearchParameter(options?.searchParams, key));
}

function getScopedOptionValue(
  options: RenderGymRouteOptions | undefined,
  key: string,
  fallback: string,
): string {
  return getSearchParameter(options?.searchParams, key) ?? fallback;
}

function buildPathWithSearchParams(
  path: string,
  searchParameters: SearchParametersRecord | undefined,
  overrides: Record<string, string | undefined>,
): string {
  const normalizedSearchParameters = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(searchParameters ?? {})) {
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

    if (value) {
      normalizedSearchParameters.set(key, value);
    }
  }

  for (const [key, value] of Object.entries(overrides)) {
    if (value) {
      normalizedSearchParameters.set(key, value);
    } else {
      normalizedSearchParameters.delete(key);
    }
  }

  const queryString = normalizedSearchParameters.toString();

  return queryString.length > 0 ? `${path}?${queryString}` : path;
}

function matchesSearchQuery(
  query: string,
  ...values: Array<string | number | undefined>
): boolean {
  if (!query) {
    return true;
  }

  const searchableText = values
    .map((value) => normalizeSearchText(value))
    .join(" ");

  return searchableText.includes(query);
}

function compareVietnameseText(leftValue: string, rightValue: string): number {
  return leftValue.localeCompare(rightValue, "vi", {
    sensitivity: "base",
    numeric: true,
  });
}

function sortByVietnameseText<Item>(
  items: Item[],
  getValue: (item: Item) => string,
  direction: "asc" | "desc" = "asc",
): Item[] {
  return items.toSorted((leftItem, rightItem) => {
    const result = compareVietnameseText(
      getValue(leftItem),
      getValue(rightItem),
    );

    return direction === "asc" ? result : -result;
  });
}

function toSortableTimestamp(value?: string): number {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
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

function toDateInputValue(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  return value.slice(0, 10);
}

function getTodayDateInputValue(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getAgeFromBirthDate(value?: string): number | undefined {
  const normalizedBirthDate = toDateInputValue(value);

  if (!normalizedBirthDate) {
    return undefined;
  }

  const [yearText, monthText, dayText] = normalizedBirthDate.split("-");
  const birthYear = Number(yearText);
  const birthMonth = Number(monthText);
  const birthDay = Number(dayText);

  if (
    !Number.isFinite(birthYear) ||
    !Number.isFinite(birthMonth) ||
    !Number.isFinite(birthDay)
  ) {
    return undefined;
  }

  const currentDate = new Date();
  let age = currentDate.getUTCFullYear() - birthYear;
  const hasBirthdayPassedInCurrentYear =
    currentDate.getUTCMonth() + 1 > birthMonth ||
    (currentDate.getUTCMonth() + 1 === birthMonth &&
      currentDate.getUTCDate() >= birthDay);

  if (!hasBirthdayPassedInCurrentYear) {
    age -= 1;
  }

  return age >= 0 ? age : undefined;
}

function formatBirthDateWithAge(value?: string): string {
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
  return snapshot.dataset.systemConfigs.find((config) => config.key === key)
    ?.value;
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
          <span
            className={`pi ${iconClassName} pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400`}
          />
        ) : null}
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          placeholder={
            placeholder ? translateText(placeholder, locale) : undefined
          }
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

function FormAutocompleteSelect({
  label,
  name,
  options,
  defaultValue,
  required = false,
  placeholder,
  invalidSelectionMessage,
  emptyStateMessage,
}: {
  readonly label: string;
  readonly name: string;
  readonly options: Array<{ readonly label: string; readonly value: string }>;
  readonly defaultValue?: string;
  readonly required?: boolean;
  readonly placeholder?: string;
  readonly invalidSelectionMessage?: string;
  readonly emptyStateMessage?: string;
}): JSX.Element {
  const locale = getActiveUiLocale();

  return (
    <BaseFormAutocompleteSelect
      label={translateText(label, locale)}
      name={name}
      options={options.map((option) => ({
        value: option.value,
        label: translateText(option.label, locale),
      }))}
      defaultValue={defaultValue}
      isRequired={required}
      placeholder={
        placeholder ? translateText(placeholder, locale) : undefined
      }
      invalidSelectionMessage={
        invalidSelectionMessage
          ? translateText(invalidSelectionMessage, locale)
          : undefined
      }
      emptyStateMessage={
        emptyStateMessage
          ? translateText(emptyStateMessage, locale)
          : translateText("Không có gợi ý phù hợp.", locale)
      }
    />
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
        placeholder={
          placeholder ? translateText(placeholder, locale) : undefined
        }
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

function buildDashboardPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const dashboardSearchQuery = getModuleSearchQuery(options);
  const filteredLowStockProducts = sortProductsByStock(
    snapshot.dashboard.lowStockProducts,
  ).filter((lowStockProduct) =>
    matchesSearchQuery(
      dashboardSearchQuery,
      lowStockProduct.code,
      lowStockProduct.name,
    ),
  );
  const filteredTopSellingProducts =
    snapshot.inventoryOverview.topSellingProducts.filter((topSellingProduct) =>
      matchesSearchQuery(
        dashboardSearchQuery,
        topSellingProduct.product.code,
        topSellingProduct.product.name,
      ),
    );

  return (
    <>
      <PageHeader
        eyebrow="Vận hành phòng gym"
        title="Tổng quan vận hành"
        actions={
          <ActionLink href="/reports/profit">Báo cáo lợi nhuận</ActionLink>
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

      <ModuleFilterForm
        query={dashboardSearchQuery}
        placeholder="Tìm sản phẩm theo tên hoặc mã..."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Phân tích doanh thu">
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

        <SectionCard title="Cảnh báo tồn kho thấp">
          <DataTable
            headers={["Sản phẩm", "Tồn kho", "Ngưỡng", "Trạng thái"]}
            rows={filteredLowStockProducts.map((product) => [
              product.name,
              `${product.stockOnHand} đơn vị`,
              `${product.minimumStockLevel} đơn vị`,
              <Badge key={product.id} tone="amber">
                Bổ sung ngay
              </Badge>,
            ])}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Sản phẩm bán chạy">
          <DataTable
            headers={["Sản phẩm", "Số lượng bán", "Tồn kho hiện tại"]}
            rows={filteredTopSellingProducts.map((entry) => [
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
  const ptSearchQuery = getModuleSearchQuery(options);
  const ptStatusFilter = getScopedOptionValue(options, "status", "ALL");
  const ptSort = getScopedOptionValue(options, "sort", "name-asc");
  const filteredPtOverview = snapshot.ptOverview
    .filter(
      (ptOverviewItem) =>
        ptStatusFilter === "ALL" || ptOverviewItem.pt.status === ptStatusFilter,
    )
    .filter((ptOverviewItem) =>
      matchesSearchQuery(
        ptSearchQuery,
        ptOverviewItem.pt.code,
        ptOverviewItem.pt.fullName,
        ptOverviewItem.pt.phone,
        ptOverviewItem.pt.status,
        getGenderLabel(ptOverviewItem.pt.gender),
      ),
    );
  const sortedPtOverview = ((): typeof filteredPtOverview => {
    switch (ptSort) {
      case "name-desc": {
        return sortByVietnameseText(
          filteredPtOverview,
          (ptOverviewItem) => ptOverviewItem.pt.fullName,
          "desc",
        );
      }

      case "start-newest": {
        return filteredPtOverview.toSorted(
          (leftItem, rightItem) =>
            toSortableTimestamp(rightItem.pt.startDate) -
            toSortableTimestamp(leftItem.pt.startDate),
        );
      }

      case "start-oldest": {
        return filteredPtOverview.toSorted(
          (leftItem, rightItem) =>
            toSortableTimestamp(leftItem.pt.startDate) -
            toSortableTimestamp(rightItem.pt.startDate),
        );
      }

      case "status-active": {
        return filteredPtOverview.toSorted((leftItem, rightItem) => {
          if (leftItem.pt.status === rightItem.pt.status) {
            return compareVietnameseText(
              leftItem.pt.fullName,
              rightItem.pt.fullName,
            );
          }

          return leftItem.pt.status === "ACTIVE" ? -1 : 1;
        });
      }

      default: {
        return sortByVietnameseText(
          filteredPtOverview,
          (ptOverviewItem) => ptOverviewItem.pt.fullName,
        );
      }
    }
  })();

  return (
    <>
      <PageHeader
        eyebrow="Quản lý PT"
        title="Huấn luyện viên cá nhân"
        actions={<ActionLink href="/pts/attendance">Mở chấm công</ActionLink>}
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
                <FormField
                  label="Mã PT"
                  name="code"
                  placeholder="PT-NEW"
                  required
                />
                <FormField
                  label="Họ và tên"
                  name="fullName"
                  placeholder="Nguyễn Văn A"
                  required
                />
                <FormSelect
                  label="Giới tính"
                  name="gender"
                  defaultValue="OTHER"
                  options={[
                    { value: "MALE", label: "Nam" },
                    { value: "FEMALE", label: "Nữ" },
                    { value: "OTHER", label: "Khác" },
                  ]}
                />
                <FormField label="Ngày sinh" name="birthDate" type="date" />
                <FormField label="Số điện thoại" name="phone" required />
                <FormField
                  label="Ngày bắt đầu"
                  name="startDate"
                  type="date"
                  defaultValue={getTodayDateInputValue()}
                />
              </FormGrid>
              <SubmitButton label="Tạo PT" />
            </form>
          </CollapsibleCrudPanel>
        </SectionCard>
      ) : null}

      <SectionCard title="Danh sách PT">
        <ModuleFilterForm
          query={ptSearchQuery}
          placeholder="Mã PT, tên PT, số điện thoại..."
        >
          <ModuleFilterSelect
            label="Trạng thái"
            name="status"
            defaultValue={ptStatusFilter}
            options={[
              { value: "ALL", label: "Tất cả" },
              { value: "ACTIVE", label: "Đang hoạt động" },
              { value: "INACTIVE", label: "Ngừng hoạt động" },
            ]}
          />
          <ModuleFilterSelect
            label="Sắp xếp"
            name="sort"
            defaultValue={ptSort}
            options={[
              { value: "name-asc", label: "Tên A-Z" },
              { value: "name-desc", label: "Tên Z-A" },
              { value: "start-newest", label: "PT mới vào trước" },
              { value: "start-oldest", label: "PT lâu năm trước" },
              { value: "status-active", label: "Đang hoạt động trước" },
            ]}
          />
        </ModuleFilterForm>
        <DataTable
          headers={[
            "Tên PT",
            "Ngày sinh (tuổi)",
            "Giới tính",
            "Số điện thoại",
            "Hội viên phụ trách",
            "Chi tiết",
          ]}
          rows={sortedPtOverview.map((item) => [
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
  const activeAssignments = snapshot.dataset.memberPtAssignments.filter(
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
              {
                label: "Giới tính",
                value: getGenderLabel(ptOverview.pt.gender),
              },
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
                  <FormField
                    label="Mã PT"
                    name="code"
                    defaultValue={ptOverview.pt.code}
                    required
                  />
                  <FormField
                    label="Họ và tên"
                    name="fullName"
                    defaultValue={ptOverview.pt.fullName}
                    required
                  />
                  <FormSelect
                    label="Giới tính"
                    name="gender"
                    defaultValue={ptOverview.pt.gender}
                    options={[
                      { value: "MALE", label: "Nam" },
                      { value: "FEMALE", label: "Nữ" },
                      { value: "OTHER", label: "Khác" },
                    ]}
                  />
                  <FormField
                    label="Ngày sinh"
                    name="birthDate"
                    type="date"
                    defaultValue={toDateInputValue(ptOverview.pt.birthDate)}
                  />
                  <FormField
                    label="Số điện thoại"
                    name="phone"
                    defaultValue={ptOverview.pt.phone}
                    required
                  />
                  <FormField
                    label="Ngày bắt đầu"
                    name="startDate"
                    type="date"
                    defaultValue={toDateInputValue(ptOverview.pt.startDate)}
                  />
                  <FormSelect
                    label="Trạng thái"
                    name="status"
                    defaultValue={ptOverview.pt.status}
                    required
                    options={[
                      { value: "ACTIVE", label: "Đang hoạt động" },
                      { value: "INACTIVE", label: "Ngừng hoạt động" },
                    ]}
                  />
                </FormGrid>
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
                    defaultValue={
                      compensationDefaults.performanceBonusThreshold
                    }
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

          <SectionCard title="Trạng thái PT">
            <CollapsibleCrudPanel triggerLabel="Mở bảng trạng thái PT">
              <form
                action={
                  ptOverview.pt.status === "ACTIVE"
                    ? deletePersonalTrainerAction
                    : setPersonalTrainerStatusAction
                }
                className="space-y-4"
              >
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="ptId" value={ptId} />
                <input
                  type="hidden"
                  name="status"
                  value={
                    ptOverview.pt.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                  }
                />
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {ptOverview.pt.status === "ACTIVE"
                    ? "PT sẽ chuyển sang ngừng hoạt động nhưng vẫn giữ lại hồ sơ để có thể mở lại sau."
                    : "PT sẽ được tái kích hoạt và xuất hiện lại trong danh sách thao tác hằng ngày."}
                </p>
                <button
                  type="submit"
                  className={`rounded-full px-5 py-3 text-sm font-semibold text-white transition ${ptOverview.pt.status === "ACTIVE"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {ptOverview.pt.status === "ACTIVE"
                    ? "Ngừng PT"
                    : "Tái kích hoạt PT"}
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
  const attendanceSearchQuery = getModuleSearchQuery(options);
  const { attendanceLogs } = snapshot.dataset;
  const currentVietnamDate = getTodayDateInputValue();
  const selectedMonth =
    getSearchParameter(options?.searchParams, "month") ??
    currentVietnamDate.slice(0, 7);
  const selectedPtId = getSearchParameter(options?.searchParams, "ptId") ?? "";
  const trainerOptions = snapshot.dataset.personalTrainers.map((trainer) => ({
    value: trainer.id,
    label: `${trainer.fullName} | ${trainer.code}`,
  }));
  const openShifts = attendanceLogs.filter(
    (attendanceLog) => !attendanceLog.checkOutAt,
  );
  const openShiftByTrainerId = new Map(
    openShifts.map((attendanceLog) => [attendanceLog.ptId, attendanceLog]),
  );
  const eligibleCheckoutTrainerIds = new Set(
    openShifts
      .filter(
        (attendanceLog) => attendanceLog.attendanceDate === currentVietnamDate,
      )
      .map((attendanceLog) => attendanceLog.ptId),
  );
  const actionableTrainers = snapshot.dataset.personalTrainers
    .filter((trainer) => trainer.status === "ACTIVE")
    .filter((trainer) => !selectedPtId || trainer.id === selectedPtId)
    .filter((trainer) =>
      matchesSearchQuery(
        attendanceSearchQuery,
        trainer.code,
        trainer.fullName,
        trainer.phone,
      ),
    );
  const filteredAttendanceLogs = attendanceLogs
    .filter((attendanceLog) =>
      attendanceLog.attendanceDate.startsWith(selectedMonth),
    )
    .filter(
      (attendanceLog) => !selectedPtId || attendanceLog.ptId === selectedPtId,
    )
    .filter((attendanceLog) =>
      matchesSearchQuery(
        attendanceSearchQuery,
        getTrainerName(snapshot, attendanceLog.ptId),
        attendanceLog.attendanceDate,
        attendanceLog.status,
      ),
    )
    .toSorted(
      (leftAttendanceLog, rightAttendanceLog) =>
        toSortableTimestamp(rightAttendanceLog.checkInAt) -
        toSortableTimestamp(leftAttendanceLog.checkInAt),
    );
  const uniqueTrainerCount = new Set(
    filteredAttendanceLogs.map((attendanceLog) => attendanceLog.ptId),
  ).size;

  return (
    <>
      <PageHeader eyebrow="Chấm công PT" title="Nhật ký chấm công" />

      <StatsGrid
        items={[
          {
            label: "PT có chấm công",
            value: `${uniqueTrainerCount}`,
            note: "Số PT khác nhau có bản ghi trong bảng chấm công.",
          },
          {
            label: "Ca VALID",
            value: `${filteredAttendanceLogs.filter((attendanceLog) => attendanceLog.status === "VALID").length}`,
            note: "Ca đủ giờ chuẩn và được tính full credit.",
          },
          {
            label: "Ca HALF",
            value: `${filteredAttendanceLogs.filter((attendanceLog) => attendanceLog.status === "HALF").length}`,
            note: "Ca thiếu giờ được quy đổi công theo tỷ lệ giờ làm.",
          },
          {
            label: "Tăng ca",
            value: formatHours(
              filteredAttendanceLogs.reduce(
                (total, attendanceLog) => total + attendanceLog.overtimeHours,
                0,
              ),
            ),
            note: "Tổng giờ vượt ca chuẩn.",
          },
        ]}
      />

      <SectionCard
        title={`Bảng chấm công (${filteredAttendanceLogs.length} bản ghi / ${uniqueTrainerCount} PT)`}
      >
        <ModuleFilterForm
          query={attendanceSearchQuery}
          placeholder="Tên PT, mã PT, trạng thái..."
        >
          <label className="min-w-[9.5rem]">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Tháng
            </span>
            <input
              type="month"
              name="month"
              defaultValue={selectedMonth}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--focus-ring)]"
            />
          </label>
          <label className="min-w-[13rem]">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              PT
            </span>
            <select
              name="ptId"
              defaultValue={selectedPtId}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--focus-ring)]"
            >
              <option value="">Tất cả PT</option>
              {trainerOptions.map((trainer) => (
                <option
                  key={`attendance-filter-${trainer.value}`}
                  value={trainer.value}
                >
                  {trainer.label}
                </option>
              ))}
            </select>
          </label>
        </ModuleFilterForm>
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
          rows={filteredAttendanceLogs.map((attendanceLog) => [
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
          title="Thao tác nhanh theo PT"
          description="Thay vì chọn mã PT trong nhiều dropdown, lễ tân lọc tên PT rồi bấm vào/ra ca trực tiếp trên từng dòng."
        >
          <DataTable
            headers={["PT", "Ca đang mở", "Vào ca", "Ra ca", "Ghi chú"]}
            rows={actionableTrainers.map((trainer) => {
              const openShift = openShiftByTrainerId.get(trainer.id);
              const canCheckOut = eligibleCheckoutTrainerIds.has(trainer.id);

              return [
                `${trainer.fullName} | ${trainer.code}`,
                openShift ? formatDateTime(openShift.checkInAt) : "Chưa mở ca",
                openShift ? (
                  <span
                    key={`${trainer.id}-check-in-disabled`}
                    className="text-xs text-slate-400"
                  >
                    Đang có ca mở
                  </span>
                ) : (
                  <form
                    key={`${trainer.id}-check-in`}
                    action={checkInAttendanceAction}
                  >
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="ptId" value={trainer.id} />
                    <button
                      type="submit"
                      className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Vào ca
                    </button>
                  </form>
                ),
                canCheckOut ? (
                  <form
                    key={`${trainer.id}-check-out`}
                    action={checkOutAttendanceAction}
                  >
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="ptId" value={trainer.id} />
                    <button
                      type="submit"
                      className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      Ra ca
                    </button>
                  </form>
                ) : (
                  <span
                    key={`${trainer.id}-check-out-note`}
                    className="text-xs text-slate-500"
                  >
                    {openShift
                      ? "Ca mở không thuộc ngày hiện tại"
                      : "Chưa có ca để đóng"}
                  </span>
                ),
                openShift
                  ? "Nếu cần sửa giờ cũ, mở bảng chấm công rồi dùng chức năng chỉnh ca."
                  : "Bấm vào ca để hệ thống lấy giờ hiện tại theo múi giờ Việt Nam.",
              ];
            })}
          />
        </SectionCard>
      ) : null}
    </>
  );
}

function buildPayrollPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);
  const payrollSearchQuery = getModuleSearchQuery(options);
  const filteredPayrollPeriods = snapshot.dataset.payrollPeriods
    .filter((payrollPeriod) =>
      matchesSearchQuery(
        payrollSearchQuery,
        payrollPeriod.code,
        payrollPeriod.status,
        payrollPeriod.from,
        payrollPeriod.to,
      ),
    )
    .toSorted(
      (leftPayrollPeriod, rightPayrollPeriod) =>
        toSortableTimestamp(rightPayrollPeriod.from) -
        toSortableTimestamp(leftPayrollPeriod.from),
    );
  const filteredPayrollByTrainer = snapshot.payrollReport.byTrainer.filter(
    (payrollItem) =>
      matchesSearchQuery(
        payrollSearchQuery,
        payrollItem.ptName,
        payrollItem.payrollPeriodCode,
        payrollItem.status,
      ),
  );

  return (
    <>
      <PageHeader eyebrow="Bảng lương" title="Kỳ lương" />

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

      <ModuleFilterForm
        query={payrollSearchQuery}
        placeholder="Mã kỳ, tên PT, trạng thái..."
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionCard title="Kỳ lương">
          <DataTable
            headers={["Mã", "Khoảng thời gian", "Trạng thái", "Chi tiết"]}
            rows={filteredPayrollPeriods.map((period) => [
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
            rows={filteredPayrollByTrainer.map((item) => [
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
          <SectionCard title="Tạo kỳ lương">
            <CollapsibleCrudPanel triggerLabel="Mở bảng tạo kỳ lương">
              <form action={createPayrollPeriodAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormGrid>
                  <FormField label="Mã" name="code" placeholder="2026-04-A" />
                  <FormField label="Từ ngày" name="from" type="date" required />
                  <FormField label="Đến ngày" name="to" type="date" required />
                </FormGrid>
                <SubmitButton label="Tạo kỳ" />
              </form>
            </CollapsibleCrudPanel>
          </SectionCard>

          <SectionCard title="Tạo bảng lương">
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
  const memberSearchQuery = getModuleSearchQuery(options);
  const memberStatusFilter = getScopedOptionValue(options, "status", "ALL");
  const memberSort = getScopedOptionValue(options, "sort", "registered-newest");
  const membersWithPt = snapshot.memberOverview.filter(
    (item) => item.trainer !== undefined,
  ).length;
  const filteredMembers = snapshot.dataset.members.filter((memberItem) => {
    const memberOverview = snapshot.memberOverview.find(
      (item) => item.member.id === memberItem.id,
    );

    if (
      memberStatusFilter !== "ALL" &&
      memberItem.status !== memberStatusFilter
    ) {
      return false;
    }

    return matchesSearchQuery(
      memberSearchQuery,
      memberItem.code,
      memberItem.fullName,
      memberItem.phone,
      memberItem.status,
      memberOverview?.membershipPlan?.name,
      memberOverview?.trainer?.fullName,
    );
  });
  const sortedMembers = ((): typeof filteredMembers => {
    switch (memberSort) {
      case "name-asc": {
        return sortByVietnameseText(
          filteredMembers,
          (memberItem) => memberItem.fullName,
        );
      }

      case "name-desc": {
        return sortByVietnameseText(
          filteredMembers,
          (memberItem) => memberItem.fullName,
          "desc",
        );
      }

      case "registered-oldest": {
        return filteredMembers.toSorted(
          (leftMember, rightMember) =>
            toSortableTimestamp(leftMember.registeredAt) -
            toSortableTimestamp(rightMember.registeredAt),
        );
      }

      case "status-active": {
        return filteredMembers.toSorted((leftMember, rightMember) => {
          if (leftMember.status === rightMember.status) {
            return compareVietnameseText(
              leftMember.fullName,
              rightMember.fullName,
            );
          }

          return leftMember.status === "ACTIVE" ? -1 : 1;
        });
      }

      default: {
        return sortMembersByDate(filteredMembers);
      }
    }
  })();

  return (
    <>
      <PageHeader
        eyebrow="Quản lý hội viên"
        title="Hội viên"
        actions={
          <ActionLink href="/members/memberships">Mở gói tập đã bán</ActionLink>
        }
      />

      <StatsGrid
        items={[
          {
            label: "Tổng hội viên",
            value: `${snapshot.dataset.members.length}`,
            note: "Bao gồm cả trạng thái hoạt động và ngừng hoạt động.",
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

      {canManageGym(options) ? (
        <SectionCard title="Thêm hội viên mới">
          <CollapsibleCrudPanel
            triggerLabel="Mở bảng thêm hội viên"
            helperText="Chỉ cần mã hội viên, họ tên, số điện thoại. Hệ thống tự điền thông tin mặc định còn lại."
          >
            <form action={createMemberAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <FormGrid>
                <FormField
                  label="Mã hội viên"
                  name="code"
                  placeholder="MEM-NEW"
                  required
                />
                <FormField label="Họ và tên" name="fullName" required />
                <FormSelect
                  label="Giới tính"
                  name="gender"
                  defaultValue="OTHER"
                  options={[
                    { value: "MALE", label: "Nam" },
                    { value: "FEMALE", label: "Nữ" },
                    { value: "OTHER", label: "Khác" },
                  ]}
                />
                <FormField label="Ngày sinh" name="birthDate" type="date" />
                <FormField label="Số điện thoại" name="phone" required />
                <FormField
                  label="Ngày đăng ký"
                  name="registeredAt"
                  type="date"
                  defaultValue={getTodayDateInputValue()}
                />
              </FormGrid>
              <SubmitButton label="Tạo hội viên" />
            </form>
          </CollapsibleCrudPanel>
        </SectionCard>
      ) : null}

      <SectionCard title="Danh sách hội viên">
        <ModuleFilterForm
          query={memberSearchQuery}
          placeholder="Mã hội viên, tên, số điện thoại, PT..."
        >
          <ModuleFilterSelect
            label="Trạng thái"
            name="status"
            defaultValue={memberStatusFilter}
            options={[
              { value: "ALL", label: "Tất cả" },
              { value: "ACTIVE", label: "Đang hoạt động" },
              { value: "INACTIVE", label: "Ngừng hoạt động" },
            ]}
          />
          <ModuleFilterSelect
            label="Sắp xếp"
            name="sort"
            defaultValue={memberSort}
            options={[
              { value: "registered-newest", label: "Mới đăng ký trước" },
              { value: "registered-oldest", label: "Cũ nhất trước" },
              { value: "name-asc", label: "Tên A-Z" },
              { value: "name-desc", label: "Tên Z-A" },
              { value: "status-active", label: "Đang hoạt động trước" },
            ]}
          />
        </ModuleFilterForm>
        <DataTable
          headers={[
            "Hội viên",
            "Gói hiện tại",
            "Chi cho gói tập",
            "Chi cho dịch vụ",
            "PT phụ trách",
            "Chi tiết",
          ]}
          rows={sortedMembers.map((member) => {
            const overview = snapshot.memberOverview.find(
              (item) => item.member.id === member.id,
            );

            return [
              <div key={member.id}>
                <p className="font-semibold text-slate-900">
                  {member.fullName}
                </p>
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
        actions={
          <ActionLink href="/members">Quay lại danh sách hội viên</ActionLink>
        }
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
                value:
                  memberOverview?.membershipPlan?.name ??
                  "Chưa có gói hoạt động",
              },
              {
                label: "PT phụ trách",
                value: memberOverview?.trainer?.fullName ?? "Chưa gán",
              },
              {
                label: "Tổng chi gói tập",
                value: formatCurrency(
                  memberOverview?.totalMembershipSpend ?? 0,
                ),
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
              "PT đồng hành",
              "Trạng thái",
            ]}
            rows={memberships.map((membership) => [
              getPlanName(snapshot, membership.membershipPlanId),
              formatDate(membership.startDate),
              formatDate(membership.endDate),
              getTrainerName(
                snapshot,
                snapshot.dataset.memberPtAssignments.find(
                  (assignment) =>
                    assignment.memberMembershipId === membership.id &&
                    assignment.status === "ACTIVE",
                )?.ptId ?? "",
              ),
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
                  <FormField
                    label="Mã hội viên"
                    name="code"
                    defaultValue={member.code}
                    required
                  />
                  <FormField
                    label="Họ và tên"
                    name="fullName"
                    defaultValue={member.fullName}
                    required
                  />
                  <FormSelect
                    label="Giới tính"
                    name="gender"
                    defaultValue={member.gender}
                    options={[
                      { value: "MALE", label: "Nam" },
                      { value: "FEMALE", label: "Nữ" },
                      { value: "OTHER", label: "Khác" },
                    ]}
                  />
                  <FormField
                    label="Ngày sinh"
                    name="birthDate"
                    type="date"
                    defaultValue={toDateInputValue(member.birthDate)}
                  />
                  <FormField
                    label="Số điện thoại"
                    name="phone"
                    defaultValue={member.phone}
                    required
                  />
                  <FormField
                    label="Ngày đăng ký"
                    name="registeredAt"
                    type="date"
                    defaultValue={toDateInputValue(member.registeredAt)}
                  />
                  <FormSelect
                    label="Trạng thái"
                    name="status"
                    defaultValue={member.status}
                    required
                    options={[
                      { value: "ACTIVE", label: "Đang hoạt động" },
                      { value: "INACTIVE", label: "Ngừng hoạt động" },
                    ]}
                  />
                </FormGrid>
                <SubmitButton label="Lưu hội viên" />
              </form>
            </CollapsibleCrudPanel>
          </SectionCard>

          <SectionCard title="Trạng thái hội viên">
            <CollapsibleCrudPanel triggerLabel="Mở bảng trạng thái hội viên">
              <form
                action={
                  member.status === "ACTIVE"
                    ? deleteMemberAction
                    : setMemberStatusAction
                }
                className="space-y-4"
              >
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="memberId" value={memberId} />
                <input
                  type="hidden"
                  name="status"
                  value={member.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"}
                />
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {member.status === "ACTIVE"
                    ? "Hội viên sẽ chuyển sang ngừng hoạt động nhưng vẫn giữ nguyên lịch sử gói tập và hóa đơn."
                    : "Hội viên sẽ được tái kích hoạt để tiếp tục thao tác bán gói và mua dịch vụ."}
                </p>
                <button
                  type="submit"
                  className={`rounded-full px-5 py-3 text-sm font-semibold text-white transition ${member.status === "ACTIVE"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {member.status === "ACTIVE"
                    ? "Ngừng hội viên"
                    : "Tái kích hoạt hội viên"}
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
  const membershipSearchQuery = getModuleSearchQuery(options);
  const memberQuickQuery = getScopedSearchQuery(options, "memberQ");
  const planQuickQuery = getScopedSearchQuery(options, "planQ");
  const ptQuickQuery = getScopedSearchQuery(options, "ptQ");
  const membershipStatusFilter = getScopedOptionValue(options, "status", "ALL");
  const membershipSort = getScopedOptionValue(options, "sort", "start-newest");
  const membershipStatusQuickFilters = [
    { value: "ALL", label: "Tất cả" },
    { value: "ACTIVE", label: "Đang hoạt động" },
    { value: "EXPIRED", label: "Đã hết hạn" },
  ] as const;
  const defaultStartDate =
    getSearchParameter(options?.searchParams, "startDate") ??
    getTodayDateInputValue();
  const manageableMemberships = snapshot.dataset.memberMemberships.filter(
    (membership) => membership.status !== "CANCELLED",
  );
  const filteredMemberships = manageableMemberships
    .filter(
      (membership) =>
        membershipStatusFilter === "ALL" ||
        membership.status === membershipStatusFilter,
    )
    .filter((membership) =>
      matchesSearchQuery(
        membershipSearchQuery,
        getMemberName(snapshot, membership.memberId),
        getPlanName(snapshot, membership.membershipPlanId),
        getTrainerName(
          snapshot,
          snapshot.dataset.memberPtAssignments.find(
            (assignment) =>
              assignment.memberMembershipId === membership.id &&
              assignment.status === "ACTIVE",
          )?.ptId ?? "",
        ),
        membership.status,
        membership.startDate,
        membership.endDate,
      ),
    );
  const sortedMemberships = ((): typeof filteredMemberships => {
    switch (membershipSort) {
      case "start-oldest": {
        return filteredMemberships.toSorted(
          (leftMembership, rightMembership) =>
            toSortableTimestamp(leftMembership.startDate) -
            toSortableTimestamp(rightMembership.startDate),
        );
      }

      case "member-asc": {
        return sortByVietnameseText(filteredMemberships, (membership) =>
          getMemberName(snapshot, membership.memberId),
        );
      }

      case "member-desc": {
        return sortByVietnameseText(
          filteredMemberships,
          (membership) => getMemberName(snapshot, membership.memberId),
          "desc",
        );
      }

      default: {
        return filteredMemberships.toSorted(
          (leftMembership, rightMembership) =>
            toSortableTimestamp(rightMembership.startDate) -
            toSortableTimestamp(leftMembership.startDate),
        );
      }
    }
  })();
  const saleMembers = sortByVietnameseText(
    sortMembersByDate(snapshot.dataset.members)
      .filter((member) => member.status === "ACTIVE")
      .filter((member) =>
        matchesSearchQuery(
          memberQuickQuery,
          member.code,
          member.fullName,
          member.phone,
        ),
      ),
    (member) => member.fullName,
  );
  const salePlans = sortByVietnameseText(
    snapshot.dataset.membershipPlans
      .filter((plan) => plan.status === "ON_SALE")
      .filter((plan) =>
        matchesSearchQuery(
          planQuickQuery,
          plan.code,
          plan.name,
          plan.type,
          plan.includesPt ? "có PT" : "tự tập",
        ),
      ),
    (plan) => plan.name,
  );
  const saleTrainers = sortByVietnameseText(
    snapshot.dataset.personalTrainers
      .filter((trainer) => trainer.status === "ACTIVE")
      .filter((trainer) =>
        matchesSearchQuery(
          ptQuickQuery,
          trainer.code,
          trainer.fullName,
          trainer.phone,
        ),
      ),
    (trainer) => trainer.fullName,
  );
  const saleMemberOptions = saleMembers.slice(0, 60).map((member) => ({
    value: member.id,
    label: `${member.code} | ${member.fullName} | ${member.phone}`,
  }));
  const salePlanOptions = salePlans.slice(0, 30).map((plan) => ({
    value: plan.id,
    label: `${plan.name} | ${formatCurrency(plan.price)}${plan.includesPt ? " | Có PT" : ""}`,
  }));
  const saleTrainerOptions = [
    { value: "", label: "Không chọn PT" },
    ...saleTrainers.slice(0, 30).map((trainer) => ({
      value: trainer.id,
      label: `${trainer.code} | ${trainer.fullName}`,
    })),
  ];
  const canSubmitSale =
    saleMemberOptions.length > 0 && salePlanOptions.length > 0;

  return (
    <>
      <PageHeader
        eyebrow="Vòng đời gói tập"
        title="Bán gói và chốt PT"
        description="Lễ tân lọc nhanh hội viên, gói và PT rồi chốt trong một thao tác."
      />

      {canManageGym(options) ? (
        <>
          <SectionCard
            title="Bán nhanh tại quầy"
            description="Tìm trước theo tên hoặc mã để danh sách chọn gọn hơn, rồi bán gói và chọn PT trong cùng một form."
          >
            <form
              method="get"
              className="mb-4 grid gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 md:grid-cols-[1fr_1fr_1fr_12rem_12rem_auto]"
            >
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Tìm hội viên
                </span>
                <input
                  type="search"
                  name="memberQ"
                  defaultValue={memberQuickQuery}
                  placeholder="Mã, tên, số điện thoại..."
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--focus-ring)]"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Tìm gói
                </span>
                <input
                  type="search"
                  name="planQ"
                  defaultValue={planQuickQuery}
                  placeholder="Gói tháng, gói có PT..."
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--focus-ring)]"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Tìm PT
                </span>
                <input
                  type="search"
                  name="ptQ"
                  defaultValue={ptQuickQuery}
                  placeholder="Mã PT, tên PT..."
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--focus-ring)]"
                />
              </label>
              <ModuleFilterSelect
                label="Trạng thái gói"
                name="status"
                defaultValue={membershipStatusFilter}
                options={[
                  { value: "ALL", label: "Tất cả" },
                  { value: "ACTIVE", label: "Đang hoạt động" },
                  { value: "EXPIRED", label: "Đã hết hạn" },
                ]}
              />
              <ModuleFilterSelect
                label="Sắp xếp"
                name="sort"
                defaultValue={membershipSort}
                options={[
                  { value: "start-newest", label: "Mới bán trước" },
                  { value: "start-oldest", label: "Cũ nhất trước" },
                  { value: "member-asc", label: "Hội viên A-Z" },
                  { value: "member-desc", label: "Hội viên Z-A" },
                ]}
              />
              <div className="flex items-end">
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-slate-800"
                >
                  Lọc nhanh
                </button>
              </div>
            </form>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                {canSubmitSale ? (
                  <form action={createMembershipAction} className="space-y-4">
                    <input type="hidden" name="locale" value={locale} />
                    <FormGrid>
                      <FormAutocompleteSelect
                        label="Hội viên"
                        name="memberId"
                        required
                        options={saleMemberOptions}
                        placeholder="Gõ mã, tên hoặc số điện thoại để chọn"
                      />
                      <FormAutocompleteSelect
                        label="Gói tập"
                        name="membershipPlanId"
                        required
                        options={salePlanOptions}
                        placeholder="Gõ tên gói để chọn"
                      />
                      <FormAutocompleteSelect
                        label="PT đồng hành"
                        name="ptId"
                        defaultValue=""
                        options={saleTrainerOptions}
                        placeholder="Để trống nếu không chọn PT"
                      />
                      <FormField
                        label="Ngày bắt đầu"
                        name="startDate"
                        type="date"
                        defaultValue={defaultStartDate}
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
                    <p className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
                      Chỉ chọn PT khi bán gói có PT. Nếu đổi PT sau này, lịch sử
                      phân công vẫn được giữ trong bảng nhật ký riêng.
                    </p>
                    <SubmitButton label="Bán gói và chốt PT" />
                  </form>
                ) : (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Chưa có đủ hội viên hoặc gói phù hợp với bộ lọc hiện tại.
                    Hãy nới bộ lọc để chốt giao dịch.
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Hội viên khớp nhanh
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {saleMembers.slice(0, 6).map((member) => (
                      <span
                        key={`sale-member-${member.id}`}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                      >
                        {member.fullName}
                      </span>
                    ))}
                    {saleMembers.length === 0 ? (
                      <span className="text-sm text-slate-500">
                        Không có hội viên khớp.
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Gói đang bán
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {salePlans.slice(0, 5).map((plan) => (
                      <li
                        key={`sale-plan-${plan.id}`}
                        className="flex items-center justify-between gap-3"
                      >
                        <span>{plan.name}</span>
                        <span className="font-semibold text-slate-900">
                          {formatCurrency(plan.price)}
                        </span>
                      </li>
                    ))}
                    {salePlans.length === 0 ? (
                      <li className="text-slate-500">Không có gói khớp.</li>
                    ) : null}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    PT sẵn sàng
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {saleTrainers.slice(0, 6).map((trainer) => (
                      <span
                        key={`sale-pt-${trainer.id}`}
                        className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs text-sky-800"
                      >
                        {trainer.fullName}
                      </span>
                    ))}
                    {saleTrainers.length === 0 ? (
                      <span className="text-sm text-slate-500">
                        Không có PT khớp.
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <SectionCard title="Gia hạn nhanh">
              <form action={renewMembershipAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormAutocompleteSelect
                  label="Gói hiện có"
                  name="membershipId"
                  required
                  options={filteredMemberships.map((membership) => ({
                    value: membership.id,
                    label: `${getMemberName(snapshot, membership.memberId)} | ${getPlanName(snapshot, membership.membershipPlanId)} | ${humanizeStatus(membership.status)}`,
                  }))}
                  placeholder="Gõ tên hội viên hoặc tên gói để chọn"
                />
                <FormGrid>
                  <FormField
                    label="Ngày bắt đầu mới"
                    name="startDate"
                    type="date"
                  />
                  <FormAutocompleteSelect
                    label="PT cho kỳ mới"
                    name="ptId"
                    defaultValue=""
                    options={saleTrainerOptions}
                    placeholder="Để trống nếu giữ nguyên"
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
                <SubmitButton label="Gia hạn gói" />
              </form>
            </SectionCard>

            <SectionCard title="Hủy gói tập">
              <form action={cancelMembershipAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormAutocompleteSelect
                  label="Gói tập"
                  name="membershipId"
                  required
                  options={filteredMemberships.map((membership) => ({
                    value: membership.id,
                    label: `${getMemberName(snapshot, membership.memberId)} | ${getPlanName(snapshot, membership.membershipPlanId)}`,
                  }))}
                  placeholder="Gõ tên hội viên hoặc tên gói để chọn"
                />
                <FormField
                  label="Thời điểm hủy"
                  name="cancelledAt"
                  type="date"
                />
                <SubmitButton label="Hủy gói tập" />
              </form>
            </SectionCard>
          </div>
        </>
      ) : null}

      <SectionCard title="Gói tập của hội viên">
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Trạng thái nhanh
          </span>
          {membershipStatusQuickFilters.map((statusFilterItem) => {
            const isActiveFilter =
              membershipStatusFilter === statusFilterItem.value;

            return (
              <Link
                key={`membership-status-quick-${statusFilterItem.value}`}
                href={buildPathWithSearchParams(
                  "/members/memberships",
                  options?.searchParams,
                  { status: statusFilterItem.value },
                )}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${isActiveFilter
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {translateText(statusFilterItem.label, getActiveUiLocale())}
              </Link>
            );
          })}
        </div>
        <ModuleFilterForm
          query={membershipSearchQuery}
          placeholder="Tên hội viên, tên gói, PT, trạng thái..."
        >
          <ModuleFilterSelect
            label="Trạng thái gói"
            name="status"
            defaultValue={membershipStatusFilter}
            options={[
              { value: "ALL", label: "Tất cả" },
              { value: "ACTIVE", label: "Đang hoạt động" },
              { value: "EXPIRED", label: "Đã hết hạn" },
            ]}
          />
        </ModuleFilterForm>
        <DataTable
          headers={[
            "Hội viên",
            "Gói",
            "Khoảng thời gian",
            "PT hiện tại",
            "Trạng thái",
          ]}
          rows={sortedMemberships.map((membership) => {
            const plan = snapshot.dataset.membershipPlans.find(
              (item) => item.id === membership.membershipPlanId,
            );
            const activeAssignment = snapshot.dataset.memberPtAssignments.find(
              (assignment) =>
                assignment.memberMembershipId === membership.id &&
                assignment.status === "ACTIVE",
            );

            return [
              getMemberName(snapshot, membership.memberId),
              plan?.name ?? membership.membershipPlanId,
              `${formatDate(membership.startDate)} - ${formatDate(membership.endDate)}`,
              plan?.includesPt
                ? getTrainerName(snapshot, activeAssignment?.ptId ?? "")
                : "Tự tập",
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

function buildMemberAssignmentsPage(
  options?: RenderGymRouteOptions,
): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);
  const assignmentSearchQuery = getModuleSearchQuery(options);
  const filteredAssignments = snapshot.dataset.memberPtAssignments
    .filter((assignment) =>
      matchesSearchQuery(
        assignmentSearchQuery,
        getMemberName(snapshot, assignment.memberId),
        getTrainerName(snapshot, assignment.ptId),
        getPlanName(
          snapshot,
          snapshot.dataset.memberMemberships.find(
            (membership) => membership.id === assignment.memberMembershipId,
          )?.membershipPlanId ?? "",
        ),
        assignment.status,
        assignment.assignedFrom,
        assignment.assignedTo,
      ),
    )
    .toSorted(
      (leftAssignment, rightAssignment) =>
        toSortableTimestamp(rightAssignment.assignedFrom) -
        toSortableTimestamp(leftAssignment.assignedFrom),
    );

  return (
    <>
      <PageHeader eyebrow="Phân công PT" title="Nhật ký PT theo hội viên" />

      <StatsGrid
        items={[
          {
            label: "Phân công đang hoạt động",
            value: `${snapshot.dataset.memberPtAssignments.filter((a) => a.status === "ACTIVE").length}`,
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
          <ModuleFilterForm
            query={assignmentSearchQuery}
            placeholder="Tên hội viên, tên PT, gói tập..."
          />
          <DataTable
            headers={[
              "Hội viên",
              "PT",
              "Gói tập",
              "Hoa hồng chốt",
              "Phân công từ",
              "Đến ngày",
              "Trạng thái",
              "Hành động",
            ]}
            rows={filteredAssignments.map((assignment) => [
              getMemberName(snapshot, assignment.memberId),
              getTrainerName(snapshot, assignment.ptId),
              getPlanName(
                snapshot,
                snapshot.dataset.memberMemberships.find(
                  (membership) =>
                    membership.id === assignment.memberMembershipId,
                )?.membershipPlanId ?? "",
              ),
              formatCurrency(assignment.commissionAmount),
              formatDate(assignment.assignedFrom),
              assignment.assignedTo ? formatDate(assignment.assignedTo) : "-",
              <Badge
                key={assignment.id}
                tone={getStatusTone(assignment.status)}
              >
                {assignment.status}
              </Badge>,
              assignment.status === "ACTIVE" && isAdmin(options) ? (
                <form
                  key={`${assignment.id}-form`}
                  action={endAssignmentAction}
                >
                  <input type="hidden" name="locale" value={locale} />
                  <input
                    type="hidden"
                    name="assignmentId"
                    value={assignment.id}
                  />
                  <button
                    type="submit"
                    className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Kết thúc
                  </button>
                </form>
              ) : null,
            ])}
          />
        </SectionCard>

        <SectionCard
          title="Nguyên tắc vận hành"
          description="Phân công PT mới được chốt ngay khi bán gói có PT. Màn hình này giữ vai trò tra cứu lịch sử và kết thúc phân công khi cần đổi người theo dõi."
        >
          <KeyValueList
            items={[
              {
                label: "Bán gói có PT",
                value: "Lễ tân chọn PT ngay trong lúc chốt gói tập.",
              },
              {
                label: "Đổi PT",
                value: "Kết thúc phân công cũ rồi bán/gia hạn lại với PT mới.",
              },
              {
                label: "Hoa hồng",
                value:
                  "Hệ thống tự chốt theo mức cấu hình của PT, không nhập tay ngoài quầy.",
              },
            ]}
          />
        </SectionCard>
      </div>
    </>
  );
}

function buildMembershipPlansPage(
  options?: RenderGymRouteOptions,
): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);
  const membershipPlanSearchQuery = getModuleSearchQuery(options);
  const filteredMembershipPlans = snapshot.dataset.membershipPlans.filter(
    (membershipPlan) =>
      matchesSearchQuery(
        membershipPlanSearchQuery,
        membershipPlan.code,
        membershipPlan.name,
        membershipPlan.type,
        membershipPlan.status,
      ),
  );

  return (
    <>
      <PageHeader eyebrow="Danh mục" title="Gói tập" />

      {isAdmin(options) ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <SectionCard title="Thêm gói tập mới">
            <CollapsibleCrudPanel triggerLabel="Mở bảng thêm gói tập">
              <form action={createMembershipPlanAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <FormGrid>
                  <FormField
                    label="Mã gói"
                    name="code"
                    placeholder="PLAN-NEW"
                    required
                  />
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
                  <FormField
                    label="Giá bán"
                    name="price"
                    type="number"
                    min={0}
                    step="1000"
                    required
                  />
                  <FormField
                    label="Số ngày"
                    name="durationDays"
                    type="number"
                    min={1}
                    defaultValue={30}
                    required
                  />
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
                <FormAutocompleteSelect
                  label="Gói tập"
                  name="planId"
                  required
                  options={snapshot.dataset.membershipPlans.map((plan) => ({
                    value: plan.id,
                    label: `${plan.code} | ${plan.name} | ${humanizeStatus(plan.status)}`,
                  }))}
                  placeholder="Gõ mã hoặc tên gói để chọn"
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
        <ModuleFilterForm
          query={membershipPlanSearchQuery}
          placeholder="Mã gói, tên gói, loại hoặc trạng thái..."
        />
        <DataTable
          headers={[
            "Gói",
            "Loại",
            "Giá",
            "Hình thức",
            "Quyền lợi",
            "Trạng thái",
            "Cập nhật",
          ]}
          rows={filteredMembershipPlans.map((plan) => [
            plan.name,
            plan.type,
            formatCurrency(plan.price),
            plan.includesPt ? "Có PT đồng hành" : "Tự tập",
            plan.perks.join(", "),
            <Badge key={plan.id} tone={getStatusTone(plan.status)}>
              {humanizeStatus(plan.status)}
            </Badge>,
            isAdmin(options) ? (
              <details
                key={`${plan.id}-edit`}
                className="group min-w-[12.5rem] rounded-2xl border border-slate-200/80 bg-white/90 p-2"
              >
                <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Chỉnh sửa
                </summary>
                <form
                  action={updateMembershipPlanAction}
                  className="mt-2 flex flex-wrap items-center gap-2"
                >
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="planId" value={plan.id} />
                  <input type="hidden" name="code" value={plan.code} />
                  <input type="hidden" name="name" value={plan.name} />
                  <input type="hidden" name="type" value={plan.type} />
                  <input
                    type="hidden"
                    name="durationDays"
                    value={plan.durationDays}
                  />
                  <input
                    type="hidden"
                    name="includesPt"
                    value={plan.includesPt ? "true" : "false"}
                  />
                  <input
                    type="hidden"
                    name="perks"
                    value={plan.perks.join("\n")}
                  />
                  <input
                    type="number"
                    name="price"
                    defaultValue={plan.price}
                    min={0}
                    step="1000"
                    className="w-28 rounded-xl border border-slate-200 px-2 py-1 text-xs"
                  />
                  <select
                    name="status"
                    defaultValue={plan.status}
                    className="rounded-xl border border-slate-200 px-2 py-1 text-xs"
                  >
                    <option value="ON_SALE">ON_SALE</option>
                    <option value="OFF_SALE">OFF_SALE</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Lưu
                  </button>
                </form>
              </details>
            ) : (
              "-"
            ),
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildMembershipInvoicesPage(
  options?: RenderGymRouteOptions,
): JSX.Element {
  const snapshot = getGymSnapshot();
  const membershipInvoiceSearchQuery = getModuleSearchQuery(options);
  const filteredMembershipInvoices = snapshot.dataset.membershipInvoices
    .filter((membershipInvoice) =>
      matchesSearchQuery(
        membershipInvoiceSearchQuery,
        membershipInvoice.code,
        membershipInvoice.paymentMethod,
        membershipInvoice.status,
        getMemberName(snapshot, membershipInvoice.memberId),
      ),
    )
    .toSorted(
      (leftMembershipInvoice, rightMembershipInvoice) =>
        toSortableTimestamp(rightMembershipInvoice.invoiceDate) -
        toSortableTimestamp(leftMembershipInvoice.invoiceDate),
    );

  return (
    <>
      <PageHeader eyebrow="Thanh toán gói tập" title="Hóa đơn gói tập" />
      <SectionCard title="Danh sách hóa đơn gói tập">
        <ModuleFilterForm
          query={membershipInvoiceSearchQuery}
          placeholder="Mã hóa đơn, tên hội viên, phương thức thanh toán..."
        />
        <DataTable
          headers={[
            "Mã",
            "Hội viên",
            "Ngày",
            "Số tiền",
            "Thanh toán",
            "Trạng thái",
          ]}
          rows={filteredMembershipInvoices.map((invoice) => [
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
  const productSearchQuery = getModuleSearchQuery(options);
  const productStatusFilter = getScopedOptionValue(options, "status", "ALL");
  const productSort = getScopedOptionValue(options, "sort", "stock-low");
  const filteredProducts = snapshot.dataset.products
    .filter(
      (productItem) =>
        productStatusFilter === "ALL" ||
        productItem.status === productStatusFilter,
    )
    .filter((productItem) =>
      matchesSearchQuery(
        productSearchQuery,
        productItem.code,
        productItem.name,
        productItem.category,
        productItem.status,
      ),
    );
  const sortedProducts = ((): typeof filteredProducts => {
    switch (productSort) {
      case "name-asc": {
        return sortByVietnameseText(
          filteredProducts,
          (productItem) => productItem.name,
        );
      }

      case "name-desc": {
        return sortByVietnameseText(
          filteredProducts,
          (productItem) => productItem.name,
          "desc",
        );
      }

      case "stock-high": {
        return filteredProducts.toSorted(
          (leftProduct, rightProduct) =>
            rightProduct.stockOnHand - leftProduct.stockOnHand,
        );
      }

      case "status-active": {
        return filteredProducts.toSorted((leftProduct, rightProduct) => {
          if (leftProduct.status === rightProduct.status) {
            return compareVietnameseText(leftProduct.name, rightProduct.name);
          }

          return leftProduct.status === "ACTIVE" ? -1 : 1;
        });
      }

      default: {
        return sortProductsByStock(filteredProducts);
      }
    }
  })();

  return (
    <>
      <PageHeader eyebrow="Danh mục bán lẻ" title="Sản phẩm" />
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
                  <FormField
                    label="Mã sản phẩm"
                    name="code"
                    placeholder="PRD-NEW"
                    required
                  />
                  <FormField label="Tên sản phẩm" name="name" required />
                  <FormField label="Danh mục" name="category" required />
                  <FormField
                    label="Đơn giá vốn"
                    name="unitCost"
                    type="number"
                    min={0}
                    step="1000"
                    required
                  />
                  <FormField
                    label="Giá bán"
                    name="salePrice"
                    type="number"
                    min={0}
                    step="1000"
                    required
                  />
                  <FormField
                    label="Tồn kho"
                    name="stockOnHand"
                    type="number"
                    min={0}
                    defaultValue={0}
                    required
                  />
                  <FormField
                    label="Ngưỡng cảnh báo"
                    name="minimumStockLevel"
                    type="number"
                    min={0}
                    defaultValue={10}
                    required
                  />
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
                <FormAutocompleteSelect
                  label="Sản phẩm"
                  name="productId"
                  required
                  options={snapshot.dataset.products.map((product) => ({
                    value: product.id,
                    label: `${product.code} | ${product.name} | ${humanizeStatus(product.status)}`,
                  }))}
                  placeholder="Gõ mã hoặc tên sản phẩm để chọn"
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
        <ModuleFilterForm
          query={productSearchQuery}
          placeholder="Mã sản phẩm, tên sản phẩm, danh mục..."
        >
          <ModuleFilterSelect
            label="Trạng thái"
            name="status"
            defaultValue={productStatusFilter}
            options={[
              { value: "ALL", label: "Tất cả" },
              { value: "ACTIVE", label: "Đang bán" },
              { value: "INACTIVE", label: "Ngừng bán" },
            ]}
          />
          <ModuleFilterSelect
            label="Sắp xếp"
            name="sort"
            defaultValue={productSort}
            options={[
              { value: "stock-low", label: "Tồn kho thấp trước" },
              { value: "stock-high", label: "Tồn kho cao trước" },
              { value: "name-asc", label: "Tên A-Z" },
              { value: "name-desc", label: "Tên Z-A" },
              { value: "status-active", label: "Đang bán trước" },
            ]}
          />
        </ModuleFilterForm>
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
          rows={sortedProducts.map((product) => [
            product.name,
            product.category,
            formatCurrency(product.unitCost),
            formatCurrency(product.salePrice),
            `${product.stockOnHand}`,
            `${product.minimumStockLevel}`,
            isAdmin(options) ? (
              <details
                key={`${product.id}-edit`}
                className="group min-w-[12.5rem] rounded-2xl border border-slate-200/80 bg-white/90 p-2"
              >
                <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Chỉnh sửa
                </summary>
                <form
                  action={updateProductAction}
                  className="mt-2 flex flex-wrap items-center gap-2"
                >
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="code" value={product.code} />
                  <input type="hidden" name="name" value={product.name} />
                  <input
                    type="hidden"
                    name="category"
                    value={product.category}
                  />
                  <input
                    type="hidden"
                    name="unitCost"
                    value={product.unitCost}
                  />
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
                  <button
                    type="submit"
                    className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Lưu
                  </button>
                </form>
              </details>
            ) : (
              "-"
            ),
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildInventoryPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);
  const inventorySearchQuery = getModuleSearchQuery(options);
  const importProductOptions = snapshot.dataset.products
    .filter((product) =>
      matchesSearchQuery(
        inventorySearchQuery,
        product.code,
        product.name,
        product.category,
      ),
    )
    .map((product) => ({
      value: product.id,
      label: `${product.code} | ${product.name} | ton ${product.stockOnHand}`,
    }));
  const filteredInventoryTransactions = snapshot.dataset.inventoryTransactions
    .filter((inventoryTransaction) =>
      matchesSearchQuery(
        inventorySearchQuery,
        getProductName(snapshot, inventoryTransaction.productId),
        inventoryTransaction.type,
        inventoryTransaction.referenceCode,
        inventoryTransaction.note,
      ),
    )
    .toSorted(
      (leftInventoryTransaction, rightInventoryTransaction) =>
        toSortableTimestamp(rightInventoryTransaction.transactionDate) -
        toSortableTimestamp(leftInventoryTransaction.transactionDate),
    );

  return (
    <>
      <PageHeader
        eyebrow="Kho hàng"
        title="Giao dịch kho"
        actions={
          <ActionLink href="/inventory/import">Mở phiếu nhập</ActionLink>
        }
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

      {canManageGym(options) ? (
        <SectionCard title="Tạo phiếu nhập">
          <CollapsibleCrudPanel triggerLabel="Mở bảng tạo phiếu nhập">
            <form action={importInventoryAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <p className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                O tim kiem o bang so kho cung loc luon danh sach san pham trong
                form nhap.
              </p>
              <FormGrid>
                <FormAutocompleteSelect
                  label="Sản phẩm"
                  name="productId"
                  required
                  options={importProductOptions}
                  placeholder="Gõ mã hoặc tên sản phẩm để chọn"
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
        <ModuleFilterForm
          query={inventorySearchQuery}
          placeholder="Sản phẩm, loại giao dịch, mã tham chiếu..."
        />
        <DataTable
          headers={["Ngày", "Sản phẩm", "Loại", "SL", "Tham chiếu", "Ghi chú"]}
          rows={filteredInventoryTransactions.map((transaction) => [
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

function buildInventoryImportPage(
  options?: RenderGymRouteOptions,
): JSX.Element {
  const snapshot = getGymSnapshot();
  const inventoryImportSearchQuery = getModuleSearchQuery(options);
  const importTransactions = snapshot.dataset.inventoryTransactions
    .filter((transaction) => transaction.type === "IMPORT")
    .filter((transaction) =>
      matchesSearchQuery(
        inventoryImportSearchQuery,
        getProductName(snapshot, transaction.productId),
        transaction.referenceCode,
      ),
    )
    .toSorted(
      (leftImportTransaction, rightImportTransaction) =>
        toSortableTimestamp(rightImportTransaction.transactionDate) -
        toSortableTimestamp(leftImportTransaction.transactionDate),
    );
  const filteredLowStockProducts = sortProductsByStock(
    snapshot.dashboard.lowStockProducts,
  ).filter((lowStockProduct) =>
    matchesSearchQuery(
      inventoryImportSearchQuery,
      lowStockProduct.code,
      lowStockProduct.name,
    ),
  );

  return (
    <>
      <PageHeader eyebrow="Nhập hàng" title="Theo dõi nhập kho" />
      <ModuleFilterForm
        query={inventoryImportSearchQuery}
        placeholder="Tên sản phẩm, mã tham chiếu..."
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
            headers={["Sản phẩm", "Tồn kho hiện tại", "Ngưỡng", "Nhập nhanh"]}
            rows={filteredLowStockProducts.map((product) => [
              product.name,
              `${product.stockOnHand}`,
              `${product.minimumStockLevel}`,
              canManageGym(options) ? (
                <form
                  key={`quick-import-${product.id}`}
                  action={importInventoryAction}
                  className="flex items-center gap-2"
                >
                  <input
                    type="hidden"
                    name="locale"
                    value={getLocale(options)}
                  />
                  <input type="hidden" name="productId" value={product.id} />
                  <input
                    type="hidden"
                    name="unitCost"
                    value={product.unitCost}
                  />
                  <input
                    type="number"
                    name="quantity"
                    min={1}
                    defaultValue={Math.max(
                      product.minimumStockLevel * 2 - product.stockOnHand,
                      product.minimumStockLevel,
                    )}
                    className="w-20 rounded-xl border border-slate-200 px-2 py-1 text-xs"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Nhập
                  </button>
                </form>
              ) : (
                "Can nhap bo sung"
              ),
            ])}
          />
        </SectionCard>
      </div>
    </>
  );
}

function buildInvoicesPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);
  const salesInvoiceSearchQuery = getModuleSearchQuery(options);
  const saleMemberQuery = getScopedSearchQuery(options, "saleMemberQ");
  const saleProductQuery = getScopedSearchQuery(options, "saleProductQ");
  const invoiceStatusFilter = getScopedOptionValue(options, "status", "ALL");
  const invoiceSort = getScopedOptionValue(options, "sort", "date-newest");
  const saleMemberOptions = sortByVietnameseText(
    snapshot.dataset.members.filter((member) =>
      matchesSearchQuery(
        saleMemberQuery,
        member.code,
        member.fullName,
        member.phone,
      ),
    ),
    (member) => member.fullName,
  ).map((member) => ({
    value: member.id,
    label: `${member.code} | ${member.fullName}`,
  }));
  const saleProductOptions = sortByVietnameseText(
    snapshot.dataset.products
      .filter((product) => product.status === "ACTIVE")
      .filter((product) =>
        matchesSearchQuery(
          saleProductQuery,
          product.code,
          product.name,
          product.category,
        ),
      ),
    (product) => product.name,
  ).map((product) => ({
    value: product.id,
    label: `${product.code} | ${product.name} | ${formatCurrency(product.salePrice)}`,
  }));
  const filteredSalesInvoices = snapshot.dataset.salesInvoices
    .filter(
      (salesInvoice) =>
        invoiceStatusFilter === "ALL" ||
        salesInvoice.status === invoiceStatusFilter,
    )
    .filter((salesInvoice) =>
      matchesSearchQuery(
        salesInvoiceSearchQuery,
        salesInvoice.code,
        salesInvoice.customerName,
        salesInvoice.status,
        salesInvoice.paymentMethod,
      ),
    );
  const sortedSalesInvoices = ((): typeof filteredSalesInvoices => {
    switch (invoiceSort) {
      case "date-oldest": {
        return filteredSalesInvoices.toSorted(
          (leftSalesInvoice, rightSalesInvoice) =>
            toSortableTimestamp(leftSalesInvoice.invoiceDate) -
            toSortableTimestamp(rightSalesInvoice.invoiceDate),
        );
      }

      case "customer-asc": {
        return sortByVietnameseText(
          filteredSalesInvoices,
          (salesInvoice) => salesInvoice.customerName,
        );
      }

      case "customer-desc": {
        return sortByVietnameseText(
          filteredSalesInvoices,
          (salesInvoice) => salesInvoice.customerName,
          "desc",
        );
      }

      default: {
        return filteredSalesInvoices.toSorted(
          (leftSalesInvoice, rightSalesInvoice) =>
            toSortableTimestamp(rightSalesInvoice.invoiceDate) -
            toSortableTimestamp(leftSalesInvoice.invoiceDate),
        );
      }
    }
  })();

  return (
    <>
      <PageHeader eyebrow="Bán hàng" title="Hóa đơn dịch vụ" />

      {canManageGym(options) ? (
        <SectionCard
          title="Bán nhanh tại quầy"
          description="Lọc hội viên và sản phẩm trước để ô chọn ngắn lại, phù hợp thao tác bán nước, găng tay, khăn..."
        >
          <form
            method="get"
            className="mb-4 grid gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 md:grid-cols-[1fr_1fr_12rem_12rem_auto]"
          >
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Tìm hội viên
              </span>
              <input
                type="search"
                name="saleMemberQ"
                defaultValue={saleMemberQuery}
                placeholder="Mã, tên hội viên..."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--focus-ring)]"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Tìm sản phẩm
              </span>
              <input
                type="search"
                name="saleProductQ"
                defaultValue={saleProductQuery}
                placeholder="Mã, tên sản phẩm..."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--focus-ring)]"
              />
            </label>
            <ModuleFilterSelect
              label="Trạng thái"
              name="status"
              defaultValue={invoiceStatusFilter}
              options={[
                { value: "ALL", label: "Tất cả" },
                { value: "CONFIRMED", label: "Đã xác nhận" },
                { value: "DRAFT", label: "Nháp" },
                { value: "CANCELLED", label: "Đã hủy" },
              ]}
            />
            <ModuleFilterSelect
              label="Sắp xếp"
              name="sort"
              defaultValue={invoiceSort}
              options={[
                { value: "date-newest", label: "Mới nhất trước" },
                { value: "date-oldest", label: "Cũ nhất trước" },
                { value: "customer-asc", label: "Khách hàng A-Z" },
                { value: "customer-desc", label: "Khách hàng Z-A" },
              ]}
            />
            <div className="flex items-end">
              <button
                type="submit"
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-slate-800"
              >
                Lọc nhanh
              </button>
            </div>
          </form>

          <form action={createSalesInvoiceAction} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <FormGrid>
              <FormAutocompleteSelect
                label="Hội viên (tùy chọn)"
                name="memberId"
                defaultValue=""
                options={[
                  { value: "", label: "Khách lẻ" },
                  ...saleMemberOptions,
                ]}
                placeholder="Gõ tên hội viên hoặc để trống nếu khách lẻ"
              />
              <FormField
                label="Tên khách hàng (tùy chọn)"
                name="customerName"
                placeholder="Trần Văn A"
              />
              <FormAutocompleteSelect
                label="Sản phẩm"
                name="productId"
                required
                options={saleProductOptions}
                placeholder="Gõ mã hoặc tên sản phẩm để chọn"
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
            <p className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Bộ lọc phía trên chỉ thu gọn danh sách chọn, không ảnh hưởng lịch
              sử hóa đơn.
            </p>
            <SubmitButton label="Tạo hóa đơn" />
          </form>
        </SectionCard>
      ) : null}

      <SectionCard title="Hóa đơn bán hàng">
        <ModuleFilterForm
          query={salesInvoiceSearchQuery}
          placeholder="Mã hóa đơn, khách hàng, trạng thái..."
        />
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
          rows={sortedSalesInvoices.map((invoice) => [
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
        actions={
          <ActionLink href="/invoices">Quay lại danh sách hóa đơn</ActionLink>
        }
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

function buildRevenueReportPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const revenueSearchQuery = getModuleSearchQuery(options);
  const filteredMembershipInvoices = snapshot.dataset.membershipInvoices
    .filter((membershipInvoice) =>
      matchesSearchQuery(
        revenueSearchQuery,
        membershipInvoice.code,
        getMemberName(snapshot, membershipInvoice.memberId),
      ),
    )
    .toSorted(
      (leftMembershipInvoice, rightMembershipInvoice) =>
        toSortableTimestamp(rightMembershipInvoice.invoiceDate) -
        toSortableTimestamp(leftMembershipInvoice.invoiceDate),
    );
  const filteredServiceInvoices = snapshot.dataset.salesInvoices
    .filter((salesInvoice) => salesInvoice.status === "CONFIRMED")
    .filter((salesInvoice) =>
      matchesSearchQuery(
        revenueSearchQuery,
        salesInvoice.code,
        salesInvoice.customerName,
      ),
    )
    .toSorted(
      (leftSalesInvoice, rightSalesInvoice) =>
        toSortableTimestamp(rightSalesInvoice.invoiceDate) -
        toSortableTimestamp(leftSalesInvoice.invoiceDate),
    );

  return (
    <>
      <PageHeader
        eyebrow="Báo cáo"
        title="Báo cáo doanh thu"
        actions={
          isAdmin(options) ? (
            <ReportDownloadActions reportType="revenue" />
          ) : undefined
        }
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

      <ModuleFilterForm
        query={revenueSearchQuery}
        placeholder="Mã hóa đơn, hội viên, khách hàng..."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Hóa đơn gói tập">
          <DataTable
            headers={["Mã", "Hội viên", "Ngày", "Số tiền"]}
            rows={filteredMembershipInvoices.map((invoice) => [
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
            rows={filteredServiceInvoices.map((invoice) => [
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

function buildPayrollReportPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const payrollReportSearchQuery = getModuleSearchQuery(options);
  const filteredPayrollReportItems = snapshot.payrollReport.byTrainer.filter(
    (payrollReportItem) =>
      matchesSearchQuery(
        payrollReportSearchQuery,
        payrollReportItem.ptName,
        payrollReportItem.payrollPeriodCode,
        payrollReportItem.status,
      ),
  );

  return (
    <>
      <PageHeader
        eyebrow="Báo cáo"
        title="Báo cáo lương"
        actions={
          isAdmin(options) ? (
            <ReportDownloadActions reportType="payroll" />
          ) : undefined
        }
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
      <ModuleFilterForm
        query={payrollReportSearchQuery}
        placeholder="Tên PT, mã kỳ, trạng thái..."
      />
      <SectionCard title="Bảng lương theo PT">
        <DataTable
          headers={["PT", "Kỳ", "Thực lĩnh", "Trạng thái"]}
          rows={filteredPayrollReportItems.map((item) => [
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

function buildInventoryReportPage(
  options?: RenderGymRouteOptions,
): JSX.Element {
  const snapshot = getGymSnapshot();
  const inventoryReportSearchQuery = getModuleSearchQuery(options);
  const filteredTopSellingProducts =
    snapshot.inventoryOverview.topSellingProducts.filter((topSellingProduct) =>
      matchesSearchQuery(
        inventoryReportSearchQuery,
        topSellingProduct.product.name,
        topSellingProduct.product.code,
      ),
    );
  const filteredRecentTransactions =
    snapshot.inventoryOverview.recentTransactions
      .filter((recentTransaction) =>
        matchesSearchQuery(
          inventoryReportSearchQuery,
          getProductName(snapshot, recentTransaction.productId),
          recentTransaction.type,
        ),
      )
      .toSorted(
        (leftTransaction, rightTransaction) =>
          toSortableTimestamp(rightTransaction.transactionDate) -
          toSortableTimestamp(leftTransaction.transactionDate),
      );

  return (
    <>
      <PageHeader eyebrow="Báo cáo" title="Báo cáo tồn kho" />
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
      <ModuleFilterForm
        query={inventoryReportSearchQuery}
        placeholder="Sản phẩm, mã sản phẩm, loại giao dịch..."
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Sản phẩm bán chạy">
          <DataTable
            headers={["Sản phẩm", "Số lượng bán", "Tồn kho hiện tại"]}
            rows={filteredTopSellingProducts.map((entry) => [
              entry.product.name,
              `${entry.soldQuantity}`,
              `${entry.product.stockOnHand}`,
            ])}
          />
        </SectionCard>
        <SectionCard title="Giao dịch kho gần đây">
          <DataTable
            headers={["Ngày", "Sản phẩm", "Loại", "SL"]}
            rows={filteredRecentTransactions.map((transaction) => [
              formatDateTime(transaction.transactionDate),
              getProductName(snapshot, transaction.productId),
              transaction.type,
              `${transaction.quantity}`,
            ])}
          />
        </SectionCard>
      </div>
    </>
  );
}

function buildExpenseReportPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const expenseReportSearchQuery = getModuleSearchQuery(options);
  const filteredExpenseByCategory = Object.entries(
    snapshot.expenseReport.byCategory,
  ).filter(([category]) =>
    matchesSearchQuery(expenseReportSearchQuery, category),
  );

  return (
    <>
      <PageHeader
        eyebrow="Báo cáo"
        title="Báo cáo chi phí"
        actions={
          isAdmin(options) ? (
            <ReportDownloadActions reportType="expenses" />
          ) : undefined
        }
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
        <ModuleFilterForm
          query={expenseReportSearchQuery}
          placeholder="Tên danh mục chi phí..."
        />
        <DataTable
          headers={["Danh mục", "Số tiền"]}
          rows={filteredExpenseByCategory.map(([category, amount]) => [
            category,
            formatCurrency(amount),
          ])}
        />
      </SectionCard>
    </>
  );
}

function buildProfitReportPage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Báo cáo"
        title="Báo cáo lợi nhuận"
        actions={
          isAdmin(options) ? (
            <ReportDownloadActions reportType="profit" />
          ) : undefined
        }
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
  const settingsSearchQuery = getModuleSearchQuery(options);
  const filteredSystemConfigs = snapshot.dataset.systemConfigs.filter(
    (systemConfig) =>
      matchesSearchQuery(
        settingsSearchQuery,
        systemConfig.key,
        systemConfig.label,
        systemConfig.value,
        systemConfig.description,
      ),
  );
  const currentFullName = options?.currentUser?.fullName ?? "";
  const currentUsername = options?.currentUser?.username ?? "";

  return (
    <>
      <PageHeader eyebrow="Cấu hình hệ thống" title="Cấu hình" />
      <SectionCard
        title="Tài khoản đăng nhập"
        description="Admin/Staff có thể đổi tên đăng nhập hoặc mật khẩu trực tiếp tại đây"
      >
        <form action={updateAccountAction} className="space-y-4">
          <input type="hidden" name="locale" value={locale} />
          <FormGrid>
            <FormField
              label="Tên hiển thị"
              name="fullName"
              defaultValue={currentFullName}
              required
            />
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
      {isAdmin(options) ? (
        <SectionCard
          title="Dọn dữ liệu cấu hình rác"
          description="Xóa các khóa cấu hình PT đã lỗi thời và khóa cũ không còn dùng trong bản demo."
        >
          <form action={cleanupSystemConfigTrashAction} className="space-y-3">
            <input type="hidden" name="locale" value={locale} />
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Tác vụ này giúp dữ liệu cấu hình gọn hơn sau khi xóa PT hoặc tinh
              gọn tính năng.
            </p>
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Dọn cấu hình rác
            </button>
          </form>
        </SectionCard>
      ) : null}
      <SectionCard title="Cấu hình hệ thống">
        <ModuleFilterForm
          query={settingsSearchQuery}
          placeholder="Khóa cấu hình, nhãn, mô tả..."
        />
        <DataTable
          headers={["Khóa", "Nhãn", "Giá trị", "Mô tả"]}
          rows={filteredSystemConfigs.map((config) => [
            config.key,
            config.label,
            isAdmin(options) ? (
              <details
                key={`${config.key}-edit`}
                className="group min-w-[14rem] rounded-2xl border border-slate-200/80 bg-white/90 p-2"
              >
                <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Chỉnh sửa
                </summary>
                <form
                  action={patchSystemConfigAction}
                  className="mt-2 flex items-center gap-2"
                >
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
            ) : (
              config.value
            ),
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
    getSearchParameter(options?.searchParams, "error") === "invalid";

  return (
    <>
      <PageHeader
        eyebrow="Đăng nhập an toàn"
        title="Đăng nhập"
        description="Truy cập nhanh vào workspace để theo dõi vận hành, quản trị hội viên và kiểm soát doanh thu trong thời gian thực."
      />

      <div className="mx-auto grid w-full max-w-4xl gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-6">
        <section className="rounded-[1.8rem] border border-white/70 bg-white/82 p-5 shadow-[0_22px_54px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-600)]">
            Gym Manager
          </p>
          <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.85rem]">
            Bảo mật rõ ràng, thao tác nhanh
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Phiên đăng nhập được tối ưu cho nhân sự vận hành phòng gym trên
            mobile lẫn desktop.
          </p>
          <div className="mt-5 grid gap-3">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
              <span className="pi pi-shield text-sm text-[var(--accent-600)]" />
              <p className="text-sm text-slate-700">
                Xác thực tài khoản theo phân quyền Admin và Staff.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
              <span className="pi pi-mobile text-sm text-[var(--accent-600)]" />
              <p className="text-sm text-slate-700">
                Biểu mẫu tối ưu nhịp chạm cho màn hình nhỏ.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
              <span className="pi pi-bolt text-sm text-[var(--accent-600)]" />
              <p className="text-sm text-slate-700">
                Đăng nhập xong chuyển thẳng về luồng công việc phù hợp vai trò.
              </p>
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
    content = buildDashboardPage(options);
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
    content = buildMembershipInvoicesPage(options);
  }

  if (!content && section === "products") {
    content = buildProductsPage(options);
  }

  if (!content && section === "inventory" && slug.length === 1) {
    content = buildInventoryPage(options);
  }

  if (!content && section === "inventory" && entityId === "import") {
    content = buildInventoryImportPage(options);
  }

  if (!content && section === "invoices" && slug.length === 1) {
    content = buildInvoicesPage(options);
  }

  if (!content && section === "invoices" && slug.length === 2 && entityId) {
    content = buildInvoiceDetailPage(entityId);
  }

  if (!content && section === "reports" && entityId === "revenue") {
    content = buildRevenueReportPage(options);
  }

  if (!content && section === "reports" && entityId === "payroll") {
    content = buildPayrollReportPage(options);
  }

  if (!content && section === "reports" && entityId === "inventory") {
    content = buildInventoryReportPage(options);
  }

  if (!content && section === "reports" && entityId === "expenses") {
    content = buildExpenseReportPage(options);
  }

  if (!content && section === "reports" && entityId === "profit") {
    content = buildProfitReportPage(options);
  }

  if (!content && section === "settings") {
    content = buildSettingsPage(options);
  }

  if (!content) {
    notFound();
  }

  return content;
}
