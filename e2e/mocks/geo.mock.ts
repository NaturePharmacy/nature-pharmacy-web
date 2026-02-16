import { Page, Route } from '@playwright/test';

/**
 * Mock geo-detection API to simulate different countries/currencies
 */
export async function mockGeoDetection(page: Page, country: string = 'SN'): Promise<void> {
  await page.route('**/api/geo', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ country }),
    });
  });
}

/** Country to expected currency mapping */
export const COUNTRY_CURRENCIES: Record<string, string> = {
  SN: 'XOF',  // Senegal -> FCFA
  US: 'USD',
  FR: 'EUR',
  GB: 'GBP',
  MA: 'MAD',
  CA: 'CAD',
  CI: 'XOF',  // Ivory Coast -> FCFA
  ML: 'XOF',  // Mali -> FCFA
};
