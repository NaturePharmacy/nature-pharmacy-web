import { test, expect } from '@playwright/test';

test.describe('Locale Switching', () => {
  test('Default locale fr loads correctly', async ({ page }) => {
    const response = await page.goto('/fr', { waitUntil: 'domcontentloaded' });
    expect(response!.status()).toBe(200);

    const html = page.locator('html');
    const lang = await html.getAttribute('lang');
    expect(lang).toMatch(/fr/);
  });

  test('Switch to English (/en)', async ({ page }) => {
    const response = await page.goto('/en', { waitUntil: 'domcontentloaded' });
    expect(response!.status()).toBe(200);

    const html = page.locator('html');
    const lang = await html.getAttribute('lang');
    expect(lang).toMatch(/en/);
    expect(page.url()).toContain('/en');
  });

  test('Switch to Spanish (/es)', async ({ page }) => {
    const response = await page.goto('/es', { waitUntil: 'domcontentloaded' });
    expect(response!.status()).toBe(200);

    const html = page.locator('html');
    const lang = await html.getAttribute('lang');
    expect(lang).toMatch(/es/);
    expect(page.url()).toContain('/es');
  });

  test('URL contains correct locale prefix after navigation', async ({ page }) => {
    const locales = ['fr', 'en', 'es'];

    for (const locale of locales) {
      await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded' });
      expect(page.url()).toContain(`/${locale}`);
    }
  });
});
