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
  renewMembershipAction,
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

function translateNode(node: ReactNode, locale: "en" | "vi"): ReactNode {
  if (typeof node === "string") {
    return translateText(node, locale);
  }

  if (Array.isArray(node)) {
    const translatedItems: ReactNode[] = [];

    for (const item of node as ReactNode[]) {
      translatedItems.push(translateNode(item, locale));
    }

    return translatedItems;
  }

  return node;
  function buildPtsPage(options?: RenderGymRouteOptions): JSX.Element {
    const snapshot = getGymSnapshot();
    const locale = getLocale(options);

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
              note: "Tổng số hội viên đang có PT phụ trách.",
            },
            {
              label: "Công quy đổi",
              value: `${snapshot.ptOverview.reduce((total, item) => total + item.validShiftCredits, 0)}`,
              note: "Tổng công VALID/HALF trong dữ liệu mẫu.",
            },
            {
              label: "Tăng ca",
              value: formatHours(
                snapshot.ptOverview.reduce((total, item) => total + item.overtimeHours, 0),
              ),
              note: "Tổng giờ tăng ca được lấy từ nhật ký chấm công.",
            },
            {
              label: "Lương ước tính",
              value: formatCurrency(
                snapshot.ptOverview.reduce((total, item) => total + item.estimatedPayroll, 0),
              ),
              note: "Tổng thực lĩnh kỳ gần nhất của tất cả PT.",
            },
          ]}
        />

        {canManageGym(options) ? (
          <SectionCard title="Tạo PT mới">
            <form action={createPersonalTrainerAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <FormGrid>
                <FormField label="Mã PT" name="code" placeholder="PT004" required />
                <FormField label="Họ và tên" name="fullName" placeholder="Nguyễn Văn A" required />
                <FormSelect
                  label="Giới tính"
                  name="gender"
                  required
                  defaultValue="MALE"
                  options={[
                    { value: "MALE", label: "Nam" },
                    { value: "FEMALE", label: "Nữ" },
                    { value: "OTHER", label: "Khác" },
                  ]}
                />
                <FormField label="Ngày sinh" name="birthDate" type="date" required />
                <FormField label="Số điện thoại" name="phone" required />
                <FormField label="Thư điện tử" name="email" type="email" required />
                <FormField label="Địa chỉ" name="address" required />
                <FormSelect
                  label="Trạng thái"
                  name="status"
                  required
                  defaultValue="ACTIVE"
                  options={[
                    { value: "ACTIVE", label: "Đang hoạt động" },
                    { value: "INACTIVE", label: "Ngưng hoạt động" },
                  ]}
                />
                <FormField label="Chuyên môn" name="specialties" placeholder="Yoga\nHIIT" required />
                <FormField label="Kinh nghiệm" name="experienceYears" type="number" min={0} defaultValue={0} required />
                <FormField label="Avatar URL" name="avatarUrl" placeholder="https://..." />
                <FormField label="Ngày bắt đầu" name="startDate" type="date" required />
                <FormField label="Mã người dùng" name="userId" placeholder="user-uuid" />
              </FormGrid>
              <SubmitButton label="Tạo PT" />
            </form>
          </SectionCard>
        ) : null}

        <SectionCard title="Danh sách PT">
          <DataTable
            headers={[
              "PT",
              "Chuyên môn",
              "Hội viên đang hoạt động",
              "Công quy đổi",
              "Tăng ca",
              "Thực lĩnh",
              "Chi tiết",
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
                <ActionLink href={`/pts/${item.pt.id}`}>Hồ sơ</ActionLink>
              </div>,
            ])}
          />
        </SectionCard>
      </>
    );
  }

  function buildPtDetailPage(ptId: string, options?: RenderGymRouteOptions): JSX.Element {
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
        snapshot.dataset.members.find((member) => member.id === assignment.memberId),
      )
      .filter((member): member is (typeof snapshot.dataset.members)[number] => member !== undefined);

    return (
      <>
        <PageHeader
          eyebrow="Hồ sơ PT"
          title={ptOverview.pt.fullName}
          actions={<ActionLink href="/pts">Quay lại danh sách PT</ActionLink>}
        />

        <StatsGrid
          items={[
            { label: "Hội viên đang hoạt động", value: `${ptOverview.activeMembers}`, note: "Phân công hội viên đang mở." },
            { label: "Công quy đổi", value: `${ptOverview.validShiftCredits}`, note: "Công VALID/HALF trong kỳ." },
            { label: "Tăng ca", value: formatHours(ptOverview.overtimeHours), note: "Tổng giờ tăng ca." },
            { label: "Lương kỳ gần nhất", value: formatCurrency(ptOverview.estimatedPayroll), note: "Thực lĩnh kỳ gần nhất." },
          ]}
        />

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <SectionCard title="Tóm tắt hồ sơ">
            <KeyValueList
              items={[
                { label: "Thư điện tử", value: ptOverview.pt.email },
                { label: "Số điện thoại", value: ptOverview.pt.phone },
                { label: "Địa chỉ", value: ptOverview.pt.address },
                { label: "Kinh nghiệm", value: `${ptOverview.pt.experienceYears} năm` },
                {
                  label: "Trạng thái",
                  value: <Badge tone={getStatusTone(ptOverview.pt.status)}>{ptOverview.pt.status}</Badge>,
                },
                { label: "Lương do Admin quản lý", value: formatCurrency(ptOverview.estimatedPayroll) },
              ]}
            />
          </SectionCard>

          <SectionCard title="Hội viên được phân công">
            <DataTable
              headers={["Hội viên", "Trạng thái", "Ngày tham gia", "Chi tiết"]}
              rows={assignedMembers.map((member) => [
                member.fullName,
                <Badge key={member.id} tone={getStatusTone(member.status)}>{member.status}</Badge>,
                formatDate(member.registeredAt),
                <ActionLink key={`${member.id}-detail`} href={`/members/${member.id}`}>Mở hội viên</ActionLink>,
              ])}
            />
          </SectionCard>
        </div>

        <SectionCard title="Dòng thời gian chấm công">
          <DataTable
            headers={["Ngày", "Vào ca", "Ra ca", "Giờ làm", "Tăng ca", "Trạng thái"]}
            rows={attendanceLogs.map((attendanceLog) => [
              attendanceLog.attendanceDate,
              formatDateTime(attendanceLog.checkInAt),
              attendanceLog.checkOutAt ? formatDateTime(attendanceLog.checkOutAt) : "Đang mở",
              formatHours(attendanceLog.workedHours),
              formatHours(attendanceLog.overtimeHours),
              <Badge key={attendanceLog.id} tone={getStatusTone(attendanceLog.status)}>{attendanceLog.status}</Badge>,
            ])}
          />
        </SectionCard>

        <SectionCard title="Lịch sử lương">
          <DataTable
            headers={["Kỳ", "Công quy đổi", "Tăng ca", "Hoa hồng gói", "Thực lĩnh", "Trạng thái"]}
            rows={payrollEntries.map((entry) => [
              snapshot.dataset.payrollPeriods.find((period) => period.id === entry.payrollPeriodId)?.code ?? entry.payrollPeriodId,
              `${entry.validShiftCredits}`,
              formatHours(entry.overtimeHours),
              formatCurrency(entry.packageCommission),
              formatCurrency(entry.netPay),
              <Badge key={entry.id} tone={getStatusTone(entry.status)}>{humanizeStatus(entry.status)}</Badge>,
            ])}
          />
        </SectionCard>

        {canManageGym(options) ? (
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <SectionCard title="Cập nhật PT">
              <form action={updatePersonalTrainerAction} className="space-y-4">
                <input type="hidden" name="locale" value={getLocale(options)} />
                <input type="hidden" name="ptId" value={ptId} />
                <FormGrid>
                  <FormField label="Mã PT" name="code" defaultValue={ptOverview.pt.code} required />
                  <FormField label="Họ và tên" name="fullName" defaultValue={ptOverview.pt.fullName} required />
                  <FormSelect
                    label="Giới tính"
                    name="gender"
                    required
                    defaultValue={ptOverview.pt.gender}
                    options={[
                      { value: "MALE", label: "Nam" },
                      { value: "FEMALE", label: "Nữ" },
                      { value: "OTHER", label: "Khác" },
                    ]}
                  />
                  <FormField label="Ngày sinh" name="birthDate" type="date" defaultValue={toDateInputValue(ptOverview.pt.birthDate)} required />
                  <FormField label="Số điện thoại" name="phone" defaultValue={ptOverview.pt.phone} required />
                  <FormField label="Thư điện tử" name="email" type="email" defaultValue={ptOverview.pt.email} required />
                  <FormField label="Địa chỉ" name="address" defaultValue={ptOverview.pt.address} required />
                  <FormSelect
                    label="Trạng thái"
                    name="status"
                    required
                    defaultValue={ptOverview.pt.status}
                    options={[
                      { value: "ACTIVE", label: "Đang hoạt động" },
                      { value: "INACTIVE", label: "Ngưng hoạt động" },
                    ]}
                  />
                  <FormField label="Chuyên môn" name="specialties" defaultValue={ptOverview.pt.specialties.join("\n")} required />
                  <FormField label="Kinh nghiệm" name="experienceYears" type="number" min={0} defaultValue={ptOverview.pt.experienceYears} required />
                  <FormField label="Avatar URL" name="avatarUrl" defaultValue={ptOverview.pt.avatarUrl} />
                  <FormField label="Ngày bắt đầu" name="startDate" type="date" defaultValue={toDateInputValue(ptOverview.pt.startDate)} required />
                  <FormField label="Mã người dùng" name="userId" defaultValue={ptOverview.pt.userId} />
                </FormGrid>
                <SubmitButton label="Lưu PT" />
              </form>
            </SectionCard>

            <SectionCard title="Xóa PT">
              <form action={deletePersonalTrainerAction} className="space-y-4">
                <input type="hidden" name="locale" value={getLocale(options)} />
                <input type="hidden" name="ptId" value={ptId} />
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  Xóa PT sẽ loại bỏ hồ sơ khỏi danh sách quản trị.
                </p>
                <button type="submit" className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700">
                  Xóa PT
                </button>
              </form>
            </SectionCard>
          </div>
        ) : null}
      </>
    );
  }

  label: "Lợi nhuận ròng",
    value: formatCurrency(snapshot.profitReport.netProfit),
              },
            ]}
          />
        </SectionCard >

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
      </div >

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

function buildPtsPage(): JSX.Element {
  const snapshot = getGymSnapshot();

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
            note: "Tổng số hội viên đang có PT phụ trách.",
          },
          {
            label: "Công quy đổi",
        { canManageGym(undefined) ? null : null}

        {true ? (
          <SectionCard title="Tạo PT mới">
            <form action={createPersonalTrainerAction} className="space-y-4">
              <input type="hidden" name="locale" value={getLocale()} />
              <FormGrid>
                <FormField label="Mã PT" name="code" placeholder="PT004" required />
                <FormField label="Họ và tên" name="fullName" placeholder="Nguyễn Văn A" required />
                <FormSelect
                  label="Giới tính"
                  name="gender"
                  required
                  defaultValue="MALE"
                  options={[
                    { value: "MALE", label: "Nam" },
                    { value: "FEMALE", label: "Nữ" },
                    { value: "OTHER", label: "Khác" },
                  ]}
                />
                <FormField label="Ngày sinh" name="birthDate" type="date" required />
                <FormField label="Số điện thoại" name="phone" required />
                <FormField label="Thư điện tử" name="email" type="email" required />
                <FormField label="Địa chỉ" name="address" required />
                <FormSelect
                  label="Trạng thái"
                  name="status"
                  required
                  defaultValue="ACTIVE"
                  options={[
                    { value: "ACTIVE", label: "Đang hoạt động" },
                    { value: "INACTIVE", label: "Ngưng hoạt động" },
                  ]}
                />
                <FormField label="Chuyên môn" name="specialties" placeholder="Yoga\nHIIT" required />
                <FormField label="Kinh nghiệm" name="experienceYears" type="number" min={0} defaultValue={0} required />
                <FormField label="Avatar URL" name="avatarUrl" placeholder="https://..." />
                <FormField label="Ngày bắt đầu" name="startDate" type="date" required />
                <FormField label="Mã người dùng" name="userId" placeholder="user-uuid" />
              </FormGrid>
              <SubmitButton label="Tạo PT" />
            </form>
          </SectionCard>
        ) : null}

        <SectionCard title="Danh sách PT">
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

        <SectionCard
          title="Danh sách PT"
        >
          <DataTable
            headers={[
              "PT",
              "Chuyên môn",
              "Hội viên đang hoạt động",
              "Công quy đổi",
              "Tăng ca",
              "Thực lĩnh",
              "Chi tiết",
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
                <ActionLink href={`/pts/${item.pt.id}`}>Hồ sơ</ActionLink>
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
          eyebrow="Hồ sơ PT"
          title={ptOverview.pt.fullName}
          actions={
            <ActionLink href="/pts">Quay lại danh sách PT</ActionLink>
          }
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
                { label: "Thư điện tử", value: ptOverview.pt.email },
                { label: "Số điện thoại", value: ptOverview.pt.phone },
                { label: "Địa chỉ", value: ptOverview.pt.address },
                {
                  label: "Kinh nghiệm",
                  value: `${ptOverview.pt.experienceYears} năm`,
                },
                {
                  label: "Trạng thái",
                  value: (
                    <Badge tone={getStatusTone(ptOverview.pt.status)}>
                      {ptOverview.pt.status}
                    </Badge>
                  ),
                },
                { label: "Lương do Admin quản lý", value: formatCurrency(ptOverview.estimatedPayroll) },
              ]}
            />
          </SectionCard>

          <SectionCard title="Hội viên được phân công">
            <DataTable
              headers={["Hội viên", "Trạng thái", "Ngày tham gia", "Chi tiết"]}
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
                  Mở hội viên
                </ActionLink>,
              ])}
            />
          </SectionCard>
        </div>

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

                {canManageGym(undefined) ? null : null}

                {true ? (
                  <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                    <SectionCard title="Cập nhật PT">
                      <form action={updatePersonalTrainerAction} className="space-y-4">
                        <input type="hidden" name="locale" value={getLocale()} />
                        <input type="hidden" name="ptId" value={ptId} />
                        <FormGrid>
                          <FormField label="Mã PT" name="code" defaultValue={ptOverview.pt.code} required />
                          <FormField label="Họ và tên" name="fullName" defaultValue={ptOverview.pt.fullName} required />
                          <FormSelect
                            label="Giới tính"
                            name="gender"
                            required
                            defaultValue={ptOverview.pt.gender}
                            options={[
                              { value: "MALE", label: "Nam" },
                              { value: "FEMALE", label: "Nữ" },
                              { value: "OTHER", label: "Khác" },
                            ]}
                          />
                          <FormField label="Ngày sinh" name="birthDate" type="date" defaultValue={toDateInputValue(ptOverview.pt.birthDate)} required />
                          <FormField label="Số điện thoại" name="phone" defaultValue={ptOverview.pt.phone} required />
                          <FormField label="Thư điện tử" name="email" type="email" defaultValue={ptOverview.pt.email} required />
                          <FormField label="Địa chỉ" name="address" defaultValue={ptOverview.pt.address} required />
                          <FormSelect
                            label="Trạng thái"
                            name="status"
                            required
                            defaultValue={ptOverview.pt.status}
                            options={[
                              { value: "ACTIVE", label: "Đang hoạt động" },
                              { value: "INACTIVE", label: "Ngưng hoạt động" },
                            ]}
                          />
                          <FormField label="Chuyên môn" name="specialties" defaultValue={ptOverview.pt.specialties.join("\n")} required />
                          <FormField label="Kinh nghiệm" name="experienceYears" type="number" min={0} defaultValue={ptOverview.pt.experienceYears} required />
                          <FormField label="Avatar URL" name="avatarUrl" defaultValue={ptOverview.pt.avatarUrl} />
                          <FormField label="Ngày bắt đầu" name="startDate" type="date" defaultValue={toDateInputValue(ptOverview.pt.startDate)} required />
                          <FormField label="Mã người dùng" name="userId" defaultValue={ptOverview.pt.userId} />
                        </FormGrid>
                        <SubmitButton label="Lưu PT" />
                      </form>
                    </SectionCard>

                    <SectionCard title="Xóa PT">
                      <form action={deletePersonalTrainerAction} className="space-y-4">
                        <input type="hidden" name="locale" value={getLocale()} />
                        <input type="hidden" name="ptId" value={ptId} />
                        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                          Xóa PT sẽ loại bỏ hồ sơ khỏi danh sách quản trị.
                        </p>
                        <button type="submit" className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700">
                          Xóa PT
                        </button>
                      </form>
                    </SectionCard>
                  </div>
                ) : null}
                {humanizeStatus(entry.status)}
              </Badge>,
            ])}
          />
        </SectionCard>
      </>
      );
}
      notFound();
      return <></>;
      <SubmitButton label="Tạo hợp đồng kế tiếp" />
    </form >
          </SectionCard >
        </div >
      ) : null
}
    </>
  );
}

function buildAttendancePage(options?: RenderGymRouteOptions): JSX.Element {
  const snapshot = getGymSnapshot();
  const locale = getLocale(options);
  const { attendanceLogs } = snapshot.dataset;
  const trainerOptions = snapshot.dataset.personalTrainers.map((trainer) => ({
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

            <form action={checkOutAttendanceAction} className="space-y-4 rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4">
              <input type="hidden" name="locale" value={locale} />
              <FormSelect
                label="PT"
                name="ptId"
                required
                options={trainerOptions}
              />
              <SubmitButton label="Chấm công ra" />
            </form>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Hệ thống tự lấy thời điểm hiện tại khi bấm nút. Chấm công ra chỉ hợp lệ sau tối thiểu 5 giờ từ lúc vào ca.
          </p>
        </SectionCard>
      ) : null}
    </>
  );
}

function buildPtSelfAttendancePage(
  options?: RenderGymRouteOptions,
): JSX.Element {
  const attendanceLogs = options?.ptAttendance ?? [];
  const openShift = attendanceLogs.find((attendanceLog) => !attendanceLog.checkOutAt);

  return (
    <>
      <PageHeader
        eyebrow="Chấm công PT"
        title="Chấm công của tôi"
        actions={<ActionLink href="/payroll">Mở bảng lương</ActionLink>}
      />

      <StatsGrid
        items={[
          {
            label: "Ca đang mở",
            value: openShift ? "1 ca" : "Không có ca đang mở",
            note: openShift
              ? `Bắt đầu lúc ${formatDateTime(openShift.checkInAt)}`
              : "Bạn có thể bắt đầu ca mới ngay tại đây.",
          },
          {
            label: "Ca đã hoàn tất",
            value: `${attendanceLogs.filter((attendanceLog) => attendanceLog.checkOutAt).length}`,
            note: "Tổng số ca đã đóng trong lịch sử phiên này.",
          },
          {
            label: "Giờ tính lương",
            value: formatHours(
              attendanceLogs.reduce(
                (total, attendanceLog) => total + (attendanceLog.paidHours ?? attendanceLog.workedHours),
                0,
              ),
            ),
            note: "Tổng giờ được tính lương sau khi áp quy tắc valid/half.",
          },
          {
            label: "Tăng ca",
            value: formatHours(
              attendanceLogs.reduce(
                (total, attendanceLog) => total + attendanceLog.overtimeHours,
                0,
              ),
            ),
            note: "Tổng giờ tăng ca đã được ghi nhận.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionCard
          title="Theo dõi ngày công"
        >
          <p className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-700">
            PT chỉ có quyền theo dõi ngày công và lương. Việc chấm công được thực hiện bởi quản lý/staff tại màn PT Attendance.
          </p>
        </SectionCard>

        <SectionCard title="Nhật ký chấm công của tôi">
          <DataTable
            headers={[
              "Ngày",
              "Vào ca",
              "Ra ca",
              "Giờ tính lương",
              "Tăng ca",
              "Trạng thái",
            ]}
            rows={attendanceLogs.map((attendanceLog) => [
              attendanceLog.attendanceDate,
              formatDateTime(attendanceLog.checkInAt),
              attendanceLog.checkOutAt
                ? formatDateTime(attendanceLog.checkOutAt)
                : "Đang mở",
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
          </SectionCard>

          <SectionCard
            title="Tạo bảng lương"
          >
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
        eyebrow="Lương PT"
        title="Lương của tôi"
        actions={<ActionLink href="/pts/attendance">Mở chấm công</ActionLink>}
      />

      <StatsGrid
        items={[
          {
            label: "Bản ghi",
            value: `${payrollEntries.length}`,
            note: "Tổng số dòng bảng lương đã được tạo cho PT này.",
          },
          {
            label: "Đã duyệt hoặc đã chi",
            value: formatCurrency(
              payrollEntries
                .filter((entry) => entry.status === "APPROVED" || entry.status === "PAID")
                .reduce((total, entry) => total + entry.netPay, 0),
            ),
            note: "Số tiền đã được duyệt hoặc đã thanh toán.",
          },
          {
            label: "Đang chờ",
            value: formatCurrency(
              payrollEntries
                .filter((entry) => entry.status === "PENDING_APPROVAL")
                .reduce((total, entry) => total + entry.netPay, 0),
            ),
            note: "Thực nhận đang chờ duyệt hoặc tạo lại.",
          },
          {
            label: "Giờ tính lương",
            value: formatHours(
              payrollEntries.reduce(
                (total, entry) => total + (entry.paidHours ?? 0),
                0,
              ),
            ),
            note: "Tổng giờ đã đưa vào bảng lương.",
          },
        ]}
      />

      <SectionCard title="Bản ghi lương của tôi">
        <DataTable
          headers={[
            "Mã kỳ",
            "Giờ tính lương",
            "Lương cơ bản",
            "Hoa hồng gói",
            "Hoa hồng bán hàng",
            "Thực lĩnh",
            "Trạng thái",
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

      {canManageGym(options) ? (
        <SectionCard title="Tạo hội viên mới">
          <form action={createMemberAction} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <FormGrid>
              <FormField label="Mã hội viên" name="code" placeholder="MBR004" required />
              <FormField label="Họ và tên" name="fullName" required />
              <FormSelect
                label="Giới tính"
                name="gender"
                required
                defaultValue="MALE"
                options={[
                  { value: "MALE", label: "Nam" },
                  { value: "FEMALE", label: "Nữ" },
                  { value: "OTHER", label: "Khác" },
                ]}
              />
              <FormField label="Ngày sinh" name="birthDate" type="date" required />
              <FormField label="Số điện thoại" name="phone" required />
              <FormField label="Thư điện tử" name="email" type="email" required />
              <FormField label="Địa chỉ" name="address" required />
              <FormField label="Chiều cao (cm)" name="heightCm" type="number" min={0} defaultValue={165} required />
              <FormField label="Cân nặng (kg)" name="weightKg" type="number" min={0} defaultValue={60} required />
              <FormField label="Mục tiêu" name="goal" required />
              <FormField label="Ghi chú sức khỏe" name="healthNotes" required />
              <FormField label="Ngày đăng ký" name="registeredAt" type="date" required />
              <FormSelect
                label="Trạng thái"
                name="status"
                defaultValue="ACTIVE"
                required
                options={[
                  { value: "ACTIVE", label: "Đang hoạt động" },
                  { value: "INACTIVE", label: "Ngưng hoạt động" },
                ]}
              />
            </FormGrid>
            <SubmitButton label="Tạo hội viên" />
          </form>
        </SectionCard>
      ) : null}

      <SectionCard title="Danh sách hội viên">
        <DataTable
          headers={[
            "Hội viên",
            "Gói hiện tại",
            "PT phụ trách",
            "Chi cho gói tập",
            "Chi cho dịch vụ",
            "Chi tiết",
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
              overview?.membershipPlan?.name ?? "Chưa có gói hoạt động",
              overview?.trainer?.fullName ?? "Chưa gán",
              formatCurrency(overview?.totalMembershipSpend ?? 0),
              formatCurrency(overview?.totalServiceSpend ?? 0),
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
        eyebrow="Chi tiết hội viên"
        title={member.fullName}
        actions={<ActionLink href="/members">Quay lại danh sách hội viên</ActionLink>}
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Tóm tắt hồ sơ">
          <KeyValueList
            items={[
              { label: "Số điện thoại", value: member.phone },
              { label: "Thư điện tử", value: member.email },
              { label: "Địa chỉ", value: member.address },
              {
                label: "Chỉ số cơ thể",
                value: `${member.heightCm} cm | ${member.weightKg} kg`,
              },
              { label: "Ghi chú sức khỏe", value: member.healthNotes },
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

      {canManageGym(options) ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <SectionCard title="Cập nhật hội viên">
            <form action={updateMemberAction} className="space-y-4">
              <input type="hidden" name="locale" value={getLocale(options)} />
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
                <FormField label="Thư điện tử" name="email" type="email" defaultValue={member.email} required />
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
          </SectionCard>

          <SectionCard title="Xóa hội viên">
            <form action={deleteMemberAction} className="space-y-4">
              <input type="hidden" name="locale" value={getLocale(options)} />
              <input type="hidden" name="memberId" value={memberId} />
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                Xóa hội viên sẽ loại bỏ hồ sơ và toàn bộ quan hệ gắn với hồ sơ này.
              </p>
              <button type="submit" className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700">
                Xóa hội viên
              </button>
            </form>
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
function buildMembershipPlansPage(options?: RenderGymRouteOptions): JSX.Element {
  function buildMembershipOverviewPage(
    const locale = getLocale(options);
    options?: RenderGymRouteOptions,
  ): JSX.Element {
    const snapshot = getGymSnapshot();
    const locale = getLocale(options);
    const manageableMemberships = snapshot.dataset.memberMemberships.filter(
      (membership) => membership.status !== "CANCELLED",
    );
    {
      canManageGym(options) ? (
        <SectionCard title="Tạo gói tập mới">
          <form action={createMembershipPlanAction} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <FormGrid>
              <FormField label="Mã gói" name="code" placeholder="PLAN-3M" required />
              <FormField label="Tên gói" name="name" required />
              <FormField label="Loại" name="type" placeholder="MONTHLY" required />
              <FormField label="Giá" name="price" type="number" step="1000" min={0} required />
              <FormField label="Số ngày" name="durationDays" type="number" min={1} defaultValue={30} required />
              <FormField label="Giới hạn lượt" name="usageLimit" type="number" min={0} />
              <FormSelect
                label="Bao gồm PT"
                name="includesPt"
                defaultValue="false"
                required
                options={[
                  { value: "false", label: "Không" },
                  { value: "true", label: "Có" },
                ]}
              />
              <FormField label="Số buổi PT kèm theo" name="includedPtSessions" type="number" min={0} defaultValue={0} required />
              <FormField label="Quyền lợi" name="perks" placeholder="Tập gym\nTắm nóng lạnh" required />
              <FormSelect
                label="Trạng thái"
                name="status"
                defaultValue="ACTIVE"
                required
                options={[
                  { value: "ACTIVE", label: "Đang bán" },
                  { value: "INACTIVE", label: "Ngưng bán" },
                ]}
              />
            </FormGrid>
            <SubmitButton label="Tạo gói" />
          </form>
        </SectionCard>
      ) : null
    }
    const activeAssignments = snapshot.dataset.memberPtAssignments.filter(
      (assignment) => assignment.status === "ACTIVE",

  return (
      <>
        <PageHeader
          eyebrow="Vòng đời gói tập"
          title="Gói tập đã bán"
        />

        {canManageGym(options) ? (
          <>
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <SectionCard
                title="Bán gói tập mới"
              >
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
              </SectionCard>

              <SectionCard
                title="Gia hạn gói tập"
              >
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
              </SectionCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
              <SectionCard
                title="Hủy gói tập"
              >
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
              </SectionCard>

              <SectionCard
                title="Phân công PT"
              >
                <form action={createAssignmentAction} className="space-y-4">
                  <input type="hidden" name="locale" value={locale} />
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
                    <FormSelect
                      label="Loại hoa hồng"
                      name="commissionType"
                      defaultValue="PERCENTAGE"
                      options={[
                        { value: "PERCENTAGE", label: "Phần trăm" },
                        { value: "FIXED", label: "Cố định" },
                      ]}
                    />
                    <FormField
                      label="Giá trị hoa hồng"
                      name="commissionValue"
                      type="number"
                      defaultValue={10}
                      step="0.5"
                    />
                  </FormGrid>
                  <SubmitButton label="Tạo phân công" />
                </form>
              </SectionCard>

              <SectionCard
                title="Kết thúc phân công PT"
              >
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

          {canManageGym(options) ? (
            <SectionCard
              title="Tạo phân công"
            >
              <form action={createAssignmentAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
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
                  <FormSelect
                    label="Loại hoa hồng"
                    name="commissionType"
                    options={[
                      { value: "PERCENT", label: "Phần trăm" },
                      { value: "FIXED", label: "Số tiền cố định" },
                    ]}
                    defaultValue="PERCENT"
                  />
                  <FormField
                    label="Giá trị hoa hồng"
                    name="commissionValue"
                    type="number"
                    step="0.01"
                    required
                  />
                </FormGrid>
                <FormTextArea
                  label="Ghi chú"
                  name="note"
                  placeholder="Chi tiết cho phân công này"
                />
                <SubmitButton label="Tạo phân công" />
              </form>
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
        {canManageGym(options) ? (
          <SectionCard title="Tạo gói tập mới">
            <form action={createMembershipPlanAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <FormGrid>
                <FormField label="Mã gói" name="code" placeholder="PLAN-3M" required />
                <FormField label="Tên gói" name="name" required />
                <FormField label="Loại" name="type" placeholder="MONTHLY" required />
                <FormField label="Giá" name="price" type="number" step="1000" min={0} required />
                <FormField label="Số ngày" name="durationDays" type="number" min={1} defaultValue={30} required />
                <FormField label="Giới hạn lượt" name="usageLimit" type="number" min={0} />
                <FormSelect
                  label="Bao gồm PT"
                  name="includesPt"
                  defaultValue="false"
                  required
                  options={[
                    { value: "false", label: "Không" },
                    { value: "true", label: "Có" },
                  ]}
                />
                <FormField label="Số buổi PT kèm theo" name="includedPtSessions" type="number" min={0} defaultValue={0} required />
                <FormField label="Quyền lợi" name="perks" placeholder="Tập gym\nTắm nóng lạnh" required />
                <FormSelect
                  label="Trạng thái"
                  name="status"
                  defaultValue="ACTIVE"
                  required
                  options={[
                    { value: "ACTIVE", label: "Đang bán" },
                    { value: "INACTIVE", label: "Ngưng bán" },
                  ]}
                />
              </FormGrid>
              <SubmitButton label="Tạo gói" />
            </form>
          </SectionCard>
        ) : null}
        <SectionCard title="Danh mục gói tập">
          <DataTable
            headers={["Gói", "Loại", "Giá", "Kèm PT", "Quyền lợi", "Trạng thái", "Chi tiết"]}
            rows={snapshot.dataset.membershipPlans.map((plan) => [
              plan.name,
              plan.type,
              formatCurrency(plan.price),
              plan.includesPt ? `${plan.includedPtSessions} buổi` : "Không",
              plan.perks.join(", "),
              <Badge key={plan.id} tone={getStatusTone(plan.status)}>
                {humanizeStatus(plan.status)}
              </Badge>,
              <ActionLink key={`${plan.id}-detail`} href={`/membership-plans/${plan.id}`}>Mở gói</ActionLink>,
            ])}
          />
        </SectionCard>
      </>
    );
  }

  function buildMembershipPlanDetailPage(
    planId: string,
    options?: RenderGymRouteOptions,
  ): JSX.Element {
    const snapshot = getGymSnapshot();
    const plan = snapshot.dataset.membershipPlans.find((item) => item.id === planId);

    if (!plan) {
      notFound();
    }

    return (
      <>
        <PageHeader
          eyebrow="Chi tiết gói tập"
          title={plan.name}
          actions={<ActionLink href="/membership-plans">Quay lại danh sách gói</ActionLink>}
        />

        <SectionCard title="Tóm tắt gói tập">
          <KeyValueList
            items={[
              { label: "Mã gói", value: plan.code },
              { label: "Loại", value: plan.type },
              { label: "Giá", value: formatCurrency(plan.price) },
              { label: "Số ngày", value: `${plan.durationDays}` },
              { label: "Giới hạn lượt", value: plan.usageLimit === undefined ? "Không giới hạn" : `${plan.usageLimit}` },
              { label: "Bao gồm PT", value: plan.includesPt ? "Có" : "Không" },
              { label: "Số buổi PT", value: `${plan.includedPtSessions}` },
              { label: "Quyền lợi", value: plan.perks.join("\n") },
              { label: "Trạng thái", value: <Badge tone={getStatusTone(plan.status)}>{humanizeStatus(plan.status)}</Badge> },
            ]}
          />
        </SectionCard>

        {canManageGym(options) ? (
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <SectionCard title="Cập nhật gói tập">
              <form action={updateMembershipPlanAction} className="space-y-4">
                <input type="hidden" name="locale" value={getLocale(options)} />
                <input type="hidden" name="planId" value={planId} />
                <FormGrid>
                  <FormField label="Mã gói" name="code" defaultValue={plan.code} required />
                  <FormField label="Tên gói" name="name" defaultValue={plan.name} required />
                  <FormField label="Loại" name="type" defaultValue={plan.type} required />
                  <FormField label="Giá" name="price" type="number" step="1000" defaultValue={plan.price} required />
                  <FormField label="Số ngày" name="durationDays" type="number" min={1} defaultValue={plan.durationDays} required />
                  <FormField label="Giới hạn lượt" name="usageLimit" type="number" min={0} defaultValue={plan.usageLimit} />
                  <FormSelect
                    label="Bao gồm PT"
                    name="includesPt"
                    defaultValue={String(plan.includesPt)}
                    required
                    options={[
                      { value: "false", label: "Không" },
                      { value: "true", label: "Có" },
                    ]}
                  />
                  <FormField label="Số buổi PT kèm theo" name="includedPtSessions" type="number" min={0} defaultValue={plan.includedPtSessions} required />
                  <FormField label="Quyền lợi" name="perks" defaultValue={plan.perks.join("\n")} required />
                  <FormSelect
                    label="Trạng thái"
                    name="status"
                    defaultValue={plan.status}
                    required
                    options={[
                      { value: "ACTIVE", label: "Đang bán" },
                      { value: "INACTIVE", label: "Ngưng bán" },
                    ]}
                  />
                </FormGrid>
                <SubmitButton label="Lưu gói" />
              </form>
            </SectionCard>

            <SectionCard title="Xóa gói tập">
              <form action={deleteMembershipPlanAction} className="space-y-4">
                <input type="hidden" name="locale" value={getLocale(options)} />
                <input type="hidden" name="planId" value={planId} />
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  Xóa gói sẽ loại bỏ nó khỏi danh mục bán cho hội viên.
                </p>
                <button type="submit" className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700">
                  Xóa gói
                </button>
              </form>
            </SectionCard>
          </div>
        ) : null}
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
        {canManageGym(options) ? (
          <SectionCard title="Tạo sản phẩm mới">
            <form action={createProductAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <FormGrid>
                <FormField label="Mã sản phẩm" name="code" placeholder="PROD-001" required />
                <FormField label="Tên sản phẩm" name="name" required />
                <FormField label="Danh mục" name="category" required />
                <FormField label="Đơn giá vốn" name="unitCost" type="number" step="1000" min={0} required />
                <FormField label="Giá bán" name="salePrice" type="number" step="1000" min={0} required />
                <FormField label="Tồn kho" name="stockOnHand" type="number" min={0} defaultValue={0} required />
                <FormField label="Ngưỡng tồn" name="minimumStockLevel" type="number" min={0} defaultValue={0} required />
                <FormSelect
                  label="Trạng thái"
                  name="status"
                  defaultValue="ACTIVE"
                  required
                  options={[
                    { value: "ACTIVE", label: "Đang bán" },
                    { value: "INACTIVE", label: "Ngưng bán" },
                  ]}
                />
              </FormGrid>
              <SubmitButton label="Tạo sản phẩm" />
            </form>
          </SectionCard>
        ) : null}
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

        <SectionCard title="Danh sách sản phẩm">
          <DataTable
            headers={[
              "Sản phẩm",
              "Danh mục",
              "Đơn giá vốn",
              "Giá bán",
              "Tồn kho",
              "Ngưỡng",
              "Chi tiết",
            ]}
            rows={sortProductsByStock(snapshot.dataset.products).map(
              (product) => [
                product.name,
                product.category,
                formatCurrency(product.unitCost),
                formatCurrency(product.salePrice),
                `${product.stockOnHand}`,
                `${product.minimumStockLevel}`,
                <ActionLink key={`${product.id}-detail`} href={`/products/${product.id}`}>Mở sản phẩm</ActionLink>,
              ],
            )}
          />
        </SectionCard>
      </>
    );
  }

  function buildProductDetailPage(
    productId: string,
    options?: RenderGymRouteOptions,
  ): JSX.Element {
    const snapshot = getGymSnapshot();
    const product = snapshot.dataset.products.find((item) => item.id === productId);

    if (!product) {
      notFound();
    }

    return (
      <>
        <PageHeader
          eyebrow="Chi tiết sản phẩm"
          title={product.name}
          actions={<ActionLink href="/products">Quay lại danh sách sản phẩm</ActionLink>}
        />

        <SectionCard title="Tóm tắt sản phẩm">
          <KeyValueList
            items={[
              { label: "Mã", value: product.code },
              { label: "Danh mục", value: product.category },
              { label: "Đơn giá vốn", value: formatCurrency(product.unitCost) },
              { label: "Giá bán", value: formatCurrency(product.salePrice) },
              { label: "Tồn kho", value: `${product.stockOnHand}` },
              { label: "Ngưỡng tồn", value: `${product.minimumStockLevel}` },
              { label: "Trạng thái", value: <Badge tone={getStatusTone(product.status)}>{humanizeStatus(product.status)}</Badge> },
            ]}
          />
        </SectionCard>

        {canManageGym(options) ? (
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <SectionCard title="Cập nhật sản phẩm">
              <form action={updateProductAction} className="space-y-4">
                <input type="hidden" name="locale" value={getLocale(options)} />
                <input type="hidden" name="productId" value={productId} />
                <FormGrid>
                  <FormField label="Mã sản phẩm" name="code" defaultValue={product.code} required />
                  <FormField label="Tên sản phẩm" name="name" defaultValue={product.name} required />
                  <FormField label="Danh mục" name="category" defaultValue={product.category} required />
                  <FormField label="Đơn giá vốn" name="unitCost" type="number" step="1000" defaultValue={product.unitCost} required />
                  <FormField label="Giá bán" name="salePrice" type="number" step="1000" defaultValue={product.salePrice} required />
                  <FormField label="Tồn kho" name="stockOnHand" type="number" min={0} defaultValue={product.stockOnHand} required />
                  <FormField label="Ngưỡng tồn" name="minimumStockLevel" type="number" min={0} defaultValue={product.minimumStockLevel} required />
                  <FormSelect
                    label="Trạng thái"
                    name="status"
                    defaultValue={product.status}
                    required
                    options={[
                      { value: "ACTIVE", label: "Đang bán" },
                      { value: "INACTIVE", label: "Ngưng bán" },
                    ]}
                  />
                </FormGrid>
                <SubmitButton label="Lưu sản phẩm" />
              </form>
            </SectionCard>

            <SectionCard title="Xóa sản phẩm">
              <form action={deleteProductAction} className="space-y-4">
                <input type="hidden" name="locale" value={getLocale(options)} />
                <input type="hidden" name="productId" value={productId} />
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  Xóa sản phẩm sẽ ẩn nó khỏi danh sách quản lý kho và bán hàng.
                </p>
                <button type="submit" className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700">
                  Xóa sản phẩm
                </button>
              </form>
            </SectionCard>
          </div>
        ) : null}
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

        {canManageGym(options) ? (
          <SectionCard
            title="Tạo phiếu nhập"
          >
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
            <form action={createSalesInvoiceAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <FormGrid>
                <FormSelect
                  label="Loại khách hàng"
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
                  label="Tên khách hàng"
                  name="customerName"
                  placeholder="Trần Văn A"
                  required
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
                <FormField
                  label="Số tiền giảm"
                  name="discountAmount"
                  type="number"
                  min={0}
                  step="1000"
                  defaultValue={0}
                />
              </FormGrid>
              <SubmitButton label="Tạo hóa đơn" />
            </form>
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

  function buildSettingsPage(): JSX.Element {
    const snapshot = getGymSnapshot();

    return (
      <>
        <PageHeader
          eyebrow="Cấu hình hệ thống"
          title="Cấu hình"
        />
        <SectionCard title="Cấu hình hệ thống">
          <DataTable
            headers={["Khóa", "Nhãn", "Giá trị", "Mô tả"]}
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
    const locale = getLocale(options);
    const hasInvalidCredentials =
      getSearchParam(options?.searchParams, "error") === "invalid";

    return (
      <>
        <PageHeader
          eyebrow="Đăng nhập an toàn"
          title="Đăng nhập"
        />

        <div className="mx-auto grid w-full max-w-2xl gap-6">
          <SectionCard
            title="Biểu mẫu đăng nhập"
          >
            {hasInvalidCredentials ? (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                Email hoặc mật khẩu không đúng. Vui lòng thử lại.
              </div>
            ) : null}

            <form action={loginAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <FormField
                label="Thư điện tử"
                name="email"
                type="email"
                required
              />
              <FormField
                label="Mật khẩu"
                name="password"
                type="password"
                required
              />
              <SubmitButton label="Đăng nhập" />
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
    const section = slug[0];
    const entityId = slug[1];
    const locale: UiLocale = getLocale(options) === "vi" ? "vi" : "en";
    let content: JSX.Element | undefined;

    setActiveUiLocale(locale);

    if (options?.currentUser?.role === "PT") {
      if (section === "pts" && entityId === "attendance") {
        content = buildPtSelfAttendancePage(options);
      }

      if (!content && section === "payroll" && slug.length === 1) {
        content = buildPtSelfPayrollPage(options);
      }
    }

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
      if (slug.length === 1) {
        content = buildMembershipPlansPage(options);
      }

      if (!content && slug.length === 2 && entityId) {
        content = buildMembershipPlanDetailPage(entityId, options);
      }
    }

    if (!content && section === "membership-invoices") {
      content = buildMembershipInvoicesPage();
    }

    if (!content && section === "products") {
      if (slug.length === 1) {
        content = buildProductsPage(options);
      }

      if (!content && slug.length === 2 && entityId) {
        content = buildProductDetailPage(entityId, options);
      }
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

    if (!content && section === "reports" && entityId === "profit") {
      content = buildProfitReportPage();
    }

    if (!content && section === "settings") {
      content = buildSettingsPage();
    }

    if (!content) {
      notFound();
    }

    return content;
  }

