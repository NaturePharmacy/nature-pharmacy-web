import { test, expect } from '../../fixtures/auth.fixture';
import { OrdersPage } from '../../page-objects/orders.page';

test.describe('Buyer Orders', () => {
  test('orders page loads for buyer', async ({ buyerPage }) => {
    const ordersPage = new OrdersPage(buyerPage);
    await ordersPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

    await expect(buyerPage).toHaveURL(/\/fr\/orders/);
  });

  test('orders page shows order list or empty state', async ({ buyerPage }) => {
    const ordersPage = new OrdersPage(buyerPage);
    await ordersPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

    const hasOrders = await ordersPage.orderRows.count() > 0;

    if (hasOrders) {
      await expect(ordersPage.orderRows.first()).toBeVisible();
    } else {
      const emptyState = buyerPage.getByText(/no orders|aucune commande|empty/i);
      await expect(emptyState).toBeVisible();
    }
  });

  test('order details are accessible', async ({ buyerPage }) => {
    const ordersPage = new OrdersPage(buyerPage);
    await ordersPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

    const hasOrders = await ordersPage.orderRows.count() > 0;

    if (hasOrders) {
      await ordersPage.orderRows.first().click();
      await buyerPage.waitForLoadState('networkidle');

      await expect(buyerPage).toHaveURL(/\/fr\/orders\/.+/);
    } else {
      const emptyState = buyerPage.getByText(/no orders|aucune commande|empty/i);
      await expect(emptyState).toBeVisible();
    }
  });
});
