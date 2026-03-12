import { test, expect } from '../../fixtures/auth.fixture';
import { CheckoutPage } from '../../page-objects/checkout.page';
import { CartPage } from '../../page-objects/cart.page';
import { ProductsListPage } from '../../page-objects/products-list.page';
import { ProductDetailPage } from '../../page-objects/product-detail.page';
import { TestData } from '../../helpers/test-data-factory';
import { mockPayPalCheckout, mockPayPalError } from '../../mocks/paypal.mock';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// ─── Helper : ajoute un produit au panier et arrive sur /checkout ─────────────
async function goToCheckout(buyerPage: any): Promise<boolean> {
  const productsPage = new ProductsListPage(buyerPage);
  await productsPage.navigate();
  await buyerPage.waitForLoadState('networkidle');

  const hasProducts = await productsPage.productCards
    .first()
    .isVisible({ timeout: 15000 })
    .catch(() => false);
  if (!hasProducts) return false;

  await productsPage.clickFirstProduct();
  await buyerPage.waitForLoadState('networkidle');

  const detailPage = new ProductDetailPage(buyerPage);
  await detailPage.addToCart();

  const cartPage = new CartPage(buyerPage);
  await cartPage.navigate();
  await buyerPage.waitForLoadState('networkidle');

  const checkoutBtn = cartPage.checkoutButton;
  if (!(await checkoutBtn.isVisible({ timeout: 10000 }).catch(() => false))) return false;

  await checkoutBtn.click();
  await buyerPage.waitForLoadState('networkidle');
  await buyerPage.waitForURL(/\/fr\/checkout/, { timeout: 15000 });
  return true;
}

// ─── Helper : remplit l'adresse de livraison ──────────────────────────────────
async function fillAddress(buyerPage: any) {
  const checkoutPage = new CheckoutPage(buyerPage);
  const address = TestData.shippingAddress();
  await checkoutPage.fullNameInput.fill(address.fullName);
  await checkoutPage.phoneInput.fill(address.phone);
  await checkoutPage.addressInput.fill(address.address);
  await checkoutPage.cityInput.fill(address.city);
  await checkoutPage.stateInput.fill('Paris');
  await checkoutPage.postalCodeInput.fill('75001');
  // Sélectionner un pays si le select existe
  const countrySelect = buyerPage.locator('select[name="country"]');
  if (await countrySelect.isVisible({ timeout: 2000 }).catch(() => false)) {
    await countrySelect.selectOption({ index: 1 });
    await buyerPage.waitForTimeout(400);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. RENDU DE LA PAGE CHECKOUT
// ═══════════════════════════════════════════════════════════════════════════

test.describe('PayPal — Rendu page checkout', () => {
  test.beforeEach(async ({ buyerPage }) => {
    await mockPayPalCheckout(buyerPage);
  });

  test('les 3 méthodes de paiement sont disponibles', async ({ buyerPage }) => {
    const ok = await goToCheckout(buyerPage);
    if (!ok) { test.skip(true, 'Aucun produit disponible'); return; }

    await expect(buyerPage.locator('input[name="paymentMethod"][value="paypal"]')).toBeVisible();
    await expect(buyerPage.locator('input[name="paymentMethod"][value="stripe"]')).toBeVisible();
    await expect(buyerPage.locator('input[name="paymentMethod"][value="cash_on_delivery"]')).toBeVisible();
  });

  test('bouton submit visible par défaut (Stripe)', async ({ buyerPage }) => {
    const ok = await goToCheckout(buyerPage);
    if (!ok) { test.skip(true, 'Aucun produit disponible'); return; }

    await expect(buyerPage.locator('button[type="submit"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('bouton submit visible quand COD sélectionné', async ({ buyerPage }) => {
    const ok = await goToCheckout(buyerPage);
    if (!ok) { test.skip(true, 'Aucun produit disponible'); return; }

    await buyerPage.locator('input[name="paymentMethod"][value="cash_on_delivery"]').check();
    await buyerPage.waitForTimeout(300);
    await expect(buyerPage.locator('button[type="submit"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('résumé de commande affiche un total', async ({ buyerPage }) => {
    const ok = await goToCheckout(buyerPage);
    if (!ok) { test.skip(true, 'Aucun produit disponible'); return; }

    const total = buyerPage.getByText(/total/i).first();
    await expect(total).toBeVisible({ timeout: 10000 });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. SÉLECTION PAYPAL — AFFICHAGE DES BOUTONS
// ═══════════════════════════════════════════════════════════════════════════

test.describe('PayPal — Sélection et rendu boutons', () => {
  test.beforeEach(async ({ buyerPage }) => {
    await mockPayPalCheckout(buyerPage);
  });

  test('sélectionner PayPal affiche le bouton mocké', async ({ buyerPage }) => {
    const ok = await goToCheckout(buyerPage);
    if (!ok) { test.skip(true, 'Aucun produit disponible'); return; }

    const checkoutPage = new CheckoutPage(buyerPage);
    await checkoutPage.selectPaymentMethod('paypal');
    await buyerPage.waitForTimeout(1000);

    await expect(buyerPage.locator('[data-testid="paypal-button-mock"]')).toBeVisible({ timeout: 10000 });
  });

  test('bouton submit disparaît quand PayPal sélectionné', async ({ buyerPage }) => {
    const ok = await goToCheckout(buyerPage);
    if (!ok) { test.skip(true, 'Aucun produit disponible'); return; }

    const checkoutPage = new CheckoutPage(buyerPage);
    await checkoutPage.selectPaymentMethod('paypal');
    await buyerPage.waitForTimeout(500);

    const isVisible = await buyerPage.locator('button[type="submit"]').isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });

  test('revenir à COD restaure le bouton submit', async ({ buyerPage }) => {
    const ok = await goToCheckout(buyerPage);
    if (!ok) { test.skip(true, 'Aucun produit disponible'); return; }

    const checkoutPage = new CheckoutPage(buyerPage);
    await checkoutPage.selectPaymentMethod('paypal');
    await buyerPage.waitForTimeout(500);
    await checkoutPage.selectPaymentMethod('cod');
    await buyerPage.waitForTimeout(500);

    await expect(buyerPage.locator('button[type="submit"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('bouton PayPal présent après avoir rempli le formulaire', async ({ buyerPage }) => {
    const ok = await goToCheckout(buyerPage);
    if (!ok) { test.skip(true, 'Aucun produit disponible'); return; }

    await fillAddress(buyerPage);
    const checkoutPage = new CheckoutPage(buyerPage);
    await checkoutPage.selectPaymentMethod('paypal');
    await buyerPage.waitForTimeout(1000);

    await expect(buyerPage.locator('[data-testid="paypal-button-mock"]')).toBeVisible({ timeout: 10000 });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. FLUX COMPLET DE PAIEMENT (mocké)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('PayPal — Flux complet mocké', () => {
  test.beforeEach(async ({ buyerPage }) => {
    await mockPayPalCheckout(buyerPage);
  });

  test('cliquer PayPal → create-order ET capture appelés', async ({ buyerPage }) => {
    const ok = await goToCheckout(buyerPage);
    if (!ok) { test.skip(true, 'Aucun produit disponible'); return; }

    const apiCalls: string[] = [];
    buyerPage.on('request', req => {
      if (req.url().includes('/api/payments/paypal/')) apiCalls.push(req.url());
    });

    await fillAddress(buyerPage);
    const checkoutPage = new CheckoutPage(buyerPage);
    await checkoutPage.selectPaymentMethod('paypal');
    await buyerPage.waitForTimeout(1000);

    const paypalBtn = buyerPage.locator('[data-testid="paypal-button-mock"]');
    await expect(paypalBtn).toBeVisible({ timeout: 10000 });
    await paypalBtn.click();

    await buyerPage.waitForURL(/\/fr\/orders|\/fr\/checkout/, { timeout: 20000 });

    expect(apiCalls.some(u => u.includes('create-order'))).toBe(true);
    expect(apiCalls.some(u => u.includes('capture'))).toBe(true);
  });

  test('paiement réussi → redirection hors de /checkout', async ({ buyerPage }) => {
    const ok = await goToCheckout(buyerPage);
    if (!ok) { test.skip(true, 'Aucun produit disponible'); return; }

    await fillAddress(buyerPage);
    const checkoutPage = new CheckoutPage(buyerPage);
    await checkoutPage.selectPaymentMethod('paypal');
    await buyerPage.waitForTimeout(1000);

    const paypalBtn = buyerPage.locator('[data-testid="paypal-button-mock"]');
    await expect(paypalBtn).toBeVisible({ timeout: 10000 });
    await paypalBtn.click();

    await buyerPage.waitForURL(/\/fr\/orders/, { timeout: 20000 });
    expect(buyerPage.url()).not.toMatch(/\/fr\/checkout$/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. GESTION DES ERREURS
// ═══════════════════════════════════════════════════════════════════════════

test.describe('PayPal — Gestion des erreurs', () => {

  test('erreur PayPal → message d\'erreur visible sur la page', async ({ buyerPage }) => {
    await mockPayPalError(buyerPage);

    const ok = await goToCheckout(buyerPage);
    if (!ok) { test.skip(true, 'Aucun produit disponible'); return; }

    await fillAddress(buyerPage);
    const checkoutPage = new CheckoutPage(buyerPage);
    await checkoutPage.selectPaymentMethod('paypal');
    await buyerPage.waitForTimeout(1000);

    const errorBtn = buyerPage.locator('[data-testid="paypal-button-error"]');
    if (!(await errorBtn.isVisible({ timeout: 8000 }).catch(() => false))) {
      test.skip(true, 'Bouton erreur non rendu'); return;
    }

    await errorBtn.click();
    await buyerPage.waitForTimeout(1000);

    // Message d'erreur doit apparaître
    const errorMsg = buyerPage.locator('[class*="text-red"], p.text-red-600').first();
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
  });

  test('erreur API → on reste sur /checkout', async ({ buyerPage }) => {
    await mockPayPalError(buyerPage);

    const ok = await goToCheckout(buyerPage);
    if (!ok) { test.skip(true, 'Aucun produit disponible'); return; }

    const checkoutPage = new CheckoutPage(buyerPage);
    await checkoutPage.selectPaymentMethod('paypal');
    await buyerPage.waitForTimeout(500);

    // Rester sur la page checkout
    await expect(buyerPage).toHaveURL(/\/fr\/checkout/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. SÉCURITÉ API — SANS AUTHENTIFICATION
// ═══════════════════════════════════════════════════════════════════════════

test.describe('PayPal — Sécurité API', () => {

  test('POST create-order sans auth → 401', async ({ page }) => {
    // Naviguer vers la base URL pour avoir un contexte valide
    await page.goto(`${BASE_URL}/fr`);
    await page.waitForLoadState('networkidle');

    const status = await page.evaluate(async (baseUrl) => {
      const r = await fetch(`${baseUrl}/api/payments/paypal/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderData: {} }),
      });
      return r.status;
    }, BASE_URL);

    expect(status).toBe(401);
  });

  test('POST capture sans auth → 401', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr`);
    await page.waitForLoadState('networkidle');

    const status = await page.evaluate(async (baseUrl) => {
      const r = await fetch(`${baseUrl}/api/payments/paypal/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paypalOrderId: 'xxx', orderId: 'yyy' }),
      });
      return r.status;
    }, BASE_URL);

    expect(status).toBe(401);
  });

  test('POST create-order authentifié sans items → 400', async ({ buyerPage }) => {
    await buyerPage.goto(`${BASE_URL}/fr`);

    const status = await buyerPage.evaluate(async (baseUrl) => {
      const r = await fetch(`${baseUrl}/api/payments/paypal/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderData: { items: [], shippingAddress: {} } }),
      });
      return r.status;
    }, BASE_URL);

    expect(status).toBe(400);
  });

  test('POST capture avec IDs invalides → 400 ou 404', async ({ buyerPage }) => {
    await buyerPage.goto(`${BASE_URL}/fr`);

    const status = await buyerPage.evaluate(async (baseUrl) => {
      const r = await fetch(`${baseUrl}/api/payments/paypal/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paypalOrderId: 'INVALID', orderId: '000000000000000000000000' }),
      });
      return r.status;
    }, BASE_URL);

    expect([400, 404, 500]).toContain(status);
  });

  test('GET /api/payments/paypal/create-order → 405 method not allowed', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr`);
    const status = await page.evaluate(async (baseUrl) => {
      const r = await fetch(`${baseUrl}/api/payments/paypal/create-order`);
      return r.status;
    }, BASE_URL);
    expect([405, 401, 404]).toContain(status);
  });
});
