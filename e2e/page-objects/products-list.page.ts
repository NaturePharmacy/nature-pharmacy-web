import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductsListPage extends BasePage {
  readonly productCards: Locator;
  readonly searchInput: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.productCards = page.locator('a[href*="/products/"]');
    this.searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="cherch" i]');
  }

  async navigate(): Promise<void> {
    await this.goto('/products');
    await this.page.waitForLoadState('networkidle');
  }
  async getProductCount(): Promise<number> {
    await this.productCards.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    return await this.productCards.count();
  }
  async clickFirstProduct(): Promise<void> {
    await this.productCards.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.productCards.first().click();
  }
}
