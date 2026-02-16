import { test, expect } from '../../fixtures/api.fixture';

test.describe('Coupons API', () => {
  test.describe('POST /api/coupons/validate', () => {
    test('with invalid code returns error', async ({ buyerApi }) => {
      const response = await buyerApi.post('/api/coupons/validate', {
        data: { code: 'INVALID_COUPON_XYZ_999' },
      });
      // Should return 400 or 404 for an invalid coupon
      expect(response.status() === 400 || response.status() === 404).toBeTruthy();

      const data = await response.json();
      expect(data.error || data.message).toBeDefined();
    });
  });

  test.describe('GET /api/coupons', () => {
    test('without admin auth returns 401 or redirects', async ({ publicApi }) => {
      const response = await publicApi.get('/api/coupons');
      expect(response.status() === 401 || response.status() === 302).toBeTruthy();
    });

    test('as admin returns coupon list', async ({ adminApi }) => {
      const response = await adminApi.get('/api/coupons');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      const coupons = Array.isArray(data) ? data : data.coupons;
      expect(Array.isArray(coupons)).toBeTruthy();
    });
  });
});
