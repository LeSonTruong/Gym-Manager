"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDateOnly = parseDateOnly;
exports.parseDateTime = parseDateTime;
exports.toDecimalString = toDecimalString;
exports.mapUserEntity = mapUserEntity;
exports.mapPersonalTrainerEntity = mapPersonalTrainerEntity;
exports.mapPtContractEntity = mapPtContractEntity;
exports.mapAttendanceLogEntity = mapAttendanceLogEntity;
exports.mapPayrollPeriodEntity = mapPayrollPeriodEntity;
exports.mapPayrollEntryEntity = mapPayrollEntryEntity;
exports.mapMemberEntity = mapMemberEntity;
exports.mapMembershipPlanEntity = mapMembershipPlanEntity;
exports.mapMemberMembershipEntity = mapMemberMembershipEntity;
exports.mapMemberPtAssignmentEntity = mapMemberPtAssignmentEntity;
exports.mapMembershipInvoiceEntity = mapMembershipInvoiceEntity;
exports.mapProductEntity = mapProductEntity;
exports.mapInventoryTransactionEntity = mapInventoryTransactionEntity;
exports.mapSalesInvoiceItemEntity = mapSalesInvoiceItemEntity;
exports.mapSalesInvoiceEntity = mapSalesInvoiceEntity;
exports.mapEquipmentAssetEntity = mapEquipmentAssetEntity;
exports.mapOperatingExpenseEntity = mapOperatingExpenseEntity;
exports.mapMaintenanceRecordEntity = mapMaintenanceRecordEntity;
exports.mapSystemConfigEntity = mapSystemConfigEntity;
exports.mapDatasetFromEntities = mapDatasetFromEntities;
function toDateOnlyString(value) {
    if (typeof value === 'string') {
        return value.slice(0, 10);
    }
    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }
    return new Date(value).toISOString().slice(0, 10);
}
function toDateTimeString(value) {
    if (typeof value === 'string') {
        return new Date(value).toISOString();
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    return new Date(value).toISOString();
}
function parseDateOnly(value) {
    return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
}
function parseDateTime(value) {
    return new Date(value);
}
function toDecimalString(value) {
    return value.toString();
}
function mapUserEntity(entity) {
    return {
        id: entity.id,
        fullName: entity.fullName,
        email: entity.email,
        role: entity.role,
        status: entity.status,
        deletedAt: entity.deletedAt ? toDateTimeString(entity.deletedAt) : null,
    };
}
function mapPersonalTrainerEntity(entity) {
    return {
        id: entity.id,
        code: entity.code,
        userId: entity.user?.id ?? null,
        fullName: entity.fullName,
        gender: entity.gender,
        birthDate: toDateOnlyString(entity.birthDate),
        phone: entity.phone,
        email: entity.email,
        address: entity.address,
        status: entity.status,
        specialties: entity.specialties,
        experienceYears: entity.experienceYears,
        avatarUrl: entity.avatarUrl,
        startDate: toDateOnlyString(entity.startDate),
        deletedAt: entity.deletedAt ? toDateTimeString(entity.deletedAt) : null,
    };
}
function mapPtContractEntity(entity) {
    return {
        id: entity.id,
        ptId: entity.personalTrainer.id,
        contractCode: entity.contractCode,
        contractType: entity.contractType,
        salaryType: entity.salaryType,
        baseSalary: Number(entity.baseSalary),
        minValidShiftHours: Number(entity.minValidShiftHours),
        standardShiftHours: Number(entity.standardShiftHours),
        overtimeHourlyRate: Number(entity.overtimeHourlyRate),
        performanceBonusThreshold: entity.performanceBonusThreshold,
        performanceBonusAmount: Number(entity.performanceBonusAmount),
        packageCommissionRate: Number(entity.packageCommissionRate),
        salesCommissionRate: Number(entity.salesCommissionRate),
        allowances: Number(entity.allowances),
        penaltyRules: entity.penaltyRules,
        effectiveFrom: toDateOnlyString(entity.effectiveFrom),
        effectiveTo: entity.effectiveTo ? toDateOnlyString(entity.effectiveTo) : null,
    };
}
function mapAttendanceLogEntity(entity) {
    return {
        id: entity.id,
        ptId: entity.personalTrainer.id,
        attendanceDate: toDateOnlyString(entity.attendanceDate),
        checkInAt: toDateTimeString(entity.checkInAt),
        checkOutAt: entity.checkOutAt ? toDateTimeString(entity.checkOutAt) : null,
        workedHours: Number(entity.workedHours),
        paidHours: Number(entity.paidHours),
        overtimeHours: Number(entity.overtimeHours),
        status: entity.status,
        workCredit: Number(entity.workCredit),
        note: entity.note ?? null,
    };
}
function mapPayrollPeriodEntity(entity) {
    return {
        id: entity.id,
        code: entity.code,
        from: toDateOnlyString(entity.fromDate),
        to: toDateOnlyString(entity.toDate),
        status: entity.status,
        submittedAt: entity.submittedAt ? toDateTimeString(entity.submittedAt) : null,
        approvedByUserId: entity.approvedByUser?.id ?? null,
        approvedAt: entity.approvedAt ? toDateTimeString(entity.approvedAt) : null,
        paidAt: entity.paidAt ? toDateTimeString(entity.paidAt) : null,
    };
}
function mapPayrollEntryEntity(entity) {
    return {
        id: entity.id,
        payrollPeriodId: entity.payrollPeriod.id,
        ptId: entity.personalTrainer.id,
        contractId: entity.contract?.id ?? null,
        validShiftCredits: Number(entity.validShiftCredits),
        paidHours: Number(entity.paidHours),
        overtimeHours: Number(entity.overtimeHours),
        baseSalaryAmount: Number(entity.baseSalaryAmount),
        attendanceBonusAmount: Number(entity.attendanceBonusAmount),
        overtimeAmount: Number(entity.overtimeAmount),
        packageCommission: Number(entity.packageCommission),
        salesCommission: Number(entity.salesCommission),
        performanceBonus: Number(entity.performanceBonus),
        allowanceAmount: Number(entity.allowanceAmount),
        deductionAmount: Number(entity.deductionAmount),
        penalties: Number(entity.penalties),
        grossPay: Number(entity.grossPay),
        netPay: Number(entity.netPay),
        status: entity.status,
    };
}
function mapMemberEntity(entity) {
    return {
        id: entity.id,
        code: entity.code,
        fullName: entity.fullName,
        gender: entity.gender,
        birthDate: toDateOnlyString(entity.birthDate),
        phone: entity.phone,
        email: entity.email,
        address: entity.address,
        heightCm: entity.heightCm,
        weightKg: entity.weightKg,
        goal: entity.goal,
        healthNotes: entity.healthNotes,
        registeredAt: toDateOnlyString(entity.registeredAt),
        status: entity.status,
        deletedAt: entity.deletedAt ? toDateTimeString(entity.deletedAt) : null,
    };
}
function mapMembershipPlanEntity(entity) {
    return {
        id: entity.id,
        code: entity.code,
        name: entity.name,
        type: entity.type,
        price: Number(entity.price),
        durationDays: entity.durationDays,
        usageLimit: entity.usageLimit ?? null,
        includesPt: entity.includesPt,
        includedPtSessions: entity.includedPtSessions,
        perks: entity.perks,
        status: entity.status,
    };
}
function mapMemberMembershipEntity(entity) {
    return {
        id: entity.id,
        memberId: entity.member.id,
        membershipPlanId: entity.membershipPlan.id,
        startDate: toDateOnlyString(entity.startDate),
        endDate: toDateOnlyString(entity.endDate),
        remainingSessions: entity.remainingSessions ?? null,
        status: entity.status,
        deletedAt: entity.deletedAt ? toDateTimeString(entity.deletedAt) : null,
    };
}
function mapMemberPtAssignmentEntity(entity) {
    return {
        id: entity.id,
        memberId: entity.member.id,
        ptId: entity.personalTrainer.id,
        memberMembershipId: entity.memberMembership.id,
        assignedFrom: toDateOnlyString(entity.assignedFrom),
        assignedTo: entity.assignedTo ? toDateOnlyString(entity.assignedTo) : null,
        commissionType: entity.commissionType ?? null,
        commissionValue: entity.commissionValue ? Number(entity.commissionValue) : null,
        commissionAmount: Number(entity.commissionAmount),
        status: entity.status,
        note: entity.note ?? null,
    };
}
function mapMembershipInvoiceEntity(entity) {
    return {
        id: entity.id,
        code: entity.code,
        memberId: entity.member.id,
        memberMembershipId: entity.memberMembership.id,
        invoiceDate: toDateTimeString(entity.invoiceDate),
        totalAmount: Number(entity.totalAmount),
        paymentMethod: entity.paymentMethod,
        status: entity.status,
    };
}
function mapProductEntity(entity) {
    return {
        id: entity.id,
        code: entity.code,
        name: entity.name,
        category: entity.category,
        unitCost: Number(entity.unitCost),
        salePrice: Number(entity.salePrice),
        stockOnHand: entity.stockOnHand,
        minimumStockLevel: entity.minimumStockLevel,
        status: entity.status,
        deletedAt: entity.deletedAt ? toDateTimeString(entity.deletedAt) : null,
    };
}
function mapInventoryTransactionEntity(entity) {
    return {
        id: entity.id,
        productId: entity.product.id,
        type: entity.type,
        quantity: entity.quantity,
        unitCost: Number(entity.unitCost),
        transactionDate: toDateTimeString(entity.transactionDate),
        referenceCode: entity.referenceCode,
        note: entity.note,
    };
}
function mapSalesInvoiceItemEntity(entity) {
    return {
        productId: entity.product.id,
        quantity: entity.quantity,
        unitPrice: Number(entity.unitPrice),
        unitCost: Number(entity.unitCost),
        lineTotal: Number(entity.lineTotal),
    };
}
function mapSalesInvoiceEntity(entity, items) {
    return {
        id: entity.id,
        code: entity.code,
        invoiceDate: toDateTimeString(entity.invoiceDate),
        createdByUserId: entity.createdByUser.id,
        memberId: entity.member?.id ?? null,
        customerName: entity.customerName,
        status: entity.status,
        paymentMethod: entity.paymentMethod,
        discountAmount: Number(entity.discountAmount),
        totalAmount: Number(entity.totalAmount),
        note: entity.note,
        items,
        confirmedAt: entity.confirmedAt ? toDateTimeString(entity.confirmedAt) : null,
        cancelledAt: entity.cancelledAt ? toDateTimeString(entity.cancelledAt) : null,
        cancellationReason: entity.cancellationReason ?? null,
    };
}
function mapEquipmentAssetEntity(entity) {
    return {
        id: entity.id,
        code: entity.code,
        name: entity.name,
        category: entity.category ?? null,
        purchasedAt: toDateOnlyString(entity.purchasedAt),
        purchaseValue: Number(entity.purchaseValue),
        status: entity.status ?? null,
        condition: entity.condition,
        location: entity.location ?? null,
        nextMaintenanceAt: entity.nextMaintenanceAt
            ? toDateOnlyString(entity.nextMaintenanceAt)
            : null,
        note: entity.note,
        deletedAt: entity.deletedAt ? toDateTimeString(entity.deletedAt) : null,
    };
}
function mapOperatingExpenseEntity(entity) {
    return {
        id: entity.id,
        code: entity.code,
        expenseDate: toDateOnlyString(entity.expenseDate),
        category: entity.category,
        equipmentAssetId: entity.equipmentAsset?.id ?? null,
        vendorName: entity.vendorName,
        amount: Number(entity.amount),
        description: entity.description,
        approvedByUserId: entity.approvedByUser?.id ?? null,
        attachmentUrl: entity.attachmentUrl ?? null,
        status: entity.status,
        submittedAt: entity.submittedAt ? toDateTimeString(entity.submittedAt) : null,
        approvedAt: entity.approvedAt ? toDateTimeString(entity.approvedAt) : null,
        rejectedAt: entity.rejectedAt ? toDateTimeString(entity.rejectedAt) : null,
        rejectionReason: entity.rejectionReason ?? null,
        paidAt: entity.paidAt ? toDateTimeString(entity.paidAt) : null,
    };
}
function mapMaintenanceRecordEntity(entity) {
    return {
        id: entity.id,
        equipmentAssetId: entity.equipmentAsset.id,
        maintenanceDate: toDateOnlyString(entity.maintenanceDate),
        maintenanceType: entity.maintenanceType ?? null,
        description: entity.description,
        vendorName: entity.vendorName,
        amount: Number(entity.amount),
        resultStatus: entity.resultStatus ?? null,
        note: entity.note ?? null,
        createdByUserId: entity.createdByUser?.id ?? null,
    };
}
function mapSystemConfigEntity(entity) {
    return {
        key: entity.key,
        label: entity.label,
        value: entity.value,
        description: entity.description,
        updatedByUserId: entity.updatedByUser?.id ?? null,
        updatedAt: toDateTimeString(entity.updatedAt),
    };
}
function mapDatasetFromEntities(collections, generatedAt = new Date().toISOString()) {
    const salesInvoiceItemsByInvoiceId = new Map();
    for (const item of collections.salesInvoiceItems) {
        const salesInvoiceId = item.salesInvoice.id;
        const currentItems = salesInvoiceItemsByInvoiceId.get(salesInvoiceId) ?? [];
        currentItems.push(mapSalesInvoiceItemEntity(item));
        salesInvoiceItemsByInvoiceId.set(salesInvoiceId, currentItems);
    }
    return {
        generatedAt,
        users: collections.users.map((entity) => mapUserEntity(entity)),
        personalTrainers: collections.personalTrainers.map((entity) => mapPersonalTrainerEntity(entity)),
        ptContracts: collections.ptContracts.map((entity) => mapPtContractEntity(entity)),
        attendanceLogs: collections.attendanceLogs.map((entity) => mapAttendanceLogEntity(entity)),
        payrollPeriods: collections.payrollPeriods.map((entity) => mapPayrollPeriodEntity(entity)),
        payrollEntries: collections.payrollEntries.map((entity) => mapPayrollEntryEntity(entity)),
        members: collections.members.map((entity) => mapMemberEntity(entity)),
        membershipPlans: collections.membershipPlans.map((entity) => mapMembershipPlanEntity(entity)),
        memberMemberships: collections.memberMemberships.map((entity) => mapMemberMembershipEntity(entity)),
        memberPtAssignments: collections.memberPtAssignments.map((entity) => mapMemberPtAssignmentEntity(entity)),
        membershipInvoices: collections.membershipInvoices.map((entity) => mapMembershipInvoiceEntity(entity)),
        products: collections.products.map((entity) => mapProductEntity(entity)),
        inventoryTransactions: collections.inventoryTransactions.map((entity) => mapInventoryTransactionEntity(entity)),
        salesInvoices: collections.salesInvoices.map((invoice) => mapSalesInvoiceEntity(invoice, salesInvoiceItemsByInvoiceId.get(invoice.id) ?? [])),
        operatingExpenses: collections.operatingExpenses.map((entity) => mapOperatingExpenseEntity(entity)),
        equipmentAssets: collections.equipmentAssets.map((entity) => mapEquipmentAssetEntity(entity)),
        maintenanceRecords: collections.maintenanceRecords.map((entity) => mapMaintenanceRecordEntity(entity)),
        systemConfigs: collections.systemConfigs.map((entity) => mapSystemConfigEntity(entity)),
    };
}
//# sourceMappingURL=gym-management.mapper.js.map