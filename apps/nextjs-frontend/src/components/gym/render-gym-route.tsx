import process from "node:process";
import { type JSX } from "react";
import { notFound } from "next/navigation";
import {
  Badge,
  DataTable,
  KeyValueList,
  PageHeader,
  SectionCard,
  StatsGrid,
} from "./gym-ui.tsx";
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

function buildPtContractsPage(ptId: string): JSX.Element {
  const snapshot = getGymSnapshot();
  const trainer = snapshot.dataset.personalTrainers.find(
    (item) => item.id === ptId,
  );
  const contract = getContractForTrainer(snapshot, ptId);

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
              value: `${formatDate(contract.effectiveFrom)} - ${formatDate(contract.effectiveTo)}`,
            },
          ]}
        />
      </SectionCard>
    </>
  );
}

function buildAttendancePage(): JSX.Element {
  const snapshot = getGymSnapshot();

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
    </>
  );
}

function buildPayrollPage(): JSX.Element {
  const snapshot = getGymSnapshot();

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

function buildMembershipOverviewPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Membership lifecycle"
        title="Sold memberships"
        description="Nguon su that cho goi tap da ban, PT assignments va membership invoice confirmations."
      />

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

function buildInventoryPage(): JSX.Element {
  const snapshot = getGymSnapshot();

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

function buildInvoicesPage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Sales"
        title="Service invoices"
        description="Hoa don ban san pham dich vu cho member hoac khach le."
      />
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

function buildMaintenancePage(): JSX.Element {
  const snapshot = getGymSnapshot();

  return (
    <>
      <PageHeader
        eyebrow="Maintenance log"
        title="Maintenance history"
        description="Tat ca event bao tri, repair va recommendation replacement cho thiet bi."
      />
      <SectionCard title="Maintenance records">
        <DataTable
          headers={["Date", "Equipment", "Vendor", "Description", "Amount"]}
          rows={snapshot.dataset.maintenanceRecords.map((record) => [
            formatDate(record.maintenanceDate),
            getEquipmentName(snapshot, record.equipmentAssetId ?? undefined),
            record.vendorName,
            record.description,
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

function buildLoginPage(): JSX.Element {
  const snapshot = getGymSnapshot();
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

  return (
    <>
      <PageHeader
        eyebrow="Demo access"
        title="Login reference"
        description="Frontend hien doc snapshot tu backend bang demo account o phia server. UI van chua co session auth rieng cho tung nguoi dung."
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

      <SectionCard title="Demo accounts">
        <DataTable
          headers={["Role", "Name", "Email", "Password"]}
          rows={snapshot.dataset.users.map((user) => [
            user.role,
            user.fullName,
            user.email,
            user.passwordHint,
          ])}
        />
      </SectionCard>

      <SectionCard title="Quick test">
        <pre className="overflow-x-auto rounded-[1.25rem] bg-slate-950 p-4 text-sm leading-7 text-slate-100">
          {`POST ${backendUrl}/api/auth/login
{
  "email": "admin@gymmanager.local",
  "password": "demo123"
}`}
        </pre>
      </SectionCard>
    </>
  );
}

export function renderGymRoute(slug: string[]): JSX.Element {
  const section = slug[0];
  const entityId = slug[1];
  const nestedSection = slug[2];

  if (slug.length === 0 || section === "dashboard") {
    return buildDashboardPage();
  }

  if (section === "login") {
    return buildLoginPage();
  }

  if (section === "pts" && slug.length === 1) {
    return buildPtsPage();
  }

  if (section === "pts" && entityId === "attendance") {
    return buildAttendancePage();
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
    return buildPtContractsPage(entityId);
  }

  if (section === "payroll" && slug.length === 1) {
    return buildPayrollPage();
  }

  if (section === "payroll" && slug.length === 2 && entityId) {
    return buildPayrollPeriodPage(entityId);
  }

  if (section === "members" && slug.length === 1) {
    return buildMembersPage();
  }

  if (section === "members" && entityId === "memberships") {
    return buildMembershipOverviewPage();
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
    return buildInventoryPage();
  }

  if (section === "inventory" && entityId === "import") {
    return buildInventoryImportPage();
  }

  if (section === "invoices" && slug.length === 1) {
    return buildInvoicesPage();
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
    return buildMaintenancePage();
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
