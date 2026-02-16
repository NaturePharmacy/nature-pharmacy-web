import { test, expect } from '../../fixtures/base.fixture';
import { localizedUrl, ROUTES } from '../../helpers/locale-helpers';

test.describe('Product Multilingual Content', () => {
  test('product detail page content changes with locale', async ({ page }) => {
    // Load products page in French to get a product link
    await page.goto(localizedUrl('fr', ROUTES.products));
    await page.waitForLoadState('networkidle');

    const firstProductLink = page.locator('a[href*="/products/"]').first();
    await expect(firstProductLink).toBeVisible();

    // Extract the product slug from the href
    const href = await firstProductLink.getAttribute('href');
    const productPath = href?.replace(/^\/(fr|en|es)/, '') || '';

    // Load the same product in French and capture text
    await page.goto(localizedUrl('fr', productPath));
    await page.waitForLoadState('networkidle');
    const frenchContent = await page.locator('main').first().textContent();

    // Load the same product in English
    await page.goto(localizedUrl('en', productPath));
    await page.waitForLoadState('networkidle');
    const englishContent = await page.locator('main').first().textContent();

    // Content should differ between locales (translated product fields)
    expect(frenchContent).toBeTruthy();
    expect(englishContent).toBeTruthy();
    expect(frenchContent).not.toBe(englishContent);
  });

  test('product list page adapts to locale', async ({ page }) => {
    // Load products in French
    await page.goto(localizedUrl('fr', ROUTES.products));
    await page.waitForLoadState('networkidle');
    const frText = await page.locator('main').first().textContent();

    // Load products in English
    await page.goto(localizedUrl('en', ROUTES.products));
    await page.waitForLoadState('networkidle');
    const enText = await page.locator('main').first().textContent();

    expect(frText).toBeTruthy();
    expect(enText).toBeTruthy();
    // UI labels and product names should differ between locales
    expect(frText).not.toBe(enText);
  });

  test('add to cart button text changes with locale', async ({ page }) => {
    await page.goto(localizedUrl('fr', ROUTES.products));
    await page.waitForLoadState('networkidle');

    const firstProductLink = page.locator('a[href*="/products/"]').first();
    await expect(firstProductLink).toBeVisible();

    const href = await firstProductLink.getAttribute('href');
    const productPath = href?.replace(/^\/(fr|en|es)/, '') || '';

    // French: expect "Ajouter au panier" or similar
    await page.goto(localizedUrl('fr', productPath));
    await page.waitForLoadState('networkidle');
    const frButton = page.locator('button', { hasText: /panier|ajouter/i }).first();
    await expect(frButton).toBeVisible();
    const frButtonText = await frButton.textContent();

    // English: expect "Add to cart" or similar
    await page.goto(localizedUrl('en', productPath));
    await page.waitForLoadState('networkidle');
    const enButton = page.locator('button', { hasText: /cart|add/i }).first();
    await expect(enButton).toBeVisible();
    const enButtonText = await enButton.textContent();

    expect(frButtonText).not.toBe(enButtonText);
  });
});
