import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Category Management', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/categories');
    await adminPage.waitForLoadState('networkidle');
  });

  test('categories page loads', async ({ adminPage }) => {
    await expect(adminPage).toHaveURL(/\/fr\/admin\/categories/);
    const heading = adminPage.locator('h1, [data-testid="page-title"]');
    await expect(heading.first()).toBeVisible();
  });

  test('category rows are visible', async ({ adminPage }) => {
    const rows = adminPage.locator(
      'table tbody tr, [data-testid="category-row"], [data-testid*="category-row"], .category-item',
    );
    await expect(rows.first()).toBeVisible();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('add category button is visible', async ({ adminPage }) => {
    const addButton = adminPage.locator(
      'button:has-text("Ajouter"), button:has-text("Nouvelle"), button:has-text("Add"), [data-testid="add-category"], [data-testid*="add"]',
    );
    await expect(addButton.first()).toBeVisible();
  });

  test('admin can click add category button', async ({ adminPage }) => {
    const addButton = adminPage.locator(
      'button:has-text("Ajouter"), button:has-text("Nouvelle"), button:has-text("Add"), [data-testid="add-category"], [data-testid*="add"]',
    );
    await addButton.first().click();

    const formOrModal = adminPage.locator(
      'form, [role="dialog"], .modal, [data-testid="category-form"], [data-testid*="modal"]',
    );
    await expect(formOrModal.first()).toBeVisible();
  });
});
