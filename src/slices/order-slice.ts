import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type TInitialState = {
  loading: boolean;
  errorText: string;
  orders: TOrder[] | null;
};

const initialState: TInitialState = {
  loading: false,
  errorText: '',
  orders: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setErrorText(state, action: PayloadAction<string>) {
      state.errorText = action.payload;
    },
    removeUserOrders(state) {
      state.orders = null;
    }
  },
  selectors: {
    selectLoading: (state) => state.loading,
    selectUserOrders: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      });
  }
});

export const fetchUserOrders = createAsyncThunk(
  'orders/all',
  async () => await getOrdersApi()
);

export const { selectLoading, selectUserOrders } = orderSlice.selectors;
export const { setErrorText, removeUserOrders } = orderSlice.actions;

export default orderSlice.reducer;
