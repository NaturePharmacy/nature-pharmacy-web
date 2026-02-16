import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly locale: string;

  constructor(page: Page, locale: string = 'fr') {
    this.page = page;
    this.locale = locale;
  }

  url(path: string): string {
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `/${this.locale}${clean}`;
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(this.url(path));
    await this.dismissCookieConsent();
  }

  async dismissCookieConsent(): Promise<void> {
    await this.page.evaluate(() => {
      if (!localStorage.getItem('cookie_consent')) {
        localStorage.setItem('cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false, preferences: false }));
        localStorage.setItem('cookie_consent_date', new Date().toISOString());
      }
    });
  }

  async waitForHydration(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  get header(): Locator { return this.page.locator('header').first(); }
  get footer(): Locator { return this.page.locator('footer').first(); }
}
