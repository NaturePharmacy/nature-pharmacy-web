import { test, expect } from '../../fixtures/auth.fixture';
import { SellerDashboardPage } from '../../page-objects/seller/seller-dashboard.page';

test.describe('Seller Dashboard', () => {
  test('seller dashboard loads', async ({ sellerPage }) => {
    const dashboardPage = new SellerDashboardPage(sellerPage);
    await dashboardPage.navigate();
    await sellerPage.waitForLoadState('networkidle');

    await expect(sellerPage).toHaveURL(/\/fr\/seller/);
  });

  test('dashboard shows stats cards', async ({ sellerPage }) => {
    const dashboardPage = new SellerDashboardPage(sellerPage);
    await dashboardPage.navigate();
    await sellerPage.waitForLoadState('networkidle');

    await expect(dashboardPage.statsCards.first()).toBeVisible();

    const cardCount = await dashboardPage.statsCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(1);
  });

  test('quick links visible for products and orders', async ({ sellerPage }) => {
    const dashboardPage = new SellerDashboardPage(sellerPage);
    await dashboardPage.navigate();
    await sellerPage.waitForLoadState('networkidle');

    const productsLink = sellerPage.getByRole('link', {
      name: /products|produits/i,
    });
    const ordersLink = sellerPage.getByRole('link', {
      name: /orders|commandes/i,
    });

    await expect(productsLink.first()).toBeVisible();
    await expect(ordersLink.first()).toBeVisible();
  });
});
