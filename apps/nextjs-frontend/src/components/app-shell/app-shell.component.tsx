'use client';

import { type JSX, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation.ts';

type NavItem = {
  readonly href: string;
  readonly label: string;
  readonly iconClassName: string;
};

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return pathname === '/' || pathname === '/dashboard';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getNavigationByRole(t: (key: string) => string, role?: string): {
  readonly main: NavItem[];
  readonly secondary: NavItem[];
} {
  const mainNavigation: NavItem[] = [
    { href: '/dashboard', label: t('Dashboard'), iconClassName: 'pi pi-home' },
    { href: '/pts', label: t('PT'), iconClassName: 'pi pi-users' },
    { href: '/members', label: t('Members'), iconClassName: 'pi pi-id-card' },
    { href: '/membership-plans', label: t('Plans'), iconClassName: 'pi pi-ticket' },
    { href: '/products', label: t('Products'), iconClassName: 'pi pi-shopping-bag' },
    { href: '/expenses', label: t('Expenses'), iconClassName: 'pi pi-wallet' },
    { href: '/equipment', label: t('Equipment'), iconClassName: 'pi pi-cog' },
    { href: '/reports/revenue', label: t('Reports'), iconClassName: 'pi pi-chart-line' },
  ];

  const secondaryNavigation: NavItem[] = [
    { href: '/pts/attendance', label: t('Attendance'), iconClassName: 'pi pi-clock' },
    { href: '/payroll', label: t('Payroll'), iconClassName: 'pi pi-money-bill' },
    { href: '/members/memberships', label: t('SoldMemberships'), iconClassName: 'pi pi-calendar' },
    { href: '/member-assignments', label: t('Assignments'), iconClassName: 'pi pi-users' },
    { href: '/membership-invoices', label: t('MembershipInvoices'), iconClassName: 'pi pi-file' },
    { href: '/inventory', label: t('Inventory'), iconClassName: 'pi pi-box' },
    { href: '/invoices', label: t('SalesInvoices'), iconClassName: 'pi pi-receipt' },
    { href: '/maintenance', label: t('Maintenance'), iconClassName: 'pi pi-wrench' },
    { href: '/settings', label: t('Settings'), iconClassName: 'pi pi-sliders-h' },
  ];

  if (role === 'PT') {
    return {
      main: [{ href: '/pts/attendance', label: t('Attendance'), iconClassName: 'pi pi-clock' }],
      secondary: [{ href: '/payroll', label: t('MyPayroll'), iconClassName: 'pi pi-money-bill' }],
    };
  }

  if (!role) {
    return {
      main: [],
      secondary: [],
    };
  }

  return {
    main: mainNavigation,
    secondary: secondaryNavigation,
  };
}

function NavigationGroup({
  title,
  items,
  pathname,
}: {
  readonly title: string;
  readonly items: NavItem[];
  readonly pathname: string;
}): JSX.Element {
  return (
    <div>
      <p className="px-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{title}</p>
      <nav className="mt-3 space-y-1">
        {items.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${active
                ? 'bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.28)]'
                : 'text-slate-600 hover:bg-white/70 hover:text-slate-950'
                }`}
            >
              <span className={`text-sm ${item.iconClassName}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function AppShell({
  children,
  locale,
  currentUserName,
  currentUserRole,
  logoutAction,
}: {
  readonly children: ReactNode;
  readonly locale: string;
  readonly currentUserName?: string;
  readonly currentUserRole?: string;
  readonly logoutAction: (formData: FormData) => void;
}): JSX.Element {
  const pathname = usePathname();
  const tNav = useTranslations('Navigation');
  const tApp = useTranslations('AppShell');
  const navigation = getNavigationByRole(tNav, currentUserRole);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#fff7ed_100%)] lg:grid lg:grid-cols-[295px_minmax(0,1fr)]">
      <aside className="border-b border-white/60 bg-white/72 p-5 backdrop-blur lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-[0_25px_60px_rgba(15,23,42,0.32)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">Gym Manager</p>
          <h1 className="font-display mt-3 text-2xl font-semibold tracking-tight">{tApp('Title')}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {tApp('Subtitle')}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-orange-100">NestJS API</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-100">Next.js App</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100">Shared contracts</span>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {navigation.main.length > 0 ? <NavigationGroup title={tApp('GroupPrimary')} items={navigation.main} pathname={pathname} /> : null}
          {navigation.secondary.length > 0 ? (
            <NavigationGroup title={tApp('GroupOperations')} items={navigation.secondary} pathname={pathname} />
          ) : null}
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-white/60 bg-white/62 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{tApp('Workspace')}</p>
              <p className="font-display mt-1 text-xl font-semibold text-slate-950">Gym Management System v2.1</p>
              {currentUserName ? (
                <p className="mt-1 text-sm text-slate-600">
                  {currentUserName} ({currentUserRole})
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                {tApp('WorkspaceTag')}
              </span>
              <Link
                href={pathname}
                locale={locale === 'vi' ? 'en' : 'vi'}
                className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-sm font-semibold text-indigo-600 transition hover:bg-slate-50"
              >
                {tApp('SwitchLocale')}
              </Link>
              {currentUserName ? (
                <form action={logoutAction}>
                  <input type="hidden" name="locale" value={locale} />
                  <button
                    type="submit"
                    className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    {tApp('Logout')}
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  {tApp('Login')}
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
