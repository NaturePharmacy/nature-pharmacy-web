import { test, expect } from '@playwright/test';

async function dismissCookies(page: any) {
  await page.evaluate(() => {
    if (!localStorage.getItem('cookie_consent')) {
      localStorage.setItem('cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false, preferences: false }));
      localStorage.setItem('cookie_consent_date', new Date().toISOString());
    }
  });
}

test.describe('Navigation - Core Layout', () => {
  test('Header is visible on homepage', async ({ page }) => {
    await page.goto('/fr', { waitUntil: 'domcontentloaded' });
    await dismissCookies(page);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Footer is visible on homepage', async ({ page }) => {
    await page.goto('/fr', { waitUntil: 'domcontentloaded' });
    await dismissCookies(page);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Navigation - Page Transitions', () => {
  test('Navigate from home to products page', async ({ page }) => {
    await page.goto('/fr', { waitUntil: 'domcontentloaded' });
    await dismissCookies(page);
    await page.reload({ waitUntil: 'domcontentloaded' });

    const productsLink = page.locator('a[href="/fr/products"]').first();
    await expect(productsLink).toBeVisible({ timeout: 10000 });
    await productsLink.click();

    await page.waitForURL('**/products**', { timeout: 15000 });
    expect(page.url()).toContain('/products');
  });

  test('Navigate from products to product detail', async ({ page }) => {
    await page.goto('/fr/products', { waitUntil: 'domcontentloaded' });
    await dismissCookies(page);
    await page.reload({ waitUntil: 'domcontentloaded' });

    const productCard = page.locator('a[href*="/products/"]').first();
    await expect(productCard).toBeVisible({ timeout: 15000 });
    await productCard.click();

    await page.waitForURL('**/products/**', { timeout: 15000 });
    expect(page.url()).toMatch(/\/products\//);
  });

  test('Cart link is accessible', async ({ page }) => {
    await page.goto('/fr', { waitUntil: 'domcontentloaded' });
    await dismissCookies(page);
    await page.reload({ waitUntil: 'domcontentloaded' });

    const cartLink = page.locator('a[href="/fr/cart"]').first();
    await expect(cartLink).toBeVisible({ timeout: 10000 });
    await cartLink.click();

    await page.waitForURL('**/cart**', { timeout: 15000 });
    expect(page.url()).toContain('/cart');
  });
});
