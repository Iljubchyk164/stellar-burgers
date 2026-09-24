import reducer, {
  addIngredient,
  deleteItem,
  movaUp,
  movaDown,
  clearConstructor
} from '../constructorSlice';
import { TConstructorIngredient, TIngredient } from '../../../utils/types';

const initialState = {
  ingredients: [],
  bun: null
};

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_mobile: 'bun-mobile.png',
  image_large: 'bun-large.png'
};

const sauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'sauce.png',
  image_mobile: 'sauce-mobile.png',
  image_large: 'sauce-large.png'
};

const filling: TIngredient = {
  _id: 'filling-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'filling.png',
  image_mobile: 'filling-mobile.png',
  image_large: 'filling-large.png'
};

describe('constructorSlice reducer', () => {
  test('возвращает initialState при неизвестном экшене', () => {
    const result = reducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('addIngredient добавляет булку в конструктор', () => {
    const action = addIngredient(bun); // prepare добавит id
    const result = reducer(initialState, action);

    expect(result.bun).toMatchObject({
      _id: bun._id,
      name: bun.name,
      type: 'bun'
    });
    expect((result.bun as TConstructorIngredient)?.id).toEqual(
      expect.any(String)
    );
    expect(result.ingredients).toEqual([]);
  });

  test('addIngredient добавляет начинку в конструктор', () => {
    const action = addIngredient(filling);
    const result = reducer(initialState, action);

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toMatchObject({
      _id: filling._id,
      name: filling.name,
      type: filling.type
    });
    expect(result.ingredients[0].id).toEqual(expect.any(String));
    expect(result.bun).toBeNull();
  });

  test('addIngredient добавляет несколько ингредиентов по порядку', () => {
    const stateAfterFirst = reducer(initialState, addIngredient(sauce));
    const stateAfterSecond = reducer(stateAfterFirst, addIngredient(filling));

    expect(stateAfterSecond.ingredients).toHaveLength(2);
    expect(stateAfterSecond.ingredients[0]._id).toBe(sauce._id);
    expect(stateAfterSecond.ingredients[1]._id).toBe(filling._id);
  });

  test('deleteItem удаляет ингредиент по индексу', () => {
    const stateWithTwo = {
      ...initialState,
      ingredients: [
        { ...sauce, id: 'id-1' } as TConstructorIngredient,
        { ...filling, id: 'id-2' } as TConstructorIngredient
      ]
    };

    const result = reducer(stateWithTwo, deleteItem(0));

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]._id).toBe(filling._id);
  });

  test('movaUp перемещает ингредиент вверх', () => {
    const state = {
      ...initialState,
      ingredients: [
        { ...sauce, id: 'id-1' } as TConstructorIngredient,
        { ...filling, id: 'id-2' } as TConstructorIngredient
      ]
    };

    const result = reducer(state, movaUp(1));

    expect(result.ingredients[0]._id).toBe(filling._id);
    expect(result.ingredients[1]._id).toBe(sauce._id);
  });

  test('movaDown перемещает ингредиент вниз', () => {
    const state = {
      ...initialState,
      ingredients: [
        { ...sauce, id: 'id-1' } as TConstructorIngredient,
        { ...filling, id: 'id-2' } as TConstructorIngredient
      ]
    };

    const result = reducer(state, movaDown(0));

    expect(result.ingredients[0]._id).toBe(filling._id);
    expect(result.ingredients[1]._id).toBe(sauce._id);
  });

  test('clearConstructor очищает конструктор', () => {
    const state = {
      bun: { ...bun, id: 'id-bun' } as TConstructorIngredient,
      ingredients: [{ ...sauce, id: 'id-1' } as TConstructorIngredient]
    };

    const result = reducer(state, clearConstructor());

    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([]);
  });
});
