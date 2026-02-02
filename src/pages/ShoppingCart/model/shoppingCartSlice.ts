import { setAppErrorAC, setAppStatusAC } from "@/app/model/app-slice";
import type { RootState } from "@/app/providers/store/store";
import type { Product } from "@/pages/Main/model/productsSlice.types";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

export type ItemType = Product & { quantity: number };

export type ShoppingCartType = {
  items: ItemType[];
  totalPrice: number;
};

export const shoppingCartSlice = createSlice({
  name: "shoppingCartSlice",
  initialState: {
    items: [],
    totalPrice: 0,
  } as ShoppingCartType,
  selectors: {
    selectItemsInShoppingCart: (state) => state.items,
    selectTotalPrice: (state) => state.totalPrice,
    selectTotalQuantityItemInShoppingCart: (state) => state.items.length,
  },
  reducers: (create) => {
    return {
      addNewItem: create.reducer<{ item: Product }>((state, action) => {
        state.items.push({ ...action.payload.item, quantity: 1 });
        state.totalPrice += +action.payload.item.price.toFixed(2);
      }),
      addItem: create.reducer<{ id: number }>((state, action) => {
        const index = state.items.findIndex(
          (el) => el.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index].quantity += 1;
          state.totalPrice =
            +state.totalPrice.toFixed(2) + +state.items[index].price.toFixed(2);
        }
      }),
      deleteItem: create.reducer<{ id: number }>((state, action) => {
        const index = state.items.findIndex(
          (el) => el.id === action.payload.id,
        );
        if (index !== -1) {
          state.totalPrice =
            +state.totalPrice.toFixed(2) - +state.items[index].price.toFixed(2);
          state.items[index].quantity -= 1;
          if (state.items[index].quantity === 0) {
            state.items.splice(index, 1);
          }
        }
      }),
      fullDeleteItem: create.reducer<{ id: number }>((state, action) => {
        const index = state.items.findIndex(
          (el) => el.id === action.payload.id,
        );
        if (index !== -1) {
          state.totalPrice =
            +state.totalPrice.toFixed(2) -
            +(state.items[index].price * state.items[index].quantity).toFixed(
              2,
            );
          state.items.splice(index, 1);
        }
      }),
    };
  },
  extraReducers(builder) {
    builder.addCase(
      loadFromLocalStorageCart.fulfilled,
      (_state, action: PayloadAction<ShoppingCartType>) => {
        return action.payload;
      },
    );
  },
});

export const saveInLocalStorageCart = createAsyncThunk(
  `${shoppingCartSlice.name}/saveInLocalStorageCart`,
  (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      localStorage.setItem(
        "shopping-cart",
        JSON.stringify(state.shoppingCartSlice),
      );
    } catch (error) {
      dispatch(setAppStatusAC({ status: "failed" }));
      dispatch(setAppErrorAC({ error: error as string }));
      return rejectWithValue(error);
    }
  },
);
export const loadFromLocalStorageCart = createAsyncThunk(
  `${shoppingCartSlice.name}/loadFromLocalStorageCart`,
  (_, { dispatch, rejectWithValue }) => {
    try {
      const state = localStorage.getItem("shopping-cart");
      if (!state) {
        return {
          items: [],
          totalPrice: 0,
        };
      }

      const parsed = JSON.parse(state) as ShoppingCartType;
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        parsed.items.length === 0
      ) {
        localStorage.removeItem("shopping-cart");

        return {
          items: [],
          totalPrice: 0,
        };
      }
      return parsed as ShoppingCartType;
    } catch (error) {
      dispatch(setAppStatusAC({ status: "failed" }));
      dispatch(setAppErrorAC({ error: error as string }));
      return rejectWithValue(error);
    }
  },
);

export const { addItem, addNewItem, deleteItem, fullDeleteItem } =
  shoppingCartSlice.actions;
export const {
  selectItemsInShoppingCart,
  selectTotalPrice,
  selectTotalQuantityItemInShoppingCart,
} = shoppingCartSlice.selectors;
export const shoppingCartReducer = shoppingCartSlice.reducer;
