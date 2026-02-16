import { test, expect } from '../../fixtures/base.fixture';

test.describe('Cart - Guest User', () => {
  test('Cart page loads for guest', async ({ cartPage }) => {
    await cartPage.navigate();

    // Page should not error out; cart page is accessible to guests
    const title = await cartPage.page.title();
    expect(title).toBeTruthy();
  });

  test('Empty cart shows empty state message', async ({ cartPage, page }) => {
    await cartPage.navigate();

    const cartItems = cartPage.cartItems;
    const itemCount = await cartItems.count();

    if (itemCount === 0) {
      // Look for an empty state message
      const emptyState = page.locator(
        '[data-testid="empty-cart"], .empty-cart, :text-matches("vide|empty|vacío", "i")'
      ).first();
      await expect(emptyState).toBeVisible({ timeout: 10000 });
    }
  });

  test('Guest can add product to cart from detail page', async ({
    productsPage,
    productDetailPage,
    cartPage,
    page,
  }) => {
    // Navigate to a product
    await productsPage.navigate();
    await productsPage.clickFirstProduct();
    await page.waitForLoadState('domcontentloaded');

    // Add product to cart
    await productDetailPage.addToCart();

    // Verify the cart reflects the addition
    await cartPage.navigate();
    await page.waitForLoadState('domcontentloaded');

    const cartItems = cartPage.cartItems;
    const count = await cartItems.count();
    expect(count).toBeGreaterThan(0);
  });
});
