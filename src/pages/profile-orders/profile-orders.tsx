import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrders } from '../../components/slices/ordersSlice';
import { selectUserOrdersData } from '@selectors';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const userOrdersData = useSelector(selectUserOrdersData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const orders: TOrder[] = userOrdersData;

  return <ProfileOrdersUI orders={orders} />;
};
