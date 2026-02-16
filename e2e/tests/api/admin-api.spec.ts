import { test, expect } from '../../fixtures/api.fixture';

test.describe('Admin API', () => {
  test.describe('GET /api/admin/users', () => {
    test('without auth returns 401, 403 or redirects', async ({ publicApi }) => {
      const response = await publicApi.get('/api/admin/users');
      expect([401, 403, 302]).toContain(response.status());
    });

    test('as admin returns users list', async ({ adminApi }) => {
      const response = await adminApi.get('/api/admin/users');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      const users = Array.isArray(data) ? data : data.users;
      expect(Array.isArray(users)).toBeTruthy();
      expect(users.length).toBeGreaterThan(0);

      // Each user should have basic fields
      const firstUser = users[0];
      expect(firstUser.email || firstUser.name).toBeDefined();
    });

    test('as buyer returns 403 or 401', async ({ buyerApi }) => {
      const response = await buyerApi.get('/api/admin/users');
      expect(
        response.status() === 403 ||
        response.status() === 401 ||
        response.status() === 302
      ).toBeTruthy();
    });
  });

  test.describe('GET /api/admin/stats', () => {
    test('as admin returns statistics', async ({ adminApi }) => {
      const response = await adminApi.get('/api/admin/stats');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data).toBeDefined();
      // Stats should contain aggregate data like totals or counts
      expect(typeof data).toBe('object');
    });
  });
});
