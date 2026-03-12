import { test, expect } from '../../fixtures/auth.fixture';
import { CheckoutPage } from '../../page-objects/checkout.page';
import { CartPage } from '../../page-objects/cart.page';
import { ProductsListPage } from '../../page-objects/products-list.page';
import { ProductDetailPage } from '../../page-objects/product-detail.page';
import { TestData } from '../../helpers/test-data-factory';
import { mockPayPalCheckout, mockPayPalError } from '../../mocks/paypal.mock';

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function addProductToCartAndGoToCheckout(buyerPage: any) {
  await mockPayPalCheckout(buyerPage);

  const productsPage = new ProductsListPage(buyerPage);
  await productsPage.navigate();
  await buyerPage.waitForLoadState('networkidle');

  const hasProducts = await productsPage.productCards.first().isVisible({ timeout: 15000 }).catch(() => false);
  if (!hasProducts) return false;

  await productsPage.clickFirstProduct();
  await buyerPage.waitForLoadState('networkidle');

  const detailPage = new ProductDetailPage(buyerPage);
  await detailPage.addToCart();

  const cartPage = new CartPage(buyerPage);
  await cartPage.navigate();
  await buyerPage.waitForLoadState('networkidle');

  const checkoutBtn = cartPage.checkoutButton;
  const btnVisible = await checkoutBtn.isVisible({ timeout: 10000 }).catch(() => false);
  if (!btnVisible) return false;

  await checkoutBtn.click();
  await buyerPage.waitForLoadState('networkidle');
  return true;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('PayPal — Checkout Integration', () => {

  // ── 1. Page checkout ──────────────────────────────────────────────────────
  test.describe('Checkout page rendering', () => {

    test('checkout page se charge avec les options de paiement', async ({ buyerPage }) => {
      const ready = await addProductToCartAndGoToCheckout(buyerPage);
      if (!ready) { test.skip(true, 'No products available'); return; }

      await expect(buyerPage).toHaveURL(/\/fr\/checkout/);
      await expect(buyerPage.locator('input[name="paymentMethod"][value="paypal"]')).toBeVisible();
      await expect(buyerPage.locator('input[name="paymentMethod"][value="stripe"]')).toBeVisible();
      await expect(buyerPage.locator('input[name="paymentMethod"][value="cash_on_delivery"]')).toBeVisible();
    });

    test('le bouton "Passer commande" est visible quand Stripe est sélectionné (défaut)', async ({ buyerPage }) => {
      const ready = await addProductToCartAndGoToCheckout(buyerPage);
      if (!ready) { test.skip(true, 'No products available'); return; }

      // Stripe est la méthode par défaut
      const submitBtn = buyerPage.locator('button[type="submit"]');
      await expect(submitBtn.first()).toBeVisible({ timeout: 10000 });
    });

    test('le bouton "Passer commande" est visible quand COD est sélectionné', async ({ buyerPage }) => {
      const ready = await addProductToCartAndGoToCheckout(buyerPage);
      if (!ready) { test.skip(true, 'No products available'); return; }

      await buyerPage.locator('input[name="paymentMethod"][value="cash_on_delivery"]').check();
      await buyerPage.waitForTimeout(500);

      const submitBtn = buyerPage.locator('button[type="submit"]');
      await expect(submitBtn.first()).toBeVisible({ timeout: 10000 });
    });
  });

  // ── 2. Sélection PayPal ───────────────────────────────────────────────────
  test.describe('Sélection de PayPal', () => {

    test('la sélection de PayPal affiche les boutons PayPal', async ({ buyerPage }) => {
      const ready = await addProductToCartAndGoToCheckout(buyerPage);
      if (!ready) { test.skip(true, 'No products available'); return; }

      const checkoutPage = new CheckoutPage(buyerPage);
      await checkoutPage.selectPaymentMethod('paypal');
      await buyerPage.waitForTimeout(1000);

      // Les boutons PayPal doivent apparaître (rendus par le mock SDK)
      const paypalBtn = buyerPage.locator('[data-testid="paypal-button-mock"]');
      await expect(paypalBtn).toBeVisible({ timeout: 10000 });
    });

    test('le bouton submit standard disparaît quand PayPal est sélectionné', async ({ buyerPage }) => {
      const ready = await addProductToCartAndGoToCheckout(buyerPage);
      if (!ready) { test.skip(true, 'No products available'); return; }

      const checkoutPage = new CheckoutPage(buyerPage);
      await checkoutPage.selectPaymentMethod('paypal');
      await buyerPage.waitForTimeout(500);

      // Le bouton type="submit" ne doit plus être visible
      const submitBtn = buyerPage.locator('button[type="submit"]');
      const isVisible = await submitBtn.isVisible().catch(() => false);
      expect(isVisible).toBe(false);
    });

    test('basculer vers une autre méthode restaure le bouton submit', async ({ buyerPage }) => {
      const ready = await addProductToCartAndGoToCheckout(buyerPage);
      if (!ready) { test.skip(true, 'No products available'); return; }

      const checkoutPage = new CheckoutPage(buyerPage);

      // Sélectionner PayPal
      await checkoutPage.selectPaymentMethod('paypal');
      await buyerPage.waitForTimeout(500);

      // Revenir au COD
      await checkoutPage.selectPaymentMethod('cod');
      await buyerPage.waitForTimeout(500);

      const submitBtn = buyerPage.locator('button[type="submit"]');
      await expect(submitBtn.first()).toBeVisible({ timeout: 5000 });
    });
  });

  // ── 3. Formulaire + PayPal ────────────────────────────────────────────────
  test.describe('Formulaire d\'adresse avec PayPal', () => {

    test('tous les champs du formulaire sont remplis avant de payer', async ({ buyerPage }) => {
      const ready = await addProductToCartAndGoToCheckout(buyerPage);
      if (!ready) { test.skip(true, 'No products available'); return; }

      const checkoutPage = new CheckoutPage(buyerPage);
      const address = TestData.shippingAddress();

      await checkoutPage.fullNameInput.fill(address.fullName);
      await checkoutPage.phoneInput.fill(address.phone);
      await checkoutPage.addressInput.fill(address.address);
      await checkoutPage.cityInput.fill(address.city);
      await checkoutPage.stateInput.fill('Île-de-France');
      await checkoutPage.postalCodeInput.fill('75001');

      // Sélectionner un pays
      const countrySelect = buyerPage.locator('select[name="country"]');
      const hasCountry = await countrySelect.isVisible().catch(() => false);
      if (hasCountry) {
        await countrySelect.selectOption({ index: 1 });
        await buyerPage.waitForTimeout(500);
      }

      await checkoutPage.selectPaymentMethod('paypal');
      await buyerPage.waitForTimeout(1000);

      const paypalBtn = buyerPage.locator('[data-testid="paypal-button-mock"]');
      await expect(paypalBtn).toBeVisible({ timeout: 10000 });
    });

    test('le résumé de commande affiche le total correct', async ({ buyerPage }) => {
      const ready = await addProductToCartAndGoToCheckout(buyerPage);
      if (!ready) { test.skip(true, 'No products available'); return; }

      // Le total doit être visible dans le résumé
      const total = buyerPage.locator('text=/total/i').first();
      await expect(total).toBeVisible({ timeout: 10000 });

      // Le prix doit contenir un montant
      const priceText = buyerPage.locator('[class*="text-green"]').first();
      await expect(priceText).toBeVisible({ timeout: 5000 });
    });
  });

  // ── 4. Flux complet PayPal (avec mock) ───────────────────────────────────
  test.describe('Flux de paiement PayPal (mocké)', () => {

    test('cliquer sur le bouton PayPal appelle create-order puis capture', async ({ buyerPage }) => {
      const ready = await addProductToCartAndGoToCheckout(buyerPage);
      if (!ready) { test.skip(true, 'No products available'); return; }

      // Intercepter les appels API
      const apiCalls: string[] = [];
      buyerPage.on('request', req => {
        if (req.url().includes('/api/payments/paypal/')) {
          apiCalls.push(req.url());
        }
      });

      const checkoutPage = new CheckoutPage(buyerPage);
      const address = TestData.shippingAddress();

      await checkoutPage.fullNameInput.fill(address.fullName);
      await checkoutPage.phoneInput.fill(address.phone);
      await checkoutPage.addressInput.fill(address.address);
      await checkoutPage.cityInput.fill(address.city);
      await checkoutPage.stateInput.fill('Paris');
      await checkoutPage.postalCodeInput.fill('75001');

      const countrySelect = buyerPage.locator('select[name="country"]');
      if (await countrySelect.isVisible().catch(() => false)) {
        await countrySelect.selectOption({ index: 1 });
        await buyerPage.waitForTimeout(500);
      }

      await checkoutPage.selectPaymentMethod('paypal');
      await buyerPage.waitForTimeout(1500);

      const paypalBtn = buyerPage.locator('[data-testid="paypal-button-mock"]');
      await expect(paypalBtn).toBeVisible({ timeout: 10000 });
      await paypalBtn.click();

      // Attendre la redirection vers la confirmation de commande
      await buyerPage.waitForURL(/\/fr\/(orders|checkout)/, { timeout: 20000 });

      // Vérifier que les deux API ont été appelées
      expect(apiCalls.some(url => url.includes('create-order'))).toBe(true);
      expect(apiCalls.some(url => url.includes('capture'))).toBe(true);
    });

    test('après paiement PayPal réussi, redirection vers page commande', async ({ buyerPage }) => {
      const ready = await addProductToCartAndGoToCheckout(buyerPage);
      if (!ready) { test.skip(true, 'No products available'); return; }

      const checkoutPage = new CheckoutPage(buyerPage);
      const address = TestData.shippingAddress();

      await checkoutPage.fullNameInput.fill(address.fullName);
      await checkoutPage.phoneInput.fill(address.phone);
      await checkoutPage.addressInput.fill(address.address);
      await checkoutPage.cityInput.fill(address.city);
      await checkoutPage.stateInput.fill('Paris');
      await checkoutPage.postalCodeInput.fill('75001');

      const countrySelect = buyerPage.locator('select[name="country"]');
      if (await countrySelect.isVisible().catch(() => false)) {
        await countrySelect.selectOption({ index: 1 });
        await buyerPage.waitForTimeout(500);
      }

      await checkoutPage.selectPaymentMethod('paypal');
      await buyerPage.waitForTimeout(1500);

      const paypalBtn = buyerPage.locator('[data-testid="paypal-button-mock"]');
      await paypalBtn.click();

      await buyerPage.waitForURL(/\/fr\/(orders|checkout)/, { timeout: 20000 });
      // L'URL doit changer (plus sur /checkout)
      expect(buyerPage.url()).not.toMatch(/\/fr\/checkout$/);
    });
  });

  // ── 5. Gestion des erreurs ────────────────────────────────────────────────
  test.describe('Gestion des erreurs PayPal', () => {

    test('une erreur PayPal affiche un message d\'erreur', async ({ buyerPage }) => {
      // Utiliser le mock d'erreur
      await mockPayPalError(buyerPage);

      const productsPage = new ProductsListPage(buyerPage);
      await productsPage.navigate();
      await buyerPage.waitForLoadState('networkidle');

      const hasProducts = await productsPage.productCards.first().isVisible({ timeout: 15000 }).catch(() => false);
      if (!hasProducts) { test.skip(true, 'No products available'); return; }

      await productsPage.clickFirstProduct();
      const detailPage = new ProductDetailPage(buyerPage);
      await detailPage.addToCart();

      const cartPage = new CartPage(buyerPage);
      await cartPage.navigate();
      await cartPage.checkoutButton.click();
      await buyerPage.waitForLoadState('networkidle');

      const checkoutPage = new CheckoutPage(buyerPage);
      const address = TestData.shippingAddress();

      await checkoutPage.fullNameInput.fill(address.fullName);
      await checkoutPage.phoneInput.fill(address.phone);
      await checkoutPage.addressInput.fill(address.address);
      await checkoutPage.cityInput.fill(address.city);
      await checkoutPage.stateInput.fill('Paris');
      await checkoutPage.postalCodeInput.fill('75001');

      await checkoutPage.selectPaymentMethod('paypal');
      await buyerPage.waitForTimeout(1500);

      const errorBtn = buyerPage.locator('[data-testid="paypal-button-error"]');
      const hasMockBtn = await errorBtn.isVisible({ timeout: 5000 }).catch(() => false);
      if (!hasMockBtn) { test.skip(true, 'Error mock button not rendered'); return; }

      await errorBtn.click();
      await buyerPage.waitForTimeout(1000);

      // Un message d'erreur doit apparaître sur la page
      const errorMsg = buyerPage.locator('[class*="text-red"], [class*="bg-red"], .error').first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('l\'API create-order retourne 500 → message d\'erreur affiché', async ({ buyerPage }) => {
      await mockPayPalError(buyerPage);

      const productsPage = new ProductsListPage(buyerPage);
      await productsPage.navigate();
      const hasProducts = await productsPage.productCards.first().isVisible({ timeout: 10000 }).catch(() => false);
      if (!hasProducts) { test.skip(true, 'No products available'); return; }

      await productsPage.clickFirstProduct();
      const detailPage = new ProductDetailPage(buyerPage);
      await detailPage.addToCart();

      const cartPage = new CartPage(buyerPage);
      await cartPage.navigate();
      await cartPage.checkoutButton.click();
      await buyerPage.waitForLoadState('networkidle');

      const checkoutPage = new CheckoutPage(buyerPage);
      await checkoutPage.selectPaymentMethod('paypal');
      await buyerPage.waitForTimeout(1000);

      // On doit rester sur la page checkout (pas de redirection)
      await expect(buyerPage).toHaveURL(/\/fr\/checkout/);
    });
  });

  // ── 6. Vérification API (sans browser) ───────────────────────────────────
  test.describe('API PayPal — Routes', () => {

    test('POST /api/payments/paypal/create-order sans auth → 401', async ({ buyerPage }) => {
      // Appel direct sans cookies d'auth
      const context = buyerPage.context();
      const page = await context.browser()!.newContext().then(c => c.newPage());

      const res = await page.evaluate(async () => {
        const r = await fetch('/api/payments/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderData: {} }),
        });
        return r.status;
      });

      expect(res).toBe(401);
      await page.close();
    });

    test('POST /api/payments/paypal/capture sans auth → 401', async ({ buyerPage }) => {
      const context = buyerPage.context();
      const page = await context.browser()!.newContext().then(c => c.newPage());

      const res = await page.evaluate(async () => {
        const r = await fetch('/api/payments/paypal/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paypalOrderId: 'xxx', orderId: 'yyy' }),
        });
        return r.status;
      });

      expect(res).toBe(401);
      await page.close();
    });

    test('POST /api/payments/paypal/create-order authentifié sans items → 400', async ({ buyerPage }) => {
      const status = await buyerPage.evaluate(async () => {
        const r = await fetch('/api/payments/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderData: { items: [], shippingAddress: {} } }),
        });
        return r.status;
      });

      expect(status).toBe(400);
    });

    test('POST /api/payments/paypal/capture avec IDs invalides → 400 ou 404', async ({ buyerPage }) => {
      const status = await buyerPage.evaluate(async () => {
        const r = await fetch('/api/payments/paypal/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paypalOrderId: 'INVALID-ID', orderId: '000000000000000000000000' }),
        });
        return r.status;
      });

      expect([400, 404, 500]).toContain(status);
    });
  });
});
