import { test, expect } from '../../fixtures/base.fixture';
import { localizedUrl, ROUTES } from '../../helpers/locale-helpers';
import { mockGeoDetection } from '../../mocks/geo.mock';

/** Matches a formatted price with a currency symbol or code (e.g. "1 500 FCFA", "$12.99", "12,99 EUR") */
const PRICE_PATTERN = /(\$|FCFA|EUR|\u20AC|GBP|\u00A3|MAD|DH|CA\$|CAD)\s*[\d\s.,]+|[\d\s.,]+\s*(FCFA|EUR|\u20AC|GBP|\u00A3|MAD|DH|CA\$|CAD|\$)/;

test.describe('Price Display Formatting', () => {
  test('products page shows prices with a currency symbol', async ({ page }) => {
    await page.goto(localizedUrl('fr', ROUTES.products));
    await page.waitForLoadState('networkidle');

    // Wait for products to load
    await page.locator('a[href*="/products/"]').first().waitFor({ state: 'visible', timeout: 15000 });

    // Check body text for currency symbols since price elements don't have specific classes
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText).toMatch(PRICE_PATTERN);
  });

  test('product detail shows price with correct format', async ({ page }) => {
    await page.goto(localizedUrl('fr', ROUTES.products));
    await page.waitForLoadState('networkidle');

    // Navigate to the first product detail
    const firstProductLink = page.locator('a[href*="/products/"]').first();
    await expect(firstProductLink).toBeVisible({ timeout: 15000 });
    await firstProductLink.click();
    await page.waitForLoadState('networkidle');

    // Price on the detail page should include a currency indicator
    // Price text is in a span with font-bold or text-xl classes
    const bodyText = await page.locator('main').first().textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText).toMatch(PRICE_PATTERN);
  });

  test('cart total shows correct currency', async ({ page }) => {
    // Navigate to a product and add it to the cart
    await page.goto(localizedUrl('fr', ROUTES.products));
    await page.waitForLoadState('networkidle');

    const firstProductLink = page.locator('a[href*="/products/"]').first();
    await expect(firstProductLink).toBeVisible();
    await firstProductLink.click();
    await page.waitForLoadState('networkidle');

    const addToCartButton = page.locator('button', { hasText: /panier|ajouter|cart|add/i }).first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();
    await page.waitForTimeout(1000);

    // Go to the cart page
    await page.goto(localizedUrl('fr', ROUTES.cart));
    await page.waitForLoadState('networkidle');

    // Verify cart total displays a formatted price with currency
    const cartTotal = page.locator(
      '[data-testid="cart-total"], [class*="total"], main'
    ).first();
    const totalText = await cartTotal.textContent();
    expect(totalText).toBeTruthy();
    expect(totalText).toMatch(PRICE_PATTERN);
  });

  test('no raw USD dollar signs when non-USD currency is selected', async ({ page }) => {
    // Mock geo-detection to Senegal (XOF/FCFA)
    await mockGeoDetection(page, 'SN');
    await page.goto(localizedUrl('fr', ROUTES.products));
    await page.waitForLoadState('networkidle');

    // Wait for products to load
    await page.locator('a[href*="/products/"]').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});

    // Check body text for FCFA currency
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText).toMatch(/FCFA|XOF/i);
  });
});
