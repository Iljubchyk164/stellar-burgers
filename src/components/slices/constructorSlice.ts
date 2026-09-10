import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../utils/types';
import { v4 } from 'uuid';

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
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.ingredients.push(payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: v4() }
      })
    },
    clearConstructor: (state) => {
      state.ingredients = [];
      state.bun = null;
    }
  }
});

export default constructorSlice.reducer;
export const { addIngredient, movaDown, movaUp, deleteItem, clearConstructor } =
  constructorSlice.actions;
