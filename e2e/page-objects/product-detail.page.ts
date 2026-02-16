import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly addToCartButton: Locator;
  readonly productImages: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.productName = page.locator('h1').first();
    // The add-to-cart button text varies by locale:
    // FR: "Ajouter au panier", EN: "Add to Cart", ES: "Añadir al carrito"
    // Also matches "Ajouté" (added state) and generic patterns
    this.addToCartButton = page.locator('button').filter({
      hasText: /panier|cart|carrito|ajouter|add|añadir/i,
    }).first();
    this.productImages = page.locator('img[alt]');
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.addToCartButton.click();
    // Wait for cart to update
    await this.page.waitForTimeout(1000);
  }
}
