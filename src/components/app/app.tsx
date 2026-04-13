// @ts-ignore
import '../../index.css';

import { useEffect } from 'react';
import styles from './app.module.css';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
import {
  closeModal,
  fetchIngredients,
  openModal,
  selectIngredients,
  selectIsModalOpened
} from '../../slices/constructor-slice';
import { useDispatch, useSelector } from '../../services/store';
import { getCookie } from '../../utils/cookie';
import {
  getUserThunk,
  init,
  selectIsAuthenticated
} from '../../slices/user-slice';
import { fetchFeed, selectOrders } from '../../slices/feed-slice';
import { ProtectedRoute } from '../protected-route';

const token = getCookie('accessToken');

const App = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const isModalOpened = useSelector(selectIsModalOpened);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const ingredients = useSelector(selectIngredients);
  const feed = useSelector(selectOrders);

  const isModalView = location.state?.modal === true;

  const getBackgroundLocation = () => {
    if (location.state?.modal === true) {
      if (
        location.pathname.startsWith('/feed/') &&
        location.pathname.match(/^\/feed\/(\d+)$/)
      ) {
        return { ...location, pathname: '/feed', state: null };
      }

      if (
        location.pathname.startsWith('/profile/orders/') &&
        location.pathname.match(/^\/profile\/orders\/(\d+)$/)
      ) {
        return { ...location, pathname: '/profile/orders', state: null };
      }

      if (location.pathname.startsWith('/ingredients/')) {
        return { ...location, pathname: '/', state: null };
      }
    }

    return location.state?.background || location;
  };

  const backgroundLocation = getBackgroundLocation();

  const handleCloseModal = () => {
    dispatch(closeModal());

    if (location.pathname.startsWith('/ingredients')) {
      navigate('/', { replace: true });
    } else {
      const basePath = location.pathname.includes('/profile')
        ? '/profile/orders'
        : '/feed';

      navigate(basePath, { replace: true });
    }
  };

  useEffect(() => {
    const modalState = sessionStorage.getItem('isModalOpened');
    if (modalState === 'true') {
      dispatch(openModal());
    }

    if (!isAuthenticated && token) {
      dispatch(getUserThunk()).then(() => dispatch(init()));
    } else {
      dispatch(init());
    }

    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }

    if (!feed.length) {
      dispatch(fetchFeed());
    }
  }, [dispatch, isAuthenticated, ingredients.length, feed.length]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute unAuthOnly>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute unAuthOnly>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute unAuthOnly>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute unAuthOnly>
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

      {(isModalOpened || isModalView) && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Описание ингредиента'} onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={'Заказ'} onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title={'Заказ'} onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
