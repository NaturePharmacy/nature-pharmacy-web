import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Shipping Zones', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/shipping');
    await adminPage.waitForLoadState('networkidle');
  });

  test('shipping page loads', async ({ adminPage }) => {
    await expect(adminPage).toHaveURL(/\/fr\/admin\/shipping/);
    const heading = adminPage.locator('h1, [data-testid="page-title"]');
    await expect(heading.first()).toBeVisible();
  });

  test('zone rows visible or empty state shown', async ({ adminPage }) => {
    const rows = adminPage.locator(
      'table tbody tr, [data-testid="zone-row"], [data-testid*="zone-row"], .zone-item',
    );
    const emptyState = adminPage.locator(
      '[data-testid="empty-state"], .empty-state, :text("aucun"), :text("Aucun"), :text("No zones")',
    );

    const hasRows = (await rows.count()) > 0;
    const hasEmpty = (await emptyState.count()) > 0;
    expect(hasRows || hasEmpty).toBeTruthy();
  });

  test('add zone controls exist', async ({ adminPage }) => {
    const addButton = adminPage.locator(
      'button:has-text("Ajouter"), button:has-text("Nouvelle"), button:has-text("Add"), button:has-text("New"), [data-testid="add-zone"], [data-testid*="add"]',
    );
    await expect(addButton.first()).toBeVisible();
    await addButton.first().click();

    const formOrModal = adminPage.locator(
      'form, [role="dialog"], .modal, [data-testid="zone-form"], [data-testid*="modal"]',
    );
    await expect(formOrModal.first()).toBeVisible();
  });
});
