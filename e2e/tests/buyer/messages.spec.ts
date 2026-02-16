import { test, expect } from '../../fixtures/auth.fixture';
import { MessagesPage } from '../../page-objects/messages.page';

test.describe('Buyer Messages', () => {
  test('messages page loads', async ({ buyerPage }) => {
    const messagesPage = new MessagesPage(buyerPage);
    await messagesPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

    await expect(buyerPage).toHaveURL(/\/fr\/messages/);
  });

  test('messages page shows conversation list or empty state', async ({ buyerPage }) => {
    const messagesPage = new MessagesPage(buyerPage);
    await messagesPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

    const hasConversations = await messagesPage.conversationList.count() > 0;

    if (hasConversations) {
      await expect(messagesPage.conversationList.first()).toBeVisible();
    } else {
      const emptyState = buyerPage.getByText(
        /no messages|no conversations|aucun message|aucune conversation|empty/i
      );
      await expect(emptyState).toBeVisible();
    }
  });
});
