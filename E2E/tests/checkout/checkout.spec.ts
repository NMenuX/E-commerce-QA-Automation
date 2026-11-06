import { test, expect } from '../../fixtures/test';
import { users, productNames, customer } from '../../test-data/shop-data';

test.describe('Checkout and order completion', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.addProduct(productNames[0]);
    await inventoryPage.openCart();
  });

  test('29 - checkout starts from cart', async ({ cartPage, checkoutPage }) => {
    await cartPage.checkout();
    await expect(checkoutPage.page).toHaveURL(/checkout-step-one/);
    await expect(checkoutPage.page.getByText('Checkout: Your Information')).toBeVisible();
  });

  test('30 - empty first name is rejected', async ({ cartPage, checkoutPage }) => {
    await cartPage.checkout();
    await checkoutPage.fillInformation('', customer.lastName, customer.postalCode);
    await checkoutPage.continue();
    await expect(checkoutPage.page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('31 - empty last name is rejected', async ({ cartPage, checkoutPage }) => {
    await cartPage.checkout();
    await checkoutPage.fillInformation(customer.firstName, '', customer.postalCode);
    await checkoutPage.continue();
    await expect(checkoutPage.page.locator('[data-test="error"]')).toContainText('Last Name is required');
  });

  test('32 - empty postal code is rejected', async ({ cartPage, checkoutPage }) => {
    await cartPage.checkout();
    await checkoutPage.fillInformation(customer.firstName, customer.lastName, '');
    await checkoutPage.continue();
    await expect(checkoutPage.page.locator('[data-test="error"]')).toContainText('Postal Code is required');
  });

  test('33 - valid customer details proceed to order overview', async ({ cartPage, checkoutPage }) => {
    await cartPage.checkout();
    await checkoutPage.fillInformation(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutPage.continue();
    await expect(checkoutPage.page).toHaveURL(/checkout-step-two/);
    await expect(checkoutPage.page.getByText('Payment Information')).toBeVisible();
    await expect(checkoutPage.page.getByText('Shipping Information')).toBeVisible();
  });

  test('34 - order overview shows item and total', async ({ cartPage, checkoutPage }) => {
    await cartPage.checkout();
    await checkoutPage.fillInformation(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutPage.continue();
    await expect(checkoutPage.page.locator('.cart_item')).toContainText(productNames[0]);
    await expect(checkoutPage.page.locator('.summary_total_label')).toContainText('$32.39');
  });

  test('35 - cancel checkout returns to inventory', async ({ cartPage, checkoutPage }) => {
    await cartPage.checkout();
    await checkoutPage.page.getByRole('button', { name: 'Cancel' }).click();
    await expect(checkoutPage.page).toHaveURL(/inventory/);
  });

  test('36 - finish completes order and shows confirmation', async ({ cartPage, checkoutPage }) => {
    await cartPage.checkout();
    await checkoutPage.fillInformation(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutPage.continue();
    await checkoutPage.finish();
    await expect(checkoutPage.page).toHaveURL(/checkout-complete/);
    await expect(checkoutPage.page.getByText('Thank you for your order!')).toBeVisible();
  });

  test('37 - back home returns to inventory after order', async ({ cartPage, checkoutPage, inventoryPage }) => {
    await cartPage.checkout();
    await checkoutPage.fillInformation(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutPage.continue();
    await checkoutPage.finish();
    await checkoutPage.page.getByRole('button', { name: 'Back Home' }).click();
    await expect(inventoryPage.title).toBeVisible();
  });

  test('38 - completed order empties the cart', async ({ cartPage, checkoutPage, inventoryPage }) => {
    await cartPage.checkout();
    await checkoutPage.fillInformation(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutPage.continue();
    await checkoutPage.finish();
    await checkoutPage.page.locator('.shopping_cart_link').click();
    await expect(cartPage.items).toHaveCount(0);
  });
});