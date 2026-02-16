import { test, expect } from '@playwright/test';
import { mockGeoDetection, COUNTRY_CURRENCIES } from '../../mocks/geo.mock';
import { localizedUrl, ROUTES } from '../../helpers/locale-helpers';

test.describe('Currency Geo-Detection', () => {
  test('user from Senegal (SN) sees XOF / FCFA prices', async ({ page }) => {
    await mockGeoDetection(page, 'SN');
    await page.goto(localizedUrl('fr', ROUTES.products));
    await page.waitForLoadState('networkidle');

    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    // XOF displays as "FCFA" in the UI
    expect(bodyText).toMatch(/FCFA|XOF/i);
  });

  test('user from France (FR) sees EUR prices', async ({ page }) => {
    await mockGeoDetection(page, 'FR');
    await page.goto(localizedUrl('fr', ROUTES.products));
    await page.waitForLoadState('networkidle');

    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText).toMatch(/EUR|\u20AC/); // EUR symbol or euro sign
  });

  test('user from US sees USD prices', async ({ page }) => {
    await mockGeoDetection(page, 'US');
    await page.goto(localizedUrl('en', ROUTES.products));
    await page.waitForLoadState('networkidle');

    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText).toMatch(/USD|\$/);
  });

  test('user from Morocco (MA) sees MAD prices', async ({ page }) => {
    await mockGeoDetection(page, 'MA');
    await page.goto(localizedUrl('fr', ROUTES.products));
    await page.waitForLoadState('networkidle');

    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    // MAD displays as "DH" or "MAD" in the UI
    expect(bodyText).toMatch(/MAD|DH/i);
  });

  test('detected currency matches country mapping', async ({ page }) => {
    const testCases = [
      { country: 'SN', expected: /FCFA|XOF/i },
      { country: 'GB', expected: /GBP|\u00A3/ },
      { country: 'CA', expected: /CAD|CA\$/ },
    ];

    for (const { country, expected } of testCases) {
      await mockGeoDetection(page, country);
      await page.goto(localizedUrl('fr', ROUTES.products));
      await page.waitForLoadState('networkidle');

      const bodyText = await page.textContent('body');
      expect(bodyText).toMatch(expected);
    }
  });
});
