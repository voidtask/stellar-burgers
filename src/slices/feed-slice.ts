import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

type TInitialState = {
  loading: boolean;
  orders: TOrder[];
  totalOrders: number;
  ordersToday: number;
  errorText: string;
};

const initialState: TInitialState = {
  loading: false,
  orders: [],
  totalOrders: 0,
  ordersToday: 0,
  errorText: ''
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    removeOrders(state) {
      state.orders.length = 0;
    },
    setErrorText(state, action: PayloadAction<string>) {
      state.errorText = action.payload;
    },
    removeErrorText(state) {
      state.errorText = '';
    }
  },
  selectors: {
    selectLoading: (state) => state.loading,
    selectOrders: (state) => state.orders,
    selectTotalOrders: (state) => state.totalOrders,
    selectTodayOrders: (state) => state.ordersToday
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.errorText = action.error.message!;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.ordersToday = action.payload.totalToday;
      });
  }
});

export const fetchFeed = createAsyncThunk(
  'feed/list',
  async () => await getFeedsApi()
);

export const {
  selectLoading,
  selectOrders,
  selectTotalOrders,
  selectTodayOrders
} = feedSlice.selectors;

export const { removeOrders, setErrorText } = feedSlice.actions;

export default feedSlice.reducer;
