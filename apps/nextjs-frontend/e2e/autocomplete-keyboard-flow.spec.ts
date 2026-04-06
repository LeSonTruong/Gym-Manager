import process from 'node:process';
import { type Locator, type Page, expect, test } from '@playwright/test';

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

        const candidate = candidates[candidateIndex];

        if (!candidate) {
            return false;
        }

        const loggedIn = await tryLoginCandidate(candidate);

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

async function openDisableMembershipPlanPanel(page: Page): Promise<Locator> {
    const disablePlanSection = page
        .locator('section')
        .filter({ hasText: 'Ngừng bán gói tập' })
        .first();
    const detailsElement = disablePlanSection.locator('details').first();
    const openAttribute = await detailsElement.getAttribute('open');

    if (openAttribute !== null) {
        return detailsElement;
    }

    await detailsElement.locator('summary').click();

    return detailsElement;
}

async function getTrimmedTextContent(locator: Locator): Promise<string> {
    const textContent = await locator.textContent();

    return textContent?.trim() ?? '';
}

test.describe('Autocomplete Keyboard Flow', () => {
    test('supports Arrow/Home/End/Enter/Escape and keeps highlighted option visible', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/vi/membership-plans');
        const disablePlanPanel = await openDisableMembershipPlanPanel(page);

        const planIdInput = disablePlanPanel.locator('input[name="planId"]').first();
        const combobox = disablePlanPanel.getByPlaceholder('Gõ mã hoặc tên gói để chọn');

        await expect(planIdInput).toHaveValue('');
        await expect(combobox).toBeVisible();

        const listboxId = await combobox.getAttribute('aria-controls');

        expect(listboxId, 'Expected combobox to expose an aria-controls id').toBeTruthy();

        const listbox = page.locator(
            `ul[role="listbox"][id="${listboxId ?? ''}"]`,
        );

        await combobox.focus();
        await expect(listbox).toBeVisible();

        const optionRows = listbox.locator('li[role="option"]');
        const optionButtons = optionRows.locator('button');
        const optionCount = await optionButtons.count();

        expect(optionCount).toBeGreaterThan(1);

        const firstOptionLabel = await getTrimmedTextContent(optionButtons.first());
        const secondOptionLabel = await getTrimmedTextContent(optionButtons.nth(1));
        const lastOptionLabel = await getTrimmedTextContent(
            optionButtons.nth(optionCount - 1),
        );

        await expect(
            listbox.locator('li[role="option"][aria-selected="true"]').first(),
        ).toContainText(firstOptionLabel);

        await combobox.press('ArrowDown');
        await expect(
            listbox.locator('li[role="option"][aria-selected="true"]').first(),
        ).toContainText(secondOptionLabel);

        await combobox.press('End');
        await expect(
            listbox.locator('li[role="option"][aria-selected="true"]').first(),
        ).toContainText(lastOptionLabel);

        const highlightedOptionInView = await listbox.evaluate((element) => {
            const selectedOption = element.querySelector<HTMLElement>(
                'li[role="option"][aria-selected="true"]',
            );

            if (!selectedOption) {
                return false;
            }

            const selectedTop = selectedOption.offsetTop;
            const selectedBottom = selectedTop + selectedOption.offsetHeight;
            const viewTop = element.scrollTop;
            const viewBottom = viewTop + element.clientHeight;

            return selectedTop >= viewTop && selectedBottom <= viewBottom;
        });

        expect(highlightedOptionInView).toBeTruthy();

        await combobox.press('Home');
        await expect(
            listbox.locator('li[role="option"][aria-selected="true"]').first(),
        ).toContainText(firstOptionLabel);

        const selectedLabelBeforeEnter = await getTrimmedTextContent(
            listbox
                .locator('li[role="option"][aria-selected="true"] button')
                .first(),
        );

        await combobox.press('Enter');
        await expect(listbox).toBeHidden();
        await expect(combobox).toHaveValue(selectedLabelBeforeEnter);
        await expect(planIdInput).not.toHaveValue('');

        await combobox.focus();
        await combobox.press('ArrowDown');
        await expect(listbox).toBeVisible();
        await combobox.press('Escape');
        await expect(listbox).toBeHidden();

        await combobox.fill('abcdef');
        await combobox.focus();
        await combobox.press('Home');

        const cursorAtStart = await combobox.evaluate((element) => {
            if (!(element instanceof HTMLInputElement)) {
                return -1;
            }

            return element.selectionStart;
        });

        expect(cursorAtStart).toBe(0);

        await combobox.press('End');

        const cursorAtEnd = await combobox.evaluate((element) => {
            if (!(element instanceof HTMLInputElement)) {
                return false;
            }

            return element.selectionStart === element.value.length;
        });

        expect(cursorAtEnd).toBeTruthy();

        await combobox.fill('|');
        await expect(listbox).toBeVisible();

        const activeOptionButton = listbox
            .locator('li[role="option"][aria-selected="true"] button')
            .first();
        const highlightedSegmentCount = await activeOptionButton
            .locator('span.font-semibold')
            .count();

        expect(highlightedSegmentCount).toBeGreaterThanOrEqual(2);
    });
});
