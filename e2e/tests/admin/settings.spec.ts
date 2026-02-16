import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Settings', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/settings');
    await adminPage.waitForLoadState('networkidle');
  });

  test('settings page loads', async ({ adminPage }) => {
    await expect(adminPage).toHaveURL(/\/fr\/admin\/settings/);
    const heading = adminPage.locator('h1, [data-testid="page-title"]');
    await expect(heading.first()).toBeVisible();
  });

  test('commission rate input is visible', async ({ adminPage }) => {
    // Commission input is a number input with min=0 max=100
    const commissionInput = adminPage.locator(
      'input[name*="commission"], input[data-testid="commission-input"], [data-testid*="commission"] input, input[id*="commission"], input[type="number"][max="100"]',
    );
    await expect(commissionInput.first()).toBeVisible({ timeout: 15000 });
  });

  test('save button is visible', async ({ adminPage }) => {
    const saveButton = adminPage.locator(
      'button:has-text("Enregistrer"), button:has-text("Sauvegarder"), button:has-text("Save"), button[type="submit"], [data-testid="save-settings"]',
    );
    await expect(saveButton.first()).toBeVisible();
    await expect(saveButton.first()).toBeEnabled();
  });

  test('current commission rate is displayed', async ({ adminPage }) => {
    const commissionInput = adminPage.locator(
      'input[name*="commission"], input[data-testid="commission-input"], [data-testid*="commission"] input, input[id*="commission"], input[type="number"][max="100"]',
    );
    await expect(commissionInput.first()).toBeVisible({ timeout: 15000 });
    const value = await commissionInput.first().inputValue();
    expect(value).toBeTruthy();
    expect(Number(value)).toBeGreaterThanOrEqual(0);
    expect(Number(value)).toBeLessThanOrEqual(100);
  });
});
