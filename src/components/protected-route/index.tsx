import React, { useLayoutEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { getUser } from '../slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuth = useSelector((state) => state.userSlice.isAuth);
  useLayoutEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  if (!isAuth && !onlyUnAuth) {
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  }
  if (isAuth && onlyUnAuth) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  return children;
};
