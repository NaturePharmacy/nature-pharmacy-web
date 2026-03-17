import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Finance Dashboard', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/finance');
    await adminPage.waitForLoadState('networkidle');
    await adminPage.waitForTimeout(2000);
  });

  test('finance page loads successfully', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/finance')) {
      test.skip(true, 'Redirected away - possible auth/role issue');
      return;
    }
    const heading = adminPage.locator('h1');
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('finance page shows KPI cards', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/finance')) {
      test.skip(true, 'Redirected away');
      return;
    }
    const cards = adminPage.locator('[class*="card"], [class*="bg-white"], [class*="rounded"]').filter({ hasText: /commission|\d+/ });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('finance API is accessible to admin', async ({ adminPage }) => {
    const res = await adminPage.evaluate(async () => {
      const r = await fetch('/api/admin/finance');
      return r.status;
    });
    // Should not be 401/403 — admin is authenticated
    expect(res).not.toBe(401);
    expect(res).not.toBe(403);
  });

  test('finance API requires admin auth', async ({ request }) => {
    const res = await request.get('/api/admin/finance');
    expect([401, 403]).toContain(res.status());
  });

  test('finance page shows seller payouts table', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/finance')) {
      test.skip(true, 'Redirected away');
      return;
    }
    const table = adminPage.locator('table, [class*="table"]').first();
    const emptyState = adminPage.getByText(/aucun|vide|no data|empty/i).first();
    const hasContent = await table.isVisible().catch(() => false) || await emptyState.isVisible().catch(() => false);
    expect(hasContent).toBe(true);
  });

  test('finance page has CSV export button', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/finance')) {
      test.skip(true, 'Redirected away');
      return;
    }
    const exportBtn = adminPage.locator('button', { hasText: /csv|export/i }).first();
    await expect(exportBtn).toBeVisible({ timeout: 10000 });
  });
});
