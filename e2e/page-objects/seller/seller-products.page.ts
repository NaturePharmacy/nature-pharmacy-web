import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class SellerProductsPage extends BasePage {
  readonly productRows: Locator;
  readonly addProductButton: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.productRows = page.locator('table tbody tr');
    this.addProductButton = page.locator('a[href*="/seller/products/new"]');
  }

  async navigate(): Promise<void> { await this.goto('/seller/products'); }
  async clickAddProduct(): Promise<void> { await this.addProductButton.click(); }
}
