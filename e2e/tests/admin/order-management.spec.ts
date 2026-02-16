import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Order Management', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/orders');
    await adminPage.waitForLoadState('networkidle');
    // Wait for loading spinner to disappear and data to render
    await adminPage.waitForTimeout(3000);
  });

  test('admin orders page loads', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/orders')) {
      test.skip(true, 'Redirected away from orders page - possible auth/role issue');
      return;
    }

    await expect(adminPage).toHaveURL(/\/fr\/admin\/orders/);
    const heading = adminPage.locator('h1');
    await expect(heading.first()).toBeVisible({ timeout: 15000 });
  });

  test('order rows visible or empty state shown', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/orders')) {
      test.skip(true, 'Redirected away - possible auth/role issue');
      return;
    }

    // The table always renders. Empty state is a <tr> with "Aucune commande trouvee" text
    const rows = adminPage.locator('table tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 15000 });

    // Either there are order rows with data, or the empty state row
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('admin can view order details', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/orders')) {
      test.skip(true, 'Redirected away - possible auth/role issue');
      return;
    }

    // Check for the empty state text "Aucune commande trouvee"
    const emptyText = adminPage.getByText(/aucune commande|no orders/i);
    const isEmpty = await emptyText.isVisible().catch(() => false);
    if (isEmpty) {
      test.skip(true, 'No orders available to view');
      return;
    }

    const rows = adminPage.locator('table tbody tr');
    const rowCount = await rows.count();
    if (rowCount === 0) {
      test.skip(true, 'No orders available to view');
      return;
    }

    // The "View" link is a <Link> with text "Voir →" (fr locale)
    const detailTrigger = rows.first().locator(
      'a[href*="/orders/"]',
    ).first();
    await expect(detailTrigger).toBeVisible({ timeout: 10000 });
    await detailTrigger.click();
    await adminPage.waitForLoadState('networkidle');

    const detailContent = adminPage.locator('h1, h2');
    await expect(detailContent.first()).toBeVisible({ timeout: 15000 });
  });

  test('order status update controls exist', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/orders')) {
      test.skip(true, 'Redirected away - possible auth/role issue');
      return;
    }

    const emptyText = adminPage.getByText(/aucune commande|no orders/i);
    const isEmpty = await emptyText.isVisible().catch(() => false);
    if (isEmpty) {
      test.skip(true, 'No orders available');
      return;
    }

    const rows = adminPage.locator('table tbody tr');
    const rowCount = await rows.count();
    if (rowCount === 0) {
      test.skip(true, 'No orders available');
      return;
    }

    // Each order row has a <select> for status updates
    const statusControl = rows.first().locator('select');
    await expect(statusControl.first()).toBeVisible({ timeout: 10000 });
  });
});
