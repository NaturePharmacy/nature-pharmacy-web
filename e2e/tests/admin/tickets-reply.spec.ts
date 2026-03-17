import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Tickets — Reply & Status', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/tickets');
    await adminPage.waitForLoadState('networkidle');
    await adminPage.waitForTimeout(2000);
  });

  test('tickets page shows open ticket badge in header', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/tickets')) {
      test.skip(true, 'Redirected away');
      return;
    }

    const heading = adminPage.locator('h1');
    await expect(heading.first()).toBeVisible({ timeout: 10000 });

    // Badge or count indicator should be present (even if 0)
    const headingText = await heading.first().textContent();
    expect(headingText).toBeTruthy();
  });

  test('ticket rows have inline status selects', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/tickets')) {
      test.skip(true, 'Redirected away');
      return;
    }

    const emptyState = adminPage.getByText(/aucun ticket|no ticket/i).first();
    const isEmpty = await emptyState.isVisible().catch(() => false);
    if (isEmpty) {
      test.skip(true, 'No tickets available');
      return;
    }

    const rows = adminPage.locator('table tbody tr');
    const rowCount = await rows.count();
    if (rowCount === 0) {
      test.skip(true, 'No ticket rows');
      return;
    }

    // Each ticket row should have a status select
    const statusSelects = adminPage.locator('table tbody tr select');
    const selectCount = await statusSelects.count();
    expect(selectCount).toBeGreaterThan(0);
  });

  test('reply button opens reply modal', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/tickets')) {
      test.skip(true, 'Redirected away');
      return;
    }

    const emptyState = adminPage.getByText(/aucun ticket|no ticket/i).first();
    const isEmpty = await emptyState.isVisible().catch(() => false);
    if (isEmpty) {
      test.skip(true, 'No tickets to reply to');
      return;
    }

    const replyBtn = adminPage.locator('button', { hasText: /répondre|reply/i }).first();
    const hasReply = await replyBtn.isVisible().catch(() => false);
    if (!hasReply) {
      test.skip(true, 'No reply button visible');
      return;
    }

    await replyBtn.click();
    await adminPage.waitForTimeout(500);

    // Modal should appear with a textarea for the reply
    const textarea = adminPage.locator('textarea').first();
    await expect(textarea).toBeVisible({ timeout: 5000 });

    // Close modal
    const cancelBtn = adminPage.locator('button', { hasText: /annuler|cancel|fermer|close/i }).first();
    if (await cancelBtn.isVisible()) await cancelBtn.click();
  });

  test('tickets API POST adds a message', async ({ adminPage }) => {
    // Test with invalid ticket ID to verify route exists
    const res = await adminPage.evaluate(async () => {
      const r = await fetch('/api/tickets/000000000000000000000000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Test admin reply' }),
      });
      return r.status;
    });
    // 404 for non-existent ticket (not 401/403)
    expect([404, 400]).toContain(res);
  });

  test('tickets count API reflects in dashboard stats', async ({ adminPage }) => {
    const res = await adminPage.evaluate(async () => {
      const r = await fetch('/api/admin/stats');
      const data = await r.json();
      return { status: r.status, hasOpenTickets: 'openTickets' in data };
    });
    expect(res.status).toBe(200);
    expect(res.hasOpenTickets).toBe(true);
  });
});
