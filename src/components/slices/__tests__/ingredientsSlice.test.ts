import reducer, { ingredientsFetch } from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';

const initialState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image.png',
    image_mobile: 'image-mobile.png',
    image_large: 'image-large.png'
  }
];

describe('ingredientsSlice reducer', () => {
  test('возвращает initialState при неизвестном экшене', () => {
    const result = reducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('обрабатывает ingredientsFetch.pending', () => {
    const stateWithError = {
      ...initialState,
      error: 'ошибка'
    };

    const action = ingredientsFetch.pending('requestId');
    const result = reducer(stateWithError, action);

    expect(result.isIngredientsLoading).toBe(true);
    expect(result.error).toBeNull();
    expect(result.ingredients).toEqual([]);
  });

  test('обрабатывает ingredientsFetch.fulfilled', () => {
    const loadingState = {
      ...initialState,
      isIngredientsLoading: true
    };

    const action = ingredientsFetch.fulfilled(mockIngredients, 'requestId');
    const result = reducer(loadingState, action);

    expect(result.isIngredientsLoading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
    expect(result.error).toBeNull();
  });

  test('обрабатывает ingredientsFetch.rejected', () => {
    const loadingState = {
      ...initialState,
      isIngredientsLoading: true
    };

    const action = ingredientsFetch.rejected(new Error('ошибка'), 'requestId');
    const result = reducer(loadingState, action);

    expect(result.isIngredientsLoading).toBe(false);
    expect(result.error).toBe('ошибка' || 'Нет ингредиентов');
  });
});
