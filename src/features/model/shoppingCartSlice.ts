import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "./productsSlice.types";

export type ItemType = Product & { quantity: number };

export type ShoppingCartType = {
  items: ItemType[];
  totalPrice: number;
};

const loadStateFromLS = (): ShoppingCartType => {
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
};

export const shoppingCartSlice = createSlice({
  name: "shoppingCartSlice",
  initialState: loadStateFromLS(),
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
        localStorage.setItem("shopping-cart", JSON.stringify(state));
      }),
      addItem: create.reducer<{ id: number }>((state, action) => {
        const index = state.items.findIndex(
          (el) => el.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index].quantity += 1;
          state.totalPrice =
            +state.totalPrice.toFixed(2) + +state.items[index].price.toFixed(2);
          localStorage.setItem("shopping-cart", JSON.stringify(state));
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
          localStorage.setItem("shopping-cart", JSON.stringify(state));
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
          localStorage.setItem("shopping-cart", JSON.stringify(state));
        }
      }),
    };
  },
});

export const { addItem, addNewItem, deleteItem, fullDeleteItem } =
  shoppingCartSlice.actions;
export const {
  selectItemsInShoppingCart,
  selectTotalPrice,
  selectTotalQuantityItemInShoppingCart,
} = shoppingCartSlice.selectors;
export const shoppingCartReducer = shoppingCartSlice.reducer;
