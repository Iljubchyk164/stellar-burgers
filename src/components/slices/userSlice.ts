import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

interface UserState {
  userData: TUser | null;
  isAuth: boolean;
  isAuthChecked: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: null,
  isAuth: false,
  isAuthChecked: false,
  error: null
};

export const updateUser = createAsyncThunk(
  'update/get',
  async (user: TRegisterData) => await updateUserApi(user)
);

export const logoutUser = createAsyncThunk(
  'logout/get',
  async () => await logoutApi()
);

export const getUser = createAsyncThunk(
  'getUser/get',
  async () => await getUserApi()
);

export const postRegister = createAsyncThunk(
  'register/post',
  async (data: TRegisterData) => await registerUserApi(data)
);

export const postLogin = createAsyncThunk(
  'login/post',
  async (data: TLoginData) => await loginUserApi(data)
);

const userSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postRegister.pending, (state) => {
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(postRegister.fulfilled, (state, action) => {
        state.isAuth = true;
        state.userData = action.payload.user;
        state.error = null;
        state.isAuthChecked = true;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(postRegister.rejected, (state, action) => {
        state.isAuth = false;
        state.isAuthChecked = true;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(postLogin.pending, (state) => {
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(postLogin.fulfilled, (state, action) => {
        state.isAuth = true;
        state.isAuthChecked = true;
        state.userData = action.payload.user;
        state.error = null;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(postLogin.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка входа';
        state.isAuthChecked = true;
      })
      .addCase(getUser.pending, (state) => {
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.isAuth = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error =
          action.error.message || 'Ошибка получения данных пользователя';
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isAuth = false;
        state.isAuthChecked = true;
        state.userData = null;
        localStorage.clear();
        deleteCookie('accessToken');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка входа';
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка сохранения';
      });
  }
});

export default userSlice.reducer;
