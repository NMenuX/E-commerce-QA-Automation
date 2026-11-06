import { test, expect } from '../../fixtures/test';
import { users, productNames } from '../../test-data/shop-data';

test.describe('Product discovery and inventory', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('09 - inventory displays all six products', async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('10 - inventory is sorted by name A to Z', async ({ inventoryPage }) => {
    await inventoryPage.sort.selectOption('az');
    const names = await inventoryPage.page.locator('.inventory_item_name').allTextContents();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('11 - inventory is sorted by name Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sort.selectOption('za');
    const names = await inventoryPage.page.locator('.inventory_item_name').allTextContents();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('12 - inventory is sorted by price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sort.selectOption('lohi');
    const prices = await inventoryPage.page.locator('.inventory_item_price').allTextContents();
    const values = prices.map((price) => Number(price.replace('$', '')));
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  test('13 - inventory is sorted by price high to low', async ({ inventoryPage }) => {
    await inventoryPage.sort.selectOption('hilo');
    const prices = await inventoryPage.page.locator('.inventory_item_price').allTextContents();
    const values = prices.map((price) => Number(price.replace('$', '')));
    expect(values).toEqual([...values].sort((a, b) => b - a));
  });

  for (const [index, product] of productNames.entries()) {
    test(`${14 + index} - ${product} opens its detail page`, async ({ inventoryPage }) => {
      await inventoryPage.openProduct(product);
      await expect(inventoryPage.page.locator('.inventory_details_name')).toHaveText(product);
      await expect(inventoryPage.page.getByRole('button', { name: 'Back to products' })).toBeVisible();
    });
  }

  test('20 - product detail returns to inventory', async ({ inventoryPage }) => {
    await inventoryPage.openProduct(productNames[0]);
    await inventoryPage.page.getByRole('button', { name: 'Back to products' }).click();
    await expect(inventoryPage.title).toBeVisible();
    await expect(inventoryPage.items).toHaveCount(6);
  });
});