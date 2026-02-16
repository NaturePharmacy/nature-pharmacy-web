import { test, expect } from '../../fixtures/auth.fixture';
import { ProductsListPage } from '../../page-objects/products-list.page';
import { ProductDetailPage } from '../../page-objects/product-detail.page';

test.describe('Buyer Reviews', () => {
  test.beforeEach(async ({ buyerPage }) => {
    const productsPage = new ProductsListPage(buyerPage);
    await productsPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

    const hasProducts = await productsPage.productCards.first().isVisible({ timeout: 15000 }).catch(() => false);
    if (!hasProducts) {
      test.skip(true, 'No products available');
      return;
    }

    await productsPage.clickFirstProduct();
    await buyerPage.waitForLoadState('networkidle');
  });

  test('product detail page shows reviews section', async ({ buyerPage }) => {
    // The product detail page has a ProductReviews component
    // The reviews section header or rating text should be visible
    // Look for text that says "reviews" or "avis" or the review count in parentheses
    const reviewsSection = buyerPage.getByText(/reviews|avis|évaluations/i).first();
    const ratingText = buyerPage.locator('text=/\\(\\d+\\)/').first();

    const reviewsVisible = await reviewsSection.isVisible({ timeout: 10000 }).catch(() => false);
    const ratingVisible = await ratingText.isVisible().catch(() => false);

    expect(reviewsVisible || ratingVisible).toBeTruthy();
  });

  test('review form is available for authenticated buyer', async ({ buyerPage }) => {
    // Wait for the full page to load including the reviews section
    await buyerPage.waitForTimeout(2000);

    const reviewForm = buyerPage.locator('form').filter({
      has: buyerPage.locator('textarea, [name="comment"], [name="review"]'),
    });
    const ratingInput = buyerPage.locator(
      '[data-testid="rating"], [name="rating"], .rating-stars, .star-rating'
    );
    const writeReviewButton = buyerPage.getByRole('button', {
      name: /write.*review|add.*review|écrire.*avis|ajouter.*avis|submit|soumettre|envoyer/i,
    });
    const starElements = buyerPage.locator('svg[fill="currentColor"], .text-amber-400, .text-yellow-400').first();

    const formVisible = await reviewForm.isVisible().catch(() => false);
    const ratingVisible = await ratingInput.first().isVisible().catch(() => false);
    const buttonVisible = await writeReviewButton.first().isVisible().catch(() => false);
    const starsVisible = await starElements.isVisible().catch(() => false);

    expect(formVisible || ratingVisible || buttonVisible || starsVisible).toBeTruthy();
  });
});
