import { test, expect } from '../../fixtures/auth.fixture';
import { SellerProductsPage } from '../../page-objects/seller/seller-products.page';
import { mockBlobUpload } from '../../mocks/blob-storage.mock';

test.describe('Seller Product Edit', () => {
  test('seller can navigate to edit existing product', async ({ sellerPage }) => {
    const sellerProductsPage = new SellerProductsPage(sellerPage);
    await sellerProductsPage.navigate();
    await sellerPage.waitForLoadState('networkidle');
    // Wait for products to load
    await sellerPage.waitForTimeout(2000);

    const hasProducts = await sellerProductsPage.productRows.count() > 0;
    test.skip(!hasProducts, 'No products available to edit');

    // The edit link is an SVG icon link with title="Modifier" or similar
    const editLink = sellerProductsPage.productRows
      .first()
      .locator('a[href*="/seller/products/"]').first();
    const editLinkExists = await editLink.isVisible().catch(() => false);

    if (editLinkExists) {
      await editLink.click();
    } else {
      await sellerProductsPage.productRows.first().click();
    }
    await sellerPage.waitForLoadState('networkidle');

    await expect(sellerPage).toHaveURL(/\/fr\/seller\/products\/.+/);
  });

  test('edit form pre-populated with product data', async ({ sellerPage }) => {
    const sellerProductsPage = new SellerProductsPage(sellerPage);
    await sellerProductsPage.navigate();
    await sellerPage.waitForLoadState('networkidle');
    await sellerPage.waitForTimeout(2000);

    const hasProducts = await sellerProductsPage.productRows.count() > 0;
    test.skip(!hasProducts, 'No products available to edit');

    const editLink = sellerProductsPage.productRows
      .first()
      .locator('a[href*="/seller/products/"]').first();
    const editLinkExists = await editLink.isVisible().catch(() => false);

    if (editLinkExists) {
      await editLink.click();
    } else {
      await sellerProductsPage.productRows.first().click();
    }
    await sellerPage.waitForLoadState('networkidle');
    // Wait for product data to be fetched and populated
    await sellerPage.waitForTimeout(3000);

    // The edit form uses controlled inputs without name attributes
    // The first text input should be the product name
    const nameField = sellerPage.locator('input[type="text"]').first();
    const nameValue = await nameField.inputValue();
    expect(nameValue.length).toBeGreaterThan(0);
  });

  test('seller can update product', async ({ sellerPage }) => {
    await mockBlobUpload(sellerPage);

    const sellerProductsPage = new SellerProductsPage(sellerPage);
    await sellerProductsPage.navigate();
    await sellerPage.waitForLoadState('networkidle');
    await sellerPage.waitForTimeout(2000);

    const hasProducts = await sellerProductsPage.productRows.count() > 0;
    test.skip(!hasProducts, 'No products available to edit');

    const editLink = sellerProductsPage.productRows
      .first()
      .locator('a[href*="/seller/products/"]').first();
    const editLinkExists = await editLink.isVisible().catch(() => false);

    if (editLinkExists) {
      await editLink.click();
    } else {
      await sellerProductsPage.productRows.first().click();
    }
    await sellerPage.waitForLoadState('networkidle');
    await sellerPage.waitForTimeout(3000);

    // The first text input is the product name
    const nameField = sellerPage.locator('input[type="text"]').first();
    await nameField.clear();
    await nameField.fill(`Updated Product ${Date.now()}`);

    const saveButton = sellerPage.getByRole('button', {
      name: /save|update|enregistrer|mettre à jour|modifications/i,
    });
    await saveButton.click();
    await sellerPage.waitForLoadState('networkidle');

    const successMessage = sellerPage.getByText(
      /updated|saved|success|mis à jour|enregistré/i
    );
    const redirected = sellerPage.url().match(/\/fr\/seller\/products(?!\/.+\/edit)/);

    const isSuccess = await successMessage.first().isVisible().catch(() => false);
    expect(isSuccess || !!redirected).toBeTruthy();
  });
});
