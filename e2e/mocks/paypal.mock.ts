import { Page, Route } from '@playwright/test';

/**
 * Mock complet du SDK PayPal compatible avec @paypal/react-paypal-js
 *
 * Stratégie :
 * 1. page.addInitScript() → injecte window.paypal AVANT tout JS de la page
 * 2. page.route() → bloque le vrai script SDK PayPal (évite erreurs réseau)
 * 3. Mock les API routes create-order et capture
 */
export async function mockPayPalCheckout(page: Page): Promise<void> {
  // ① Injecter window.paypal avant tout le JS de la page
  await page.addInitScript(() => {
    (window as any).paypal = {
      Buttons: function (config: any) {
        return {
          isEligible: () => true,
          render: async function (container: HTMLElement | string) {
            const target =
              typeof container === 'string'
                ? document.querySelector<HTMLElement>(container)
                : container;

            if (!target) return;

            const btn = document.createElement('button');
            btn.setAttribute('data-testid', 'paypal-button-mock');
            btn.setAttribute('type', 'button');
            btn.textContent = 'PayPal (test)';
            btn.style.cssText =
              'background:#0070ba;color:#fff;padding:12px 24px;border:none;border-radius:4px;cursor:pointer;width:100%;font-size:16px;margin-top:8px;';

            btn.addEventListener('click', async () => {
              try {
                if (config?.createOrder) {
                  const orderId = await config.createOrder();
                  if (config?.onApprove) {
                    await config.onApprove({ orderID: orderId });
                  }
                }
              } catch (err) {
                if (config?.onError) config.onError(err);
              }
            });

            target.innerHTML = '';
            target.appendChild(btn);
          },
          close: () => {},
        };
      },
      FUNDING: {
        PAYPAL: 'paypal',
        CARD: 'card',
      },
    };
  });

  // ② Bloquer le vrai script SDK PayPal
  await page.route('https://www.paypal.com/sdk/js**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: '// PayPal SDK blocked by test mock',
    });
  });

  await page.route('https://www.sandbox.paypal.com/**', async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });

  // ③ Mock API create-order
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

  // ④ Mock API capture
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
 * Mock d'erreur PayPal (test gestion d'erreurs)
 */
export async function mockPayPalError(page: Page): Promise<void> {
  await page.addInitScript(() => {
    (window as any).paypal = {
      Buttons: function (config: any) {
        return {
          isEligible: () => true,
          render: async function (container: HTMLElement | string) {
            const target =
              typeof container === 'string'
                ? document.querySelector<HTMLElement>(container)
                : container;
            if (!target) return;

            const btn = document.createElement('button');
            btn.setAttribute('data-testid', 'paypal-button-error');
            btn.setAttribute('type', 'button');
            btn.textContent = 'PayPal (erreur simulée)';
            btn.style.cssText =
              'background:#cc0000;color:#fff;padding:12px;border:none;border-radius:4px;cursor:pointer;width:100%;';

            btn.addEventListener('click', () => {
              if (config?.onError) config.onError(new Error('PayPal payment declined'));
            });

            target.innerHTML = '';
            target.appendChild(btn);
          },
          close: () => {},
        };
      },
      FUNDING: { PAYPAL: 'paypal', CARD: 'card' },
    };
  });

  await page.route('https://www.paypal.com/sdk/js**', async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });

  await page.route('**/api/payments/paypal/create-order', async (route: Route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'PayPal API unavailable' }),
    });
  });

  await page.route('**/api/payments/paypal/capture', async (route: Route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Capture failed' }),
    });
  });
}
