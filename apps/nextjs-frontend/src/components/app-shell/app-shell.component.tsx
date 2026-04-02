'use client';

import { type JSX, type ReactNode, useEffect, useState } from 'react';
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
  const adminMainNavigation: NavItem[] = [
    { href: '/dashboard', label: t('Dashboard'), iconClassName: 'pi pi-home' },
    { href: '/pts', label: t('PT'), iconClassName: 'pi pi-users' },
    { href: '/members', label: t('Members'), iconClassName: 'pi pi-id-card' },
    { href: '/membership-plans', label: t('Plans'), iconClassName: 'pi pi-ticket' },
    { href: '/products', label: t('Products'), iconClassName: 'pi pi-shopping-bag' },
    { href: '/reports/revenue', label: t('Reports'), iconClassName: 'pi pi-chart-line' },
  ];

  const adminSecondaryNavigation: NavItem[] = [
    { href: '/pts/attendance', label: t('Attendance'), iconClassName: 'pi pi-clock' },
    { href: '/payroll', label: t('Payroll'), iconClassName: 'pi pi-money-bill' },
    { href: '/members/memberships', label: t('SoldMemberships'), iconClassName: 'pi pi-calendar' },
    { href: '/member-assignments', label: t('Assignments'), iconClassName: 'pi pi-users' },
    { href: '/membership-invoices', label: t('MembershipInvoices'), iconClassName: 'pi pi-file' },
    { href: '/inventory', label: t('Inventory'), iconClassName: 'pi pi-box' },
    { href: '/invoices', label: t('SalesInvoices'), iconClassName: 'pi pi-receipt' },
    { href: '/settings', label: t('Settings'), iconClassName: 'pi pi-sliders-h' },
  ];

  const staffMainNavigation: NavItem[] = [
    { href: '/dashboard', label: t('Dashboard'), iconClassName: 'pi pi-home' },
    { href: '/pts', label: t('PT'), iconClassName: 'pi pi-users' },
    { href: '/members', label: t('Members'), iconClassName: 'pi pi-id-card' },
    { href: '/membership-plans', label: t('Plans'), iconClassName: 'pi pi-ticket' },
    { href: '/products', label: t('Products'), iconClassName: 'pi pi-shopping-bag' },
    { href: '/reports/revenue', label: t('Reports'), iconClassName: 'pi pi-chart-line' },
  ];

  const staffSecondaryNavigation: NavItem[] = [
    { href: '/pts/attendance', label: t('Attendance'), iconClassName: 'pi pi-clock' },
    { href: '/payroll', label: t('Payroll'), iconClassName: 'pi pi-money-bill' },
    { href: '/members/memberships', label: t('SoldMemberships'), iconClassName: 'pi pi-calendar' },
    { href: '/member-assignments', label: t('Assignments'), iconClassName: 'pi pi-users' },
    { href: '/membership-invoices', label: t('MembershipInvoices'), iconClassName: 'pi pi-file' },
    { href: '/inventory', label: t('Inventory'), iconClassName: 'pi pi-box' },
    { href: '/invoices', label: t('SalesInvoices'), iconClassName: 'pi pi-receipt' },
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

  if (role === 'STAFF') {
    return {
      main: staffMainNavigation,
      secondary: staffSecondaryNavigation,
    };
  }

  return {
    main: adminMainNavigation,
    secondary: adminSecondaryNavigation,
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
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${active
                ? 'bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.28)]'
                : 'text-slate-600 hover:bg-white/70 hover:text-slate-950'
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70`}
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = globalThis.localStorage.getItem('gym-theme');
    const preferredDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolvedTheme = savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : (preferredDark ? 'dark' : 'light');

    setTheme(resolvedTheme);
    document.documentElement.dataset.theme = resolvedTheme;
  }, []);

  const toggleTheme = (): void => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    globalThis.localStorage.setItem('gym-theme', nextTheme);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#fff7ed_100%)] lg:grid lg:grid-cols-[295px_minmax(0,1fr)]">
      <aside className="border-b border-white/60 bg-white/72 p-5 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-[0_25px_60px_rgba(15,23,42,0.32)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">Gym Manager</p>
          <h1 className="font-display mt-3 text-2xl font-semibold tracking-tight">{tApp('Title')}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {tApp('Subtitle')}
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {navigation.main.length > 0 ? <NavigationGroup title={tApp('GroupPrimary')} items={navigation.main} pathname={pathname} /> : null}
          {navigation.secondary.length > 0 ? (
            <NavigationGroup title={tApp('GroupOperations')} items={navigation.secondary} pathname={pathname} />
          ) : null}
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/72 px-4 py-4 backdrop-blur lg:px-8">
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
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? tApp('ThemeLight') : tApp('ThemeDark')}
              </button>
              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                {tApp('WorkspaceTag')}
              </span>
              {currentUserName ? (
                <form action={logoutAction}>
                  <input type="hidden" name="locale" value={locale} />
                  <button
                    type="submit"
                    className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70"
                  >
                    {tApp('Logout')}
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70"
                >
                  {tApp('Login')}
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
          {navigation.main.length > 0 ? (
            <nav className="-mx-1 flex gap-2 overflow-x-auto pb-2 lg:hidden" aria-label="Điều hướng nhanh">
              {navigation.main.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={`quick-${item.href}`}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`shrink-0 rounded-full border px-3 py-2 text-sm font-medium transition ${active
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
