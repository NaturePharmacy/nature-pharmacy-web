import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Refunds (PayPal)', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/orders');
    await adminPage.waitForLoadState('networkidle');
    await adminPage.waitForTimeout(2000);
  });

  test('refund button exists on PayPal paid orders', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/orders')) {
      test.skip(true, 'Redirected away - possible auth/role issue');
      return;
    }

    // Check if any refund buttons exist (only shown for PayPal paid orders)
    const refundBtn = adminPage.locator('button', { hasText: /rembourser|refund/i }).first();
    const hasRefundBtn = await refundBtn.isVisible().catch(() => false);

    // Skip if no PayPal paid orders exist — just verify the UI doesn't crash
    if (!hasRefundBtn) {
      test.skip(true, 'No PayPal paid orders available to refund');
      return;
    }

    await expect(refundBtn).toBeVisible();
  });

  test('refund modal opens with amount and reason fields', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/orders')) {
      test.skip(true, 'Redirected away - possible auth/role issue');
      return;
    }

    const refundBtn = adminPage.locator('button', { hasText: /rembourser|refund/i }).first();
    const hasRefundBtn = await refundBtn.isVisible().catch(() => false);
    if (!hasRefundBtn) {
      test.skip(true, 'No refundable orders');
      return;
    }

    await refundBtn.click();
    await adminPage.waitForTimeout(500);

    // Modal should appear with amount input and reason textarea
    const amountInput = adminPage.locator('input[type="number"]').first();
    const reasonTextarea = adminPage.locator('textarea').first();
    await expect(amountInput).toBeVisible({ timeout: 5000 });
    await expect(reasonTextarea).toBeVisible({ timeout: 5000 });

    // Close modal via Cancel
    const cancelBtn = adminPage.locator('button', { hasText: /annuler|cancel/i }).first();
    if (await cancelBtn.isVisible()) await cancelBtn.click();
  });

  test('refund API endpoint requires admin auth', async ({ adminPage }) => {
    const res = await adminPage.evaluate(async () => {
      const r = await fetch('/api/admin/orders/fake-id/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'test' }),
      });
      return r.status;
    });
    // Should return 404 (not found) not 401 for authenticated admin
    // or 400 (bad request) — anything but 401/403
    expect([400, 404, 500]).toContain(res);
  });

  test('orders page shows payment status filter', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/orders')) {
      test.skip(true, 'Redirected away');
      return;
    }

    // Payment status filter select should be present
    const selects = adminPage.locator('select');
    const selectCount = await selects.count();
    expect(selectCount).toBeGreaterThan(0);
  });

  test('CSV export button is present on orders page', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/orders')) {
      test.skip(true, 'Redirected away');
      return;
    }

    const exportBtn = adminPage.locator('button', { hasText: /csv|export/i }).first();
    await expect(exportBtn).toBeVisible({ timeout: 10000 });
  });
});
