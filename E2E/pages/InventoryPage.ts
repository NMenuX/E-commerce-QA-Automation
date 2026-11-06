import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly items: Locator;
  readonly cartBadge: Locator;
  readonly sort: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText('Products', { exact: true });
    this.items = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sort = page.locator('[data-test="product-sort-container"]');
  }

  async addProduct(name: string): Promise<void> {
    const item = this.items.filter({ has: this.page.getByText(name, { exact: true }) });
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async openProduct(name: string): Promise<void> {
    await this.page.getByText(name, { exact: true }).click();
  }

  async openCart(): Promise<void> {
    await this.page.locator('.shopping_cart_link').click();
  }
}