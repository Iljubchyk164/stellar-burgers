import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../slices/userSlice';
import { deleteUserOrders } from '../slices/ordersSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(deleteUserOrders());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
