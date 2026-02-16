import { test, expect } from '../../fixtures/api.fixture';

test.describe('Orders API', () => {
  test.describe('GET /api/orders', () => {
    test('without auth returns 401 or redirects', async ({ publicApi }) => {
      const response = await publicApi.get('/api/orders');
      expect(response.status() === 401 || response.status() === 302).toBeTruthy();
    });

    test('as buyer returns orders array', async ({ buyerApi }) => {
      const response = await buyerApi.get('/api/orders');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      // Response should contain an array of orders (may be empty for new accounts)
      const orders = Array.isArray(data) ? data : data.orders;
      expect(Array.isArray(orders)).toBeTruthy();
    });
  });

  test.describe('POST /api/orders', () => {
    test('without auth returns 401 or redirects', async ({ publicApi }) => {
      const response = await publicApi.post('/api/orders', {
        data: {
          items: [{ productId: '000000000000000000000000', quantity: 1 }],
          shippingAddress: {
            street: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zip: '12345',
            country: 'US',
          },
        },
      });
      expect(response.status() === 401 || response.status() === 302).toBeTruthy();
    });
  });
});
