import { test, expect } from '../../fixtures/auth.fixture';
import { CheckoutPage } from '../../page-objects/checkout.page';
import { CartPage } from '../../page-objects/cart.page';
import { ProductsListPage } from '../../page-objects/products-list.page';
import { ProductDetailPage } from '../../page-objects/product-detail.page';
import { TestData } from '../../helpers/test-data-factory';
import { mockStripeCheckout } from '../../mocks/stripe.mock';

test.describe('Buyer Checkout - Stripe', () => {
  test.beforeEach(async ({ buyerPage }) => {
    await mockStripeCheckout(buyerPage);

    const productsPage = new ProductsListPage(buyerPage);
    await productsPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

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

    await cartPage.checkoutButton.waitFor({ state: 'visible', timeout: 10000 });
    await cartPage.checkoutButton.click();
    await buyerPage.waitForLoadState('networkidle');
  });

  test('checkout page loads', async ({ buyerPage }) => {
    await expect(buyerPage).toHaveURL(/\/fr\/checkout/);
  });

  test('buyer can select Stripe payment', async ({ buyerPage }) => {
    const checkoutPage = new CheckoutPage(buyerPage);
    const address = TestData.shippingAddress();

    await checkoutPage.fullNameInput.fill(address.fullName);
    await checkoutPage.phoneInput.fill(address.phone);
    await checkoutPage.addressInput.fill(address.address);
    await checkoutPage.cityInput.fill(address.city);
    await checkoutPage.stateInput.fill('Dakar');
    await checkoutPage.postalCodeInput.fill(address.postalCode);

    await checkoutPage.selectPaymentMethod('stripe');

    await expect(checkoutPage.placeOrderButton).toBeVisible();
  });

  test('Stripe mock intercepted and redirect simulated', async ({ buyerPage }) => {
    const checkoutPage = new CheckoutPage(buyerPage);
    const address = TestData.shippingAddress();

    await checkoutPage.fullNameInput.fill(address.fullName);
    await checkoutPage.phoneInput.fill(address.phone);
    await checkoutPage.addressInput.fill(address.address);
    await checkoutPage.cityInput.fill(address.city);
    await checkoutPage.stateInput.fill('Dakar');
    await checkoutPage.postalCodeInput.fill(address.postalCode);

    await checkoutPage.selectPaymentMethod('stripe');
    await checkoutPage.placeOrderButton.click();
    await buyerPage.waitForLoadState('networkidle');

    await expect(buyerPage).toHaveURL(/\/fr\/(orders|order-confirmation|checkout\/success)/, { timeout: 15000 });
  });
});
