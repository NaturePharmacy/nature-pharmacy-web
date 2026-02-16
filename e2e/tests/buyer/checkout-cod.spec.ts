import { test, expect } from '../../fixtures/auth.fixture';
import { CheckoutPage } from '../../page-objects/checkout.page';
import { CartPage } from '../../page-objects/cart.page';
import { ProductsListPage } from '../../page-objects/products-list.page';
import { ProductDetailPage } from '../../page-objects/product-detail.page';
import { TestData } from '../../helpers/test-data-factory';

test.describe('Buyer Checkout - Cash on Delivery', () => {
  test.beforeEach(async ({ buyerPage }) => {
    // Add a product to cart before each test
    const productsPage = new ProductsListPage(buyerPage);
    await productsPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

    // Wait for products to appear
    const hasProducts = await productsPage.productCards.first().isVisible({ timeout: 15000 }).catch(() => false);
    if (!hasProducts) {
      test.skip(true, 'No products available');
      return;
    }

    await productsPage.clickFirstProduct();
    await buyerPage.waitForLoadState('networkidle');

    const detailPage = new ProductDetailPage(buyerPage);
    await detailPage.addToCart();

    const cartPage = new CartPage(buyerPage);
    await cartPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

    // Verify checkout button exists before clicking
    await cartPage.checkoutButton.waitFor({ state: 'visible', timeout: 10000 });
    await cartPage.checkoutButton.click();
    await buyerPage.waitForLoadState('networkidle');
  });

  test('checkout page loads for authenticated buyer', async ({ buyerPage }) => {
    await expect(buyerPage).toHaveURL(/\/fr\/checkout/);
  });

  test('buyer can fill shipping address form', async ({ buyerPage }) => {
    const checkoutPage = new CheckoutPage(buyerPage);
    const address = TestData.shippingAddress();

    await checkoutPage.fullNameInput.fill(address.fullName);
    await checkoutPage.phoneInput.fill(address.phone);
    await checkoutPage.addressInput.fill(address.address);
    await checkoutPage.cityInput.fill(address.city);
    await checkoutPage.stateInput.fill('Dakar');
    await checkoutPage.postalCodeInput.fill(address.postalCode);

    await expect(checkoutPage.fullNameInput).toHaveValue(address.fullName);
    await expect(checkoutPage.phoneInput).toHaveValue(address.phone);
    await expect(checkoutPage.addressInput).toHaveValue(address.address);
    await expect(checkoutPage.cityInput).toHaveValue(address.city);
  });

  test('buyer can select cash on delivery payment', async ({ buyerPage }) => {
    const checkoutPage = new CheckoutPage(buyerPage);

    await checkoutPage.selectPaymentMethod('cod');

    await expect(checkoutPage.placeOrderButton).toBeVisible();
  });

  test('buyer can place order with COD', async ({ buyerPage }) => {
    const checkoutPage = new CheckoutPage(buyerPage);
    const address = TestData.shippingAddress();

    await checkoutPage.fullNameInput.fill(address.fullName);
    await checkoutPage.phoneInput.fill(address.phone);
    await checkoutPage.addressInput.fill(address.address);
    await checkoutPage.cityInput.fill(address.city);
    await checkoutPage.stateInput.fill('Dakar');
    await checkoutPage.postalCodeInput.fill(address.postalCode);

    await checkoutPage.selectPaymentMethod('cod');
    await checkoutPage.placeOrderButton.click();
    await buyerPage.waitForLoadState('networkidle');

    // After placing order, redirect to order detail or orders list
    await expect(buyerPage).toHaveURL(/\/fr\/(orders|order-confirmation)/, { timeout: 15000 });
  });
});
