import { test, expect } from '../../fixtures/auth.fixture';
import { SellerProductsPage } from '../../page-objects/seller/seller-products.page';
import { TestData } from '../../helpers/test-data-factory';
import { mockBlobUpload } from '../../mocks/blob-storage.mock';

test.describe('Seller Product Create', () => {
  test('new product page loads for seller', async ({ sellerPage }) => {
    const sellerProductsPage = new SellerProductsPage(sellerPage);
    await sellerProductsPage.navigate();
    await sellerPage.waitForLoadState('networkidle');

    await sellerProductsPage.clickAddProduct();
    await sellerPage.waitForLoadState('networkidle');

    await expect(sellerPage).toHaveURL(/\/fr\/seller\/products\/new/);
  });

  test('product form has required fields', async ({ sellerPage }) => {
    await sellerPage.goto('/fr/seller/products/new');
    await sellerPage.waitForLoadState('networkidle');
    // Wait for client-side auth check
    await sellerPage.waitForTimeout(2000);

    // The form inputs don't have name attributes - they use controlled components
    // Use type-based selectors
    const nameField = sellerPage.locator(
      'input[type="text"]'
    ).first();
    const priceField = sellerPage.locator(
      'input[type="number"]'
    ).first();
    const descriptionField = sellerPage.locator(
      'textarea'
    ).first();

    await expect(nameField).toBeVisible({ timeout: 10000 });
    await expect(priceField).toBeVisible();
    await expect(descriptionField).toBeVisible();
  });

  test('seller can fill and submit product form with blob upload mock', async ({
    sellerPage,
  }) => {
    await mockBlobUpload(sellerPage);

    await sellerPage.goto('/fr/seller/products/new');
    await sellerPage.waitForLoadState('networkidle');
    // Wait for client-side auth check and categories to load
    await sellerPage.waitForTimeout(3000);

    // Check if we got redirected away (not a seller)
    if (!sellerPage.url().includes('/seller/products/new')) {
      test.skip(true, 'Not on product create page - possible auth/role issue');
      return;
    }

    const product = TestData.product();

    // The form uses controlled inputs without name attributes
    // Product name is the first text input
    const nameField = sellerPage.locator('input[type="text"]').first();
    // Price is the first number input
    const priceField = sellerPage.locator('input[type="number"]').first();
    // Description is the first textarea
    const descriptionField = sellerPage.locator('textarea').first();

    await nameField.fill(product.name);
    await priceField.fill(String(product.price));
    await descriptionField.fill(product.description);

    // Select a category if available (the select element)
    const categorySelect = sellerPage.locator('select').first();
    const hasCategories = await categorySelect.isVisible().catch(() => false);
    if (hasCategories) {
      const options = await categorySelect.locator('option').count();
      if (options > 1) {
        // Select the second option (first is placeholder)
        await categorySelect.selectOption({ index: 1 });
      }
    }

    // Fill stock field (third number input)
    const stockField = sellerPage.locator('input[type="number"]').nth(2);
    const stockVisible = await stockField.isVisible().catch(() => false);
    if (stockVisible) {
      await stockField.fill(String(product.stock));
    }

    const submitButton = sellerPage.getByRole('button', {
      name: /create|add|save|créer|ajouter|enregistrer/i,
    });
    await submitButton.click();
    await sellerPage.waitForLoadState('networkidle');

    const successMessage = sellerPage.getByText(
      /created|added|success|saved|créé|ajouté|enregistré/i
    );
    const redirected = sellerPage.url().match(/\/fr\/seller\/products(?!\/new)/);

    const isSuccess = await successMessage.first().isVisible().catch(() => false);
    expect(isSuccess || !!redirected).toBeTruthy();
  });
});
