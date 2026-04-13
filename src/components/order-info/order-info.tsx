import { FC, useEffect, useMemo } from 'react';
import { OrderInfoUI, Preloader } from '@ui';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { selectOrders } from '../../slices/feed-slice';
import {
  fetchOldOrder,
  selectIngredients,
  selectOldOrderError,
  selectOldOrderLoading,
  selectOrderModalData,
  clearOrderModalData
} from '../../slices/constructor-slice';

export const OrderInfo: FC = () => {
  const params = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useDispatch();

  const orders = useSelector(selectOrders);
  const ingredients = useSelector(selectIngredients);
  const orderModalData = useSelector(selectOrderModalData);
  const oldOrderLoading = useSelector(selectOldOrderLoading);
  const oldOrderError = useSelector(selectOldOrderError);

  const orderNumber = params.number ? parseInt(params.number) : null;

  if (!orderNumber) {
    const basePath = location.pathname.includes('/profile')
      ? '/profile/orders'
      : '/feed';
    return <Navigate to={basePath} replace />;
  }

  const orderFromFeed = orders.find((item) => item.number === orderNumber);

  useEffect(() => {
    if (
      !orderFromFeed &&
      !orderModalData &&
      !oldOrderLoading &&
      !oldOrderError
    ) {
      dispatch(fetchOldOrder(orderNumber));
    }
  }, [
    dispatch,
    orderFromFeed,
    orderModalData,
    oldOrderLoading,
    oldOrderError,
    orderNumber
  ]);

  useEffect(
    () => () => {
      dispatch(clearOrderModalData());
    },
    [dispatch]
  );

  const orderData = orderFromFeed || orderModalData;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
