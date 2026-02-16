import { test, expect } from '../../fixtures/auth.fixture';
import { SellerAnalyticsPage } from '../../page-objects/seller/seller-analytics.page';

test.describe('Seller Analytics', () => {
  test('analytics page loads', async ({ sellerPage }) => {
    const analyticsPage = new SellerAnalyticsPage(sellerPage);
    await analyticsPage.navigate();
    await sellerPage.waitForLoadState('networkidle');

    await expect(sellerPage).toHaveURL(/\/fr\/seller\/analytics/);
  });

  test('revenue card visible', async ({ sellerPage }) => {
    const analyticsPage = new SellerAnalyticsPage(sellerPage);
    await analyticsPage.navigate();
    await sellerPage.waitForLoadState('networkidle');

    await expect(analyticsPage.revenueCard).toBeVisible();

    const revenueText = await analyticsPage.revenueCard.textContent();
    expect(revenueText).toBeTruthy();
  });
});
