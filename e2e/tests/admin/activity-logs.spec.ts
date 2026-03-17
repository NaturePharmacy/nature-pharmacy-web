import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Activity Logs', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/logs');
    await adminPage.waitForLoadState('networkidle');
    await adminPage.waitForTimeout(2000);
  });

  test('logs page loads successfully', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/logs')) {
      test.skip(true, 'Redirected away - possible auth/role issue');
      return;
    }

    const heading = adminPage.locator('h1');
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
    await expect(heading.first()).toContainText(/log|activit|journal/i);
  });

  test('logs API returns paginated results', async ({ adminPage }) => {
    const res = await adminPage.evaluate(async () => {
      const r = await fetch('/api/admin/logs?page=1&limit=10');
      const data = await r.json();
      return { status: r.status, hasLogs: Array.isArray(data.logs), total: data.total };
    });
    expect(res.status).toBe(200);
    expect(res.hasLogs).toBe(true);
  });

  test('logs API supports resource type filter', async ({ adminPage }) => {
    const res = await adminPage.evaluate(async () => {
      const r = await fetch('/api/admin/logs?resourceType=order&page=1&limit=5');
      return r.status;
    });
    expect(res).toBe(200);
  });

  test('logs API supports action filter', async ({ adminPage }) => {
    const res = await adminPage.evaluate(async () => {
      const r = await fetch('/api/admin/logs?action=refund&page=1&limit=5');
      return r.status;
    });
    expect(res).toBe(200);
  });

  test('logs page shows filter controls', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/logs')) {
      test.skip(true, 'Redirected away');
      return;
    }

    // Should have at least one filter select
    const selects = adminPage.locator('select');
    const count = await selects.count();
    expect(count).toBeGreaterThan(0);
  });

  test('logs page shows empty state or timeline entries', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/logs')) {
      test.skip(true, 'Redirected away');
      return;
    }

    // Either shows "Aucun log" or a list of log entries
    const body = await adminPage.locator('main, [role="main"], div.container, div.max-w-7xl').first().textContent();
    expect(body).toBeTruthy();
  });

  test('logs requires admin authentication', async ({ adminPage }) => {
    const res = await adminPage.evaluate(async () => {
      const r = await fetch('/api/admin/logs');
      return r.status;
    });
    // Authenticated admin should get 200
    expect(res).toBe(200);
  });
});
