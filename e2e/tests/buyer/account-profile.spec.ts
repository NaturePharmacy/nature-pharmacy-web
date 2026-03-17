import { test, expect } from '../../fixtures/auth.fixture';
import { AccountPage } from '../../page-objects/account.page';

test.describe('Buyer Account Profile', () => {
  test('account page loads', async ({ buyerPage }) => {
    const accountPage = new AccountPage(buyerPage);
    await accountPage.navigate();

    await expect(buyerPage).toHaveURL(/\/fr\/account/);
  });

  test('profile form shows user name', async ({ buyerPage }) => {
    const accountPage = new AccountPage(buyerPage);
    await accountPage.navigate();

    await expect(accountPage.nameInput).toBeVisible();

    // Wait for user data to populate (async API fetch)
    await expect(accountPage.nameInput).not.toHaveValue('', { timeout: 10000 });
    const nameValue = await accountPage.nameInput.inputValue();
    expect(nameValue.length).toBeGreaterThan(0);
  });

  test('buyer can update profile name', async ({ buyerPage }) => {
    const accountPage = new AccountPage(buyerPage);
    await accountPage.navigate();

    // Wait for user data to populate the name field (async fetch)
    await expect(accountPage.nameInput).not.toHaveValue('', { timeout: 10000 });

    const updatedName = `Test Buyer ${Date.now()}`;
    await accountPage.nameInput.fill(updatedName);
    await accountPage.saveButton.click();
    await buyerPage.waitForLoadState('networkidle');

    // "Profile updated successfully!" shown in bg-green-50 div
    const successMessage = buyerPage.getByText(
      /saved|updated|success|enregistré|mis à jour|successfully/i
    );
    await expect(successMessage.first()).toBeVisible({ timeout: 15_000 });
  });
});
