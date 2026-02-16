import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class AdminCategoriesPage extends BasePage {
  readonly categoryRows: Locator;
  readonly addButton: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.categoryRows = page.locator('table tbody tr, [class*="category-item"]');
    this.addButton = page.locator('button:has-text("Ajouter"), button:has-text("Add")');
  }

  async navigate(): Promise<void> { await this.goto('/admin/categories'); }
}
