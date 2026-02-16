import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class MessagesPage extends BasePage {
  readonly conversationList: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;

  constructor(page: Page, locale: string = 'fr') {
    super(page, locale);
    this.conversationList = page.locator('a[href*="/messages/"]');
    this.messageInput = page.locator('input[type="text"], textarea').last();
    this.sendButton = page.locator('button[type="submit"]');
  }

  async navigate(): Promise<void> { await this.goto('/messages'); }
}
