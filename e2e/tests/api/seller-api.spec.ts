import { test, expect } from '../../fixtures/api.fixture';

test.describe('Seller API', () => {
  test.describe('GET /api/seller/products', () => {
    test('without auth returns 401 or redirects', async ({ publicApi }) => {
      const response = await publicApi.get('/api/seller/products');
      expect(response.status() === 401 || response.status() === 302).toBeTruthy();
    });

    test('as seller returns products', async ({ sellerApi }) => {
      const response = await sellerApi.get('/api/seller/products');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      const products = Array.isArray(data) ? data : data.products;
      expect(Array.isArray(products)).toBeTruthy();
    });

    test('as buyer returns 401 or 403', async ({ buyerApi }) => {
      const response = await buyerApi.get('/api/seller/products');
      expect(
        response.status() === 401 ||
        response.status() === 403 ||
        response.status() === 302
      ).toBeTruthy();
    });
  });

  test.describe('GET /api/seller/stats', () => {
    test('as seller returns stats', async ({ sellerApi }) => {
      const response = await sellerApi.get('/api/seller/stats');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data).toBeDefined();
      expect(typeof data).toBe('object');
    });
  });

  test.describe('GET /api/seller/orders', () => {
    test('as seller returns orders', async ({ sellerApi }) => {
      const response = await sellerApi.get('/api/seller/orders');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      const orders = Array.isArray(data) ? data : data.orders;
      expect(Array.isArray(orders)).toBeTruthy();
    });
  });
});
