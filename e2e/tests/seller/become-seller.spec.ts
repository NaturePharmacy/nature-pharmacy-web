import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Become a Seller', () => {
  test('regular buyer can access become-seller page', async ({ buyerPage }) => {
    await buyerPage.goto('/fr/become-seller');
    await buyerPage.waitForLoadState('networkidle');

    await expect(buyerPage).toHaveURL(/\/fr\/become-seller/);

    const heading = buyerPage.getByText(
      /become.*seller|devenir.*vendeur|start.*selling|commencer.*vendre/i
    );
    await expect(heading.first()).toBeVisible();
  });

  test('become seller form loads', async ({ buyerPage }) => {
    await buyerPage.goto('/fr/become-seller');
    await buyerPage.waitForLoadState('networkidle');

    const form = buyerPage.locator('form');
    await expect(form.first()).toBeVisible();

    const storeNameField = buyerPage.locator(
      'input[name="storeName"], input[name="shopName"], input[name="businessName"], [data-testid="store-name"]'
    );
    const descriptionField = buyerPage.locator(
      'textarea[name="description"], textarea[name="storeDescription"], [data-testid="store-description"]'
    );
    const submitButton = buyerPage.getByRole('button', {
      name: /submit|apply|register|soumettre|postuler|inscrire/i,
    });

    const storeNameVisible = await storeNameField.first().isVisible().catch(() => false);
    const descriptionVisible = await descriptionField.first().isVisible().catch(() => false);
    const submitVisible = await submitButton.isVisible().catch(() => false);

    expect(storeNameVisible || descriptionVisible || submitVisible).toBeTruthy();
  });
});
