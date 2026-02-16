import { test, expect } from '../../fixtures/api.fixture';

test.describe('Wishlist API', () => {
  test.describe('GET /api/wishlist', () => {
    test('without auth returns 401 or redirects', async ({ publicApi }) => {
      const response = await publicApi.get('/api/wishlist');
      expect(response.status() === 401 || response.status() === 302).toBeTruthy();
    });

    test('as buyer returns wishlist', async ({ buyerApi }) => {
      const response = await buyerApi.get('/api/wishlist');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      // API returns { wishlist: { products: [...] }, count: N }
      expect(data.wishlist).toBeDefined();
      expect(Array.isArray(data.wishlist.products)).toBeTruthy();
      expect(typeof data.count).toBe('number');
    });
  });

  test.describe('POST /api/wishlist', () => {
    test('as buyer adds item to wishlist', async ({ buyerApi, publicApi }) => {
      // Get a valid product id
      const listRes = await publicApi.get('/api/products?limit=1');
      const listData = await listRes.json();
      const productId = listData.products[0]?.id ?? listData.products[0]?._id;
      expect(productId).toBeDefined();

      const response = await buyerApi.post('/api/wishlist', {
        data: { productId },
      });
      // Should succeed or indicate item already exists (API returns 400)
      expect(response.ok() || response.status() === 400).toBeTruthy();
    });
  });

  test.describe('DELETE /api/wishlist', () => {
    test('as buyer removes item from wishlist', async ({ buyerApi, publicApi }) => {
      // Ensure an item exists in the wishlist first
      const listRes = await publicApi.get('/api/products?limit=1');
      const listData = await listRes.json();
      const productId = listData.products[0]?.id ?? listData.products[0]?._id;

      // Add item (ignore if already present)
      await buyerApi.post('/api/wishlist', { data: { productId } });

      // DELETE uses query param, not body
      const response = await buyerApi.delete(`/api/wishlist?productId=${productId}`);
      expect(response.ok()).toBeTruthy();
    });
  });
});
