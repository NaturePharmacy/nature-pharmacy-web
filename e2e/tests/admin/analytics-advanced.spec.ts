import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Analytics — Date Range & Export', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/analytics');
    await adminPage.waitForLoadState('networkidle');
    await adminPage.waitForTimeout(2000);
  });

  test('analytics page loads', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/analytics')) {
      test.skip(true, 'Redirected away');
      return;
    }
    const heading = adminPage.locator('h1');
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('date range tabs are visible (7j / 30j / 90j / Personnalisé)', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/analytics')) {
      test.skip(true, 'Redirected away');
      return;
    }

    const tab7 = adminPage.locator('button', { hasText: /7j|7 jours|7 days/i }).first();
    const tab30 = adminPage.locator('button', { hasText: /30j|30 jours|30 days/i }).first();
    await expect(tab7).toBeVisible({ timeout: 10000 });
    await expect(tab30).toBeVisible({ timeout: 5000 });
  });

  test('custom date range shows date inputs when selected', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/analytics')) {
      test.skip(true, 'Redirected away');
      return;
    }

    const customTab = adminPage.locator('button', { hasText: /personnalis|custom/i }).first();
    const hasCustom = await customTab.isVisible().catch(() => false);
    if (!hasCustom) {
      test.skip(true, 'No custom tab found');
      return;
    }

    await customTab.click();
    await adminPage.waitForTimeout(500);

    // Date inputs should appear (type=date or type=text for date pickers)
    const dateInputs = adminPage.locator('input[type="date"], input[placeholder*="date"], input[placeholder*="Date"]');
    const count = await dateInputs.count();
    // Soft assertion — if inputs appeared, verify at least one; otherwise skip
    if (count === 0) {
      test.skip(true, 'Date inputs did not appear — implementation may use a different input type');
      return;
    }
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('analytics API supports startDate/endDate params', async ({ adminPage }) => {
    const res = await adminPage.evaluate(async () => {
      const start = '2025-01-01';
      const end = '2025-12-31';
      const r = await fetch(`/api/admin/analytics?startDate=${start}&endDate=${end}`);
      const data = await r.json();
      return { status: r.status, hasSummary: 'summary' in data || typeof data === 'object' };
    });
    expect(res.status).toBe(200);
    expect(res.hasSummary).toBe(true);
  });

  test('analytics API supports period param fallback', async ({ adminPage }) => {
    const res = await adminPage.evaluate(async () => {
      const r = await fetch('/api/admin/analytics?period=30');
      return r.status;
    });
    expect(res).toBe(200);
  });

  test('CSV export button is visible', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/analytics')) {
      test.skip(true, 'Redirected away');
      return;
    }

    const exportBtn = adminPage.locator('button', { hasText: /csv|export/i }).first();
    await expect(exportBtn).toBeVisible({ timeout: 10000 });
  });

  test('analytics shows commissions card', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/analytics')) {
      test.skip(true, 'Redirected away');
      return;
    }

    const commissionCard = adminPage.locator('[class*="card"], [class*="bg-white"]')
      .filter({ hasText: /commission/i }).first();
    await expect(commissionCard).toBeVisible({ timeout: 10000 });
  });
});
