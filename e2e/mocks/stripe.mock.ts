import { Page, Route } from '@playwright/test';

/**
 * Mock Stripe checkout by intercepting Stripe.js and API calls
 */
export async function mockStripeCheckout(page: Page): Promise<void> {
  // Block Stripe.js from loading
  await page.route('https://js.stripe.com/**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `
        window.Stripe = function() {
          return {
            redirectToCheckout: async function({ sessionId }) {
              window.location.href = window.location.origin + '/fr/orders?payment=success&session_id=' + sessionId;
              return { error: null };
            },
            elements: function() {
              return { create: function() { return { mount: function() {}, on: function() {} }; } };
            },
          };
        };
      `,
    });
  });

  // Mock Stripe Connect pages
  await page.route('https://connect.stripe.com/**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<html><body>Mock Stripe Connect</body></html>',
    });
  });
}
