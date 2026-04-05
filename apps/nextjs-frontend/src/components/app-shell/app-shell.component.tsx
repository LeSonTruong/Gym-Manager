'use client';

import { type JSX, type ReactNode, useEffect, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation.ts';

type ThemeMode = 'light' | 'dark';
type ThemePreset = 'professional' | 'energetic';

const defaultTheme: ThemeMode = 'light';
const defaultPreset: ThemePreset = 'professional';
const themeStorageKey = 'gym-theme';
const presetStorageKey = 'gym-preset';
const appearanceChangeEventName = 'gym-appearance-change';
const themeTransitionDurationMs = 180;
const themeTransitionOverlayId = 'gym-theme-transition-overlay';

function getThemeSnapshot(): ThemeMode {
  if (globalThis.window === undefined) {
    return defaultTheme;
  }

  const savedTheme = globalThis.localStorage.getItem(themeStorageKey);

  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getServerThemeSnapshot(): ThemeMode {
  return defaultTheme;
}

function getPresetSnapshot(): ThemePreset {
  if (globalThis.window === undefined) {
    return defaultPreset;
  }

  const savedPreset = globalThis.localStorage.getItem(presetStorageKey);

  if (savedPreset === 'professional' || savedPreset === 'energetic') {
    return savedPreset;
  }

  return defaultPreset;
}

function getServerPresetSnapshot(): ThemePreset {
  return defaultPreset;
}

function runThemeCrossFade(): void {
  if (globalThis.window === undefined) {
    return;
  }

  if (globalThis.window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  document.querySelector<HTMLDivElement>(`#${themeTransitionOverlayId}`)?.remove();

  const rootStyles = globalThis.window.getComputedStyle(document.documentElement);
  const bodyStyles = globalThis.window.getComputedStyle(document.body);
  const shellBackground = rootStyles.getPropertyValue('--shell-bg').trim();
  const overlay = document.createElement('div');

  overlay.id = themeTransitionOverlayId;
  overlay.setAttribute('aria-hidden', 'true');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '9999';
  overlay.style.opacity = '1';
  overlay.style.willChange = 'opacity';
  overlay.style.transition = `opacity ${themeTransitionDurationMs}ms ease`;
  overlay.style.background = shellBackground || bodyStyles.background || bodyStyles.backgroundColor;

  document.body.append(overlay);

  globalThis.window.requestAnimationFrame(() => {
    overlay.style.opacity = '0';
  });

  globalThis.window.setTimeout(() => {
    overlay.remove();
  }, themeTransitionDurationMs + 80);
}

function subscribeAppearance(onStoreChange: () => void): () => void {
  if (globalThis.window === undefined) {
    return () => undefined;
  }

  const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');

  const onMediaChange = (): void => {
    onStoreChange();
  };

  const onStorageChange = (event: StorageEvent): void => {
    if (
      event.key === null
      || event.key === themeStorageKey
      || event.key === presetStorageKey
    ) {
      onStoreChange();
    }
  };

  mediaQuery.addEventListener('change', onMediaChange);
  globalThis.window.addEventListener('storage', onStorageChange);
  globalThis.window.addEventListener(appearanceChangeEventName, onMediaChange);

  return () => {
    mediaQuery.removeEventListener('change', onMediaChange);
    globalThis.window.removeEventListener('storage', onStorageChange);
    globalThis.window.removeEventListener(appearanceChangeEventName, onMediaChange);
  };
}

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
    { href: '/settings', label: t('Settings'), iconClassName: 'pi pi-sliders-h' },
  ];

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
  readonly logoutAction: (formData: FormData) => void | Promise<void>;
}): JSX.Element {
  const pathname = usePathname();
  const tNav = useTranslations('Navigation');
  const tApp = useTranslations('AppShell');
  const navigation = getNavigationByRole(tNav, currentUserRole);
  const theme = useSyncExternalStore(
    subscribeAppearance,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const preset = useSyncExternalStore(
    subscribeAppearance,
    getPresetSnapshot,
    getServerPresetSnapshot,
  );

  useEffect(() => {
    if (globalThis.window === undefined) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.preset = preset;
    globalThis.window.localStorage.setItem(themeStorageKey, theme);
    globalThis.window.localStorage.setItem(presetStorageKey, preset);
  }, [theme, preset]);

  const toggleTheme = (): void => {
    if (globalThis.window === undefined) {
      return;
    }

    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';

    runThemeCrossFade();
    globalThis.window.localStorage.setItem(themeStorageKey, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    globalThis.window.dispatchEvent(new Event(appearanceChangeEventName));
  };

  const applyPreset = (nextPreset: ThemePreset): void => {
    if (globalThis.window === undefined) {
      return;
    }

    globalThis.window.localStorage.setItem(presetStorageKey, nextPreset);
    document.documentElement.dataset.preset = nextPreset;
    globalThis.window.dispatchEvent(new Event(appearanceChangeEventName));
  };

  return (
    <div className="min-h-screen [background:var(--shell-bg)] lg:grid lg:grid-cols-[308px_minmax(0,1fr)]">
      <aside className="border-b border-white/60 bg-white/74 p-5 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="rounded-[1.9rem] bg-[linear-gradient(145deg,#020617_0%,#0f172a_52%,#1e293b_100%)] p-5 text-white shadow-[0_28px_64px_rgba(15,23,42,0.34)]">
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
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/72 px-4 py-4 backdrop-blur-xl lg:px-8">
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
              <div className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/92 p-1 shadow-sm">
                <button
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide transition ${preset === 'professional'
                    ? 'bg-[var(--accent-600)] text-white shadow-[0_10px_24px_rgba(15,23,42,0.2)]'
                    : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => {
                    applyPreset('professional');
                  }}
                >
                  {tApp('PresetProfessional')}
                </button>
                <button
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide transition ${preset === 'energetic'
                    ? 'bg-[var(--accent-600)] text-white shadow-[0_10px_24px_rgba(15,23,42,0.2)]'
                    : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => {
                    applyPreset('energetic');
                  }}
                >
                  {tApp('PresetEnergetic')}
                </button>
              </div>
              <button
                type="button"
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/92 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                onClick={toggleTheme}
              >
                <span className={`pi ${theme === 'dark' ? 'pi-sun' : 'pi-moon'} text-[11px] text-[var(--accent-600)] transition group-hover:rotate-12`} />
                {theme === 'dark' ? tApp('ThemeLight') : tApp('ThemeDark')}
              </button>
              <span className="rounded-full border border-slate-200/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {tApp('WorkspaceTag')}
              </span>
              {currentUserName ? (
                <form action={logoutAction}>
                  <input type="hidden" name="locale" value={locale} />
                  <button
                    type="submit"
                    className="rounded-full bg-[linear-gradient(120deg,#0f172a_0%,#1e293b_60%,#334155_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.24)] transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  >
                    {tApp('Logout')}
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full bg-[var(--accent-600)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.24)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
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
                      ? 'border-slate-900 bg-[linear-gradient(120deg,#0f172a_0%,#1e293b_100%)] text-white shadow-[0_10px_24px_rgba(15,23,42,0.24)]'
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
