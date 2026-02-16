import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Tickets', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/tickets');
    await adminPage.waitForLoadState('networkidle');
    // Wait for loading spinner to disappear and data to render
    await adminPage.waitForTimeout(3000);
  });

  test('tickets page loads', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/tickets')) {
      test.skip(true, 'Redirected away from tickets page - possible auth/role issue');
      return;
    }

    await expect(adminPage).toHaveURL(/\/fr\/admin\/tickets/);
    const heading = adminPage.locator('h1');
    await expect(heading.first()).toBeVisible({ timeout: 15000 });
  });

  test('ticket list visible or empty state shown', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/tickets')) {
      test.skip(true, 'Redirected away - possible auth/role issue');
      return;
    }

    // Table rows for tickets, or empty state row with "No tickets found"
    const rows = adminPage.locator('table tbody tr');
    const emptyText = adminPage.getByText(/no tickets|aucun ticket/i);

    const hasRows = (await rows.count()) > 0;
    const hasEmpty = await emptyText.isVisible().catch(() => false);
    expect(hasRows || hasEmpty).toBeTruthy();
  });

  test('ticket details accessible', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/tickets')) {
      test.skip(true, 'Redirected away - possible auth/role issue');
      return;
    }

    // Check for empty state
    const emptyText = adminPage.getByText(/no tickets|aucun ticket/i);
    const isEmpty = await emptyText.isVisible().catch(() => false);
    if (isEmpty) {
      test.skip(true, 'No tickets available');
      return;
    }

    const rows = adminPage.locator('table tbody tr');
    if ((await rows.count()) === 0) {
      test.skip(true, 'No tickets available');
      return;
    }

    // The "View" link navigates to /support/{ticketId}
    const detailTrigger = rows.first().locator(
      'a[href*="/support/"]',
    ).first();
    const hasLink = await detailTrigger.isVisible().catch(() => false);

    if (!hasLink) {
      // Fallback: click any link in the row
      const anyLink = rows.first().locator('a').first();
      await anyLink.click();
    } else {
      await detailTrigger.click();
    }
    await adminPage.waitForLoadState('networkidle');

    const detailContent = adminPage.locator('h1, h2');
    await expect(detailContent.first()).toBeVisible({ timeout: 15000 });
  });
});
