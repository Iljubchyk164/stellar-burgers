import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getAllOrders } from '../../components/slices/ordersSlice';
import { selectIngredientsLoading, selectOrderData } from '@selectors';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const orderData = useSelector(selectOrderData);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  if (!orderData.length || isIngredientsLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orderData}
      handleGetFeeds={() => {
        dispatch(getAllOrders());
      }}
    />
  );
};
