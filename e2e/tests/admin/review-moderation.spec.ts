import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Review Moderation', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/reviews');
    await adminPage.waitForLoadState('networkidle');
  });

  test('reviews page loads', async ({ adminPage }) => {
    await expect(adminPage).toHaveURL(/\/fr\/admin\/reviews/);
    const heading = adminPage.locator('h1, [data-testid="page-title"]');
    await expect(heading.first()).toBeVisible();
  });

  test('review list or empty state is visible', async ({ adminPage }) => {
    const reviews = adminPage.locator(
      'table tbody tr, [data-testid="review-row"], [data-testid*="review-row"], .review-item',
    );
    const emptyState = adminPage.locator(
      '[data-testid="empty-state"], .empty-state, :text("aucun"), :text("Aucun"), :text("No reviews")',
    );

    const hasReviews = (await reviews.count()) > 0;
    const hasEmpty = (await emptyState.count()) > 0;
    expect(hasReviews || hasEmpty).toBeTruthy();
  });

  test('moderation controls exist', async ({ adminPage }) => {
    const reviews = adminPage.locator(
      'table tbody tr, [data-testid="review-row"], .review-item',
    );

    if ((await reviews.count()) === 0) {
      test.skip(true, 'No reviews available for moderation');
      return;
    }

    const firstReview = reviews.first();
    const moderationControls = firstReview.locator(
      'button:has-text("Approuver"), button:has-text("Approve"), button:has-text("Reject"), button:has-text("Rejeter"), [data-testid*="approve"], [data-testid*="reject"], [data-testid*="moderate"]',
    );
    await expect(moderationControls.first()).toBeVisible();
  });
});
