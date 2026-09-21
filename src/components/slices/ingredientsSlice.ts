import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '../../utils/types';

interface IngredientsState {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};

export const ingredientsFetch = createAsyncThunk(
  'ingredients/fetch',
  async () => await getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ingredientsFetch.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(ingredientsFetch.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(ingredientsFetch.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message || 'Нет ингредиентов';
      });
  }
});

export default ingredientsSlice.reducer;
