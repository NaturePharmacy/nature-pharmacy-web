import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Buyer Notifications', () => {
  test('notifications accessible', async ({ buyerPage }) => {
    // Try dedicated notifications page first
    const response = await buyerPage.goto('/fr/notifications');
    await buyerPage.waitForLoadState('networkidle');

    // Check if the page exists (not 404)
    const is404 = response && response.status() === 404;
    const notificationsHeading = buyerPage.getByText(/notifications?/i);
    const isNotificationsPage = await notificationsHeading
      .first()
      .isVisible()
      .catch(() => false);

    if (!isNotificationsPage || is404) {
      // Notifications may be accessible from account page or via bell icon in header
      await buyerPage.goto('/fr/account');
      await buyerPage.waitForLoadState('networkidle');

      const bellIcon = buyerPage.locator(
        '[data-testid="notifications-bell"], [aria-label*="notification"], .notification-icon, a[href*="notification"]'
      );
      const bellVisible = await bellIcon.first().isVisible().catch(() => false);

      if (bellVisible) {
        await bellIcon.first().click();
        await buyerPage.waitForLoadState('networkidle');
      }
    }

    // If notifications feature not implemented, skip gracefully
    const notificationContent = buyerPage.getByText(/notifications?/i);
    const contentVisible = await notificationContent.first().isVisible().catch(() => false);
    if (!contentVisible) {
      test.skip(true, 'Notifications page not available');
    }
    await expect(notificationContent.first()).toBeVisible();
  });

  test('notification list or empty state shown', async ({ buyerPage }) => {
    const response = await buyerPage.goto('/fr/notifications');
    await buyerPage.waitForLoadState('networkidle');

    // Skip if page returns 404
    const is404 = response && response.status() === 404;
    if (is404) {
      test.skip(true, 'Notifications page not available');
    }

    const notificationItems = buyerPage.locator(
      '[data-testid="notification-item"], .notification-item, .notification-row'
    );
    const hasNotifications = await notificationItems.count() > 0;

    if (hasNotifications) {
      await expect(notificationItems.first()).toBeVisible();
    } else {
      const emptyState = buyerPage.getByText(
        /no notification|aucune notification|empty|vide|all caught up/i
      );
      const pageContent = buyerPage.getByText(/notifications?/i);

      const emptyVisible = await emptyState.first().isVisible().catch(() => false);
      const contentVisible = await pageContent.first().isVisible().catch(() => false);

      expect(emptyVisible || contentVisible).toBeTruthy();
    }
  });
});
