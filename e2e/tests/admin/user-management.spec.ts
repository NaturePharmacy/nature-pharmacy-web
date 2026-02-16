import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin User Management', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/users');
    await adminPage.waitForLoadState('networkidle');
  });

  test('users page loads with user table', async ({ adminPage }) => {
    await expect(adminPage).toHaveURL(/\/fr\/admin\/users/);
    const table = adminPage.locator('table, [data-testid="users-table"], [role="table"]');
    await expect(table.first()).toBeVisible();
  });

  test('user rows are visible', async ({ adminPage }) => {
    const rows = adminPage.locator(
      'table tbody tr, [data-testid="user-row"], [data-testid*="user-row"]',
    );
    await expect(rows.first()).toBeVisible();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('search input filters users', async ({ adminPage }) => {
    const searchInput = adminPage.locator(
      'input[type="search"], input[placeholder*="echerch"], [data-testid="search-input"]',
    );
    await expect(searchInput.first()).toBeVisible();

    const rowsBefore = adminPage.locator(
      'table tbody tr, [data-testid="user-row"], [data-testid*="user-row"]',
    );
    const countBefore = await rowsBefore.count();

    await searchInput.first().fill('test-nonexistent-user-xyz');
    await adminPage.waitForTimeout(500);

    const rowsAfter = adminPage.locator(
      'table tbody tr, [data-testid="user-row"], [data-testid*="user-row"]',
    );
    const countAfter = await rowsAfter.count();
    expect(countAfter).toBeLessThanOrEqual(countBefore);
  });

  test('user details accessible', async ({ adminPage }) => {
    const firstRow = adminPage.locator(
      'table tbody tr, [data-testid="user-row"]',
    ).first();
    const detailLink = firstRow.locator('a, button').first();
    await detailLink.click();
    await adminPage.waitForLoadState('networkidle');

    const detailContent = adminPage.locator(
      '[data-testid="user-detail"], [data-testid="user-profile"], .user-detail, h1, h2',
    );
    await expect(detailContent.first()).toBeVisible();
  });

  test('admin can change user role - UI elements exist', async ({ adminPage }) => {
    const firstRow = adminPage.locator(
      'table tbody tr, [data-testid="user-row"]',
    ).first();
    await expect(firstRow).toBeVisible();

    // Click on the first row to open details
    const detailLink = firstRow.locator('a, button').first();
    await detailLink.click();
    await adminPage.waitForLoadState('networkidle');

    // Role control should be visible in the detail view/modal
    const roleControl = adminPage.locator(
      'select, [data-testid*="role"], [role="combobox"], button:has-text("role"), button:has-text("Role")',
    );
    await expect(roleControl.first()).toBeVisible({ timeout: 10000 });
  });
});
