import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi
} from '@api';
import { TOrder } from '@utils-types';

interface OrdersState {
  orderRequest: boolean;
  orderModalDataResponse: TOrder | null;
  orderModalData: TOrder | null;
  orderData: TOrder[];
  userOrdersData: TOrder[];
  totalOrders: number;
  totalToday: number;
  error: string | null;
}

const initialState: OrdersState = {
  orderRequest: false,
  orderModalDataResponse: null,
  orderModalData: null,
  orderData: [],
  userOrdersData: [],
  totalOrders: 0,
  totalToday: 0,
  error: null
};

export const getOrderByNumber = createAsyncThunk(
  'orderNumber/get',
  async (number: number) => await getOrderByNumberApi(number)
);

export const getAllOrders = createAsyncThunk(
  'orders/all/get',
  async () => await getFeedsApi()
);

export const postOrder = createAsyncThunk(
  'orders/post',
  async (data: string[]) => await orderBurgerApi(data)
);

export const getUserOrders = createAsyncThunk(
  'orders/userOrders/get',
  async () => await getOrdersApi()
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
      state.orderModalDataResponse = null;
    },
    deleteUserOrders: (state) => {
      state.userOrdersData = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalDataResponse = {
          _id: action.payload.order._id,
          status: action.payload.order.status,
          name: action.payload.order.name,
          createdAt: action.payload.order.createdAt,
          updatedAt: action.payload.order.updatedAt,
          number: action.payload.order.number,
          ingredients: []
        };
        state.error = null;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка отправки заказов';
      })
      .addCase(getAllOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.totalOrders = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.orderData = action.payload.orders;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка отображения заказов';
      })
      .addCase(getUserOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrdersData = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.error =
          action.error.message || 'Ошибка отображения Ваших заказов';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderModalData = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message || 'Заказа с таким номером нет';
      });
  }
});

export default ordersSlice.reducer;
export const { closeOrderModal, deleteUserOrders } = ordersSlice.actions;
