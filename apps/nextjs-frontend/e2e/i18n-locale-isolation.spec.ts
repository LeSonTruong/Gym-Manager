import process from 'node:process';
import { type Page, expect, test } from '@playwright/test';

type RouteCheck = {
  path: string;
  en: string[];
};

const demoEmail = process.env.GYM_FRONTEND_DEMO_EMAIL ?? 'admin@gymmanager.local';
const demoPassword = process.env.GYM_FRONTEND_DEMO_PASSWORD ?? 'demo123';

async function loginAsAdmin(page: Page): Promise<void> {
  const backendUrl = process.env.GYM_BACKEND_URL
    ?? process.env.NEXT_PUBLIC_BACKEND_URL
    ?? 'http://127.0.0.1:4000';

  const candidates = [
    { email: demoEmail, password: demoPassword },
    { email: 'admin@gymmanager.local', password: 'demo123' },
    { email: 'staff@gymmanager.local', password: 'demo123' },
  ];

  const tryCandidate = async (index: number): Promise<void> => {
    if (index >= candidates.length) {
      throw new Error('Unable to login via API with known demo credentials');
    }

    const candidate = candidates[index];

    const loginResponse = await page.request.post(`${backendUrl}/api/auth/login`, {
      data: {
        email: candidate.email,
        password: candidate.password,
      },
    });

    if (!loginResponse.ok()) {
      await tryCandidate(index + 1);
      return;
    }

    const loginPayload = (await loginResponse.json()) as {
      data: { refreshToken: string };
    };

    await page.context().addCookies([
      {
        name: 'gym_refresh_token',
        value: loginPayload.data.refreshToken,
        url: 'http://localhost:3000',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ]);

    await page.goto('/vi/dashboard');
  };

  await tryCandidate(0);
}

async function navigateAsAdminToRoute(page: Page, routePath: string): Promise<void> {
  const tryNavigateAt = async (attempt: number): Promise<void> => {
    if (attempt >= 2) {
      throw new Error(`Unable to open ${routePath} with an authenticated session`);
    }

    await page.goto(routePath);

    if (/\/vi\/login$/i.test(page.url())) {
      await loginAsAdmin(page);
      await tryNavigateAt(attempt + 1);
    }
  };

  await tryNavigateAt(0);
}

const routeChecks: RouteCheck[] = [
  { path: '/vi/dashboard', en: ['gym operations', 'dashboard overview'] },
  { path: '/vi/pts', en: ['pt management', 'personal trainers'] },
  // /vi/pts/attendance is PT-only; skip for ADMIN users
  { path: '/vi/payroll', en: ['payroll periods', 'payroll by trainer'] },
  { path: '/vi/members', en: ['member management', 'member roster'] },
  { path: '/vi/members/memberships', en: ['membership lifecycle', 'sold memberships'] },
  { path: '/vi/member-assignments', en: ['member assignments', 'assignments log'] },
  { path: '/vi/membership-plans', en: ['membership plans', 'plan catalog'] },
  { path: '/vi/membership-invoices', en: ['membership invoices', 'membership invoice list'] },
  { path: '/vi/products', en: ['products', 'product list'] },
  { path: '/vi/inventory', en: ['inventory transactions', 'inventory ledger'] },
  { path: '/vi/inventory/import', en: ['import tracker', 'import transactions'] },
  { path: '/vi/invoices', en: ['service invoices', 'sales invoices'] },
  { path: '/vi/reports/revenue', en: ['revenue report', 'total revenue'] },
  { path: '/vi/reports/payroll', en: ['payroll report', 'payroll by trainer'] },
  { path: '/vi/reports/inventory', en: ['inventory report', 'top sellers'] },
  { path: '/vi/reports/expenses', en: ['expense report', 'expense by category'] },
  { path: '/vi/reports/profit', en: ['profit report', 'profit formula'] },
  { path: '/vi/settings', en: ['settings', 'system configs'] },
];

const removedLegacyRoutePaths = ['/vi/expenses', '/vi/equipment', '/vi/maintenance'];

async function runRouteChecks(
  page: Page,
  checks: RouteCheck[],
  runCheck: (check: RouteCheck) => Promise<void>,
  index = 0,
): Promise<void> {
  if (index >= checks.length) {
    return;
  }

  await runCheck(checks[index]);
  await runRouteChecks(page, checks, runCheck, index + 1);
}

async function runLegacyRouteChecks(
  page: Page,
  routes: string[],
  index = 0,
): Promise<void> {
  if (index >= routes.length) {
    return;
  }

  const routePath = routes[index];
  const response = await page.goto(routePath);

  expect(response, `Expected a response for ${routePath}`).not.toBeNull();
  expect(response?.status(), `Expected ${routePath} to be unavailable`).toBe(404);

  await runLegacyRouteChecks(page, routes, index + 1);
}

test.describe('Locale Isolation', () => {
  test('vi login should stay fully Vietnamese', async ({ page }) => {
    await page.goto('/vi/login');
    const main = page.locator('body');

    await expect(main).not.toContainText(/build error|export translatefromtext doesn't exist/i);
    await expect(main).not.toContainText(/secure access/i);
    await expect(main).not.toContainText(/login form/i);
    await expect(main).toContainText(/đăng nhập an toàn|biểu mẫu đăng nhập/i);
  });

  test('all vi module routes should stay localized', async ({ page }) => {
    await loginAsAdmin(page);

    await runRouteChecks(page, routeChecks, async (check) => {
      await navigateAsAdminToRoute(page, check.path);
      const main = page.locator('body');

      await expect(main).not.toContainText(/build error|export translatefromtext doesn't exist/i);
      await Promise.all(check.en.map(async phrase => expect(main).not.toContainText(new RegExp(phrase, 'i'))));
    });
  });

  test('legacy hidden modules should return 404', async ({ page }) => {
    await loginAsAdmin(page);
    await runLegacyRouteChecks(page, removedLegacyRoutePaths);
  });
});
