import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  postOrder,
  closeOrderModal as closeModal
} from '../slices/ordersSlice';
import { useNavigate } from 'react-router-dom';
import { clearConstructor } from '../slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const { bun, ingredients } = useSelector((store) => store.constructorSlice);
  const { orderRequest, orderModalData } = useSelector(
    (store) => store.ordersSlice
  );
  const { isAuth } = useSelector((store) => store.userSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuth) {
      navigate('/login');
      return;
    }
    dispatch(
      postOrder([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun._id
      ])
    ).then(() => {
      dispatch(clearConstructor());
    });
  };
  const closeOrderModal = () => {
    dispatch(closeModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
