import { createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../utils/types';

interface ConstructorState {
  ingredients: TConstructorIngredient[];
  bun: TIngredient | null;
}

const initialState: ConstructorState = {
  ingredients: [],
  bun: null
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    deleteItem: (state, action) => {
      state.ingredients.splice(action.payload, 1);
    },
    movaUp: (state, action) => {
      const index = action.payload;
      const { ingredients } = state;
      [ingredients[index - 1], ingredients[index]] = [
        ingredients[index],
        ingredients[index - 1]
      ];
    },
    movaDown: (state, action) => {
      const index = action.payload;
      const { ingredients } = state;
      [ingredients[index], ingredients[index + 1]] = [
        ingredients[index + 1],
        ingredients[index]
      ];
    },
    setBun: (state, action) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action) => {
      state.ingredients = [...state.ingredients, action.payload];
    },
    clearConstructor: (state) => {
      state.ingredients = [];
      state.bun = null;
    }
  }
});

export default constructorSlice.reducer;
export const {
  addIngredient,
  setBun,
  movaDown,
  movaUp,
  deleteItem,
  clearConstructor
} = constructorSlice.actions;
