import { test, expect } from '../../fixtures/api.fixture';

test.describe('Auth API', () => {
  test.describe('GET /api/auth/session', () => {
    test('without auth returns empty or null user', async ({ publicApi }) => {
      const response = await publicApi.get('/api/auth/session');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      // Unauthenticated session should have no user or an empty object
      const hasNoUser = !data.user || Object.keys(data).length === 0;
      expect(hasNoUser).toBeTruthy();
    });

    test('with buyer auth returns user data', async ({ buyerApi }) => {
      const response = await buyerApi.get('/api/auth/session');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBeDefined();
    });
  });

  test.describe('GET /api/auth/providers', () => {
    test('returns available auth providers', async ({ publicApi }) => {
      const response = await publicApi.get('/api/auth/providers');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data).toBeDefined();
      expect(typeof data).toBe('object');
      // NextAuth should expose at least the credentials provider
      const providerKeys = Object.keys(data);
      expect(providerKeys.length).toBeGreaterThan(0);
    });
  });
});
