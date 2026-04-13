import { getIngredientsApi, getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TConstructorItems,
  TIngredient,
  TIngredientUnique,
  TOrder
} from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TInitialState = {
  ingredients: TIngredient[];
  loading: boolean;
  orderModalData: TOrder | null;
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  isModalOpened: boolean;
  errorText: string;
  oldOrderLoading: boolean;
  oldOrderError: string | null;
};

const initialState: TInitialState = {
  ingredients: [],
  loading: false,
  orderModalData: null,
  constructorItems: {
    bun: {
      price: 0
    },
    ingredients: []
  },
  orderRequest: false,
  isModalOpened: false,
  errorText: '',
  oldOrderLoading: false,
  oldOrderError: null
};

export const addIngredientWithUniqueId = (ingredient: TIngredient) => {
  const payload =
    ingredient.type === 'bun'
      ? ingredient
      : { ...ingredient, uniqueId: uuidv4() };
  return addIngredient(payload);
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => await getIngredientsApi()
);

export const fetchNewOrder = createAsyncThunk(
  'orders/newOrder',
  async (data: string[]) => await orderBurgerApi(data)
);

export const fetchOldOrder = createAsyncThunk(
  'orders/fetchOldOrder',
  async (orderNumber: number) => await getOrderByNumberApi(orderNumber)
);

const constructorSlice = createSlice({
  name: 'contructor',
  initialState,
  reducers: {
    addIngredient(
      state,
      action: PayloadAction<TIngredient | TIngredientUnique>
    ) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push(
          action.payload as TIngredientUnique
        );
      }
    },
    closeOrderRequest(state) {
      state.orderRequest = false;
      state.orderModalData = null;
      state.constructorItems = {
        bun: {
          price: 0
        },
        ingredients: []
      };
    },
    clearOrderModalData(state) {
      state.orderRequest = false;
      state.orderModalData = null;
      state.oldOrderError = null;
    },
    openModal(state) {
      state.isModalOpened = true;
      sessionStorage.setItem('isModalOpened', 'true');
    },
    closeModal(state) {
      state.isModalOpened = false;
      sessionStorage.setItem('isModalOpened', 'false');
    },
    deleteIngredient(state, action: PayloadAction<TIngredientUnique>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (_, index) => index !== ingredientIndex
        );
    },
    setErrorText(state, action: PayloadAction<string>) {
      state.errorText = action.payload;
    },
    removeErrorText(state) {
      state.errorText = '';
    },
    moveIngredientUp(state, action: PayloadAction<TIngredientUnique>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      const prevItem = state.constructorItems.ingredients[ingredientIndex - 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex - 1,
        2,
        action.payload,
        prevItem
      );
    },
    moveIngredientDown(state, action: PayloadAction<TIngredientUnique>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      const nextItem = state.constructorItems.ingredients[ingredientIndex + 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex,
        2,
        nextItem,
        action.payload
      );
    }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectLoading: (state) => state.loading,
    selectOrderModalData: (state) => state.orderModalData,
    selectConstructorItems: (state) => state.constructorItems,
    selectOrderRequest: (state) => state.orderRequest,
    selectIsModalOpened: (state) => state.isModalOpened,
    selectErrorText: (state) => state.errorText,
    selectOldOrderLoading: (state) => state.oldOrderLoading,
    selectOldOrderError: (state) => state.oldOrderError
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchNewOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchNewOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(fetchNewOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(fetchOldOrder.pending, (state) => {
        state.oldOrderLoading = true;
        state.oldOrderError = null;
      })
      .addCase(fetchOldOrder.fulfilled, (state, action) => {
        state.oldOrderLoading = false;
        state.orderModalData = action.payload.orders[0];
      })
      .addCase(fetchOldOrder.rejected, (state, action) => {
        state.oldOrderLoading = false;
        state.oldOrderError = action.error.message || 'Failed to fetch order';
      });
  }
});

export const {
  selectLoading,
  selectIngredients,
  selectOrderModalData,
  selectConstructorItems,
  selectOrderRequest,
  selectIsModalOpened,
  selectErrorText,
  selectOldOrderLoading,
  selectOldOrderError
} = constructorSlice.selectors;

export const {
  addIngredient,
  closeOrderRequest,
  clearOrderModalData,
  openModal,
  closeModal,
  deleteIngredient,
  removeErrorText,
  moveIngredientUp,
  moveIngredientDown
} = constructorSlice.actions;

export default constructorSlice.reducer;
