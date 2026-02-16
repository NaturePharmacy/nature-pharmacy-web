import { test, expect } from '../../fixtures/api.fixture';

test.describe('Shipping API', () => {
  test.describe('GET /api/shipping/zones', () => {
    test('returns shipping zones', async ({ publicApi }) => {
      const response = await publicApi.get('/api/shipping/zones');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data).toBeDefined();
    });

    test('zones have expected structure', async ({ publicApi }) => {
      const response = await publicApi.get('/api/shipping/zones');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      const zones = Array.isArray(data) ? data : data.zones ?? data.shippingZones;
      if (Array.isArray(zones) && zones.length > 0) {
        const firstZone = zones[0];
        expect(firstZone.name || firstZone.zone || firstZone.country).toBeDefined();
      }
    });
  });
});
