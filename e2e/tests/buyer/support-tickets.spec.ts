import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Buyer Support Tickets', () => {
  test('support page loads', async ({ buyerPage }) => {
    await buyerPage.goto('/fr/support');
    await buyerPage.waitForLoadState('networkidle');

    await expect(buyerPage).toHaveURL(/\/fr\/support/);

    const supportHeading = buyerPage.getByText(
      /support|help|aide|assistance|tickets/i
    );
    await expect(supportHeading.first()).toBeVisible();
  });

  test('buyer can view ticket list', async ({ buyerPage }) => {
    await buyerPage.goto('/fr/support');
    await buyerPage.waitForLoadState('networkidle');

    const ticketRows = buyerPage.locator(
      '[data-testid="ticket-row"], .ticket-item, table tbody tr'
    );
    const hasTickets = await ticketRows.count() > 0;

    if (hasTickets) {
      await expect(ticketRows.first()).toBeVisible();
    } else {
      const emptyState = buyerPage.getByText(
        /no tickets|aucun ticket|empty|vide/i
      );
      await expect(emptyState).toBeVisible();
    }
  });

  test('new ticket form accessible', async ({ buyerPage }) => {
    await buyerPage.goto('/fr/support');
    await buyerPage.waitForLoadState('networkidle');

    const newTicketButton = buyerPage.getByRole('button', {
      name: /new ticket|create ticket|nouveau ticket|créer/i,
    });
    const newTicketLink = buyerPage.getByRole('link', {
      name: /new ticket|create ticket|nouveau ticket|créer/i,
    });

    const buttonVisible = await newTicketButton.isVisible().catch(() => false);
    const linkVisible = await newTicketLink.isVisible().catch(() => false);

    expect(buttonVisible || linkVisible).toBeTruthy();

    if (buttonVisible) {
      await newTicketButton.click();
    } else {
      await newTicketLink.click();
    }
    await buyerPage.waitForLoadState('networkidle');

    const ticketForm = buyerPage.locator('form');
    await expect(ticketForm.first()).toBeVisible();
  });
});
