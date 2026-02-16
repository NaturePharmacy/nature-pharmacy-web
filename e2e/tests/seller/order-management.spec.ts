import { test, expect } from '../../fixtures/auth.fixture';
import { SellerOrdersPage } from '../../page-objects/seller/seller-orders.page';

test.describe('Seller Order Management', () => {
  test('seller orders page loads', async ({ sellerPage }) => {
    const sellerOrdersPage = new SellerOrdersPage(sellerPage);
    await sellerOrdersPage.navigate();
    await sellerPage.waitForLoadState('networkidle');

    await expect(sellerPage).toHaveURL(/\/fr\/seller\/orders/);
  });

  test('orders table or empty state visible', async ({ sellerPage }) => {
    const sellerOrdersPage = new SellerOrdersPage(sellerPage);
    await sellerOrdersPage.navigate();
    await sellerPage.waitForLoadState('networkidle');

    const hasOrders = await sellerOrdersPage.orderRows.count() > 0;

    if (hasOrders) {
      await expect(sellerOrdersPage.orderRows.first()).toBeVisible();

      const orderCount = await sellerOrdersPage.orderRows.count();
      expect(orderCount).toBeGreaterThanOrEqual(1);
    } else {
      const emptyState = sellerPage.getByText(
        /no orders|aucune commande|empty|vide/i
      );
      await expect(emptyState).toBeVisible();
    }
  });
});
