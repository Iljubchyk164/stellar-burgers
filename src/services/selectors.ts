import { RootState } from './store';

export const selectIngredients = (store: RootState) =>
  store.ingredientsSlice.ingredients;

export const selectIngredientsLoading = (store: RootState) =>
  store.ingredientsSlice.isIngredientsLoading;

export const selectIngredientsError = (store: RootState) =>
  store.ingredientsSlice.error;

export const selectOrderData = (store: RootState) =>
  store.ordersSlice.orderData;

export const selectOrderRequest = (store: RootState) =>
  store.ordersSlice.orderRequest;

export const selectOrderModalDataResponse = (store: RootState) =>
  store.ordersSlice.orderModalDataResponse;

export const selectOrderModalData = (store: RootState) =>
  store.ordersSlice.orderModalData;

export const selectUserOrdersData = (store: RootState) =>
  store.ordersSlice.userOrdersData;

export const selectTotalOrders = (store: RootState) =>
  store.ordersSlice.totalOrders;

export const selectTotalToday = (store: RootState) =>
  store.ordersSlice.totalToday;

export const selectOrderError = (store: RootState) => store.ordersSlice.error;

export const selectConstructorIngredients = (store: RootState) =>
  store.constructorSlice.ingredients;

export const selectConstructorBun = (store: RootState) =>
  store.constructorSlice.bun;

export const selectUserData = (store: RootState) => store.userSlice.userData;

export const selectIsAuth = (store: RootState) => store.userSlice.isAuth;

export const selectUserError = (store: RootState) => store.userSlice.error;
