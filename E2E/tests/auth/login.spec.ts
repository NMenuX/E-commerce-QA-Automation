import { test, expect } from '../../fixtures/test';
import { users } from '../../test-data/shop-data';

test.describe('Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('01 - standard user can log in', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(inventoryPage.title).toBeVisible();
  });

  test('02 - locked user receives an error', async ({ loginPage }) => {
    await loginPage.login(users.locked.username, users.locked.password);
    await expect(loginPage.error).toContainText('Sorry, this user has been locked out');
  });

  test('03 - invalid username and password are rejected', async ({ loginPage }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await expect(loginPage.error).toContainText('Username and password do not match');
  });

  test('04 - empty username is required', async ({ loginPage }) => {
    await loginPage.password.fill(users.standard.password);
    await loginPage.page.getByRole('button', { name: 'Login' }).click();
    await expect(loginPage.error).toContainText('Username is required');
  });

  test('05 - empty password is required', async ({ loginPage }) => {
    await loginPage.username.fill(users.standard.username);
    await loginPage.page.getByRole('button', { name: 'Login' }).click();
    await expect(loginPage.error).toContainText('Password is required');
  });

  test('06 - both credentials are required', async ({ loginPage }) => {
    await loginPage.page.getByRole('button', { name: 'Login' }).click();
    await expect(loginPage.error).toContainText('Username is required');
  });

  test('07 - error can be dismissed', async ({ loginPage }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await loginPage.page.locator('[data-test="error-button"]').click();
    await expect(loginPage.error).toBeHidden();
  });

  test('08 - password field masks entered characters', async ({ loginPage }) => {
    await loginPage.password.fill(users.standard.password);
    await expect(loginPage.password).toHaveAttribute('type', 'password');
  });
});