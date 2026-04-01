(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/nextjs-frontend/src/i18n/routing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "routing",
    ()=>routing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [app-client] (ecmascript) <export default as defineRouting>");
;
const routing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__["defineRouting"])({
    // A list of all locales that are supported
    locales: [
        'vi'
    ],
    // Used when no locale matches
    defaultLocale: 'vi'
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/nextjs-frontend/src/i18n/navigation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$client$2f$createNavigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/navigation/react-client/createNavigation.js [app-client] (ecmascript) <export default as createNavigation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$i18n$2f$routing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/nextjs-frontend/src/i18n/routing.ts [app-client] (ecmascript)");
;
;
const { Link, redirect, usePathname, useRouter, getPathname } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$client$2f$createNavigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__["createNavigation"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$i18n$2f$routing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["routing"]);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppShell",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/nextjs-frontend/src/i18n/navigation.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function isActivePath(pathname, href) {
    if (href === '/dashboard') {
        return pathname === '/' || pathname === '/dashboard';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
}
function getNavigationByRole(t, role) {
    const adminMainNavigation = [
        {
            href: '/dashboard',
            label: t('Dashboard'),
            iconClassName: 'pi pi-home'
        },
        {
            href: '/pts',
            label: t('PT'),
            iconClassName: 'pi pi-users'
        },
        {
            href: '/members',
            label: t('Members'),
            iconClassName: 'pi pi-id-card'
        },
        {
            href: '/membership-plans',
            label: t('Plans'),
            iconClassName: 'pi pi-ticket'
        },
        {
            href: '/products',
            label: t('Products'),
            iconClassName: 'pi pi-shopping-bag'
        },
        {
            href: '/expenses',
            label: t('Expenses'),
            iconClassName: 'pi pi-wallet'
        },
        {
            href: '/equipment',
            label: t('Equipment'),
            iconClassName: 'pi pi-cog'
        },
        {
            href: '/reports/revenue',
            label: t('Reports'),
            iconClassName: 'pi pi-chart-line'
        }
    ];
    const adminSecondaryNavigation = [
        {
            href: '/pts/attendance',
            label: t('Attendance'),
            iconClassName: 'pi pi-clock'
        },
        {
            href: '/payroll',
            label: t('Payroll'),
            iconClassName: 'pi pi-money-bill'
        },
        {
            href: '/members/memberships',
            label: t('SoldMemberships'),
            iconClassName: 'pi pi-calendar'
        },
        {
            href: '/member-assignments',
            label: t('Assignments'),
            iconClassName: 'pi pi-users'
        },
        {
            href: '/membership-invoices',
            label: t('MembershipInvoices'),
            iconClassName: 'pi pi-file'
        },
        {
            href: '/inventory',
            label: t('Inventory'),
            iconClassName: 'pi pi-box'
        },
        {
            href: '/invoices',
            label: t('SalesInvoices'),
            iconClassName: 'pi pi-receipt'
        },
        {
            href: '/maintenance',
            label: t('Maintenance'),
            iconClassName: 'pi pi-wrench'
        },
        {
            href: '/settings',
            label: t('Settings'),
            iconClassName: 'pi pi-sliders-h'
        }
    ];
    const staffMainNavigation = [
        {
            href: '/dashboard',
            label: t('Dashboard'),
            iconClassName: 'pi pi-home'
        },
        {
            href: '/members',
            label: t('Members'),
            iconClassName: 'pi pi-id-card'
        },
        {
            href: '/expenses',
            label: t('Expenses'),
            iconClassName: 'pi pi-wallet'
        },
        {
            href: '/reports/revenue',
            label: t('Reports'),
            iconClassName: 'pi pi-chart-line'
        }
    ];
    const staffSecondaryNavigation = [
        {
            href: '/pts/attendance',
            label: t('Attendance'),
            iconClassName: 'pi pi-clock'
        },
        {
            href: '/payroll',
            label: t('Payroll'),
            iconClassName: 'pi pi-money-bill'
        },
        {
            href: '/members/memberships',
            label: t('SoldMemberships'),
            iconClassName: 'pi pi-calendar'
        },
        {
            href: '/member-assignments',
            label: t('Assignments'),
            iconClassName: 'pi pi-users'
        },
        {
            href: '/membership-invoices',
            label: t('MembershipInvoices'),
            iconClassName: 'pi pi-file'
        },
        {
            href: '/inventory',
            label: t('Inventory'),
            iconClassName: 'pi pi-box'
        },
        {
            href: '/invoices',
            label: t('SalesInvoices'),
            iconClassName: 'pi pi-receipt'
        },
        {
            href: '/maintenance',
            label: t('Maintenance'),
            iconClassName: 'pi pi-wrench'
        }
    ];
    if (role === 'PT') {
        return {
            main: [
                {
                    href: '/pts/attendance',
                    label: t('Attendance'),
                    iconClassName: 'pi pi-clock'
                }
            ],
            secondary: [
                {
                    href: '/payroll',
                    label: t('MyPayroll'),
                    iconClassName: 'pi pi-money-bill'
                }
            ]
        };
    }
    if (!role) {
        return {
            main: [],
            secondary: []
        };
    }
    if (role === 'STAFF') {
        return {
            main: staffMainNavigation,
            secondary: staffSecondaryNavigation
        };
    }
    return {
        main: adminMainNavigation,
        secondary: adminSecondaryNavigation
    };
}
function NavigationGroup({ title, items, pathname }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400",
                children: title
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "mt-3 space-y-1",
                children: items.map((item)=>{
                    const active = isActivePath(pathname, item.href);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                        href: item.href,
                        "aria-current": active ? 'page' : undefined,
                        className: `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${active ? 'bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.28)]' : 'text-slate-600 hover:bg-white/70 hover:text-slate-950'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-sm ${item.iconClassName}`
                            }, void 0, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                lineNumber: 119,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                lineNumber: 120,
                                columnNumber: 15
                            }, this)
                        ]
                    }, item.href, true, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                        lineNumber: 110,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
_c = NavigationGroup;
function AppShell({ children, locale, currentUserName, currentUserRole, logoutAction }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const tNav = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('Navigation');
    const tApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('AppShell');
    const navigation = getNavigationByRole(tNav, currentUserRole);
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('light');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppShell.useEffect": ()=>{
            const savedTheme = globalThis.localStorage.getItem('gym-theme');
            const preferredDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
            const resolvedTheme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : preferredDark ? 'dark' : 'light';
            setTheme(resolvedTheme);
            document.documentElement.dataset.theme = resolvedTheme;
        }
    }["AppShell.useEffect"], []);
    const toggleTheme = ()=>{
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        document.documentElement.dataset.theme = nextTheme;
        globalThis.localStorage.setItem('gym-theme', nextTheme);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#fff7ed_100%)] lg:grid lg:grid-cols-[295px_minmax(0,1fr)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "border-b border-white/60 bg-white/72 p-5 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-[0_25px_60px_rgba(15,23,42,0.32)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-semibold uppercase tracking-[0.28em] text-orange-300",
                                children: "Gym Manager"
                            }, void 0, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "font-display mt-3 text-2xl font-semibold tracking-tight",
                                children: tApp('Title')
                            }, void 0, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                lineNumber: 172,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-3 text-sm leading-6 text-slate-300",
                                children: tApp('Subtitle')
                            }, void 0, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 space-y-6",
                        children: [
                            navigation.main.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavigationGroup, {
                                title: tApp('GroupPrimary'),
                                items: navigation.main,
                                pathname: pathname
                            }, void 0, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                lineNumber: 179,
                                columnNumber: 41
                            }, this) : null,
                            navigation.secondary.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavigationGroup, {
                                title: tApp('GroupOperations'),
                                items: navigation.secondary,
                                pathname: pathname
                            }, void 0, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                lineNumber: 181,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "sticky top-0 z-20 border-b border-white/60 bg-white/72 px-4 py-4 backdrop-blur lg:px-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs font-semibold uppercase tracking-[0.24em] text-slate-500",
                                            children: tApp('Workspace')
                                        }, void 0, false, {
                                            fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                            lineNumber: 190,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-display mt-1 text-xl font-semibold text-slate-950",
                                            children: "Gym Management System v2.1"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                            lineNumber: 191,
                                            columnNumber: 15
                                        }, this),
                                        currentUserName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-slate-600",
                                            children: [
                                                currentUserName,
                                                " (",
                                                currentUserRole,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                            lineNumber: 193,
                                            columnNumber: 17
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                    lineNumber: 189,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70",
                                            onClick: toggleTheme,
                                            children: theme === 'dark' ? tApp('ThemeLight') : tApp('ThemeDark')
                                        }, void 0, false, {
                                            fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                            lineNumber: 199,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600",
                                            children: tApp('WorkspaceTag')
                                        }, void 0, false, {
                                            fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                            lineNumber: 206,
                                            columnNumber: 15
                                        }, this),
                                        currentUserName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                            action: logoutAction,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "hidden",
                                                    name: "locale",
                                                    value: locale
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                                    lineNumber: 211,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "submit",
                                                    className: "rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70",
                                                    children: tApp('Logout')
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                            lineNumber: 210,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                            href: "/login",
                                            className: "rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70",
                                            children: tApp('Login')
                                        }, void 0, false, {
                                            fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                            lineNumber: 220,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                    lineNumber: 198,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                            lineNumber: 188,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8",
                        children: [
                            navigation.main.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "-mx-1 flex gap-2 overflow-x-auto pb-2 lg:hidden",
                                "aria-label": "Điều hướng nhanh",
                                children: navigation.main.map((item)=>{
                                    const active = isActivePath(pathname, item.href);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                        href: item.href,
                                        "aria-current": active ? 'page' : undefined,
                                        className: `shrink-0 rounded-full border px-3 py-2 text-sm font-medium transition ${active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-50'}`,
                                        children: item.label
                                    }, `quick-${item.href}`, false, {
                                        fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                        lineNumber: 238,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                                lineNumber: 233,
                                columnNumber: 13
                            }, this) : null,
                            children
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                        lineNumber: 231,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/nextjs-frontend/src/components/app-shell/app-shell.component.tsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
}
_s(AppShell, "iBqCL9CzYuaIw4NTFPnNU/it7aI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"]
    ];
});
_c1 = AppShell;
var _c, _c1;
__turbopack_context__.k.register(_c, "NavigationGroup");
__turbopack_context__.k.register(_c1, "AppShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/nextjs-frontend/src/providers/react-query/react-query.provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReactQueryProvider",
    ()=>ReactQueryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query-devtools/build/modern/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function ReactQueryProvider({ children }) {
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReactQueryProvider.useMemo[queryClient]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]()
    }["ReactQueryProvider.useMemo[queryClient]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReactQueryDevtools"], {
                initialIsOpen: false
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/providers/react-query/react-query.provider.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            " ",
            children
        ]
    }, void 0, true, {
        fileName: "[project]/apps/nextjs-frontend/src/providers/react-query/react-query.provider.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_s(ReactQueryProvider, "zrvdoGfdEL4xQ2X6q2pwq9Tfz78=");
_c = ReactQueryProvider;
var _c;
__turbopack_context__.k.register(_c, "ReactQueryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/nextjs-frontend/src/providers/toast/toast.provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastContext",
    ()=>ToastContext,
    "ToastProvider",
    ()=>ToastProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$primereact$2f$toast$2f$toast$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/primereact/toast/toast.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const defaultToastLife = 3000;
const ToastContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(()=>{});
_c = ToastContext;
function ToastProvider({ children }) {
    _s();
    const toastRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const showToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[showToast]": (options)=>{
            options.life ??= defaultToastLife;
            toastRef?.current?.show(options);
        }
    }["ToastProvider.useCallback[showToast]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastContext, {
        value: showToast,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$primereact$2f$toast$2f$toast$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toast"], {
                ref: toastRef
            }, void 0, false, {
                fileName: "[project]/apps/nextjs-frontend/src/providers/toast/toast.provider.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/apps/nextjs-frontend/src/providers/toast/toast.provider.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_s(ToastProvider, "1P8ra1q0BKD9aTYhcGSX0/wWoXE=");
_c1 = ToastProvider;
var _c, _c1;
__turbopack_context__.k.register(_c, "ToastContext");
__turbopack_context__.k.register(_c1, "ToastProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/nextjs-frontend/src/providers/zod-error/utils/create-zod-error-map-util.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createZodErrorMap",
    ()=>createZodErrorMap
]);
const createZodErrorMap = (t)=>{
    // eslint-disable-next-line complexity
    const errorMap = (issue)=>{
        switch(issue.code){
            case 'invalid_type':
                {
                    if (issue.received === 'undefined' || issue.received === 'null') {
                        return t('required');
                    }
                    return t('invalidType', {
                        expected: String(issue.expected),
                        received: String(issue.received)
                    });
                }
            case 'invalid_format':
                {
                    // Handles email, url, and other string validations in v4
                    if (issue.format === 'email') {
                        return t('invalidEmail');
                    }
                    if (issue.format === 'url') {
                        return t('invalidUrl');
                    }
                    return t('invalidFormat');
                }
            case 'too_small':
                {
                    if (issue.type === 'string') {
                        return t('tooShort', {
                            minimum: String(issue.minimum)
                        });
                    }
                    if (issue.type === 'number') {
                        return t('numberTooSmall', {
                            minimum: Number(issue.minimum)
                        });
                    }
                    return undefined;
                }
            case 'too_big':
                {
                    if (issue.type === 'string') {
                        return t('tooLong', {
                            maximum: String(issue.maximum)
                        });
                    }
                    if (issue.type === 'number') {
                        return t('numberTooLarge', {
                            maximum: Number(issue.maximum)
                        });
                    }
                    return undefined;
                }
            case 'invalid_value':
                {
                    // Handles literal values, enums, etc. in v4
                    return t('invalidValue');
                }
            case 'unrecognized_keys':
                {
                    return t('unrecognizedKeys', {
                        keys: issue.keys.join(', ')
                    });
                }
            case 'invalid_union':
                {
                    return t('invalidUnion');
                }
            case 'not_multiple_of':
                {
                    return t('notMultipleOf', {
                        multipleOf: Number(issue.multipleOf)
                    });
                }
            case 'custom':
                {
                    return issue.message ?? t('customError');
                }
            case 'invalid_key':
            case 'invalid_element':
                {
                    return undefined;
                }
        }
    };
    return errorMap;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/nextjs-frontend/src/providers/zod-error/zod-error.provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ZodErrorProvider",
    ()=>ZodErrorProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/use-intl/dist/esm/development/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$providers$2f$zod$2d$error$2f$utils$2f$create$2d$zod$2d$error$2d$map$2d$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/nextjs-frontend/src/providers/zod-error/utils/create-zod-error-map-util.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function ZodErrorProvider({ children }) {
    _s();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('validation');
    const locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ZodErrorProvider.useEffect": ()=>{
            // Set the global Zod error map using z.config() in v4
            const errorMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2d$frontend$2f$src$2f$providers$2f$zod$2d$error$2f$utils$2f$create$2d$zod$2d$error$2d$map$2d$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createZodErrorMap"])(t);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].config({
                customError: errorMap
            });
        }
    }["ZodErrorProvider.useEffect"], [
        t,
        locale
    ]);
    return children;
}
_s(ZodErrorProvider, "1fNC7FJ/sizaSwgwl1gvX8VdCpg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c = ZodErrorProvider;
var _c;
__turbopack_context__.k.register(_c, "ZodErrorProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_nextjs-frontend_src_12f4ae41._.js.map