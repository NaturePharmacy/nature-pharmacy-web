import { test, expect } from '../../fixtures/auth.fixture';
import { CartPage } from '../../page-objects/cart.page';
import { ProductsListPage } from '../../page-objects/products-list.page';
import { ProductDetailPage } from '../../page-objects/product-detail.page';

test.describe('Buyer Cart', () => {
  test('buyer can view cart page', async ({ buyerPage }) => {
    const cartPage = new CartPage(buyerPage);
    await cartPage.navigate();

    await expect(buyerPage).toHaveURL(/\/fr\/cart/);
  });

  test('cart shows items after adding product', async ({ buyerPage }) => {
    const productsPage = new ProductsListPage(buyerPage);
    await productsPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

    const hasProducts = await productsPage.productCards.first().isVisible({ timeout: 15000 }).catch(() => false);
    test.skip(!hasProducts, 'No products available');

    await productsPage.clickFirstProduct();
    await buyerPage.waitForLoadState('networkidle');

    const detailPage = new ProductDetailPage(buyerPage);
    await detailPage.addToCart();
    await buyerPage.waitForLoadState('networkidle');

    const cartPage = new CartPage(buyerPage);
    await cartPage.navigate();

    await expect(cartPage.cartItems.first()).toBeVisible({ timeout: 10000 });
  });

  test('buyer can see total price or empty cart', async ({ buyerPage }) => {
    const cartPage = new CartPage(buyerPage);
    await cartPage.navigate();

    const hasItems = await cartPage.cartItems.count() > 0;
    if (hasItems) {
      await expect(cartPage.totalPrice).toBeVisible();
    } else {
      // Cart is empty - verify empty state message is shown
      const emptyState = buyerPage.getByText(/empty|vide|panier.*vide/i);
      await expect(emptyState.first()).toBeVisible();
    }
  });

  test('buyer can proceed to checkout from cart', async ({ buyerPage }) => {
    // First add a product to cart
    const productsPage = new ProductsListPage(buyerPage);
    await productsPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

    const hasProducts = await productsPage.productCards.first().isVisible({ timeout: 15000 }).catch(() => false);
    test.skip(!hasProducts, 'No products available');

    await productsPage.clickFirstProduct();
    await buyerPage.waitForLoadState('networkidle');

    const detailPage = new ProductDetailPage(buyerPage);
    await detailPage.addToCart();

    const cartPage = new CartPage(buyerPage);
    await cartPage.navigate();

    // Wait for cart to show items and checkout button
    await cartPage.checkoutButton.waitFor({ state: 'visible', timeout: 10000 });
    await cartPage.checkoutButton.click();
    await buyerPage.waitForLoadState('networkidle');

    // Should navigate to checkout page (or login if session expired)
    await expect(buyerPage).toHaveURL(/\/fr\/(checkout|login)/, { timeout: 15000 });
  });
});
