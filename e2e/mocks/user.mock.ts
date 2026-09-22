import { Page } from '@playwright/test';
import { setCookie } from '../../src/utils/cookie';

export const mockUser = {
  success: true,
  user: {
    email: 'test@example.com',
    name: 'Test User'
  }
};

export const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token'
};

export const mockOrder = {
  success: true,
  name: 'Космический бургер',
  order: {
    number: 12345,
    _id: 'mock-order-id',
    status: 'done',
    name: 'Космический бургер',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    number_: 12345,
    ingredients: [],
    owner: {
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '',
      updatedAt: ''
    },
    price: 2000
  }
};

export async function setAuthTokens(page: Page) {
  await page.addInitScript((tokens) => {
    setCookie('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }, mockTokens);
}

export async function mockUserAndOrderRoutes(page: Page) {
  await page.route('**/api/auth/user', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser)
    })
  );

  await page.route('**/api/orders', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockOrder)
    })
  );
}
