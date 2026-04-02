"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneGymManagementDataset = cloneGymManagementDataset;
exports.findPersonalTrainerById = findPersonalTrainerById;
exports.findPtContractByPtId = findPtContractByPtId;
exports.findPayrollPeriodById = findPayrollPeriodById;
exports.findMemberById = findMemberById;
exports.findMembershipPlanById = findMembershipPlanById;
exports.findSalesInvoiceById = findSalesInvoiceById;
exports.findOperatingExpenseById = findOperatingExpenseById;
exports.findEquipmentAssetById = findEquipmentAssetById;
exports.getActiveMembershipForMember = getActiveMembershipForMember;
exports.getActiveAssignmentForMember = getActiveAssignmentForMember;
exports.getAttendanceByPtId = getAttendanceByPtId;
exports.getPayrollEntriesByPeriodId = getPayrollEntriesByPeriodId;
exports.getMemberAssignmentsByMemberId = getMemberAssignmentsByMemberId;
exports.getSalesInvoicesByMemberId = getSalesInvoicesByMemberId;
exports.getMembershipInvoicesByMemberId = getMembershipInvoicesByMemberId;
exports.getInventoryTransactionsByProductId = getInventoryTransactionsByProductId;
exports.createGymManagementSnapshot = createGymManagementSnapshot;
function sumValues(values) {
    return values.reduce((total, value) => total + value, 0);
}
function isSameUtcDay(dateValue, compareValue) {
    return dateValue.slice(0, 10) === compareValue.slice(0, 10);
}
function isSameUtcMonth(dateValue, compareValue) {
    return dateValue.slice(0, 7) === compareValue.slice(0, 7);
}
function isSameUtcYear(dateValue, compareValue) {
    return dateValue.slice(0, 4) === compareValue.slice(0, 4);
}
function isExpenseCounted(expense) {
    return expense.status === 'APPROVED' || expense.status === 'PAID';
}
function isConfirmedMembershipInvoice(invoice) {
    return invoice.status === 'CONFIRMED';
}
function isConfirmedSalesInvoice(invoice) {
    return invoice.status === 'CONFIRMED';
}
function cloneGymManagementDataset(dataset) {
    return structuredClone(dataset);
}
function findPersonalTrainerById(dataset, ptId) {
    return dataset.personalTrainers.find((trainer) => trainer.id === ptId);
}
function findPtContractByPtId(dataset, ptId) {
    return dataset.ptContracts.find((contract) => contract.ptId === ptId);
}
function findPayrollPeriodById(dataset, payrollPeriodId) {
    return dataset.payrollPeriods.find((period) => period.id === payrollPeriodId);
}
function findMemberById(dataset, memberId) {
    return dataset.members.find((member) => member.id === memberId);
}
function findMembershipPlanById(dataset, membershipPlanId) {
    return dataset.membershipPlans.find((plan) => plan.id === membershipPlanId);
}
function findSalesInvoiceById(dataset, salesInvoiceId) {
    return dataset.salesInvoices.find((invoice) => invoice.id === salesInvoiceId);
}
function findOperatingExpenseById(dataset, expenseId) {
    return dataset.operatingExpenses.find((expense) => expense.id === expenseId);
}
function findEquipmentAssetById(dataset, equipmentAssetId) {
    return dataset.equipmentAssets.find((asset) => asset.id === equipmentAssetId);
}
function getActiveMembershipForMember(dataset, memberId) {
    const activeMemberships = dataset.memberMemberships
        .filter((membership) => membership.memberId === memberId && membership.status === 'ACTIVE')
        .sort((firstMembership, secondMembership) => secondMembership.startDate.localeCompare(firstMembership.startDate));
    return activeMemberships[0];
}
function getActiveAssignmentForMember(dataset, memberId) {
    const activeAssignments = dataset.memberPtAssignments
        .filter((assignment) => assignment.memberId === memberId && assignment.status === 'ACTIVE')
        .sort((firstAssignment, secondAssignment) => secondAssignment.assignedFrom.localeCompare(firstAssignment.assignedFrom));
    return activeAssignments[0];
}
function buildDashboardSummary(dataset) {
    const referenceDate = dataset.generatedAt;
    const confirmedMembershipInvoices = dataset.membershipInvoices.filter((invoice) => isConfirmedMembershipInvoice(invoice));
    const confirmedSalesInvoices = dataset.salesInvoices.filter((invoice) => isConfirmedSalesInvoice(invoice));
    const activeMemberships = dataset.memberMemberships.filter((membership) => membership.status === 'ACTIVE');
    const lowStockProducts = dataset.products.filter((product) => product.stockOnHand <= product.minimumStockLevel);
    const maintenanceAlerts = [];
    const activeMembershipsByType = Object.fromEntries(['DAY', 'MONTH', 'YEAR'].map((membershipType) => [
        membershipType,
        activeMemberships.filter((membership) => {
            const plan = findMembershipPlanById(dataset, membership.membershipPlanId);
            return plan?.type === membershipType;
        }).length,
    ]));
    return {
        totalMembers: dataset.members.length,
        totalPts: dataset.personalTrainers.length,
        activeMembers: dataset.members.filter((member) => member.status === 'ACTIVE').length,
        activeMemberships: activeMembershipsByType,
        revenue: {
            daily: sumValues([
                ...confirmedMembershipInvoices
                    .filter((invoice) => isSameUtcDay(invoice.invoiceDate, referenceDate))
                    .map((invoice) => invoice.totalAmount),
                ...confirmedSalesInvoices
                    .filter((invoice) => isSameUtcDay(invoice.invoiceDate, referenceDate))
                    .map((invoice) => invoice.totalAmount),
            ]),
            monthly: sumValues([
                ...confirmedMembershipInvoices
                    .filter((invoice) => isSameUtcMonth(invoice.invoiceDate, referenceDate))
                    .map((invoice) => invoice.totalAmount),
                ...confirmedSalesInvoices
                    .filter((invoice) => isSameUtcMonth(invoice.invoiceDate, referenceDate))
                    .map((invoice) => invoice.totalAmount),
            ]),
            yearly: sumValues([
                ...confirmedMembershipInvoices
                    .filter((invoice) => isSameUtcYear(invoice.invoiceDate, referenceDate))
                    .map((invoice) => invoice.totalAmount),
                ...confirmedSalesInvoices
                    .filter((invoice) => isSameUtcYear(invoice.invoiceDate, referenceDate))
                    .map((invoice) => invoice.totalAmount),
            ]),
            membership: sumValues(confirmedMembershipInvoices.map((invoice) => invoice.totalAmount)),
            services: sumValues(confirmedSalesInvoices.map((invoice) => invoice.totalAmount)),
        },
        totalPtPayroll: sumValues(dataset.payrollEntries
            .filter((entry) => entry.payrollPeriodId === dataset.payrollPeriods.at(-1)?.id)
            .map((entry) => entry.netPay)),
        totalOperatingExpense: sumValues(dataset.operatingExpenses.filter((expense) => isExpenseCounted(expense)).map((expense) => expense.amount)),
        lowStockProducts,
        maintenanceAlerts,
    };
}
function buildPtOverview(dataset) {
    return dataset.personalTrainers.map((trainer) => {
        const relevantAssignments = dataset.memberPtAssignments.filter((assignment) => assignment.ptId === trainer.id && assignment.status === 'ACTIVE');
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
function buildMemberOverview(dataset) {
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
            totalMembershipSpend: sumValues(dataset.membershipInvoices
                .filter((invoice) => invoice.memberId === member.id && isConfirmedMembershipInvoice(invoice))
                .map((invoice) => invoice.totalAmount)),
            totalServiceSpend: sumValues(dataset.salesInvoices
                .filter((invoice) => invoice.memberId === member.id && isConfirmedSalesInvoice(invoice))
                .map((invoice) => invoice.totalAmount)),
        };
    });
}
function buildInventoryOverview(dataset) {
    const soldQuantityByProductId = new Map();
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
        .filter((entry) => entry.product !== undefined)
        .sort((firstEntry, secondEntry) => secondEntry.soldQuantity - firstEntry.soldQuantity)
        .slice(0, 3);
    const recentTransactions = [...dataset.inventoryTransactions]
        .sort((firstTransaction, secondTransaction) => secondTransaction.transactionDate.localeCompare(firstTransaction.transactionDate))
        .slice(0, 6);
    return {
        totalProducts: dataset.products.length,
        lowStockCount: dataset.products.filter((product) => product.stockOnHand <= product.minimumStockLevel).length,
        stockValue: sumValues(dataset.products.map((product) => product.stockOnHand * product.unitCost)),
        topSellingProducts,
        recentTransactions,
    };
}
function buildRevenueReport(dataset) {
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
function buildExpenseReport(dataset) {
    const byCategory = Object.fromEntries(['CLEANING', 'UTILITY', 'SALARY', 'RENT', 'OTHER'].map((category) => [category, 0]));
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
function buildPayrollReport(dataset) {
    return {
        totalPayroll: sumValues(dataset.payrollEntries.map((entry) => entry.netPay)),
        approvedPayroll: sumValues(dataset.payrollEntries
            .filter((entry) => entry.status === 'APPROVED' || entry.status === 'PAID')
            .map((entry) => entry.netPay)),
        pendingPayroll: sumValues(dataset.payrollEntries.filter((entry) => entry.status === 'PENDING_APPROVAL').map((entry) => entry.netPay)),
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
function calculateCogsFromSalesInvoices(salesInvoices) {
    return sumValues(salesInvoices.flatMap((salesInvoice) => salesInvoice.items.map((item) => item.unitCost * item.quantity)));
}
function buildProfitReport(dataset) {
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
function getAttendanceByPtId(dataset, ptId) {
    return dataset.attendanceLogs.filter((attendanceLog) => attendanceLog.ptId === ptId);
}
function getPayrollEntriesByPeriodId(dataset, payrollPeriodId) {
    return dataset.payrollEntries.filter((entry) => entry.payrollPeriodId === payrollPeriodId);
}
function getMemberAssignmentsByMemberId(dataset, memberId) {
    return dataset.memberPtAssignments.filter((assignment) => assignment.memberId === memberId);
}
function getSalesInvoicesByMemberId(dataset, memberId) {
    return dataset.salesInvoices.filter((invoice) => invoice.memberId === memberId);
}
function getMembershipInvoicesByMemberId(dataset, memberId) {
    return dataset.membershipInvoices.filter((invoice) => invoice.memberId === memberId);
}
function getInventoryTransactionsByProductId(dataset, productId) {
    return dataset.inventoryTransactions.filter((transaction) => transaction.productId === productId);
}
function createGymManagementSnapshot(dataset) {
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
//# sourceMappingURL=gym-management.helpers.js.map