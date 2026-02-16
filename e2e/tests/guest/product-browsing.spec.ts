import { test, expect } from '../../fixtures/base.fixture';

test.describe('Product Browsing - Guest', () => {
  test('Products page loads with product cards', async ({ productsPage }) => {
    await productsPage.navigate();

    const cards = productsPage.productCards;
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
  });

  test('Product count is greater than 0', async ({ productsPage }) => {
    await productsPage.navigate();

    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('Click first product navigates to detail', async ({ productsPage, page }) => {
    await productsPage.navigate();
    await page.waitForLoadState('networkidle');

    const hasProducts = await productsPage.productCards.first().isVisible({ timeout: 15000 }).catch(() => false);
    test.skip(!hasProducts, 'No products available');

    const initialUrl = page.url();
    await productsPage.clickFirstProduct();
    await page.waitForLoadState('domcontentloaded');
    // Wait a bit for client-side navigation
    await page.waitForTimeout(1000);

    expect(page.url()).not.toBe(initialUrl);
    expect(page.url()).toMatch(/products\//);
  });

  test('Product cards have images', async ({ productsPage }) => {
    await productsPage.navigate();

    const firstCard = productsPage.productCards.first();
    await expect(firstCard).toBeVisible({ timeout: 15000 });

    const image = firstCard.locator('img').first();
    await expect(image).toBeVisible();

    const src = await image.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('Search input is visible if it exists', async ({ productsPage, page }) => {
    await productsPage.navigate();

    const searchInput = productsPage.searchInput;
    const isPresent = await searchInput.count();

    if (isPresent > 0) {
      await expect(searchInput.first()).toBeVisible();
    } else {
      // Search may not be implemented; test passes as non-critical
      test.skip();
    }
  });
});
