import process from 'node:process';
import { type Page, expect, test } from '@playwright/test';

type RouteCheck = {
  path: string;
  en: string[];
};

type LoginCandidate = {
  username: string;
  password: string;
};

const demoUsername =
  process.env.GYM_FRONTEND_DEMO_USERNAME
  ?? process.env.GYM_FRONTEND_DEMO_EMAIL
  ?? 'admin';
const demoPassword = process.env.GYM_FRONTEND_DEMO_PASSWORD ?? 'demo123';

async function delay(milliseconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function normalizeBackendUrl(value: string): string {
  return value
    .replace(/\/+$/v, '')
    .replace(/\/api$/iv, '');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getRefreshToken(payload: unknown): string {
  if (!isRecord(payload) || !isRecord(payload.data)) {
    throw new TypeError('Invalid login payload structure');
  }

  const { refreshToken } = payload.data;

  if (typeof refreshToken !== 'string') {
    throw new TypeError('Missing refresh token in login payload');
  }

  return refreshToken;
}

async function loginAsAdmin(page: Page): Promise<void> {
  const backendUrl = normalizeBackendUrl(
    process.env.GYM_BACKEND_URL
    ?? process.env.NEXT_PUBLIC_BACKEND_URL
    ?? 'http://127.0.0.1:4000',
  );
  const loginUrl = `${backendUrl}/api/auth/login`;
  const healthUrl = `${backendUrl}/api/health`;

  const candidates: LoginCandidate[] = [
    { username: demoUsername, password: demoPassword },
    { username: 'admin', password: 'demo123' },
    { username: 'staff', password: 'demo123' },
  ];

  const failureSignals: string[] = [];

  const tryLoginCandidate = async (candidate: LoginCandidate): Promise<boolean> => {
    try {
      const loginResponse = await page.request.post(loginUrl, {
        data: {
          username: candidate.username,
          password: candidate.password,
        },
      });

      if (!loginResponse.ok()) {
        failureSignals.push(
          `${candidate.username}:${loginResponse.status()}`,
        );
        return false;
      }

      const refreshToken = getRefreshToken(await loginResponse.json());

      await page.context().addCookies([
        {
          name: 'gym_refresh_token',
          value: refreshToken,
          url: 'http://localhost:3000',
          httpOnly: true,
          sameSite: 'Lax',
        },
      ]);

      await page.goto('/vi/dashboard');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failureSignals.push(`${candidate.username}:request-error:${message}`);
      return false;
    }
  };

  const loginWithRetries = async (
    round = 0,
    candidateIndex = 0,
  ): Promise<boolean> => {
    if (round >= 4) {
      return false;
    }

    if (candidateIndex >= candidates.length) {
      await delay(250 * (round + 1));
      return loginWithRetries(round + 1, 0);
    }

    const loggedIn = await tryLoginCandidate(candidates[candidateIndex]);

    if (loggedIn) {
      return true;
    }

    return loginWithRetries(round, candidateIndex + 1);
  };

  await waitForBackendReady(page, healthUrl);

  const loginSucceeded = await loginWithRetries();

  if (loginSucceeded) {
    return;
  }

  const detail = failureSignals.slice(-6).join(', ');
  throw new Error(`Unable to login via API with known demo credentials. ${detail}`);
}

async function waitForBackendReady(
  page: Page,
  healthUrl: string,
  attempt = 0,
): Promise<void> {
  if (attempt >= 8) {
    return;
  }

  try {
    const healthResponse = await page.request.get(healthUrl);

    if (healthResponse.ok()) {
      return;
    }
  } catch {
    // Ignore transient startup errors and retry shortly.
  }

  await delay(250);
  await waitForBackendReady(page, healthUrl, attempt + 1);
}

async function navigateAsAdminToRoute(page: Page, routePath: string): Promise<void> {
  const tryNavigateAt = async (attempt: number): Promise<void> => {
    if (attempt >= 2) {
      throw new Error(`Unable to open ${routePath} with an authenticated session`);
    }

    await page.goto(routePath);

    if (/\/vi\/login$/iv.test(page.url())) {
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

    await expect(main).not.toContainText(/build error|export translatefromtext doesn't exist/iv);
    await expect(main).not.toContainText(/secure access/iv);
    await expect(main).not.toContainText(/login form/iv);
    await expect(main).toContainText(/đăng nhập an toàn|biểu mẫu đăng nhập/iv);
  });

  test('all vi module routes should stay localized', async ({ page }) => {
    await loginAsAdmin(page);

    await runRouteChecks(page, routeChecks, async (check) => {
      await navigateAsAdminToRoute(page, check.path);
      const main = page.locator('body');

      await expect(main).not.toContainText(/build error|export translatefromtext doesn't exist/iv);
      await Promise.all(check.en.map(async phrase => expect(main).not.toContainText(new RegExp(phrase, 'iv'))));
    });
  });

  test('legacy hidden modules should return 404', async ({ page }) => {
    await loginAsAdmin(page);
    await runLegacyRouteChecks(page, removedLegacyRoutePaths);
  });
});
