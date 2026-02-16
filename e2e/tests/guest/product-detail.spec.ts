import { test, expect } from '../../fixtures/base.fixture';

test.describe('Product Detail - Guest', () => {
  test.beforeEach(async ({ productsPage, page }) => {
    await productsPage.navigate();
    await page.waitForLoadState('networkidle');

    const hasProducts = await productsPage.productCards.first().isVisible({ timeout: 15000 }).catch(() => false);
    if (!hasProducts) {
      test.skip(true, 'No products available');
      return;
    }

    await productsPage.clickFirstProduct();
    await page.waitForLoadState('networkidle');
  });

  test('Product detail page loads with product name', async ({ productDetailPage }) => {
    const productName = productDetailPage.productName;
    await expect(productName).toBeVisible({ timeout: 15000 });

    const nameText = await productName.textContent();
    expect(nameText).toBeTruthy();
    expect(nameText!.trim().length).toBeGreaterThan(0);
  });

  test('Product has images', async ({ productDetailPage }) => {
    const images = productDetailPage.productImages;
    await expect(images.first()).toBeVisible({ timeout: 15000 });

    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Add to cart button is visible', async ({ productDetailPage, page }) => {
    // Wait for the product data to fully load
    await page.waitForTimeout(2000);

    const addToCartBtn = productDetailPage.addToCartButton;
    await expect(addToCartBtn).toBeVisible({ timeout: 15000 });
  });

  test('Product detail shows price', async ({ page }) => {
    // Price is displayed in span elements with font-bold class - look for text with currency and digits
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible({ timeout: 15000 });

    // Wait for product data to load (prices are fetched from API)
    await page.waitForTimeout(2000);

    const bodyText = await mainContent.textContent();
    expect(bodyText).toBeTruthy();
    // Price should contain a number with currency symbol
    expect(bodyText).toMatch(/\d/);
    expect(bodyText).toMatch(/FCFA|XOF|\$|EUR|\u20AC|GBP|\u00A3|MAD|DH|CA\$/);
  });
});
