import { type Page } from '@playwright/test';

export class CheckoutPage {
  constructor(readonly page: Page) {}

  async fillInformation(first: string, last: string, postal: string): Promise<void> {
    await this.page.getByPlaceholder('First Name').fill(first);
    await this.page.getByPlaceholder('Last Name').fill(last);
    await this.page.getByPlaceholder('Zip/Postal Code').fill(postal);
  }

  async continue(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async finish(): Promise<void> {
    await this.page.getByRole('button', { name: 'Finish' }).click();
  }
}