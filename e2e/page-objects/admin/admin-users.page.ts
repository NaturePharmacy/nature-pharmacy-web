import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class AdminUsersPage extends BasePage {
  readonly userRows: Locator;
  readonly searchInput: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.userRows = page.locator('table tbody tr');
    this.searchInput = page.locator('input[type="text"]');
  }

  async navigate(): Promise<void> { await this.goto('/admin/users'); }
}
