import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { useLocation, useNavigate } from 'react-router-dom';
import { closeOrderModal } from '../slices/ordersSlice';
import { useDispatch, useSelector } from '../../services/store';
import { getUser } from '../slices/userSlice';
import { ingredientsFetch } from '../slices/ingredientsSlice';
import { selectIngredients, selectIsAuth } from '@selectors';
import { useEffect } from 'react';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const background = location.state && location.state.background;
  const navigate = useNavigate();
  const feedOrderNumber = location.pathname.match(/\/feed\/(\d+)/)?.[1];
  const profileOrderNumber = location.pathname.match(
    /\/profile\/orders\/(\d+)/
  )?.[1];
  const ingredients = useSelector(selectIngredients);
  const isAuth = useSelector(selectIsAuth);
  useEffect(() => {
    if (!isAuth) {
      dispatch(getUser());
    }
    if (ingredients.length === 0) {
      dispatch(ingredientsFetch());
    }
  }, [dispatch]);

  function modalClose() {
    navigate(-1);
    dispatch(closeOrderModal());
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${feedOrderNumber}`} onClose={modalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={modalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={`#${profileOrderNumber}`} onClose={modalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
