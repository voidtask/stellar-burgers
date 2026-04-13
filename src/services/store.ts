import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userSlice from '../slices/user-slice';
import feedSlice from '../slices/feed-slice';
import constructorSlice from '../slices/constructor-slice';
import orderSlice from '../slices/order-slice';

const rootReducer = combineReducers({
  user: userSlice,
  order: orderSlice,
  feed: feedSlice,
  contructor: constructorSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
