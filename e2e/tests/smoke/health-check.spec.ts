import { test, expect } from '@playwright/test';

const LOCALES = ['fr', 'en', 'es'];

test.describe('Health Check - Site Availability', () => {
  for (const locale of LOCALES) {
    test(`Homepage returns 200 for locale: ${locale}`, async ({ page }) => {
      const response = await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      expect(response).not.toBeNull();
      expect(response!.status()).toBeLessThan(400);
    });
  }
});

test.describe('Health Check - API Endpoints', () => {
  test('GET /api/products returns 200', async ({ request }) => {
    const response = await request.get('/api/products', { timeout: 30000 });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toBeDefined();
  });

  test('GET /api/categories returns 200', async ({ request }) => {
    const response = await request.get('/api/categories', { timeout: 30000 });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toBeDefined();
  });
});

test.describe('Health Check - Static Assets', () => {
  test('CSS and JS assets load successfully', async ({ page }) => {
    const failedResources: string[] = [];

    page.on('response', (response) => {
      const url = response.url();
      const isAsset = url.endsWith('.css') || url.endsWith('.js') || url.includes('/_next/');
      const isImageOptimization = url.includes('/_next/image');
      if (isAsset && !isImageOptimization && response.status() >= 400) {
        failedResources.push(`${response.status()} - ${url}`);
      }
    });

    await page.goto('/fr', { waitUntil: 'load', timeout: 30000 });

    const scripts = await page.locator('script[src]').count();
    const styles = await page.locator('link[rel="stylesheet"]').count();

    expect(scripts + styles).toBeGreaterThan(0);
    expect(failedResources, `Failed resources: ${failedResources.join(', ')}`).toHaveLength(0);
  });
});
