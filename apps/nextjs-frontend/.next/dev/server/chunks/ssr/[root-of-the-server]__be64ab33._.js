module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/apps/nextjs-frontend/src/app/[locale]/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/nextjs-frontend/src/app/[locale]/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/apps/nextjs-frontend/src/app/[locale]/error.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/nextjs-frontend/src/app/[locale]/error.tsx [app-rsc] (ecmascript)"));
}),
"[project]/apps/nextjs-frontend/src/app/[locale]/global-error.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/nextjs-frontend/src/app/[locale]/global-error.tsx [app-rsc] (ecmascript)"));
}),
"[project]/apps/nextjs-frontend/src/i18n/navigation.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Link",
    ()=>Link,
    "getPathname",
    ()=>getPathname,
    "redirect",
    ()=>redirect,
    "usePathname",
    ()=>usePathname,
    "useRouter",
    ()=>useRouter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$server$2f$createNavigation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/navigation/react-server/createNavigation.js [app-rsc] (ecmascript) <export default as createNavigation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$i18n$2f$routing$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/nextjs-frontend/src/i18n/routing.ts [app-rsc] (ecmascript)");
;
;
const { Link, redirect, usePathname, useRouter, getPathname } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$server$2f$createNavigation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__["createNavigation"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$i18n$2f$routing$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["routing"]);
}),
"[project]/packages/shared/dist/contracts/api-response.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
}); //# sourceMappingURL=api-response.js.map
}),
"[project]/packages/shared/dist/contracts/gym-management.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
}); //# sourceMappingURL=gym-management.js.map
}),
"[project]/packages/shared/dist/data/gym-management.mock.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gymManagementMockData = void 0;
exports.createGymManagementMockData = createGymManagementMockData;
exports.gymManagementMockData = {
    generatedAt: '2026-03-31T09:00:00.000Z',
    users: [
        {
            id: 'user-admin-001',
            fullName: 'Nguyen Minh Quan',
            email: 'admin@gymmanager.local',
            role: 'ADMIN',
            status: 'ACTIVE',
            passwordHint: 'demo123'
        },
        {
            id: 'user-staff-001',
            fullName: 'Le Thao Nhi',
            email: 'staff@gymmanager.local',
            role: 'STAFF',
            status: 'ACTIVE',
            passwordHint: 'demo123'
        },
        {
            id: 'user-pt-001',
            fullName: 'Tran Gia Bao',
            email: 'bao.pt@gymmanager.local',
            role: 'PT',
            status: 'ACTIVE',
            passwordHint: 'demo123'
        },
        {
            id: 'user-pt-002',
            fullName: 'Pham Quoc An',
            email: 'an.pt@gymmanager.local',
            role: 'PT',
            status: 'ACTIVE',
            passwordHint: 'demo123'
        },
        {
            id: 'user-pt-003',
            fullName: 'Vo Khanh Linh',
            email: 'linh.pt@gymmanager.local',
            role: 'PT',
            status: 'ACTIVE',
            passwordHint: 'demo123'
        }
    ],
    personalTrainers: [
        {
            id: 'pt-001',
            code: 'PT001',
            fullName: 'Tran Gia Bao',
            gender: 'MALE',
            birthDate: '1996-08-21',
            phone: '0901000001',
            email: 'bao.pt@gymmanager.local',
            address: 'Quan 7, TP.HCM',
            status: 'ACTIVE',
            specialties: [
                'Strength',
                'Body recomposition'
            ],
            experienceYears: 6,
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
            startDate: '2023-02-10'
        },
        {
            id: 'pt-002',
            code: 'PT002',
            fullName: 'Pham Quoc An',
            gender: 'MALE',
            birthDate: '1994-03-14',
            phone: '0901000002',
            email: 'an.pt@gymmanager.local',
            address: 'Thu Duc, TP.HCM',
            status: 'ACTIVE',
            specialties: [
                'Fat loss',
                'Functional training'
            ],
            experienceYears: 8,
            avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
            startDate: '2022-06-01'
        },
        {
            id: 'pt-003',
            code: 'PT003',
            fullName: 'Vo Khanh Linh',
            gender: 'FEMALE',
            birthDate: '1998-01-05',
            phone: '0901000003',
            email: 'linh.pt@gymmanager.local',
            address: 'Binh Thanh, TP.HCM',
            status: 'ACTIVE',
            specialties: [
                'Mobility',
                'Beginner coaching'
            ],
            experienceYears: 4,
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
            startDate: '2024-01-15'
        }
    ],
    ptContracts: [
        {
            id: 'contract-001',
            ptId: 'pt-001',
            contractType: 'Full time senior PT',
            salaryType: 'MONTHLY',
            baseSalary: 4_500_000,
            minValidShiftHours: 5,
            standardShiftHours: 8,
            overtimeHourlyRate: 120_000,
            performanceBonusThreshold: 5,
            performanceBonusAmount: 800_000,
            packageCommissionRate: 0.08,
            salesCommissionRate: 0.03,
            allowances: 500_000,
            penaltyRules: [
                'Late check-out repeated 3 times => 200000'
            ],
            effectiveFrom: '2026-01-01',
            effectiveTo: '2026-12-31'
        },
        {
            id: 'contract-002',
            ptId: 'pt-002',
            contractType: 'Full time PT',
            salaryType: 'MONTHLY',
            baseSalary: 4_800_000,
            minValidShiftHours: 5,
            standardShiftHours: 8,
            overtimeHourlyRate: 125_000,
            performanceBonusThreshold: 4,
            performanceBonusAmount: 700_000,
            packageCommissionRate: 0.09,
            salesCommissionRate: 0.02,
            allowances: 400_000,
            penaltyRules: [
                'No-show shift => 300000'
            ],
            effectiveFrom: '2026-01-01',
            effectiveTo: '2026-12-31'
        },
        {
            id: 'contract-003',
            ptId: 'pt-003',
            contractType: 'PT growth track',
            salaryType: 'MONTHLY',
            baseSalary: 4_000_000,
            minValidShiftHours: 5,
            standardShiftHours: 8,
            overtimeHourlyRate: 100_000,
            performanceBonusThreshold: 3,
            performanceBonusAmount: 600_000,
            packageCommissionRate: 0.07,
            salesCommissionRate: 0.03,
            allowances: 300_000,
            penaltyRules: [
                'Missing weekly recap => 100000'
            ],
            effectiveFrom: '2026-01-01',
            effectiveTo: '2026-12-31'
        }
    ],
    attendanceLogs: [
        {
            id: 'attendance-001',
            ptId: 'pt-001',
            attendanceDate: '2026-03-28',
            checkInAt: '2026-03-28T02:00:00.000Z',
            checkOutAt: '2026-03-28T11:30:00.000Z',
            workedHours: 9.5,
            overtimeHours: 1.5,
            status: 'VALID',
            workCredit: 1
        },
        {
            id: 'attendance-002',
            ptId: 'pt-001',
            attendanceDate: '2026-03-29',
            checkInAt: '2026-03-29T01:30:00.000Z',
            checkOutAt: '2026-03-29T09:30:00.000Z',
            workedHours: 8,
            overtimeHours: 0,
            status: 'VALID',
            workCredit: 1
        },
        {
            id: 'attendance-003',
            ptId: 'pt-001',
            attendanceDate: '2026-03-31',
            checkInAt: '2026-03-31T02:00:00.000Z',
            checkOutAt: '2026-03-31T05:30:00.000Z',
            workedHours: 3.5,
            overtimeHours: 0,
            status: 'HALF',
            workCredit: 0.5
        },
        {
            id: 'attendance-004',
            ptId: 'pt-002',
            attendanceDate: '2026-03-27',
            checkInAt: '2026-03-27T00:30:00.000Z',
            checkOutAt: '2026-03-27T10:30:00.000Z',
            workedHours: 10,
            overtimeHours: 2,
            status: 'VALID',
            workCredit: 1
        },
        {
            id: 'attendance-005',
            ptId: 'pt-002',
            attendanceDate: '2026-03-30',
            checkInAt: '2026-03-30T01:00:00.000Z',
            checkOutAt: '2026-03-30T09:00:00.000Z',
            workedHours: 8,
            overtimeHours: 0,
            status: 'VALID',
            workCredit: 1
        },
        {
            id: 'attendance-006',
            ptId: 'pt-003',
            attendanceDate: '2026-03-26',
            checkInAt: '2026-03-26T01:00:00.000Z',
            checkOutAt: '2026-03-26T08:00:00.000Z',
            workedHours: 7,
            overtimeHours: 0,
            status: 'VALID',
            workCredit: 1
        },
        {
            id: 'attendance-007',
            ptId: 'pt-003',
            attendanceDate: '2026-03-31',
            checkInAt: '2026-03-31T02:00:00.000Z',
            checkOutAt: '2026-03-31T13:00:00.000Z',
            workedHours: 11,
            overtimeHours: 3,
            status: 'VALID',
            workCredit: 1
        }
    ],
    payrollPeriods: [
        {
            id: 'payroll-period-2026-02',
            code: '2026-02',
            from: '2026-02-01',
            to: '2026-02-28',
            status: 'PAID'
        },
        {
            id: 'payroll-period-2026-03',
            code: '2026-03',
            from: '2026-03-01',
            to: '2026-03-31',
            status: 'PENDING_APPROVAL'
        }
    ],
    payrollEntries: [
        {
            id: 'payroll-entry-001',
            payrollPeriodId: 'payroll-period-2026-03',
            ptId: 'pt-001',
            validShiftCredits: 2.5,
            overtimeHours: 1.5,
            packageCommission: 900_000,
            salesCommission: 30_000,
            performanceBonus: 800_000,
            penalties: 0,
            grossPay: 6_510_000,
            netPay: 6_510_000,
            status: 'PENDING_APPROVAL'
        },
        {
            id: 'payroll-entry-002',
            payrollPeriodId: 'payroll-period-2026-03',
            ptId: 'pt-002',
            validShiftCredits: 2,
            overtimeHours: 2,
            packageCommission: 1_100_000,
            salesCommission: 20_000,
            performanceBonus: 700_000,
            penalties: 0,
            grossPay: 6_270_000,
            netPay: 6_270_000,
            status: 'APPROVED'
        },
        {
            id: 'payroll-entry-003',
            payrollPeriodId: 'payroll-period-2026-03',
            ptId: 'pt-003',
            validShiftCredits: 2,
            overtimeHours: 3,
            packageCommission: 450_000,
            salesCommission: 60_000,
            performanceBonus: 0,
            penalties: 0,
            grossPay: 4_660_000,
            netPay: 4_660_000,
            status: 'APPROVED'
        },
        {
            id: 'payroll-entry-004',
            payrollPeriodId: 'payroll-period-2026-02',
            ptId: 'pt-001',
            validShiftCredits: 22,
            overtimeHours: 11,
            packageCommission: 1_800_000,
            salesCommission: 120_000,
            performanceBonus: 800_000,
            penalties: 0,
            grossPay: 7_940_000,
            netPay: 7_940_000,
            status: 'PAID'
        }
    ],
    members: [
        {
            id: 'member-001',
            code: 'MB001',
            fullName: 'Do Hai Yen',
            gender: 'FEMALE',
            birthDate: '1999-04-22',
            phone: '0912000001',
            email: 'yen.member@gymmanager.local',
            address: 'Go Vap, TP.HCM',
            heightCm: 162,
            weightKg: 55,
            goal: 'Improve posture and muscle tone',
            healthNotes: 'Mild lower back tightness',
            registeredAt: '2026-03-01',
            status: 'ACTIVE'
        },
        {
            id: 'member-002',
            code: 'MB002',
            fullName: 'Nguyen Hoang Long',
            gender: 'MALE',
            birthDate: '1995-11-03',
            phone: '0912000002',
            email: 'long.member@gymmanager.local',
            address: 'Quan 3, TP.HCM',
            heightCm: 175,
            weightKg: 83,
            goal: 'Reduce body fat from 25% to 18%',
            healthNotes: 'No known issues',
            registeredAt: '2026-03-10',
            status: 'ACTIVE'
        },
        {
            id: 'member-003',
            code: 'MB003',
            fullName: 'Tran Mai Anh',
            gender: 'FEMALE',
            birthDate: '1992-06-18',
            phone: '0912000003',
            email: 'anh.member@gymmanager.local',
            address: 'Phu Nhuan, TP.HCM',
            heightCm: 158,
            weightKg: 50,
            goal: 'Year-long lifestyle reset',
            healthNotes: 'Knee needs low-impact warm-up',
            registeredAt: '2026-03-15',
            status: 'ACTIVE'
        },
        {
            id: 'member-004',
            code: 'MB004',
            fullName: 'Pham Kiet Hung',
            gender: 'MALE',
            birthDate: '1988-12-12',
            phone: '0912000004',
            email: 'hung.member@gymmanager.local',
            address: 'Binh Thanh, TP.HCM',
            heightCm: 170,
            weightKg: 76,
            goal: 'General health maintenance',
            healthNotes: 'Shoulder mobility work recommended',
            registeredAt: '2026-02-03',
            status: 'INACTIVE'
        },
        {
            id: 'member-005',
            code: 'MB005',
            fullName: 'Le Quynh Nhu',
            gender: 'FEMALE',
            birthDate: '2001-01-27',
            phone: '0912000005',
            email: 'nhu.member@gymmanager.local',
            address: 'Thu Duc, TP.HCM',
            heightCm: 160,
            weightKg: 48,
            goal: 'Gain lean mass',
            healthNotes: 'Beginner, needs close coaching',
            registeredAt: '2026-03-29',
            status: 'ACTIVE'
        },
        {
            id: 'member-006',
            code: 'MB006',
            fullName: 'Vu Duc Tai',
            gender: 'MALE',
            birthDate: '1997-09-09',
            phone: '0912000006',
            email: 'tai.member@gymmanager.local',
            address: 'Quan 10, TP.HCM',
            heightCm: 172,
            weightKg: 70,
            goal: 'Try a single day pass before committing',
            healthNotes: 'No known issues',
            registeredAt: '2026-03-31',
            status: 'ACTIVE'
        }
    ],
    membershipPlans: [
        {
            id: 'plan-day',
            code: 'PLAN-DAY',
            name: 'Day Pass Flex',
            type: 'DAY',
            price: 150_000,
            durationDays: 1,
            usageLimit: 1,
            includesPt: false,
            includedPtSessions: 0,
            perks: [
                '1 bottle of water',
                'Locker access'
            ],
            status: 'ON_SALE'
        },
        {
            id: 'plan-month-basic',
            code: 'PLAN-MONTH-BASIC',
            name: '30 Day Access',
            type: 'MONTH',
            price: 950_000,
            durationDays: 30,
            usageLimit: null,
            includesPt: false,
            includedPtSessions: 0,
            perks: [
                'Unlimited check-in',
                'Body metrics snapshot'
            ],
            status: 'ON_SALE'
        },
        {
            id: 'plan-month-pt',
            code: 'PLAN-MONTH-PT',
            name: 'Transformation 30',
            type: 'MONTH',
            price: 1_850_000,
            durationDays: 30,
            usageLimit: null,
            includesPt: true,
            includedPtSessions: 8,
            perks: [
                '8 PT sessions',
                'Priority booking',
                'Nutrition checklist'
            ],
            status: 'ON_SALE'
        },
        {
            id: 'plan-year-elite',
            code: 'PLAN-YEAR-ELITE',
            name: 'Elite 365',
            type: 'YEAR',
            price: 12_900_000,
            durationDays: 365,
            usageLimit: null,
            includesPt: true,
            includedPtSessions: 24,
            perks: [
                'Quarterly reassessment',
                '24 PT sessions',
                'Supplement discount 10%'
            ],
            status: 'ON_SALE'
        }
    ],
    memberMemberships: [
        {
            id: 'membership-001',
            memberId: 'member-001',
            membershipPlanId: 'plan-year-elite',
            startDate: '2026-03-01',
            endDate: '2027-02-28',
            remainingSessions: 19,
            status: 'ACTIVE'
        },
        {
            id: 'membership-002',
            memberId: 'member-002',
            membershipPlanId: 'plan-month-basic',
            startDate: '2026-03-10',
            endDate: '2026-04-08',
            remainingSessions: null,
            status: 'ACTIVE'
        },
        {
            id: 'membership-003',
            memberId: 'member-003',
            membershipPlanId: 'plan-year-elite',
            startDate: '2026-03-15',
            endDate: '2027-03-14',
            remainingSessions: 22,
            status: 'ACTIVE'
        },
        {
            id: 'membership-004',
            memberId: 'member-004',
            membershipPlanId: 'plan-month-basic',
            startDate: '2026-02-03',
            endDate: '2026-03-04',
            remainingSessions: null,
            status: 'EXPIRED'
        },
        {
            id: 'membership-005',
            memberId: 'member-005',
            membershipPlanId: 'plan-month-pt',
            startDate: '2026-03-29',
            endDate: '2026-04-27',
            remainingSessions: 7,
            status: 'ACTIVE'
        },
        {
            id: 'membership-006',
            memberId: 'member-006',
            membershipPlanId: 'plan-day',
            startDate: '2026-03-31',
            endDate: '2026-03-31',
            remainingSessions: 1,
            status: 'ACTIVE'
        }
    ],
    memberPtAssignments: [
        {
            id: 'assignment-001',
            memberId: 'member-001',
            ptId: 'pt-001',
            memberMembershipId: 'membership-001',
            assignedFrom: '2026-03-01',
            assignedTo: null,
            commissionAmount: 900_000,
            status: 'ACTIVE'
        },
        {
            id: 'assignment-002',
            memberId: 'member-003',
            ptId: 'pt-002',
            memberMembershipId: 'membership-003',
            assignedFrom: '2026-03-15',
            assignedTo: null,
            commissionAmount: 1_100_000,
            status: 'ACTIVE'
        },
        {
            id: 'assignment-003',
            memberId: 'member-005',
            ptId: 'pt-003',
            memberMembershipId: 'membership-005',
            assignedFrom: '2026-03-29',
            assignedTo: null,
            commissionAmount: 450_000,
            status: 'ACTIVE'
        },
        {
            id: 'assignment-004',
            memberId: 'member-004',
            ptId: 'pt-002',
            memberMembershipId: 'membership-004',
            assignedFrom: '2026-02-03',
            assignedTo: '2026-03-04',
            commissionAmount: 0,
            status: 'ENDED'
        }
    ],
    membershipInvoices: [
        {
            id: 'membership-invoice-001',
            code: 'MIV-20260301-001',
            memberId: 'member-001',
            memberMembershipId: 'membership-001',
            invoiceDate: '2026-03-01T03:30:00.000Z',
            totalAmount: 12_900_000,
            paymentMethod: 'BANK_TRANSFER',
            status: 'CONFIRMED'
        },
        {
            id: 'membership-invoice-002',
            code: 'MIV-20260310-001',
            memberId: 'member-002',
            memberMembershipId: 'membership-002',
            invoiceDate: '2026-03-10T04:00:00.000Z',
            totalAmount: 950_000,
            paymentMethod: 'CARD',
            status: 'CONFIRMED'
        },
        {
            id: 'membership-invoice-003',
            code: 'MIV-20260315-001',
            memberId: 'member-003',
            memberMembershipId: 'membership-003',
            invoiceDate: '2026-03-15T06:30:00.000Z',
            totalAmount: 12_900_000,
            paymentMethod: 'BANK_TRANSFER',
            status: 'CONFIRMED'
        },
        {
            id: 'membership-invoice-004',
            code: 'MIV-20260329-001',
            memberId: 'member-005',
            memberMembershipId: 'membership-005',
            invoiceDate: '2026-03-29T02:00:00.000Z',
            totalAmount: 1_850_000,
            paymentMethod: 'CASH',
            status: 'CONFIRMED'
        },
        {
            id: 'membership-invoice-005',
            code: 'MIV-20260331-001',
            memberId: 'member-006',
            memberMembershipId: 'membership-006',
            invoiceDate: '2026-03-31T02:15:00.000Z',
            totalAmount: 150_000,
            paymentMethod: 'CASH',
            status: 'CONFIRMED'
        }
    ],
    products: [
        {
            id: 'product-001',
            code: 'PRD-WATER',
            name: 'Electrolyte Water',
            category: 'Drink',
            unitCost: 6_000,
            salePrice: 15_000,
            stockOnHand: 18,
            minimumStockLevel: 20,
            status: 'ACTIVE'
        },
        {
            id: 'product-002',
            code: 'PRD-GLOVE',
            name: 'Training Gloves Pro',
            category: 'Accessory',
            unitCost: 95_000,
            salePrice: 150_000,
            stockOnHand: 7,
            minimumStockLevel: 10,
            status: 'ACTIVE'
        },
        {
            id: 'product-003',
            code: 'PRD-TOWEL',
            name: 'Microfiber Towel',
            category: 'Accessory',
            unitCost: 35_000,
            salePrice: 65_000,
            stockOnHand: 24,
            minimumStockLevel: 12,
            status: 'ACTIVE'
        },
        {
            id: 'product-004',
            code: 'PRD-WHEY',
            name: 'ISO Whey Sachet',
            category: 'Supplement',
            unitCost: 210_000,
            salePrice: 350_000,
            stockOnHand: 11,
            minimumStockLevel: 8,
            status: 'ACTIVE'
        },
        {
            id: 'product-005',
            code: 'PRD-BAND',
            name: 'Resistance Band Set',
            category: 'Accessory',
            unitCost: 55_000,
            salePrice: 90_000,
            stockOnHand: 30,
            minimumStockLevel: 10,
            status: 'ACTIVE'
        }
    ],
    inventoryTransactions: [
        {
            id: 'inventory-001',
            productId: 'product-001',
            type: 'IMPORT',
            quantity: 60,
            unitCost: 6_000,
            transactionDate: '2026-03-02T01:00:00.000Z',
            referenceCode: 'PO-20260302-001',
            note: 'Restock drinks'
        },
        {
            id: 'inventory-002',
            productId: 'product-002',
            type: 'IMPORT',
            quantity: 15,
            unitCost: 95_000,
            transactionDate: '2026-03-05T01:00:00.000Z',
            referenceCode: 'PO-20260305-001',
            note: 'Accessory restock'
        },
        {
            id: 'inventory-003',
            productId: 'product-004',
            type: 'SALE',
            quantity: 1,
            unitCost: 210_000,
            transactionDate: '2026-03-20T12:00:00.000Z',
            referenceCode: 'SIV-20260320-001',
            note: 'Linked to sales invoice'
        },
        {
            id: 'inventory-004',
            productId: 'product-001',
            type: 'SALE',
            quantity: 2,
            unitCost: 6_000,
            transactionDate: '2026-03-20T12:00:00.000Z',
            referenceCode: 'SIV-20260320-001',
            note: 'Linked to sales invoice'
        },
        {
            id: 'inventory-005',
            productId: 'product-002',
            type: 'SALE',
            quantity: 1,
            unitCost: 95_000,
            transactionDate: '2026-03-30T10:00:00.000Z',
            referenceCode: 'SIV-20260330-001',
            note: 'Linked to sales invoice'
        },
        {
            id: 'inventory-006',
            productId: 'product-001',
            type: 'SALE',
            quantity: 4,
            unitCost: 6_000,
            transactionDate: '2026-03-30T10:00:00.000Z',
            referenceCode: 'SIV-20260330-001',
            note: 'Linked to sales invoice'
        },
        {
            id: 'inventory-007',
            productId: 'product-003',
            type: 'SALE',
            quantity: 2,
            unitCost: 35_000,
            transactionDate: '2026-03-31T09:00:00.000Z',
            referenceCode: 'SIV-20260331-001',
            note: 'Linked to sales invoice'
        },
        {
            id: 'inventory-008',
            productId: 'product-005',
            type: 'SALE',
            quantity: 3,
            unitCost: 55_000,
            transactionDate: '2026-03-31T09:00:00.000Z',
            referenceCode: 'SIV-20260331-001',
            note: 'Linked to sales invoice'
        },
        {
            id: 'inventory-009',
            productId: 'product-001',
            type: 'SALE',
            quantity: 8,
            unitCost: 6_000,
            transactionDate: '2026-03-31T09:00:00.000Z',
            referenceCode: 'SIV-20260331-001',
            note: 'Linked to sales invoice'
        },
        {
            id: 'inventory-010',
            productId: 'product-003',
            type: 'ADJUSTMENT',
            quantity: -1,
            unitCost: 35_000,
            transactionDate: '2026-03-24T08:00:00.000Z',
            referenceCode: 'ADJ-20260324-001',
            note: 'Damaged towel removed'
        }
    ],
    salesInvoices: [
        {
            id: 'sales-invoice-001',
            code: 'SIV-20260320-001',
            invoiceDate: '2026-03-20T12:00:00.000Z',
            createdByUserId: 'user-staff-001',
            memberId: 'member-002',
            customerName: 'Nguyen Hoang Long',
            status: 'CONFIRMED',
            paymentMethod: 'CARD',
            discountAmount: 30_000,
            totalAmount: 350_000,
            note: 'Supplement add-on after assessment',
            items: [
                {
                    productId: 'product-004',
                    quantity: 1,
                    unitPrice: 350_000,
                    unitCost: 210_000,
                    lineTotal: 350_000
                },
                {
                    productId: 'product-001',
                    quantity: 2,
                    unitPrice: 15_000,
                    unitCost: 6_000,
                    lineTotal: 30_000
                }
            ]
        },
        {
            id: 'sales-invoice-002',
            code: 'SIV-20260330-001',
            invoiceDate: '2026-03-30T10:00:00.000Z',
            createdByUserId: 'user-staff-001',
            memberId: null,
            customerName: 'Walk-in customer',
            status: 'CONFIRMED',
            paymentMethod: 'CASH',
            discountAmount: 0,
            totalAmount: 210_000,
            note: 'Accessory checkout',
            items: [
                {
                    productId: 'product-002',
                    quantity: 1,
                    unitPrice: 150_000,
                    unitCost: 95_000,
                    lineTotal: 150_000
                },
                {
                    productId: 'product-001',
                    quantity: 4,
                    unitPrice: 15_000,
                    unitCost: 6_000,
                    lineTotal: 60_000
                }
            ]
        },
        {
            id: 'sales-invoice-003',
            code: 'SIV-20260331-001',
            invoiceDate: '2026-03-31T09:00:00.000Z',
            createdByUserId: 'user-staff-001',
            memberId: 'member-005',
            customerName: 'Le Quynh Nhu',
            status: 'CONFIRMED',
            paymentMethod: 'BANK_TRANSFER',
            discountAmount: 0,
            totalAmount: 520_000,
            note: 'Starter pack bundle',
            items: [
                {
                    productId: 'product-003',
                    quantity: 2,
                    unitPrice: 65_000,
                    unitCost: 35_000,
                    lineTotal: 130_000
                },
                {
                    productId: 'product-005',
                    quantity: 3,
                    unitPrice: 90_000,
                    unitCost: 55_000,
                    lineTotal: 270_000
                },
                {
                    productId: 'product-001',
                    quantity: 8,
                    unitPrice: 15_000,
                    unitCost: 6_000,
                    lineTotal: 120_000
                }
            ]
        },
        {
            id: 'sales-invoice-004',
            code: 'SIV-20260331-002',
            invoiceDate: '2026-03-31T11:00:00.000Z',
            createdByUserId: 'user-staff-001',
            memberId: null,
            customerName: 'Pending member checkout',
            status: 'DRAFT',
            paymentMethod: 'CASH',
            discountAmount: 0,
            totalAmount: 150_000,
            note: 'Waiting for confirmation',
            items: [
                {
                    productId: 'product-002',
                    quantity: 1,
                    unitPrice: 150_000,
                    unitCost: 95_000,
                    lineTotal: 150_000
                }
            ]
        }
    ],
    operatingExpenses: [
        {
            id: 'expense-001',
            code: 'EXP-20260308-001',
            expenseDate: '2026-03-08',
            category: 'CLEANING',
            equipmentAssetId: null,
            vendorName: 'Sparkle Clean',
            amount: 350_000,
            description: 'Deep cleaning for free weight area',
            approvedByUserId: 'user-admin-001',
            attachmentUrl: 'https://example.com/expenses/cleaning-march.pdf',
            status: 'PAID'
        },
        {
            id: 'expense-002',
            code: 'EXP-20260318-001',
            expenseDate: '2026-03-18',
            category: 'MAINTENANCE',
            equipmentAssetId: 'equipment-002',
            vendorName: 'Fit Machine Care',
            amount: 420_000,
            description: 'Lubrication and belt calibration for treadmills',
            approvedByUserId: 'user-admin-001',
            attachmentUrl: 'https://example.com/expenses/treadmill-maintenance.pdf',
            status: 'PAID'
        },
        {
            id: 'expense-003',
            code: 'EXP-20260326-001',
            expenseDate: '2026-03-26',
            category: 'REPAIR',
            equipmentAssetId: 'equipment-003',
            vendorName: 'Barbell Lab',
            amount: 480_000,
            description: 'Cable replacement for lat pulldown',
            approvedByUserId: 'user-admin-001',
            attachmentUrl: 'https://example.com/expenses/cable-repair.pdf',
            status: 'APPROVED'
        },
        {
            id: 'expense-004',
            code: 'EXP-20260330-001',
            expenseDate: '2026-03-30',
            category: 'UTILITY',
            equipmentAssetId: null,
            vendorName: 'Saigon Power',
            amount: 320_000,
            description: 'Electricity top-up for last week of March',
            approvedByUserId: null,
            attachmentUrl: null,
            status: 'PENDING_APPROVAL'
        },
        {
            id: 'expense-005',
            code: 'EXP-20260312-001',
            expenseDate: '2026-03-12',
            category: 'REPLACEMENT',
            equipmentAssetId: 'equipment-004',
            vendorName: 'Power Rack VN',
            amount: 1_200_000,
            description: 'Rejected replacement request due to incomplete photos',
            approvedByUserId: 'user-admin-001',
            attachmentUrl: 'https://example.com/expenses/replacement-rejected.pdf',
            status: 'REJECTED'
        }
    ],
    equipmentAssets: [
        {
            id: 'equipment-001',
            code: 'EQ001',
            name: 'Half Rack Alpha',
            purchasedAt: '2024-07-15',
            purchaseValue: 24_000_000,
            condition: 'GOOD',
            nextMaintenanceAt: '2026-05-15',
            note: 'Main squat station'
        },
        {
            id: 'equipment-002',
            code: 'EQ002',
            name: 'Treadmill Zone Runner',
            purchasedAt: '2023-09-01',
            purchaseValue: 18_500_000,
            condition: 'MAINTENANCE_DUE',
            nextMaintenanceAt: '2026-04-05',
            note: 'Cardio lane 2'
        },
        {
            id: 'equipment-003',
            code: 'EQ003',
            name: 'Lat Pulldown Station',
            purchasedAt: '2022-04-20',
            purchaseValue: 12_000_000,
            condition: 'MAINTENANCE_DUE',
            nextMaintenanceAt: '2026-04-02',
            note: 'Cable recently replaced'
        },
        {
            id: 'equipment-004',
            code: 'EQ004',
            name: 'Adjustable Bench B2',
            purchasedAt: '2021-11-11',
            purchaseValue: 5_500_000,
            condition: 'NEEDS_REPLACEMENT',
            nextMaintenanceAt: '2026-04-01',
            note: 'Frame wobble reported'
        }
    ],
    maintenanceRecords: [
        {
            id: 'maintenance-001',
            equipmentAssetId: 'equipment-002',
            maintenanceDate: '2026-03-18',
            description: 'Belt tension and lubrication',
            vendorName: 'Fit Machine Care',
            amount: 420_000
        },
        {
            id: 'maintenance-002',
            equipmentAssetId: 'equipment-003',
            maintenanceDate: '2026-03-26',
            description: 'Cable and pulley replacement',
            vendorName: 'Barbell Lab',
            amount: 480_000
        },
        {
            id: 'maintenance-003',
            equipmentAssetId: 'equipment-004',
            maintenanceDate: '2026-03-30',
            description: 'Inspection, recommended replacement',
            vendorName: 'Power Rack VN',
            amount: 0
        }
    ],
    systemConfigs: [
        {
            key: 'min_valid_shift_hours',
            label: 'Minimum valid shift hours',
            value: '5',
            description: 'So gio toi thieu de ca duoc tinh hop le.'
        },
        {
            key: 'half_shift_policy',
            label: 'Half shift policy',
            value: 'HALF_COUNT',
            description: 'Ca duoi chuan duoc tinh nua cong thay vi loai bo.'
        },
        {
            key: 'low_stock_threshold_default',
            label: 'Default low stock threshold',
            value: '10',
            description: 'Nguong canh bao ton kho mac dinh cho san pham moi.'
        },
        {
            key: 'membership_exclusive_mode',
            label: 'Exclusive membership mode',
            value: 'true',
            description: 'Chi cho phep mot membership active tai mot thoi diem.'
        },
        {
            key: 'default_timezone',
            label: 'Display timezone',
            value: 'Asia/Ho_Chi_Minh',
            description: 'Mui gio hien thi va tinh toan chinh cho he thong.'
        },
        {
            key: 'allow_multiple_shifts_per_day',
            label: 'Allow multiple PT shifts per day',
            value: 'false',
            description: 'Chan mo nhieu ca cung ngay neu khong bat buoc.'
        }
    ]
};
function createGymManagementMockData() {
    return structuredClone(exports.gymManagementMockData);
} //# sourceMappingURL=gym-management.mock.js.map
}),
"[project]/packages/shared/dist/utils/gym-management.helpers.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
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
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
function sumValues(values) {
    return values.reduce((total, value)=>total + value, 0);
}
function toTimeValue(value) {
    return new Date(value).getTime();
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
    return dataset.personalTrainers.find((trainer)=>trainer.id === ptId);
}
function findPtContractByPtId(dataset, ptId) {
    return dataset.ptContracts.find((contract)=>contract.ptId === ptId);
}
function findPayrollPeriodById(dataset, payrollPeriodId) {
    return dataset.payrollPeriods.find((period)=>period.id === payrollPeriodId);
}
function findMemberById(dataset, memberId) {
    return dataset.members.find((member)=>member.id === memberId);
}
function findMembershipPlanById(dataset, membershipPlanId) {
    return dataset.membershipPlans.find((plan)=>plan.id === membershipPlanId);
}
function findSalesInvoiceById(dataset, salesInvoiceId) {
    return dataset.salesInvoices.find((invoice)=>invoice.id === salesInvoiceId);
}
function findOperatingExpenseById(dataset, expenseId) {
    return dataset.operatingExpenses.find((expense)=>expense.id === expenseId);
}
function findEquipmentAssetById(dataset, equipmentAssetId) {
    return dataset.equipmentAssets.find((asset)=>asset.id === equipmentAssetId);
}
function getActiveMembershipForMember(dataset, memberId) {
    const activeMemberships = dataset.memberMemberships.filter((membership)=>membership.memberId === memberId && membership.status === 'ACTIVE').sort((firstMembership, secondMembership)=>secondMembership.startDate.localeCompare(firstMembership.startDate));
    return activeMemberships[0];
}
function getActiveAssignmentForMember(dataset, memberId) {
    const activeAssignments = dataset.memberPtAssignments.filter((assignment)=>assignment.memberId === memberId && assignment.status === 'ACTIVE').sort((firstAssignment, secondAssignment)=>secondAssignment.assignedFrom.localeCompare(firstAssignment.assignedFrom));
    return activeAssignments[0];
}
function buildDashboardSummary(dataset) {
    const referenceDate = dataset.generatedAt;
    const confirmedMembershipInvoices = dataset.membershipInvoices.filter(isConfirmedMembershipInvoice);
    const confirmedSalesInvoices = dataset.salesInvoices.filter(isConfirmedSalesInvoice);
    const activeMemberships = dataset.memberMemberships.filter((membership)=>membership.status === 'ACTIVE');
    const lowStockProducts = dataset.products.filter((product)=>product.stockOnHand <= product.minimumStockLevel);
    const maintenanceAlerts = dataset.equipmentAssets.filter((equipmentAsset)=>{
        if (equipmentAsset.condition !== 'GOOD') {
            return true;
        }
        const daysUntilMaintenance = Math.floor((toTimeValue(equipmentAsset.nextMaintenanceAt) - toTimeValue(referenceDate)) / DAY_IN_MILLISECONDS);
        return daysUntilMaintenance <= 14;
    });
    return {
        totalMembers: dataset.members.length,
        totalPts: dataset.personalTrainers.length,
        activeMembers: dataset.members.filter((member)=>member.status === 'ACTIVE').length,
        activeMemberships: {
            DAY: activeMemberships.filter((membership)=>{
                const plan = findMembershipPlanById(dataset, membership.membershipPlanId);
                return plan?.type === 'DAY';
            }).length,
            MONTH: activeMemberships.filter((membership)=>{
                const plan = findMembershipPlanById(dataset, membership.membershipPlanId);
                return plan?.type === 'MONTH';
            }).length,
            YEAR: activeMemberships.filter((membership)=>{
                const plan = findMembershipPlanById(dataset, membership.membershipPlanId);
                return plan?.type === 'YEAR';
            }).length
        },
        revenue: {
            daily: sumValues([
                ...confirmedMembershipInvoices.filter((invoice)=>isSameUtcDay(invoice.invoiceDate, referenceDate)).map((invoice)=>invoice.totalAmount),
                ...confirmedSalesInvoices.filter((invoice)=>isSameUtcDay(invoice.invoiceDate, referenceDate)).map((invoice)=>invoice.totalAmount)
            ]),
            monthly: sumValues([
                ...confirmedMembershipInvoices.filter((invoice)=>isSameUtcMonth(invoice.invoiceDate, referenceDate)).map((invoice)=>invoice.totalAmount),
                ...confirmedSalesInvoices.filter((invoice)=>isSameUtcMonth(invoice.invoiceDate, referenceDate)).map((invoice)=>invoice.totalAmount)
            ]),
            yearly: sumValues([
                ...confirmedMembershipInvoices.filter((invoice)=>isSameUtcYear(invoice.invoiceDate, referenceDate)).map((invoice)=>invoice.totalAmount),
                ...confirmedSalesInvoices.filter((invoice)=>isSameUtcYear(invoice.invoiceDate, referenceDate)).map((invoice)=>invoice.totalAmount)
            ]),
            membership: sumValues(confirmedMembershipInvoices.map((invoice)=>invoice.totalAmount)),
            services: sumValues(confirmedSalesInvoices.map((invoice)=>invoice.totalAmount))
        },
        totalPtPayroll: sumValues(dataset.payrollEntries.filter((entry)=>entry.payrollPeriodId === dataset.payrollPeriods[dataset.payrollPeriods.length - 1]?.id).map((entry)=>entry.netPay)),
        totalOperatingExpense: sumValues(dataset.operatingExpenses.filter(isExpenseCounted).map((expense)=>expense.amount)),
        lowStockProducts,
        maintenanceAlerts
    };
}
function buildPtOverview(dataset) {
    return dataset.personalTrainers.map((trainer)=>{
        const relevantAssignments = dataset.memberPtAssignments.filter((assignment)=>assignment.ptId === trainer.id && assignment.status === 'ACTIVE');
        const relevantAttendanceLogs = dataset.attendanceLogs.filter((attendanceLog)=>attendanceLog.ptId === trainer.id);
        const latestPayroll = [
            ...dataset.payrollEntries
        ].filter((payrollEntry)=>payrollEntry.ptId === trainer.id).sort((firstEntry, secondEntry)=>secondEntry.payrollPeriodId.localeCompare(firstEntry.payrollPeriodId))[0];
        return {
            pt: trainer,
            contract: findPtContractByPtId(dataset, trainer.id),
            activeMembers: relevantAssignments.length,
            validShiftCredits: sumValues(relevantAttendanceLogs.map((attendanceLog)=>attendanceLog.workCredit)),
            overtimeHours: sumValues(relevantAttendanceLogs.map((attendanceLog)=>attendanceLog.overtimeHours)),
            estimatedPayroll: latestPayroll?.netPay ?? 0
        };
    });
}
function buildMemberOverview(dataset) {
    return dataset.members.map((member)=>{
        const activeMembership = getActiveMembershipForMember(dataset, member.id);
        const activeAssignment = getActiveAssignmentForMember(dataset, member.id);
        return {
            member,
            activeMembership,
            membershipPlan: activeMembership ? findMembershipPlanById(dataset, activeMembership.membershipPlanId) : undefined,
            activeAssignment,
            trainer: activeAssignment ? findPersonalTrainerById(dataset, activeAssignment.ptId) : undefined,
            totalMembershipSpend: sumValues(dataset.membershipInvoices.filter((invoice)=>invoice.memberId === member.id && isConfirmedMembershipInvoice(invoice)).map((invoice)=>invoice.totalAmount)),
            totalServiceSpend: sumValues(dataset.salesInvoices.filter((invoice)=>invoice.memberId === member.id && isConfirmedSalesInvoice(invoice)).map((invoice)=>invoice.totalAmount))
        };
    });
}
function buildInventoryOverview(dataset) {
    const soldQuantityByProductId = new Map();
    for (const transaction of dataset.inventoryTransactions){
        if (transaction.type !== 'SALE') {
            continue;
        }
        const currentQuantity = soldQuantityByProductId.get(transaction.productId) ?? 0;
        soldQuantityByProductId.set(transaction.productId, currentQuantity + transaction.quantity);
    }
    const topSellingProducts = [
        ...soldQuantityByProductId.entries()
    ].map(([productId, soldQuantity])=>({
            product: dataset.products.find((product)=>product.id === productId),
            soldQuantity
        })).filter((entry)=>entry.product !== undefined).sort((firstEntry, secondEntry)=>secondEntry.soldQuantity - firstEntry.soldQuantity).slice(0, 3);
    const recentTransactions = [
        ...dataset.inventoryTransactions
    ].sort((firstTransaction, secondTransaction)=>secondTransaction.transactionDate.localeCompare(firstTransaction.transactionDate)).slice(0, 6);
    return {
        totalProducts: dataset.products.length,
        lowStockCount: dataset.products.filter((product)=>product.stockOnHand <= product.minimumStockLevel).length,
        stockValue: sumValues(dataset.products.map((product)=>product.stockOnHand * product.unitCost)),
        topSellingProducts,
        recentTransactions
    };
}
function buildRevenueReport(dataset) {
    const confirmedMembershipInvoices = dataset.membershipInvoices.filter(isConfirmedMembershipInvoice);
    const confirmedSalesInvoices = dataset.salesInvoices.filter(isConfirmedSalesInvoice);
    return {
        totalRevenue: sumValues([
            ...confirmedMembershipInvoices.map((invoice)=>invoice.totalAmount),
            ...confirmedSalesInvoices.map((invoice)=>invoice.totalAmount)
        ]),
        membershipRevenue: sumValues(confirmedMembershipInvoices.map((invoice)=>invoice.totalAmount)),
        servicesRevenue: sumValues(confirmedSalesInvoices.map((invoice)=>invoice.totalAmount)),
        membershipInvoiceCount: confirmedMembershipInvoices.length,
        salesInvoiceCount: confirmedSalesInvoices.length
    };
}
function buildExpenseReport(dataset) {
    const byCategory = {
        CLEANING: 0,
        MAINTENANCE: 0,
        REPAIR: 0,
        REPLACEMENT: 0,
        UTILITY: 0
    };
    for (const expense of dataset.operatingExpenses.filter(isExpenseCounted)){
        byCategory[expense.category] += expense.amount;
    }
    return {
        totalExpense: sumValues(dataset.operatingExpenses.filter(isExpenseCounted).map((expense)=>expense.amount)),
        pendingApprovalCount: dataset.operatingExpenses.filter((expense)=>expense.status === 'PENDING_APPROVAL').length,
        paidCount: dataset.operatingExpenses.filter((expense)=>expense.status === 'PAID').length,
        byCategory
    };
}
function buildPayrollReport(dataset) {
    return {
        totalPayroll: sumValues(dataset.payrollEntries.map((entry)=>entry.netPay)),
        approvedPayroll: sumValues(dataset.payrollEntries.filter((entry)=>entry.status === 'APPROVED' || entry.status === 'PAID').map((entry)=>entry.netPay)),
        pendingPayroll: sumValues(dataset.payrollEntries.filter((entry)=>entry.status === 'PENDING_APPROVAL').map((entry)=>entry.netPay)),
        byTrainer: dataset.payrollEntries.map((entry)=>{
            const trainer = findPersonalTrainerById(dataset, entry.ptId);
            const payrollPeriod = findPayrollPeriodById(dataset, entry.payrollPeriodId);
            return {
                ptId: entry.ptId,
                ptName: trainer?.fullName ?? 'Unknown trainer',
                payrollPeriodId: entry.payrollPeriodId,
                payrollPeriodCode: payrollPeriod?.code ?? 'Unknown period',
                netPay: entry.netPay,
                status: entry.status
            };
        })
    };
}
function calculateCogsFromSalesInvoices(salesInvoices) {
    return sumValues(salesInvoices.flatMap((salesInvoice)=>salesInvoice.items.map((item)=>item.unitCost * item.quantity)));
}
function buildProfitReport(dataset) {
    const confirmedSalesInvoices = dataset.salesInvoices.filter(isConfirmedSalesInvoice);
    const revenueReport = buildRevenueReport(dataset);
    const expenseReport = buildExpenseReport(dataset);
    const latestPayrollPeriodId = dataset.payrollPeriods[dataset.payrollPeriods.length - 1]?.id;
    const currentPayrollEntries = dataset.payrollEntries.filter((entry)=>entry.payrollPeriodId === latestPayrollPeriodId);
    const ptPayroll = sumValues(currentPayrollEntries.map((entry)=>entry.netPay));
    const cogs = calculateCogsFromSalesInvoices(confirmedSalesInvoices);
    return {
        totalRevenue: revenueReport.totalRevenue,
        cogs,
        ptPayroll,
        operatingExpense: expenseReport.totalExpense,
        netProfit: revenueReport.totalRevenue - cogs - ptPayroll - expenseReport.totalExpense
    };
}
function getAttendanceByPtId(dataset, ptId) {
    return dataset.attendanceLogs.filter((attendanceLog)=>attendanceLog.ptId === ptId);
}
function getPayrollEntriesByPeriodId(dataset, payrollPeriodId) {
    return dataset.payrollEntries.filter((entry)=>entry.payrollPeriodId === payrollPeriodId);
}
function getMemberAssignmentsByMemberId(dataset, memberId) {
    return dataset.memberPtAssignments.filter((assignment)=>assignment.memberId === memberId);
}
function getSalesInvoicesByMemberId(dataset, memberId) {
    return dataset.salesInvoices.filter((invoice)=>invoice.memberId === memberId);
}
function getMembershipInvoicesByMemberId(dataset, memberId) {
    return dataset.membershipInvoices.filter((invoice)=>invoice.memberId === memberId);
}
function getInventoryTransactionsByProductId(dataset, productId) {
    return dataset.inventoryTransactions.filter((transaction)=>transaction.productId === productId);
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
        profitReport: buildProfitReport(clonedDataset)
    };
} //# sourceMappingURL=gym-management.helpers.js.map
}),
"[project]/packages/shared/dist/index.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
__exportStar(__turbopack_context__.r("[project]/packages/shared/dist/contracts/api-response.js [app-rsc] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/packages/shared/dist/contracts/gym-management.js [app-rsc] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/packages/shared/dist/data/gym-management.mock.js [app-rsc] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/packages/shared/dist/utils/gym-management.helpers.js [app-rsc] (ecmascript)"), exports); //# sourceMappingURL=index.js.map
}),
"[project]/apps/nextjs-frontend/src/lib/gym-data.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatCurrency",
    ()=>formatCurrency,
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "formatHours",
    ()=>formatHours,
    "getContractForTrainer",
    ()=>getContractForTrainer,
    "getEquipmentName",
    ()=>getEquipmentName,
    "getGymSnapshot",
    ()=>getGymSnapshot,
    "getMemberName",
    ()=>getMemberName,
    "getMembershipPlanForMember",
    ()=>getMembershipPlanForMember,
    "getPlanName",
    ()=>getPlanName,
    "getProductName",
    ()=>getProductName,
    "getStatusTone",
    ()=>getStatusTone,
    "getTrainerForMember",
    ()=>getTrainerForMember,
    "getTrainerName",
    ()=>getTrainerName,
    "humanizeStatus",
    ()=>humanizeStatus,
    "sortEquipmentByMaintenance",
    ()=>sortEquipmentByMaintenance,
    "sortMembersByDate",
    ()=>sortMembersByDate,
    "sortProductsByStock",
    ()=>sortProductsByStock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/dist/index.js [app-rsc] (ecmascript)");
;
const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
});
const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeZone: 'Asia/Ho_Chi_Minh'
});
const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh'
});
const numberFormatter = new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 1
});
function getGymSnapshot() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createGymManagementSnapshot"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createGymManagementMockData"])());
}
function formatCurrency(value) {
    return currencyFormatter.format(value);
}
function formatDate(value) {
    return dateFormatter.format(new Date(value));
}
function formatDateTime(value) {
    return dateTimeFormatter.format(new Date(value));
}
function formatHours(value) {
    return `${numberFormatter.format(value)}h`;
}
function humanizeStatus(value) {
    return value.toLowerCase().split('_').map((fragment)=>`${fragment.slice(0, 1).toUpperCase()}${fragment.slice(1)}`).join(' ');
}
function getStatusTone(status) {
    switch(status){
        case 'ACTIVE':
        case 'VALID':
        case 'APPROVED':
        case 'PAID':
        case 'CONFIRMED':
            {
                return 'emerald';
            }
        case 'HALF':
        case 'PENDING_APPROVAL':
        case 'OPEN':
        case 'ON_SALE':
            {
                return 'amber';
            }
        case 'INVALID':
        case 'REJECTED':
        case 'CANCELLED':
        case 'NEEDS_REPLACEMENT':
        case 'INACTIVE':
        case 'OFF_SALE':
            {
                return 'rose';
            }
        default:
            {
                return 'sky';
            }
    }
}
function getTrainerName(snapshot, ptId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["findPersonalTrainerById"])(snapshot.dataset, ptId)?.fullName ?? 'Chua gan PT';
}
function getMemberName(snapshot, memberId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["findMemberById"])(snapshot.dataset, memberId)?.fullName ?? 'Khach le';
}
function getPlanName(snapshot, membershipPlanId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["findMembershipPlanById"])(snapshot.dataset, membershipPlanId)?.name ?? 'Unknown plan';
}
function getProductName(snapshot, productId) {
    return snapshot.dataset.products.find((product)=>product.id === productId)?.name ?? 'Unknown product';
}
function getEquipmentName(snapshot, equipmentAssetId) {
    if (!equipmentAssetId) {
        return 'Khong gan thiet bi';
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["findEquipmentAssetById"])(snapshot.dataset, equipmentAssetId)?.name ?? 'Unknown equipment';
}
function getContractForTrainer(snapshot, ptId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["findPtContractByPtId"])(snapshot.dataset, ptId);
}
function getTrainerForMember(snapshot, memberId) {
    const activeAssignment = snapshot.dataset.memberPtAssignments.find((assignment)=>assignment.memberId === memberId && assignment.status === 'ACTIVE');
    return activeAssignment ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["findPersonalTrainerById"])(snapshot.dataset, activeAssignment.ptId) : undefined;
}
function getMembershipPlanForMember(snapshot, memberId) {
    const activeMembership = snapshot.dataset.memberMemberships.find((membership)=>membership.memberId === memberId && membership.status === 'ACTIVE');
    return activeMembership ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["findMembershipPlanById"])(snapshot.dataset, activeMembership.membershipPlanId) : undefined;
}
function sortProductsByStock(products) {
    return [
        ...products
    ].sort((firstProduct, secondProduct)=>firstProduct.stockOnHand - secondProduct.stockOnHand);
}
function sortMembersByDate(members) {
    return [
        ...members
    ].sort((firstMember, secondMember)=>secondMember.registeredAt.localeCompare(firstMember.registeredAt));
}
function sortEquipmentByMaintenance(equipmentAssets) {
    return [
        ...equipmentAssets
    ].sort((firstAsset, secondAsset)=>firstAsset.nextMaintenanceAt.localeCompare(secondAsset.nextMaintenanceAt));
}
}),
"[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "DataTable",
    ()=>DataTable,
    "KeyValueList",
    ()=>KeyValueList,
    "PageHeader",
    ()=>PageHeader,
    "SectionCard",
    ()=>SectionCard,
    "StatsGrid",
    ()=>StatsGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
const badgeToneClassMap = {
    slate: 'border-slate-300 bg-slate-100 text-slate-700',
    emerald: 'border-emerald-300 bg-emerald-100 text-emerald-700',
    amber: 'border-amber-300 bg-amber-100 text-amber-800',
    rose: 'border-rose-300 bg-rose-100 text-rose-700',
    sky: 'border-sky-300 bg-sky-100 text-sky-700'
};
function PageHeader({ eyebrow, title, description, actions }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.08)] backdrop-blur lg:p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-4xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-semibold uppercase tracking-[0.3em] text-orange-600",
                            children: eyebrow
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "font-display mt-3 text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-3 max-w-3xl text-sm leading-7 text-slate-600 lg:text-base",
                            children: description
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                actions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-3",
                    children: actions
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                    lineNumber: 57,
                    columnNumber: 20
                }, this) : undefined
            ]
        }, void 0, true, {
            fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
function StatsGrid({ items }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
        children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                className: "rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold uppercase tracking-[0.24em] text-slate-500",
                        children: item.label
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950",
                        children: item.value
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                        lineNumber: 72,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-sm leading-6 text-slate-600",
                        children: item.note
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this)
                ]
            }, item.label, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
function SectionCard({ title, description, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "rounded-[1.75rem] border border-white/70 bg-white/82 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur lg:p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-display text-2xl font-semibold tracking-tight text-slate-950",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-sm leading-6 text-slate-600",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                        lineNumber: 85,
                        columnNumber: 24
                    }, this) : undefined
                ]
            }, void 0, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, this);
}
function Badge({ children, tone = 'slate' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeToneClassMap[tone]}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
function DataTable({ headers, rows, emptyMessage = 'Khong co du lieu.' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-hidden rounded-[1.25rem] border border-slate-200/80",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "overflow-x-auto",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                className: "min-w-full divide-y divide-slate-200 text-left text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                        className: "bg-slate-100/80 text-xs uppercase tracking-[0.18em] text-slate-500",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            children: headers.map((header)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    className: "px-4 py-3 font-semibold",
                                    children: header
                                }, header, false, {
                                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                                    lineNumber: 108,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                            lineNumber: 106,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                        className: "divide-y divide-slate-100 bg-white/80 text-slate-700",
                        children: rows.length > 0 ? rows.map((row, rowIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: row.map((cell, cellIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-4 py-3 align-top",
                                        children: cell
                                    }, `cell-${rowIndex}-${cellIndex}`, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                                        lineNumber: 119,
                                        columnNumber: 21
                                    }, this))
                            }, `row-${rowIndex}`, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                                lineNumber: 117,
                                columnNumber: 17
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                className: "px-4 py-6 text-sm text-slate-500",
                                colSpan: headers.length,
                                children: emptyMessage
                            }, void 0, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                                lineNumber: 127,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                            lineNumber: 126,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                lineNumber: 104,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
            lineNumber: 103,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
        lineNumber: 102,
        columnNumber: 5
    }, this);
}
function KeyValueList({ items }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
        className: "grid gap-4 md:grid-cols-2",
        children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                        className: "text-xs font-semibold uppercase tracking-[0.22em] text-slate-500",
                        children: item.label
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                        lineNumber: 144,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                        className: "mt-2 text-sm leading-6 text-slate-800",
                        children: item.value
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this)
                ]
            }, item.label, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
                lineNumber: 143,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "renderGymRoute",
    ()=>renderGymRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/nextjs-frontend/src/i18n/navigation.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/nextjs-frontend/src/lib/gym-data.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/nextjs-frontend/src/components/gym/gym-ui.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
function ActionLink({ href, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Link"], {
        href: href,
        className: "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950",
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
function buildDashboardPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Gym operations",
                title: "Dashboard overview",
                description: "Tong hop doanh thu, nhan su, ton kho, payroll va cac canh bao van hanh tu bo du lieu Gym Manager.",
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: `${backendUrl}/api/docs`,
                            target: "_blank",
                            rel: "noreferrer",
                            className: "rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800",
                            children: "Open API docs"
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 47,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                            href: "/reports/profit",
                            children: "Profit report"
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, void 0)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'Active members',
                        value: `${snapshot.dashboard.activeMembers}/${snapshot.dashboard.totalMembers}`,
                        note: 'Bao gom 1 day pass, 2 monthly va 2 yearly memberships dang active.'
                    },
                    {
                        label: 'PT on roster',
                        value: `${snapshot.dashboard.totalPts}`,
                        note: 'Tat ca PT hien dang o trang thai ACTIVE va co contract hieu luc.'
                    },
                    {
                        label: 'Monthly revenue',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.dashboard.revenue.monthly),
                        note: `Membership ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.dashboard.revenue.membership)} + services ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.dashboard.revenue.services)}.`
                    },
                    {
                        label: 'Current payroll',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.dashboard.totalPtPayroll),
                        note: 'Tong net pay cua ky luong hien tai dang review.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 xl:grid-cols-[1.2fr_0.8fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Revenue split",
                        description: "Nhom chi so nhanh cho doanh thu ngay, thang, nam va tong chi phi van hanh duoc tinh vao dashboard.",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KeyValueList"], {
                            items: [
                                {
                                    label: 'Daily revenue',
                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.dashboard.revenue.daily)
                                },
                                {
                                    label: 'Yearly revenue',
                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.dashboard.revenue.yearly)
                                },
                                {
                                    label: 'Operating expense',
                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.dashboard.totalOperatingExpense)
                                },
                                {
                                    label: 'Net profit',
                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.profitReport.netProfit)
                                }
                            ]
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Low stock alerts",
                        description: "Cac san pham can uu tien restock trong ngay.",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'Product',
                                'Stock',
                                'Threshold',
                                'Status'
                            ],
                            rows: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sortProductsByStock"])(snapshot.dashboard.lowStockProducts).map((product)=>[
                                    product.name,
                                    `${product.stockOnHand} units`,
                                    `${product.minimumStockLevel} units`,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                        tone: "amber",
                                        children: "Restock now"
                                    }, product.id, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 107,
                                        columnNumber: 15
                                    }, void 0)
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 xl:grid-cols-[1fr_1fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Maintenance alerts",
                        description: "Thiet bi can bao tri hoac thay the som.",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'Equipment',
                                'Condition',
                                'Next maintenance',
                                'Action'
                            ],
                            rows: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sortEquipmentByMaintenance"])(snapshot.dashboard.maintenanceAlerts).map((equipmentAsset)=>[
                                    equipmentAsset.name,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                        tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(equipmentAsset.condition),
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(equipmentAsset.condition)
                                    }, equipmentAsset.id, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 121,
                                        columnNumber: 15
                                    }, void 0),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(equipmentAsset.nextMaintenanceAt),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                                        href: `/equipment/${equipmentAsset.id}`,
                                        children: "Open asset"
                                    }, `${equipmentAsset.id}-action`, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 125,
                                        columnNumber: 15
                                    }, void 0)
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Top selling products",
                        description: "San pham dang tao doanh so cao nhat trong ky hien tai.",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'Product',
                                'Sold qty',
                                'Current stock'
                            ],
                            rows: snapshot.inventoryOverview.topSellingProducts.map((entry)=>[
                                    entry.product.name,
                                    `${entry.soldQuantity} units`,
                                    `${entry.product.stockOnHand} units`
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 133,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildPtsPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "PT management",
                title: "Personal trainers",
                description: "Danh sach PT, tai trong member, cong cham cong va payroll tam tinh cua Gym Manager.",
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                    href: "/pts/attendance",
                    children: "Open attendance"
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 156,
                    columnNumber: 18
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'Assigned members',
                        value: `${snapshot.ptOverview.reduce((total, item)=>total + item.activeMembers, 0)}`,
                        note: 'Tong so member dang co PT active assignment.'
                    },
                    {
                        label: 'Shift credits',
                        value: `${snapshot.ptOverview.reduce((total, item)=>total + item.validShiftCredits, 0)}`,
                        note: 'Tong cong VALID/HALF quy doi trong dataset.'
                    },
                    {
                        label: 'Overtime',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatHours"])(snapshot.ptOverview.reduce((total, item)=>total + item.overtimeHours, 0)),
                        note: 'Tong gio tang ca duoc lay tu attendance logs.'
                    },
                    {
                        label: 'Estimated payroll',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.ptOverview.reduce((total, item)=>total + item.estimatedPayroll, 0)),
                        note: 'Tong net pay ky gan nhat cua tat ca PT.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "PT roster",
                description: "Mo tung profile de xem contract, attendance va payroll chi tiet.",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'PT',
                        'Specialties',
                        'Active members',
                        'Shift credits',
                        'Overtime',
                        'Net pay',
                        'Detail'
                    ],
                    rows: snapshot.ptOverview.map((item)=>[
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-semibold text-slate-900",
                                        children: item.pt.fullName
                                    }, void 0, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, void 0),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-500",
                                        children: item.pt.code
                                    }, void 0, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 190,
                                        columnNumber: 15
                                    }, void 0)
                                ]
                            }, item.pt.id, true, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 188,
                                columnNumber: 13
                            }, void 0),
                            item.pt.specialties.join(', '),
                            `${item.activeMembers}`,
                            `${item.validShiftCredits}`,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatHours"])(item.overtimeHours),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(item.estimatedPayroll),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                                        href: `/pts/${item.pt.id}`,
                                        children: "Profile"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 198,
                                        columnNumber: 15
                                    }, void 0),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                                        href: `/pts/${item.pt.id}/contracts`,
                                        children: "Contract"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 199,
                                        columnNumber: 15
                                    }, void 0)
                                ]
                            }, `${item.pt.id}-links`, true, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 197,
                                columnNumber: 13
                            }, void 0)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 185,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildPtDetailPage(ptId) {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    const ptOverview = snapshot.ptOverview.find((item)=>item.pt.id === ptId);
    if (!ptOverview) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    const attendanceLogs = snapshot.dataset.attendanceLogs.filter((attendanceLog)=>attendanceLog.ptId === ptId);
    const payrollEntries = snapshot.dataset.payrollEntries.filter((entry)=>entry.ptId === ptId);
    const assignedMembers = snapshot.dataset.memberPtAssignments.filter((assignment)=>assignment.ptId === ptId).map((assignment)=>snapshot.dataset.members.find((member)=>member.id === assignment.memberId)).filter((member)=>member !== undefined);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "PT profile",
                title: ptOverview.pt.fullName,
                description: `${ptOverview.pt.code} | ${ptOverview.pt.specialties.join(', ')} | Started ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(ptOverview.pt.startDate)}`,
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                    href: `/pts/${ptId}/contracts`,
                    children: "View contract"
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 229,
                    columnNumber: 18
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 225,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'Active members',
                        value: `${ptOverview.activeMembers}`,
                        note: 'Member assignments dang mo.'
                    },
                    {
                        label: 'Shift credits',
                        value: `${ptOverview.validShiftCredits}`,
                        note: 'Cong VALID/HALF trong ky.'
                    },
                    {
                        label: 'Overtime',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatHours"])(ptOverview.overtimeHours),
                        note: 'Tong gio tang ca.'
                    },
                    {
                        label: 'Latest payroll',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(ptOverview.estimatedPayroll),
                        note: 'Net pay ky gan nhat.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 xl:grid-cols-[0.9fr_1.1fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Profile summary",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KeyValueList"], {
                            items: [
                                {
                                    label: 'Email',
                                    value: ptOverview.pt.email
                                },
                                {
                                    label: 'Phone',
                                    value: ptOverview.pt.phone
                                },
                                {
                                    label: 'Address',
                                    value: ptOverview.pt.address
                                },
                                {
                                    label: 'Experience',
                                    value: `${ptOverview.pt.experienceYears} years`
                                },
                                {
                                    label: 'Status',
                                    value: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                        tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(ptOverview.pt.status),
                                        children: ptOverview.pt.status
                                    }, void 0, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 249,
                                        columnNumber: 40
                                    }, void 0)
                                },
                                {
                                    label: 'Contract type',
                                    value: ptOverview.contract?.contractType ?? 'No contract'
                                }
                            ]
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 243,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 242,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Assigned members",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'Member',
                                'Status',
                                'Joined',
                                'Detail'
                            ],
                            rows: assignedMembers.map((member)=>[
                                    member.fullName,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                        tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(member.status),
                                        children: member.status
                                    }, member.id, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 260,
                                        columnNumber: 15
                                    }, void 0),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(member.registeredAt),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                                        href: `/members/${member.id}`,
                                        children: "Open member"
                                    }, `${member.id}-detail`, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 264,
                                        columnNumber: 15
                                    }, void 0)
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 256,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 255,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 241,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Attendance timeline",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Date',
                        'Check in',
                        'Check out',
                        'Worked',
                        'Overtime',
                        'Status'
                    ],
                    rows: attendanceLogs.map((attendanceLog)=>[
                            attendanceLog.attendanceDate,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(attendanceLog.checkInAt),
                            attendanceLog.checkOutAt ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(attendanceLog.checkOutAt) : 'Open',
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatHours"])(attendanceLog.workedHours),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatHours"])(attendanceLog.overtimeHours),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(attendanceLog.status),
                                children: attendanceLog.status
                            }, attendanceLog.id, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 281,
                                columnNumber: 13
                            }, void 0)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 273,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 272,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Payroll history",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Period',
                        'Shift credits',
                        'Overtime',
                        'Package commission',
                        'Net pay',
                        'Status'
                    ],
                    rows: payrollEntries.map((entry)=>[
                            snapshot.dataset.payrollPeriods.find((period)=>period.id === entry.payrollPeriodId)?.code ?? entry.payrollPeriodId,
                            `${entry.validShiftCredits}`,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatHours"])(entry.overtimeHours),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(entry.packageCommission),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(entry.netPay),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(entry.status),
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(entry.status)
                            }, entry.id, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 297,
                                columnNumber: 13
                            }, void 0)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 289,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 288,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildPtContractsPage(ptId) {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    const trainer = snapshot.dataset.personalTrainers.find((item)=>item.id === ptId);
    const contract = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getContractForTrainer"])(snapshot, ptId);
    if (!trainer || !contract) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "PT contract",
                title: `${trainer.fullName} contract`,
                description: "Cau hinh luong, overtime, commission va performance bonus dang duoc ap dung.",
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                    href: `/pts/${ptId}`,
                    children: "Back to profile"
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 322,
                    columnNumber: 18
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 318,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Contract settings",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KeyValueList"], {
                    items: [
                        {
                            label: 'Salary type',
                            value: contract.salaryType
                        },
                        {
                            label: 'Base salary',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(contract.baseSalary)
                        },
                        {
                            label: 'Min valid shift',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatHours"])(contract.minValidShiftHours)
                        },
                        {
                            label: 'Standard shift',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatHours"])(contract.standardShiftHours)
                        },
                        {
                            label: 'Overtime rate',
                            value: `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(contract.overtimeHourlyRate)} / hour`
                        },
                        {
                            label: 'Package commission',
                            value: `${contract.packageCommissionRate * 100}%`
                        },
                        {
                            label: 'Sales commission',
                            value: `${contract.salesCommissionRate * 100}%`
                        },
                        {
                            label: 'Performance bonus',
                            value: `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(contract.performanceBonusAmount)} at ${contract.performanceBonusThreshold} active members`
                        },
                        {
                            label: 'Allowances',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(contract.allowances)
                        },
                        {
                            label: 'Effective',
                            value: `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(contract.effectiveFrom)} - ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(contract.effectiveTo)}`
                        }
                    ]
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 326,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 325,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildAttendancePage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "PT attendance",
                title: "Attendance logs",
                description: "Tat ca check-in/check-out duoc phan loai VALID, HALF hoac INVALID de tinh payroll."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 350,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'VALID shifts',
                        value: `${snapshot.dataset.attendanceLogs.filter((attendanceLog)=>attendanceLog.status === 'VALID').length}`,
                        note: 'Ca du gio chuan va duoc tinh full credit.'
                    },
                    {
                        label: 'HALF shifts',
                        value: `${snapshot.dataset.attendanceLogs.filter((attendanceLog)=>attendanceLog.status === 'HALF').length}`,
                        note: 'Ca duoi chuan nhung van tinh nua cong theo setting.'
                    },
                    {
                        label: 'Overtime',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatHours"])(snapshot.dataset.attendanceLogs.reduce((total, attendanceLog)=>total + attendanceLog.overtimeHours, 0)),
                        note: 'Tong gio vuot standard shift.'
                    },
                    {
                        label: 'Work credits',
                        value: `${snapshot.dataset.attendanceLogs.reduce((total, attendanceLog)=>total + attendanceLog.workCredit, 0)}`,
                        note: 'Tong cong quy doi trong ky.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 356,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Attendance table",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'PT',
                        'Date',
                        'Check in',
                        'Check out',
                        'Worked',
                        'Overtime',
                        'Status'
                    ],
                    rows: snapshot.dataset.attendanceLogs.map((attendanceLog)=>[
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTrainerName"])(snapshot, attendanceLog.ptId),
                            attendanceLog.attendanceDate,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(attendanceLog.checkInAt),
                            attendanceLog.checkOutAt ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(attendanceLog.checkOutAt) : 'Open',
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatHours"])(attendanceLog.workedHours),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatHours"])(attendanceLog.overtimeHours),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(attendanceLog.status),
                                children: attendanceLog.status
                            }, attendanceLog.id, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 393,
                                columnNumber: 13
                            }, void 0)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 384,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 383,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildPayrollPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Payroll",
                title: "Payroll periods",
                description: "Tong quan cac ky luong PT va phan bo net pay theo tung PT."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 408,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'Total payroll',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.payrollReport.totalPayroll),
                        note: 'Tong net pay tat ca ky.'
                    },
                    {
                        label: 'Approved payroll',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.payrollReport.approvedPayroll),
                        note: 'Bao gom APPROVED va PAID.'
                    },
                    {
                        label: 'Pending payroll',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.payrollReport.pendingPayroll),
                        note: 'Net pay dang cho review.'
                    },
                    {
                        label: 'Periods',
                        value: `${snapshot.dataset.payrollPeriods.length}`,
                        note: 'So ky luong co san trong demo dataset.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 414,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 xl:grid-cols-[0.85fr_1.15fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Payroll periods",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'Code',
                                'Range',
                                'Status',
                                'Detail'
                            ],
                            rows: snapshot.dataset.payrollPeriods.map((period)=>[
                                    period.code,
                                    `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(period.from)} - ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(period.to)}`,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                        tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(period.status),
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(period.status)
                                    }, period.id, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 438,
                                        columnNumber: 15
                                    }, void 0),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                                        href: `/payroll/${period.id}`,
                                        children: "Open period"
                                    }, `${period.id}-detail`, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 441,
                                        columnNumber: 15
                                    }, void 0)
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 433,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 432,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Payroll by trainer",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'PT',
                                'Period',
                                'Net pay',
                                'Status'
                            ],
                            rows: snapshot.payrollReport.byTrainer.map((item)=>[
                                    item.ptName,
                                    item.payrollPeriodCode,
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(item.netPay),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                        tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(item.status),
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(item.status)
                                    }, `${item.ptId}-${item.payrollPeriodId}`, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 455,
                                        columnNumber: 15
                                    }, void 0)
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 449,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 448,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 431,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildPayrollPeriodPage(periodId) {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    const period = snapshot.dataset.payrollPeriods.find((item)=>item.id === periodId);
    if (!period) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    const entries = snapshot.dataset.payrollEntries.filter((entry)=>entry.payrollPeriodId === periodId);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Payroll detail",
                title: `Payroll period ${period.code}`,
                description: `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(period.from)} - ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(period.to)} | ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(period.status)}`,
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                    href: "/payroll",
                    children: "Back to payroll"
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 482,
                    columnNumber: 18
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 478,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Entries in period",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'PT',
                        'Shift credits',
                        'Overtime',
                        'Package commission',
                        'Sales commission',
                        'Net pay',
                        'Status'
                    ],
                    rows: entries.map((entry)=>[
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTrainerName"])(snapshot, entry.ptId),
                            `${entry.validShiftCredits}`,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatHours"])(entry.overtimeHours),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(entry.packageCommission),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(entry.salesCommission),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(entry.netPay),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(entry.status),
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(entry.status)
                            }, entry.id, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 495,
                                columnNumber: 13
                            }, void 0)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 486,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 485,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildMembersPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    const membersWithPt = snapshot.memberOverview.filter((item)=>item.trainer !== undefined).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Member management",
                title: "Members",
                description: "Danh sach member, membership active va PT phu trach hien tai.",
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                    href: "/members/memberships",
                    children: "Open sold memberships"
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 515,
                    columnNumber: 18
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 511,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'Total members',
                        value: `${snapshot.dataset.members.length}`,
                        note: 'Bao gom ca active va inactive.'
                    },
                    {
                        label: 'Members with PT',
                        value: `${membersWithPt}`,
                        note: 'Duoc tinh tu ACTIVE assignments.'
                    },
                    {
                        label: 'Active yearly plans',
                        value: `${snapshot.dashboard.activeMemberships.YEAR}`,
                        note: 'Nhom premium membership co PT kem theo.'
                    },
                    {
                        label: 'Membership revenue',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.revenueReport.membershipRevenue),
                        note: 'Tong thu membership invoices da confirm.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 518,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Member roster",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Member',
                        'Current plan',
                        'Assigned PT',
                        'Membership spend',
                        'Service spend',
                        'Detail'
                    ],
                    rows: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sortMembersByDate"])(snapshot.dataset.members).map((member)=>{
                        const overview = snapshot.memberOverview.find((item)=>item.member.id === member.id);
                        return [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-semibold text-slate-900",
                                        children: member.fullName
                                    }, void 0, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 543,
                                        columnNumber: 17
                                    }, void 0),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-500",
                                        children: member.code
                                    }, void 0, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 544,
                                        columnNumber: 17
                                    }, void 0)
                                ]
                            }, member.id, true, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 542,
                                columnNumber: 15
                            }, void 0),
                            overview?.membershipPlan?.name ?? 'No active plan',
                            overview?.trainer?.fullName ?? 'Chua gan',
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(overview?.totalMembershipSpend ?? 0),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(overview?.totalServiceSpend ?? 0),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                                href: `/members/${member.id}`,
                                children: "Open member"
                            }, `${member.id}-detail`, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 550,
                                columnNumber: 15
                            }, void 0)
                        ];
                    })
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 536,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 535,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildMemberDetailPage(memberId) {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    const member = snapshot.dataset.members.find((item)=>item.id === memberId);
    if (!member) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    const memberships = snapshot.dataset.memberMemberships.filter((membership)=>membership.memberId === memberId);
    const ptAssignments = snapshot.dataset.memberPtAssignments.filter((assignment)=>assignment.memberId === memberId);
    const membershipInvoices = snapshot.dataset.membershipInvoices.filter((invoice)=>invoice.memberId === memberId);
    const salesInvoices = snapshot.dataset.salesInvoices.filter((invoice)=>invoice.memberId === memberId);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Member detail",
                title: member.fullName,
                description: `${member.goal} | Registered ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(member.registeredAt)}`,
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                    href: "/members",
                    children: "Back to members"
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 580,
                    columnNumber: 18
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 576,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 xl:grid-cols-[0.9fr_1.1fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Profile summary",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KeyValueList"], {
                            items: [
                                {
                                    label: 'Phone',
                                    value: member.phone
                                },
                                {
                                    label: 'Email',
                                    value: member.email
                                },
                                {
                                    label: 'Address',
                                    value: member.address
                                },
                                {
                                    label: 'Body profile',
                                    value: `${member.heightCm} cm | ${member.weightKg} kg`
                                },
                                {
                                    label: 'Health notes',
                                    value: member.healthNotes
                                },
                                {
                                    label: 'Status',
                                    value: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                        tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(member.status),
                                        children: member.status
                                    }, void 0, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 592,
                                        columnNumber: 40
                                    }, void 0)
                                }
                            ]
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 585,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 584,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Membership history",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'Plan',
                                'Start',
                                'End',
                                'Remaining PT sessions',
                                'Status'
                            ],
                            rows: memberships.map((membership)=>[
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPlanName"])(snapshot, membership.membershipPlanId),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(membership.startDate),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(membership.endDate),
                                    membership.remainingSessions === null ? 'Unlimited' : `${membership.remainingSessions}`,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                        tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(membership.status),
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(membership.status)
                                    }, membership.id, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 605,
                                        columnNumber: 15
                                    }, void 0)
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 598,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 597,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 583,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "PT assignments",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'PT',
                        'From',
                        'To',
                        'Commission',
                        'Status'
                    ],
                    rows: ptAssignments.map((assignment)=>[
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTrainerName"])(snapshot, assignment.ptId),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(assignment.assignedFrom),
                            assignment.assignedTo ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(assignment.assignedTo) : 'Active now',
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(assignment.commissionAmount),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(assignment.status),
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(assignment.status)
                            }, assignment.id, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 621,
                                columnNumber: 13
                            }, void 0)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 614,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 613,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 xl:grid-cols-[1fr_1fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Membership invoices",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'Code',
                                'Date',
                                'Amount',
                                'Payment'
                            ],
                            rows: membershipInvoices.map((invoice)=>[
                                    invoice.code,
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(invoice.invoiceDate),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(invoice.totalAmount),
                                    invoice.paymentMethod
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 630,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 629,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Service invoices",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'Code',
                                'Date',
                                'Total',
                                'Status'
                            ],
                            rows: salesInvoices.map((invoice)=>[
                                    invoice.code,
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(invoice.invoiceDate),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(invoice.totalAmount),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                        tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(invoice.status),
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(invoice.status)
                                    }, invoice.id, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                        lineNumber: 648,
                                        columnNumber: 15
                                    }, void 0)
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 642,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 641,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 628,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildMembershipOverviewPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Membership lifecycle",
                title: "Sold memberships",
                description: "Nguon su that cho goi tap da ban, PT assignments va membership invoice confirmations."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 664,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Member memberships",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Member',
                        'Plan',
                        'Range',
                        'PT included',
                        'Status'
                    ],
                    rows: snapshot.dataset.memberMemberships.map((membership)=>{
                        const plan = snapshot.dataset.membershipPlans.find((item)=>item.id === membership.membershipPlanId);
                        return [
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMemberName"])(snapshot, membership.memberId),
                            plan?.name ?? membership.membershipPlanId,
                            `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(membership.startDate)} - ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(membership.endDate)}`,
                            plan?.includesPt ? 'Yes' : 'No',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(membership.status),
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(membership.status)
                            }, membership.id, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 681,
                                columnNumber: 15
                            }, void 0)
                        ];
                    })
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 671,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 670,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildMembershipPlansPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Catalog",
                title: "Membership plans",
                description: "Danh muc plan DAY / MONTH / YEAR va perks di kem cho tung goi."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 697,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Plan catalog",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Plan',
                        'Type',
                        'Price',
                        'PT included',
                        'Perks',
                        'Status'
                    ],
                    rows: snapshot.dataset.membershipPlans.map((plan)=>[
                            plan.name,
                            plan.type,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(plan.price),
                            plan.includesPt ? `${plan.includedPtSessions} sessions` : 'No',
                            plan.perks.join(', '),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(plan.status),
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(plan.status)
                            }, plan.id, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 707,
                                columnNumber: 13
                            }, void 0)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 699,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 698,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildMembershipInvoicesPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Membership billing",
                title: "Membership invoices",
                description: "Danh sach hoa don membership da tao khi member mua hoac gia han goi tap."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 722,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Membership invoice list",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Code',
                        'Member',
                        'Date',
                        'Amount',
                        'Payment',
                        'Status'
                    ],
                    rows: snapshot.dataset.membershipInvoices.map((invoice)=>[
                            invoice.code,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMemberName"])(snapshot, invoice.memberId),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(invoice.invoiceDate),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(invoice.totalAmount),
                            invoice.paymentMethod,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(invoice.status),
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(invoice.status)
                            }, invoice.id, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 732,
                                columnNumber: 13
                            }, void 0)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 724,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 723,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildProductsPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Retail catalog",
                title: "Products",
                description: "San pham dich vu trong gym, gia ban, gia von va trang thai ton kho hien tai."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 747,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'Total products',
                        value: `${snapshot.inventoryOverview.totalProducts}`,
                        note: 'So SKU dang duoc track trong phong gym.'
                    },
                    {
                        label: 'Low stock',
                        value: `${snapshot.inventoryOverview.lowStockCount}`,
                        note: 'Can restock ngay trong ky.'
                    },
                    {
                        label: 'Stock value',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.inventoryOverview.stockValue),
                        note: 'Ton kho tinh theo unit cost.'
                    },
                    {
                        label: 'Service revenue',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.revenueReport.servicesRevenue),
                        note: 'Doanh thu tu sales invoices confirmed.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 748,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Product list",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Product',
                        'Category',
                        'Unit cost',
                        'Sale price',
                        'Stock',
                        'Threshold'
                    ],
                    rows: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sortProductsByStock"])(snapshot.dataset.products).map((product)=>[
                            product.name,
                            product.category,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(product.unitCost),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(product.salePrice),
                            `${product.stockOnHand}`,
                            `${product.minimumStockLevel}`
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 758,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 757,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildInventoryPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Inventory",
                title: "Inventory transactions",
                description: "Theo doi bien dong import, sale, adjustment va muc ton kho hien tai.",
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                    href: "/inventory/import",
                    children: "Open imports"
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 779,
                    columnNumber: 162
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 779,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'Stock value',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.inventoryOverview.stockValue),
                        note: 'Tinh theo unit cost.'
                    },
                    {
                        label: 'Recent transactions',
                        value: `${snapshot.inventoryOverview.recentTransactions.length}`,
                        note: '6 giao dich gan nhat.'
                    },
                    {
                        label: 'Top seller',
                        value: snapshot.inventoryOverview.topSellingProducts[0]?.product.name ?? 'N/A',
                        note: 'San pham ban chay nhat.'
                    },
                    {
                        label: 'Low stock count',
                        value: `${snapshot.inventoryOverview.lowStockCount}`,
                        note: 'So SKU dang canh bao.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 780,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Inventory ledger",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Date',
                        'Product',
                        'Type',
                        'Qty',
                        'Reference',
                        'Note'
                    ],
                    rows: snapshot.dataset.inventoryTransactions.map((transaction)=>[
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(transaction.transactionDate),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductName"])(snapshot, transaction.productId),
                            transaction.type,
                            `${transaction.quantity}`,
                            transaction.referenceCode,
                            transaction.note
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 790,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 789,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildInventoryImportPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    const importTransactions = snapshot.dataset.inventoryTransactions.filter((transaction)=>transaction.type === 'IMPORT');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Restocking",
                title: "Import tracker",
                description: "Tap trung vao cac giao dich nhap kho va danh sach san pham can mua them."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 812,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 xl:grid-cols-[0.9fr_1.1fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Import transactions",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'Date',
                                'Product',
                                'Qty',
                                'Unit cost',
                                'Reference'
                            ],
                            rows: importTransactions.map((transaction)=>[
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(transaction.transactionDate),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductName"])(snapshot, transaction.productId),
                                    `${transaction.quantity}`,
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(transaction.unitCost),
                                    transaction.referenceCode
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 815,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 814,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Suggested restock queue",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'Product',
                                'Current stock',
                                'Threshold',
                                'Suggested action'
                            ],
                            rows: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sortProductsByStock"])(snapshot.dashboard.lowStockProducts).map((product)=>[
                                    product.name,
                                    `${product.stockOnHand}`,
                                    `${product.minimumStockLevel}`,
                                    'Create import request'
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 828,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 827,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 813,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildInvoicesPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Sales",
                title: "Service invoices",
                description: "Hoa don ban san pham dich vu cho member hoac khach le."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 848,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Sales invoices",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Code',
                        'Customer',
                        'Date',
                        'Total',
                        'Payment',
                        'Status',
                        'Detail'
                    ],
                    rows: snapshot.dataset.salesInvoices.map((invoice)=>[
                            invoice.code,
                            invoice.customerName,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(invoice.invoiceDate),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(invoice.totalAmount),
                            invoice.paymentMethod,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(invoice.status),
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(invoice.status)
                            }, invoice.id, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 858,
                                columnNumber: 13
                            }, void 0),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                                href: `/invoices/${invoice.id}`,
                                children: "Open invoice"
                            }, `${invoice.id}-detail`, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 861,
                                columnNumber: 13
                            }, void 0)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 850,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 849,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildInvoiceDetailPage(invoiceId) {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    const invoice = snapshot.dataset.salesInvoices.find((item)=>item.id === invoiceId);
    if (!invoice) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Sales invoice detail",
                title: invoice.code,
                description: `${invoice.customerName} | ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(invoice.invoiceDate)}`,
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                    href: "/invoices",
                    children: "Back to invoices"
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 881,
                    columnNumber: 161
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 881,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Invoice summary",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KeyValueList"], {
                    items: [
                        {
                            label: 'Customer',
                            value: invoice.customerName
                        },
                        {
                            label: 'Member',
                            value: invoice.memberId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMemberName"])(snapshot, invoice.memberId) : 'Walk-in'
                        },
                        {
                            label: 'Payment method',
                            value: invoice.paymentMethod
                        },
                        {
                            label: 'Discount',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(invoice.discountAmount)
                        },
                        {
                            label: 'Total',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(invoice.totalAmount)
                        },
                        {
                            label: 'Status',
                            value: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(invoice.status),
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(invoice.status)
                            }, void 0, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 890,
                                columnNumber: 38
                            }, void 0)
                        }
                    ]
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 883,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 882,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Invoice items",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Product',
                        'Qty',
                        'Unit price',
                        'Unit cost',
                        'Line total'
                    ],
                    rows: invoice.items.map((item, index)=>[
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductName"])(snapshot, item.productId),
                            `${item.quantity}`,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(item.unitPrice),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(item.unitCost),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold text-slate-900",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(item.lineTotal)
                            }, `line-${index}`, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 903,
                                columnNumber: 13
                            }, void 0)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 896,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 895,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildExpensesPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Operating expenses",
                title: "Expense requests",
                description: "Theo doi phi cleaning, maintenance, repair va utility theo vong doi approval."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 918,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'Counted expense',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.expenseReport.totalExpense),
                        note: 'Chi tinh APPROVED va PAID.'
                    },
                    {
                        label: 'Pending approval',
                        value: `${snapshot.expenseReport.pendingApprovalCount}`,
                        note: 'Can Admin review.'
                    },
                    {
                        label: 'Paid slips',
                        value: `${snapshot.expenseReport.paidCount}`,
                        note: 'Da thanh toan xong.'
                    },
                    {
                        label: 'Largest category',
                        value: 'Repair',
                        note: 'Chi phi repair dang chiem ty trong lon nhat trong ky.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 919,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Expense slips",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Code',
                        'Date',
                        'Category',
                        'Equipment',
                        'Amount',
                        'Status',
                        'Detail'
                    ],
                    rows: snapshot.dataset.operatingExpenses.map((expense)=>[
                            expense.code,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(expense.expenseDate),
                            expense.category,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEquipmentName"])(snapshot, expense.equipmentAssetId),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(expense.amount),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(expense.status),
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(expense.status)
                            }, expense.id, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 937,
                                columnNumber: 13
                            }, void 0),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                                href: `/expenses/${expense.id}`,
                                children: "Open slip"
                            }, `${expense.id}-detail`, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 940,
                                columnNumber: 13
                            }, void 0)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 929,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 928,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildExpenseDetailPage(expenseId) {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    const expense = snapshot.dataset.operatingExpenses.find((item)=>item.id === expenseId);
    if (!expense) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Expense detail",
                title: expense.code,
                description: `${expense.category} | ${expense.vendorName}`,
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                    href: "/expenses",
                    children: "Back to expenses"
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 960,
                    columnNumber: 134
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 960,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Expense summary",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KeyValueList"], {
                    items: [
                        {
                            label: 'Expense date',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(expense.expenseDate)
                        },
                        {
                            label: 'Vendor',
                            value: expense.vendorName
                        },
                        {
                            label: 'Equipment',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEquipmentName"])(snapshot, expense.equipmentAssetId)
                        },
                        {
                            label: 'Amount',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(expense.amount)
                        },
                        {
                            label: 'Description',
                            value: expense.description
                        },
                        {
                            label: 'Status',
                            value: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(expense.status),
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(expense.status)
                            }, void 0, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 969,
                                columnNumber: 38
                            }, void 0)
                        }
                    ]
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 962,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 961,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildEquipmentPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Assets",
                title: "Equipment register",
                description: "Danh muc thiet bi, tinh trang su dung va lich bao tri ke tiep."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 982,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'Assets tracked',
                        value: `${snapshot.dataset.equipmentAssets.length}`,
                        note: 'Tong so thiet bi trong registry.'
                    },
                    {
                        label: 'Need attention',
                        value: `${snapshot.dataset.equipmentAssets.filter((asset)=>asset.condition !== 'GOOD').length}`,
                        note: 'Asset can bao tri hoac thay the.'
                    },
                    {
                        label: 'Maintenance records',
                        value: `${snapshot.dataset.maintenanceRecords.length}`,
                        note: 'Tong event bao tri da ghi nhan.'
                    },
                    {
                        label: 'Open alerts',
                        value: `${snapshot.dashboard.maintenanceAlerts.length}`,
                        note: 'Can xu ly trong 14 ngay.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 983,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Equipment list",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Equipment',
                        'Purchased',
                        'Value',
                        'Condition',
                        'Next maintenance',
                        'Detail'
                    ],
                    rows: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sortEquipmentByMaintenance"])(snapshot.dataset.equipmentAssets).map((equipmentAsset)=>[
                            equipmentAsset.name,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(equipmentAsset.purchasedAt),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(equipmentAsset.purchaseValue),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(equipmentAsset.condition),
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(equipmentAsset.condition)
                            }, equipmentAsset.id, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 1003,
                                columnNumber: 13
                            }, void 0),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(equipmentAsset.nextMaintenanceAt),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                                href: `/equipment/${equipmentAsset.id}`,
                                children: "Open asset"
                            }, `${equipmentAsset.id}-detail`, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 1007,
                                columnNumber: 13
                            }, void 0)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 997,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 996,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildEquipmentDetailPage(equipmentId) {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    const equipmentAsset = snapshot.dataset.equipmentAssets.find((item)=>item.id === equipmentId);
    if (!equipmentAsset) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    const maintenanceRecords = snapshot.dataset.maintenanceRecords.filter((record)=>record.equipmentAssetId === equipmentId);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Equipment detail",
                title: equipmentAsset.name,
                description: equipmentAsset.note,
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                    href: "/equipment",
                    children: "Back to equipment"
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 1031,
                    columnNumber: 117
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1031,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Asset summary",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KeyValueList"], {
                    items: [
                        {
                            label: 'Code',
                            value: equipmentAsset.code
                        },
                        {
                            label: 'Purchased at',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(equipmentAsset.purchasedAt)
                        },
                        {
                            label: 'Purchase value',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(equipmentAsset.purchaseValue)
                        },
                        {
                            label: 'Condition',
                            value: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(equipmentAsset.condition),
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(equipmentAsset.condition)
                            }, void 0, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 1038,
                                columnNumber: 41
                            }, void 0)
                        },
                        {
                            label: 'Next maintenance',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(equipmentAsset.nextMaintenanceAt)
                        },
                        {
                            label: 'Note',
                            value: equipmentAsset.note
                        }
                    ]
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 1033,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1032,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Maintenance history",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Date',
                        'Vendor',
                        'Description',
                        'Amount'
                    ],
                    rows: maintenanceRecords.map((record)=>[
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(record.maintenanceDate),
                            record.vendorName,
                            record.description,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(record.amount)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 1046,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1045,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildMaintenancePage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Maintenance log",
                title: "Maintenance history",
                description: "Tat ca event bao tri, repair va recommendation replacement cho thiet bi."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1065,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Maintenance records",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Date',
                        'Equipment',
                        'Vendor',
                        'Description',
                        'Amount'
                    ],
                    rows: snapshot.dataset.maintenanceRecords.map((record)=>[
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(record.maintenanceDate),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEquipmentName"])(snapshot, record.equipmentAssetId),
                            record.vendorName,
                            record.description,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(record.amount)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 1067,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1066,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildRevenueReportPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Reports",
                title: "Revenue report",
                description: "Tong hop doanh thu membership va doanh thu retail tren cung mot dashboard."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1087,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'Total revenue',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.revenueReport.totalRevenue),
                        note: 'Membership + retail confirmed.'
                    },
                    {
                        label: 'Membership revenue',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.revenueReport.membershipRevenue),
                        note: 'Thu tu membership invoices.'
                    },
                    {
                        label: 'Service revenue',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.revenueReport.servicesRevenue),
                        note: 'Thu tu sales invoices.'
                    },
                    {
                        label: 'Invoice count',
                        value: `${snapshot.revenueReport.membershipInvoiceCount + snapshot.revenueReport.salesInvoiceCount}`,
                        note: 'Tong invoice da confirm.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1088,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 xl:grid-cols-[1fr_1fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Membership invoices",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'Code',
                                'Member',
                                'Date',
                                'Amount'
                            ],
                            rows: snapshot.dataset.membershipInvoices.map((invoice)=>[
                                    invoice.code,
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMemberName"])(snapshot, invoice.memberId),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(invoice.invoiceDate),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(invoice.totalAmount)
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 1099,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 1098,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Retail invoices",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'Code',
                                'Customer',
                                'Date',
                                'Amount'
                            ],
                            rows: snapshot.dataset.salesInvoices.filter((invoice)=>invoice.status === 'CONFIRMED').map((invoice)=>[
                                    invoice.code,
                                    invoice.customerName,
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(invoice.invoiceDate),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(invoice.totalAmount)
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 1110,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 1109,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1097,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildPayrollReportPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Reports",
                title: "Payroll report",
                description: "Tong chi luong PT, status approval va phan bo net pay theo trainer."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'Total payroll',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.payrollReport.totalPayroll),
                        note: 'Tong net pay toan bo history.'
                    },
                    {
                        label: 'Approved',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.payrollReport.approvedPayroll),
                        note: 'Da approved hoac paid.'
                    },
                    {
                        label: 'Pending',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.payrollReport.pendingPayroll),
                        note: 'Dang cho duyet.'
                    },
                    {
                        label: 'Entries',
                        value: `${snapshot.payrollReport.byTrainer.length}`,
                        note: 'So dong payroll trong dataset.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Payroll by trainer",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'PT',
                        'Period',
                        'Net pay',
                        'Status'
                    ],
                    rows: snapshot.payrollReport.byTrainer.map((item)=>[
                            item.ptName,
                            item.payrollPeriodCode,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(item.netPay),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatusTone"])(item.status),
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["humanizeStatus"])(item.status)
                            }, `${item.ptId}-${item.payrollPeriodId}`, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 1143,
                                columnNumber: 13
                            }, void 0)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 1137,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1136,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildInventoryReportPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Reports",
                title: "Inventory report",
                description: "Ton kho hien tai, top sellers va transaction flow trong ky."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1158,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'Stock value',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.inventoryOverview.stockValue),
                        note: 'Ton kho theo cost.'
                    },
                    {
                        label: 'Low stock count',
                        value: `${snapshot.inventoryOverview.lowStockCount}`,
                        note: 'SKU dang can canh bao.'
                    },
                    {
                        label: 'Products tracked',
                        value: `${snapshot.inventoryOverview.totalProducts}`,
                        note: 'Tong SKU dang active.'
                    },
                    {
                        label: 'Recent moves',
                        value: `${snapshot.inventoryOverview.recentTransactions.length}`,
                        note: '6 giao dich gan nhat.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1159,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 xl:grid-cols-[0.9fr_1.1fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Top sellers",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'Product',
                                'Sold qty',
                                'Current stock'
                            ],
                            rows: snapshot.inventoryOverview.topSellingProducts.map((entry)=>[
                                    entry.product.name,
                                    `${entry.soldQuantity}`,
                                    `${entry.product.stockOnHand}`
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 1169,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 1168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                        title: "Recent inventory transactions",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                            headers: [
                                'Date',
                                'Product',
                                'Type',
                                'Qty'
                            ],
                            rows: snapshot.inventoryOverview.recentTransactions.map((transaction)=>[
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(transaction.transactionDate),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductName"])(snapshot, transaction.productId),
                                    transaction.type,
                                    `${transaction.quantity}`
                                ])
                        }, void 0, false, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                            lineNumber: 1179,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                        lineNumber: 1178,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1167,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildExpenseReportPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Reports",
                title: "Expense report",
                description: "Chi phi van hanh theo category va trang thai approval."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1199,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'Counted expense',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.expenseReport.totalExpense),
                        note: 'Chi APPROVED + PAID.'
                    },
                    {
                        label: 'Pending approval',
                        value: `${snapshot.expenseReport.pendingApprovalCount}`,
                        note: 'Can duyet bo sung.'
                    },
                    {
                        label: 'Paid expense count',
                        value: `${snapshot.expenseReport.paidCount}`,
                        note: 'Da mark paid.'
                    },
                    {
                        label: 'Top category',
                        value: 'Repair',
                        note: 'Category co tong amount lon nhat hien tai.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1200,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Expense by category",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Category',
                        'Amount'
                    ],
                    rows: Object.entries(snapshot.expenseReport.byCategory).map(([category, amount])=>[
                            category,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(amount)
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 1209,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1208,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildProfitReportPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Reports",
                title: "Profit report",
                description: "Cong thuc: revenue - COGS - PT payroll - operating expense."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1223,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsGrid"], {
                items: [
                    {
                        label: 'Revenue',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.profitReport.totalRevenue),
                        note: 'Tong doanh thu confirmed.'
                    },
                    {
                        label: 'COGS',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.profitReport.cogs),
                        note: 'Gia von tu retail items da ban.'
                    },
                    {
                        label: 'PT payroll',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.profitReport.ptPayroll),
                        note: 'Ky payroll hien tai.'
                    },
                    {
                        label: 'Net profit',
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.profitReport.netProfit),
                        note: 'Ket qua sau khi tru chi phi va payroll.'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1224,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Profit formula",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KeyValueList"], {
                    items: [
                        {
                            label: 'Total revenue',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.profitReport.totalRevenue)
                        },
                        {
                            label: 'Minus COGS',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.profitReport.cogs)
                        },
                        {
                            label: 'Minus PT payroll',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.profitReport.ptPayroll)
                        },
                        {
                            label: 'Minus operating expense',
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.profitReport.operatingExpense)
                        },
                        {
                            label: 'Net result',
                            value: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold text-slate-950",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatCurrency"])(snapshot.profitReport.netProfit)
                            }, void 0, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                                lineNumber: 1239,
                                columnNumber: 42
                            }, void 0)
                        }
                    ]
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 1233,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1232,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildSettingsPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "System config",
                title: "Settings",
                description: "Cac tham so policy can Admin co the chinh sua trong he thong."
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1252,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "System configs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Key',
                        'Label',
                        'Value',
                        'Description'
                    ],
                    rows: snapshot.dataset.systemConfigs.map((config)=>[
                            config.key,
                            config.label,
                            config.value,
                            config.description
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 1254,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1253,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildLoginPage() {
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$lib$2f$gym$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getGymSnapshot"])();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                eyebrow: "Demo access",
                title: "Login reference",
                description: "MVP hien chua khoa route bang auth that. Tuy vay backend da co demo endpoint /auth/login de ban test workflow token.",
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: `${backendUrl}/api/docs`,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800",
                    children: "Open auth docs"
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 1279,
                    columnNumber: 11
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1274,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Demo accounts",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                    headers: [
                        'Role',
                        'Name',
                        'Email',
                        'Password'
                    ],
                    rows: snapshot.dataset.users.map((user)=>[
                            user.role,
                            user.fullName,
                            user.email,
                            user.passwordHint
                        ])
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 1291,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1290,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$gym$2d$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionCard"], {
                title: "Quick test",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                    className: "overflow-x-auto rounded-[1.25rem] bg-slate-950 p-4 text-sm leading-7 text-slate-100",
                    children: `POST ${backendUrl}/api/auth/login
{
  "email": "admin@gymmanager.local",
  "password": "demo123"
}`
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                    lineNumber: 1298,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx",
                lineNumber: 1297,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function renderGymRoute(slug) {
    if (slug.length === 0 || slug[0] === 'dashboard') {
        return buildDashboardPage();
    }
    if (slug[0] === 'login') {
        return buildLoginPage();
    }
    if (slug[0] === 'pts' && slug.length === 1) {
        return buildPtsPage();
    }
    if (slug[0] === 'pts' && slug[1] === 'attendance') {
        return buildAttendancePage();
    }
    if (slug[0] === 'pts' && slug.length === 2) {
        return buildPtDetailPage(slug[1]);
    }
    if (slug[0] === 'pts' && slug.length === 3 && slug[2] === 'contracts') {
        return buildPtContractsPage(slug[1]);
    }
    if (slug[0] === 'payroll' && slug.length === 1) {
        return buildPayrollPage();
    }
    if (slug[0] === 'payroll' && slug.length === 2) {
        return buildPayrollPeriodPage(slug[1]);
    }
    if (slug[0] === 'members' && slug.length === 1) {
        return buildMembersPage();
    }
    if (slug[0] === 'members' && slug[1] === 'memberships') {
        return buildMembershipOverviewPage();
    }
    if (slug[0] === 'members' && slug.length === 2) {
        return buildMemberDetailPage(slug[1]);
    }
    if (slug[0] === 'membership-plans') {
        return buildMembershipPlansPage();
    }
    if (slug[0] === 'membership-invoices') {
        return buildMembershipInvoicesPage();
    }
    if (slug[0] === 'products') {
        return buildProductsPage();
    }
    if (slug[0] === 'inventory' && slug.length === 1) {
        return buildInventoryPage();
    }
    if (slug[0] === 'inventory' && slug[1] === 'import') {
        return buildInventoryImportPage();
    }
    if (slug[0] === 'invoices' && slug.length === 1) {
        return buildInvoicesPage();
    }
    if (slug[0] === 'invoices' && slug.length === 2) {
        return buildInvoiceDetailPage(slug[1]);
    }
    if (slug[0] === 'expenses' && slug.length === 1) {
        return buildExpensesPage();
    }
    if (slug[0] === 'expenses' && slug.length === 2) {
        return buildExpenseDetailPage(slug[1]);
    }
    if (slug[0] === 'equipment' && slug.length === 1) {
        return buildEquipmentPage();
    }
    if (slug[0] === 'equipment' && slug.length === 2) {
        return buildEquipmentDetailPage(slug[1]);
    }
    if (slug[0] === 'maintenance') {
        return buildMaintenancePage();
    }
    if (slug[0] === 'reports' && slug[1] === 'revenue') {
        return buildRevenueReportPage();
    }
    if (slug[0] === 'reports' && slug[1] === 'payroll') {
        return buildPayrollReportPage();
    }
    if (slug[0] === 'reports' && slug[1] === 'inventory') {
        return buildInventoryReportPage();
    }
    if (slug[0] === 'reports' && slug[1] === 'expenses') {
        return buildExpenseReportPage();
    }
    if (slug[0] === 'reports' && slug[1] === 'profit') {
        return buildProfitReportPage();
    }
    if (slug[0] === 'settings') {
        return buildSettingsPage();
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
}
}),
"[project]/apps/nextjs-frontend/src/app/[locale]/[...slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GymRoutePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$render$2d$gym$2d$route$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/nextjs-frontend/src/components/gym/render-gym-route.tsx [app-rsc] (ecmascript)");
;
async function GymRoutePage({ params }) {
    const { slug } = await params;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$components$2f$gym$2f$render$2d$gym$2d$route$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["renderGymRoute"])(slug);
}
}),
"[project]/apps/nextjs-frontend/src/app/[locale]/[...slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/nextjs-frontend/src/app/[locale]/[...slug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__be64ab33._.js.map