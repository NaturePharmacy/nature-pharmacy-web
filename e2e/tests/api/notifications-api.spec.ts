import { test, expect } from '../../fixtures/api.fixture';

test.describe('Notifications API', () => {
  test.describe('GET /api/notifications', () => {
    test('without auth returns 401 or redirects', async ({ publicApi }) => {
      const response = await publicApi.get('/api/notifications');
      expect(response.status() === 401 || response.status() === 302).toBeTruthy();
    });

    test('as buyer returns notifications', async ({ buyerApi }) => {
      const response = await buyerApi.get('/api/notifications');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      const notifications = Array.isArray(data) ? data : data.notifications;
      expect(Array.isArray(notifications)).toBeTruthy();
    });
  });
});

test.describe('User Profile API', () => {
  test.describe('GET /api/user/profile', () => {
    test('as buyer returns profile data', async ({ buyerApi }) => {
      const response = await buyerApi.get('/api/user/profile');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data).toBeDefined();
      expect(data.email || data.name || data.user).toBeDefined();
    });
  });

  test.describe('PUT /api/user/profile', () => {
    test('as buyer updates profile', async ({ buyerApi }) => {
      // First get current profile
      const getRes = await buyerApi.get('/api/user/profile');
      const currentProfile = await getRes.json();

      // Update with a minor change (toggle or append to preserve data)
      const updatedName = currentProfile.name
        ? currentProfile.name
        : 'Test Buyer';

      const response = await buyerApi.put('/api/user/profile', {
        data: { name: updatedName },
      });
      expect(response.ok()).toBeTruthy();

      const updated = await response.json();
      expect(updated.name || updated.user?.name).toBeDefined();
    });
  });
});
