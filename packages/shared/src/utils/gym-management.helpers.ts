import type {
  AttendanceLog,
  DashboardSummary,
  EquipmentAsset,
  ExpenseReport,
  GymManagementDataset,
  GymManagementSnapshot,
  InventoryOverview,
  InventoryTransaction,
  Member,
  MemberMembership,
  MemberOverviewItem,
  MemberPtAssignment,
  MembershipInvoice,
  MembershipPlan,
  OperatingExpense,
  PayrollEntry,
  PayrollPeriod,
  PayrollReport,
  PersonalTrainer,
  Product,
  ProfitReport,
  PtContract,
  PtOverviewItem,
  RevenueReport,
  SalesInvoice,
} from '../contracts/gym-management';

const dayInMilliseconds = 24 * 60 * 60 * 1000;

function sumValues(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function toTimeValue(value: string): number {
  return new Date(value).getTime();
}

function isSameUtcDay(dateValue: string, compareValue: string): boolean {
  return dateValue.slice(0, 10) === compareValue.slice(0, 10);
}

function isSameUtcMonth(dateValue: string, compareValue: string): boolean {
  return dateValue.slice(0, 7) === compareValue.slice(0, 7);
}

function isSameUtcYear(dateValue: string, compareValue: string): boolean {
  return dateValue.slice(0, 4) === compareValue.slice(0, 4);
}

function isExpenseCounted(expense: OperatingExpense): boolean {
  return expense.status === 'APPROVED' || expense.status === 'PAID';
}

function isConfirmedMembershipInvoice(invoice: MembershipInvoice): boolean {
  return invoice.status === 'CONFIRMED';
}

function isConfirmedSalesInvoice(invoice: SalesInvoice): boolean {
  return invoice.status === 'CONFIRMED';
}

export function cloneGymManagementDataset(dataset: GymManagementDataset): GymManagementDataset {
  return structuredClone(dataset);
}

export function findPersonalTrainerById(dataset: GymManagementDataset, ptId: string): PersonalTrainer | undefined {
  return dataset.personalTrainers.find((trainer) => trainer.id === ptId);
}

export function findPtContractByPtId(dataset: GymManagementDataset, ptId: string): PtContract | undefined {
  return dataset.ptContracts.find((contract) => contract.ptId === ptId);
}

export function findPayrollPeriodById(dataset: GymManagementDataset, payrollPeriodId: string): PayrollPeriod | undefined {
  return dataset.payrollPeriods.find((period) => period.id === payrollPeriodId);
}

export function findMemberById(dataset: GymManagementDataset, memberId: string): Member | undefined {
  return dataset.members.find((member) => member.id === memberId);
}

export function findMembershipPlanById(
  dataset: GymManagementDataset,
  membershipPlanId: string,
): MembershipPlan | undefined {
  return dataset.membershipPlans.find((plan) => plan.id === membershipPlanId);
}

export function findSalesInvoiceById(dataset: GymManagementDataset, salesInvoiceId: string): SalesInvoice | undefined {
  return dataset.salesInvoices.find((invoice) => invoice.id === salesInvoiceId);
}

export function findOperatingExpenseById(
  dataset: GymManagementDataset,
  expenseId: string,
): OperatingExpense | undefined {
  return dataset.operatingExpenses.find((expense) => expense.id === expenseId);
}

export function findEquipmentAssetById(
  dataset: GymManagementDataset,
  equipmentAssetId: string,
): EquipmentAsset | undefined {
  return dataset.equipmentAssets.find((asset) => asset.id === equipmentAssetId);
}

export function getActiveMembershipForMember(
  dataset: GymManagementDataset,
  memberId: string,
): MemberMembership | undefined {
  const activeMemberships = dataset.memberMemberships
    .filter((membership) => membership.memberId === memberId && membership.status === 'ACTIVE')
    .sort((firstMembership, secondMembership) => secondMembership.startDate.localeCompare(firstMembership.startDate));

  return activeMemberships[0];
}

export function getActiveAssignmentForMember(
  dataset: GymManagementDataset,
  memberId: string,
): MemberPtAssignment | undefined {
  const activeAssignments = dataset.memberPtAssignments
    .filter((assignment) => assignment.memberId === memberId && assignment.status === 'ACTIVE')
    .sort((firstAssignment, secondAssignment) => secondAssignment.assignedFrom.localeCompare(firstAssignment.assignedFrom));

  return activeAssignments[0];
}

function buildDashboardSummary(dataset: GymManagementDataset): DashboardSummary {
  const referenceDate = dataset.generatedAt;
  const confirmedMembershipInvoices = dataset.membershipInvoices.filter((invoice) => isConfirmedMembershipInvoice(invoice));
  const confirmedSalesInvoices = dataset.salesInvoices.filter((invoice) => isConfirmedSalesInvoice(invoice));
  const activeMemberships = dataset.memberMemberships.filter((membership) => membership.status === 'ACTIVE');
  const lowStockProducts = dataset.products.filter((product) => product.stockOnHand <= product.minimumStockLevel);
  const maintenanceAlerts = dataset.equipmentAssets.filter((equipmentAsset) => {
    if (equipmentAsset.condition !== 'GOOD') {
      return true;
    }

    if (!equipmentAsset.nextMaintenanceAt) {
      return false;
    }

    const daysUntilMaintenance = Math.floor(
      (toTimeValue(equipmentAsset.nextMaintenanceAt) - toTimeValue(referenceDate)) / dayInMilliseconds,
    );

    return daysUntilMaintenance <= 14;
  });

  const activeMembershipsByType = Object.fromEntries(
    (['DAY', 'MONTH', 'YEAR'] as const).map((membershipType) => [
      membershipType,
      activeMemberships.filter((membership) => {
        const plan = findMembershipPlanById(dataset, membership.membershipPlanId);
        return plan?.type === membershipType;
      }).length,
    ]),
  ) as DashboardSummary['activeMemberships'];

  return {
    totalMembers: dataset.members.length,
    totalPts: dataset.personalTrainers.length,
    activeMembers: dataset.members.filter((member) => member.status === 'ACTIVE').length,
    activeMemberships: activeMembershipsByType,
    revenue: {
      daily: sumValues(
        [
          ...confirmedMembershipInvoices
            .filter((invoice) => isSameUtcDay(invoice.invoiceDate, referenceDate))
            .map((invoice) => invoice.totalAmount),
          ...confirmedSalesInvoices
            .filter((invoice) => isSameUtcDay(invoice.invoiceDate, referenceDate))
            .map((invoice) => invoice.totalAmount),
        ],
      ),
      monthly: sumValues(
        [
          ...confirmedMembershipInvoices
            .filter((invoice) => isSameUtcMonth(invoice.invoiceDate, referenceDate))
            .map((invoice) => invoice.totalAmount),
          ...confirmedSalesInvoices
            .filter((invoice) => isSameUtcMonth(invoice.invoiceDate, referenceDate))
            .map((invoice) => invoice.totalAmount),
        ],
      ),
      yearly: sumValues(
        [
          ...confirmedMembershipInvoices
            .filter((invoice) => isSameUtcYear(invoice.invoiceDate, referenceDate))
            .map((invoice) => invoice.totalAmount),
          ...confirmedSalesInvoices
            .filter((invoice) => isSameUtcYear(invoice.invoiceDate, referenceDate))
            .map((invoice) => invoice.totalAmount),
        ],
      ),
      membership: sumValues(confirmedMembershipInvoices.map((invoice) => invoice.totalAmount)),
      services: sumValues(confirmedSalesInvoices.map((invoice) => invoice.totalAmount)),
    },
    totalPtPayroll: sumValues(
      dataset.payrollEntries
        .filter((entry) => entry.payrollPeriodId === dataset.payrollPeriods.at(-1)?.id)
        .map((entry) => entry.netPay),
    ),
    totalOperatingExpense: sumValues(
      dataset.operatingExpenses.filter((expense) => isExpenseCounted(expense)).map((expense) => expense.amount),
    ),
    lowStockProducts,
    maintenanceAlerts,
  };
}

function buildPtOverview(dataset: GymManagementDataset): PtOverviewItem[] {
  return dataset.personalTrainers.map((trainer) => {
    const relevantAssignments = dataset.memberPtAssignments.filter(
      (assignment) => assignment.ptId === trainer.id && assignment.status === 'ACTIVE',
    );
    const relevantAttendanceLogs = dataset.attendanceLogs.filter((attendanceLog) => attendanceLog.ptId === trainer.id);
    const latestPayroll = [...dataset.payrollEntries]
      .filter((payrollEntry) => payrollEntry.ptId === trainer.id)
      .sort((firstEntry, secondEntry) => secondEntry.payrollPeriodId.localeCompare(firstEntry.payrollPeriodId))[0];

    return {
      pt: trainer,
      contract: findPtContractByPtId(dataset, trainer.id),
      activeMembers: relevantAssignments.length,
      validShiftCredits: sumValues(relevantAttendanceLogs.map((attendanceLog) => attendanceLog.workCredit)),
      overtimeHours: sumValues(relevantAttendanceLogs.map((attendanceLog) => attendanceLog.overtimeHours)),
      estimatedPayroll: latestPayroll?.netPay ?? 0,
    };
  });
}

function buildMemberOverview(dataset: GymManagementDataset): MemberOverviewItem[] {
  return dataset.members.map((member) => {
    const activeMembership = getActiveMembershipForMember(dataset, member.id);
    const activeAssignment = getActiveAssignmentForMember(dataset, member.id);

    return {
      member,
      activeMembership,
      membershipPlan: activeMembership
        ? findMembershipPlanById(dataset, activeMembership.membershipPlanId)
        : undefined,
      activeAssignment,
      trainer: activeAssignment ? findPersonalTrainerById(dataset, activeAssignment.ptId) : undefined,
      totalMembershipSpend: sumValues(
        dataset.membershipInvoices
          .filter((invoice) => invoice.memberId === member.id && isConfirmedMembershipInvoice(invoice))
          .map((invoice) => invoice.totalAmount),
      ),
      totalServiceSpend: sumValues(
        dataset.salesInvoices
          .filter((invoice) => invoice.memberId === member.id && isConfirmedSalesInvoice(invoice))
          .map((invoice) => invoice.totalAmount),
      ),
    };
  });
}

function buildInventoryOverview(dataset: GymManagementDataset): InventoryOverview {
  const soldQuantityByProductId = new Map<string, number>();

  for (const transaction of dataset.inventoryTransactions) {
    if (transaction.type !== 'SALE') {
      continue;
    }

    const currentQuantity = soldQuantityByProductId.get(transaction.productId) ?? 0;
    soldQuantityByProductId.set(transaction.productId, currentQuantity + transaction.quantity);
  }

  const topSellingProducts = [...soldQuantityByProductId.entries()]
    .map(([productId, soldQuantity]) => ({
      product: dataset.products.find((product) => product.id === productId),
      soldQuantity,
    }))
    .filter((entry): entry is { product: Product; soldQuantity: number } => entry.product !== undefined)
    .sort((firstEntry, secondEntry) => secondEntry.soldQuantity - firstEntry.soldQuantity)
    .slice(0, 3);

  const recentTransactions = [...dataset.inventoryTransactions]
    .sort((firstTransaction, secondTransaction) =>
      secondTransaction.transactionDate.localeCompare(firstTransaction.transactionDate),
    )
    .slice(0, 6);

  return {
    totalProducts: dataset.products.length,
    lowStockCount: dataset.products.filter((product) => product.stockOnHand <= product.minimumStockLevel).length,
    stockValue: sumValues(dataset.products.map((product) => product.stockOnHand * product.unitCost)),
    topSellingProducts,
    recentTransactions,
  };
}

function buildRevenueReport(dataset: GymManagementDataset): RevenueReport {
  const confirmedMembershipInvoices = dataset.membershipInvoices.filter((invoice) => isConfirmedMembershipInvoice(invoice));
  const confirmedSalesInvoices = dataset.salesInvoices.filter((invoice) => isConfirmedSalesInvoice(invoice));

  return {
    totalRevenue: sumValues([
      ...confirmedMembershipInvoices.map((invoice) => invoice.totalAmount),
      ...confirmedSalesInvoices.map((invoice) => invoice.totalAmount),
    ]),
    membershipRevenue: sumValues(confirmedMembershipInvoices.map((invoice) => invoice.totalAmount)),
    servicesRevenue: sumValues(confirmedSalesInvoices.map((invoice) => invoice.totalAmount)),
    membershipInvoiceCount: confirmedMembershipInvoices.length,
    salesInvoiceCount: confirmedSalesInvoices.length,
  };
}

function buildExpenseReport(dataset: GymManagementDataset): ExpenseReport {
  const byCategory = Object.fromEntries(
    (['CLEANING', 'MAINTENANCE', 'REPAIR', 'REPLACEMENT', 'UTILITY'] as const).map((category) => [category, 0]),
  ) as ExpenseReport['byCategory'];

  for (const expense of dataset.operatingExpenses.filter((item) => isExpenseCounted(item))) {
    byCategory[expense.category] += expense.amount;
  }

  return {
    totalExpense: sumValues(dataset.operatingExpenses.filter((expense) => isExpenseCounted(expense)).map((expense) => expense.amount)),
    pendingApprovalCount: dataset.operatingExpenses.filter((expense) => expense.status === 'PENDING_APPROVAL').length,
    paidCount: dataset.operatingExpenses.filter((expense) => expense.status === 'PAID').length,
    byCategory,
  };
}

function buildPayrollReport(dataset: GymManagementDataset): PayrollReport {
  return {
    totalPayroll: sumValues(dataset.payrollEntries.map((entry) => entry.netPay)),
    approvedPayroll: sumValues(
      dataset.payrollEntries
        .filter((entry) => entry.status === 'APPROVED' || entry.status === 'PAID')
        .map((entry) => entry.netPay),
    ),
    pendingPayroll: sumValues(
      dataset.payrollEntries.filter((entry) => entry.status === 'PENDING_APPROVAL').map((entry) => entry.netPay),
    ),
    byTrainer: dataset.payrollEntries.map((entry) => {
      const trainer = findPersonalTrainerById(dataset, entry.ptId);
      const payrollPeriod = findPayrollPeriodById(dataset, entry.payrollPeriodId);

      return {
        ptId: entry.ptId,
        ptName: trainer?.fullName ?? 'Unknown trainer',
        payrollPeriodId: entry.payrollPeriodId,
        payrollPeriodCode: payrollPeriod?.code ?? 'Unknown period',
        netPay: entry.netPay,
        status: entry.status,
      };
    }),
  };
}

function calculateCogsFromSalesInvoices(salesInvoices: SalesInvoice[]): number {
  return sumValues(
    salesInvoices.flatMap((salesInvoice) => salesInvoice.items.map((item) => item.unitCost * item.quantity)),
  );
}

function buildProfitReport(dataset: GymManagementDataset): ProfitReport {
  const confirmedSalesInvoices = dataset.salesInvoices.filter((invoice) => isConfirmedSalesInvoice(invoice));
  const revenueReport = buildRevenueReport(dataset);
  const expenseReport = buildExpenseReport(dataset);
  const latestPayrollPeriodId = dataset.payrollPeriods.at(-1)?.id;
  const currentPayrollEntries = dataset.payrollEntries.filter((entry) => entry.payrollPeriodId === latestPayrollPeriodId);
  const ptPayroll = sumValues(currentPayrollEntries.map((entry) => entry.netPay));
  const cogs = calculateCogsFromSalesInvoices(confirmedSalesInvoices);

  return {
    totalRevenue: revenueReport.totalRevenue,
    cogs,
    ptPayroll,
    operatingExpense: expenseReport.totalExpense,
    netProfit: revenueReport.totalRevenue - cogs - ptPayroll - expenseReport.totalExpense,
  };
}

export function getAttendanceByPtId(dataset: GymManagementDataset, ptId: string): AttendanceLog[] {
  return dataset.attendanceLogs.filter((attendanceLog) => attendanceLog.ptId === ptId);
}

export function getPayrollEntriesByPeriodId(dataset: GymManagementDataset, payrollPeriodId: string): PayrollEntry[] {
  return dataset.payrollEntries.filter((entry) => entry.payrollPeriodId === payrollPeriodId);
}

export function getMemberAssignmentsByMemberId(
  dataset: GymManagementDataset,
  memberId: string,
): MemberPtAssignment[] {
  return dataset.memberPtAssignments.filter((assignment) => assignment.memberId === memberId);
}

export function getSalesInvoicesByMemberId(dataset: GymManagementDataset, memberId: string): SalesInvoice[] {
  return dataset.salesInvoices.filter((invoice) => invoice.memberId === memberId);
}

export function getMembershipInvoicesByMemberId(dataset: GymManagementDataset, memberId: string): MembershipInvoice[] {
  return dataset.membershipInvoices.filter((invoice) => invoice.memberId === memberId);
}

export function getInventoryTransactionsByProductId(
  dataset: GymManagementDataset,
  productId: string,
): InventoryTransaction[] {
  return dataset.inventoryTransactions.filter((transaction) => transaction.productId === productId);
}

export function createGymManagementSnapshot(dataset: GymManagementDataset): GymManagementSnapshot {
  const clonedDataset = cloneGymManagementDataset(dataset);

  return {
    dataset: clonedDataset,
    dashboard: buildDashboardSummary(clonedDataset),
    ptOverview: buildPtOverview(clonedDataset),
    memberOverview: buildMemberOverview(clonedDataset),
    inventoryOverview: buildInventoryOverview(clonedDataset),
    revenueReport: buildRevenueReport(clonedDataset),
    expenseReport: buildExpenseReport(clonedDataset),
    payrollReport: buildPayrollReport(clonedDataset),
    profitReport: buildProfitReport(clonedDataset),
  };
}
