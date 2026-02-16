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

    // Wait for user data to be fetched and populated (the form loads data async)
    await buyerPage.waitForTimeout(2000);
    const nameValue = await accountPage.nameInput.inputValue();
    expect(nameValue.length).toBeGreaterThan(0);
  });

  test('buyer can update profile name', async ({ buyerPage }) => {
    const accountPage = new AccountPage(buyerPage);
    await accountPage.navigate();

    // Wait for user data to be fetched and populated
    await buyerPage.waitForTimeout(2000);

    const updatedName = `Test Buyer ${Date.now()}`;
    await accountPage.nameInput.clear();
    await accountPage.nameInput.fill(updatedName);
    await accountPage.saveButton.click();
    await buyerPage.waitForLoadState('networkidle');

    // The success message is "Profile updated successfully!" shown in a bg-green-50 div
    const successMessage = buyerPage.getByText(
      /saved|updated|success|enregistré|mis à jour/i
    );
    await expect(successMessage.first()).toBeVisible({ timeout: 10_000 });
  });
});
