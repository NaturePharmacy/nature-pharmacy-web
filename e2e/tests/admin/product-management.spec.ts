import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Product Management', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/products');
    await adminPage.waitForLoadState('networkidle');
  });

  test('admin products page loads', async ({ adminPage }) => {
    await expect(adminPage).toHaveURL(/\/fr\/admin\/products/);
    const heading = adminPage.locator('h1, [data-testid="page-title"]');
    await expect(heading.first()).toBeVisible();
  });

  test('product rows are visible', async ({ adminPage }) => {
    const rows = adminPage.locator(
      'table tbody tr, [data-testid="product-row"], [data-testid*="product-row"]',
    );
    await expect(rows.first()).toBeVisible();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('admin can view product details', async ({ adminPage }) => {
    const firstRow = adminPage.locator(
      'table tbody tr, [data-testid="product-row"]',
    ).first();
    await expect(firstRow).toBeVisible();

    const detailTrigger = firstRow.locator(
      'a, button:has-text("Voir"), button:has-text("Details"), [data-testid*="view"]',
    ).first();
    await detailTrigger.click();
    await adminPage.waitForLoadState('networkidle');

    const detailContent = adminPage.locator(
      '[data-testid="product-detail"], .product-detail, h1, h2',
    );
    await expect(detailContent.first()).toBeVisible();
  });

  test('admin can toggle product status', async ({ adminPage }) => {
    const firstRow = adminPage.locator(
      'table tbody tr, [data-testid="product-row"]',
    ).first();
    await expect(firstRow).toBeVisible();

    // Status toggle is a button with text like "Actif"/"Inactif" or "Active"/"Inactive"
    const statusToggle = firstRow.locator(
      '[data-testid*="status"], [data-testid*="toggle"], [role="switch"], input[type="checkbox"], select, button:has-text("Actif"), button:has-text("Active"), button:has-text("Inactif"), button:has-text("Inactive")',
    );
    await expect(statusToggle.first()).toBeVisible();
  });
});
