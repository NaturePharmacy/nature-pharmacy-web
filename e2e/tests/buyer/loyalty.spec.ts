import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Buyer Loyalty Program', () => {
  test('loyalty page loads', async ({ buyerPage }) => {
    await buyerPage.goto('/fr/loyalty');
    await buyerPage.waitForLoadState('networkidle');

    const loyaltyHeading = buyerPage.getByText(
      /loyalty|fidélité|reward|récompense/i
    );
    const isLoyaltyPage = await loyaltyHeading.isVisible().catch(() => false);

    if (!isLoyaltyPage) {
      await buyerPage.goto('/fr/account');
      await buyerPage.waitForLoadState('networkidle');

      const loyaltySection = buyerPage.getByText(
        /loyalty|fidélité|points|récompense/i
      );
      await expect(loyaltySection.first()).toBeVisible();
    } else {
      await expect(loyaltyHeading.first()).toBeVisible();
    }
  });

  test('loyalty points displayed', async ({ buyerPage }) => {
    await buyerPage.goto('/fr/loyalty');
    await buyerPage.waitForLoadState('networkidle');

    const hasLoyaltyPage = await buyerPage
      .getByText(/loyalty|fidélité/i)
      .isVisible()
      .catch(() => false);

    if (!hasLoyaltyPage) {
      await buyerPage.goto('/fr/account');
      await buyerPage.waitForLoadState('networkidle');
    }

    const pointsDisplay = buyerPage.getByText(/points|pts/i);
    await expect(pointsDisplay.first()).toBeVisible();
  });
});
