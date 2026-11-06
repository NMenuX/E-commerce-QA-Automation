import { test, expect } from '../../fixtures/test';
import { users, productNames } from '../../test-data/shop-data';

test.describe('Shopping cart', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('21 - add one product and update cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addProduct(productNames[0]);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('22 - add multiple products and badge shows total', async ({ inventoryPage }) => {
    await inventoryPage.addProduct(productNames[0]);
    await inventoryPage.addProduct(productNames[1]);
    await inventoryPage.addProduct(productNames[2]);
    await expect(inventoryPage.cartBadge).toHaveText('3');
  });

  test('23 - remove product from inventory', async ({ inventoryPage }) => {
    await inventoryPage.addProduct(productNames[0]);
    await inventoryPage.items.filter({ hasText: productNames[0] }).getByRole('button', { name: 'Remove' }).click();
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  test('24 - add button changes to remove and back', async ({ inventoryPage }) => {
    const item = inventoryPage.items.filter({ hasText: productNames[0] });
    await item.getByRole('button', { name: 'Add to cart' }).click();
    await expect(item.getByRole('button', { name: 'Remove' })).toBeVisible();
    await item.getByRole('button', { name: 'Remove' }).click();
    await expect(item.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });

  test('25 - cart shows selected product and price', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProduct(productNames[0]);
    await inventoryPage.openCart();
    const item = cartPage.items.filter({ hasText: productNames[0] });
    await expect(item).toBeVisible();
    await expect(item.locator('.inventory_item_price')).toHaveText('$29.99');
  });

  test('26 - remove product from cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProduct(productNames[0]);
    await inventoryPage.openCart();
    await cartPage.removeProduct(productNames[0]);
    await expect(cartPage.items).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  test('27 - continue shopping returns to inventory', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.openCart();
    await cartPage.continueShopping();
    await expect(inventoryPage.title).toBeVisible();
  });

  test('28 - cart remains available after visiting product detail', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProduct(productNames[0]);
    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(1);
    await cartPage.continueShopping();
    await inventoryPage.openProduct(productNames[1]);
    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.items.first()).toContainText(productNames[0]);
  });
});