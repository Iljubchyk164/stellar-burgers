import { test, expect, Page } from '@playwright/test';
import { setCookie } from '../src/utils/cookie';

async function addIngredient(page: Page, name: string) {
  await page
    .getByRole('listitem')
    .filter({ hasText: name })
    .getByRole('button', { name: 'Добавить' })
    .click();
}

test.describe('Constructor — E2E с HAR и моками', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./e2e/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.routeFromHAR('./e2e/hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });

    await page.routeFromHAR('./e2e/hars/order.har', {
      url: '**/api/orders',
      update: false
    });

    await page.addInitScript(() => {
      document.cookie = 'accessToken=Bearer test-accessToken; path=/';
      localStorage.setItem('refreshToken', 'test-refreshToken');
    });

    await page.goto('/');
  });

  test('не создаёт заказ с пустым конструктором', async ({ page }) => {
    const orderButton = page.getByRole('button', { name: 'Оформить заказ' });
    await orderButton.click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeHidden();
  });

  test('загружает ингредиенты из HAR', async ({ page }) => {
    const list = page.getByTestId('ingredients-list').first();
    await expect(list).toBeVisible();
  });

  test('добавляет один ингредиент в конструктор', async ({ page }) => {
    await addIngredient(page, 'Биокотлета из марсианской Магнолии');

    await expect(
      page.locator('.constructor-element__text', {
        hasText: 'Биокотлета из марсианской Магнолии'
      })
    ).toBeVisible();
  });

  test('добавляет булку в конструктор', async ({ page }) => {
    await page.getByRole('button', { name: 'Добавить' }).first().click();

    await expect(
      page.getByText('Краторная булка N-200i').first()
    ).toBeVisible();
  });

  test('добавляет начинку и соус', async ({ page }) => {
    await addIngredient(page, 'Соус Spicy-X');
    await addIngredient(page, 'Биокотлета из марсианской Магнолии');

    await expect(
      page.locator('.constructor-element__text', {
        hasText: 'Биокотлета из марсианской Магнолии'
      })
    ).toBeVisible();

    await expect(
      page.locator('.constructor-element__text', {
        hasText: 'Соус Spicy-X'
      })
    ).toBeVisible();
  });

  test('открывает модальное окно ингредиента', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();
  });

  test('закрывает модалку по крестику', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    await page.getByTestId('modal-close').click();
    await expect(modal).toBeHidden();
  });

  test('закрывает модалку по клику на оверлей', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    await page.mouse.click(10, 10);
    await expect(modal).toBeHidden();
  });

  test('создаёт заказ и проверяет номер', async ({ page }) => {
    const addButtons = page.getByRole('button', { name: 'Добавить' });

    await addButtons.first().click();
    await addButtons.nth(2).click();

    const orderButton = page.getByRole('button', { name: 'Оформить заказ' });
    const [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes('/api/orders') &&
          resp.request().method() === 'POST'
      ),
      orderButton.click()
    ]);

    // Диагностика: видим, что реально вернул сервер
    console.log('Статус /api/orders:', response.status());
    const body = await response.json();
    console.log('Тело /api/orders:', JSON.stringify(body));
    const orderNumber = body.order?.number;
    console.log('Номер заказа:', orderNumber);

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText(String(12345))).toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.getByTestId('modal-close').click();
    await expect(modal).toBeHidden();
  });
});
