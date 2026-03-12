import { Page, Route } from '@playwright/test';

/**
 * Mock complet du SDK PayPal (@paypal/react-paypal-js)
 * - Intercepte le chargement du script PayPal
 * - Simule le rendu des boutons PayPal avec un vrai bouton cliquable
 * - Mock les appels API create-order et capture
 */
export async function mockPayPalCheckout(page: Page): Promise<void> {
  // Mock du script PayPal SDK (chargé par PayPalScriptProvider)
  await page.route('https://www.paypal.com/sdk/js**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `
        window.paypal = {
          Buttons: function(config) {
            return {
              isEligible: function() { return true; },
              render: function(container) {
                var btn = document.createElement('button');
                btn.setAttribute('data-testid', 'paypal-button-mock');
                btn.setAttribute('type', 'button');
                btn.textContent = 'Payer avec PayPal (test)';
                btn.style.cssText = 'background:#0070ba;color:#fff;padding:12px 24px;border:none;border-radius:4px;cursor:pointer;width:100%;font-size:16px;';
                btn.addEventListener('click', function() {
                  if (config && config.createOrder) {
                    config.createOrder().then(function(orderId) {
                      if (config.onApprove) {
                        config.onApprove({ orderID: orderId });
                      }
                    }).catch(function(err) {
                      if (config.onError) config.onError(err);
                    });
                  }
                });
                var el = typeof container === 'string' ? document.querySelector(container) : container;
                if (el) el.appendChild(btn);
                return Promise.resolve();
              },
              close: function() {}
            };
          }
        };
        console.log('[PayPal Mock] SDK loaded');
      `,
    });
  });

  // Mock sandbox
  await page.route('https://www.sandbox.paypal.com/**', async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });

  // Mock de notre API create-order
  await page.route('**/api/payments/paypal/create-order', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          paypalOrderId: 'MOCK-PAYPAL-ORDER-123',
          orderId: 'mock-db-order-id-456',
        }),
      });
    } else {
      await route.continue();
    }
  });

  // Mock de notre API capture
  await page.route('**/api/payments/paypal/capture', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          orderId: 'mock-db-order-id-456',
          status: 'paid',
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock d'une erreur PayPal (pour tester la gestion des erreurs)
 */
export async function mockPayPalError(page: Page): Promise<void> {
  await page.route('https://www.paypal.com/sdk/js**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `
        window.paypal = {
          Buttons: function(config) {
            return {
              isEligible: function() { return true; },
              render: function(container) {
                var btn = document.createElement('button');
                btn.setAttribute('data-testid', 'paypal-button-error');
                btn.textContent = 'PayPal (simuler erreur)';
                btn.style.cssText = 'background:#cc0000;color:#fff;padding:12px;border:none;border-radius:4px;cursor:pointer;width:100%;';
                btn.addEventListener('click', function() {
                  if (config && config.onError) {
                    config.onError(new Error('PayPal payment declined'));
                  }
                });
                var el = typeof container === 'string' ? document.querySelector(container) : container;
                if (el) el.appendChild(btn);
                return Promise.resolve();
              },
              close: function() {}
            };
          }
        };
      `,
    });
  });

  await page.route('**/api/payments/paypal/create-order', async (route: Route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'PayPal API unavailable' }),
    });
  });
}
