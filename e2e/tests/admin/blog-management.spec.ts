import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Blog Management', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/blog');
    await adminPage.waitForLoadState('networkidle');
  });

  test('blog admin page loads', async ({ adminPage }) => {
    await expect(adminPage).toHaveURL(/\/fr\/admin\/blog/);
    const heading = adminPage.locator('h1, [data-testid="page-title"]');
    await expect(heading.first()).toBeVisible();
  });

  test('blog post rows visible or empty state shown', async ({ adminPage }) => {
    const rows = adminPage.locator(
      'table tbody tr, [data-testid="blog-row"], [data-testid*="blog-row"], .blog-item',
    );
    const emptyState = adminPage.locator(
      '[data-testid="empty-state"], .empty-state, :text("aucun"), :text("Aucun"), :text("No posts")',
    );

    const hasRows = (await rows.count()) > 0;
    const hasEmpty = (await emptyState.count()) > 0;
    expect(hasRows || hasEmpty).toBeTruthy();
  });

  test('create new post button exists', async ({ adminPage }) => {
    const createButton = adminPage.locator(
      'button:has-text("Cr"), button:has-text("Nouveau"), button:has-text("Ajouter"), button:has-text("New"), button:has-text("Add"), [data-testid="create-post"], [data-testid*="add"], a:has-text("Nouveau")',
    );
    await expect(createButton.first()).toBeVisible();
  });
});
