import { Page, Route } from '@playwright/test';

/**
 * Mock PayPal SDK and webhook
 */
export async function mockPayPalCheckout(page: Page): Promise<void> {
  // Block PayPal SDK
  await page.route('https://www.paypal.com/**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `window.paypal = { Buttons: function() { return { render: function() {}, isEligible: function() { return true; } }; } };`,
    });
  });

  await page.route('https://www.sandbox.paypal.com/**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `window.paypal = { Buttons: function() { return { render: function() {}, isEligible: function() { return true; } }; } };`,
    });
  });
}
