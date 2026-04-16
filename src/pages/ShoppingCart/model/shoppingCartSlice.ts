import type { Product } from "@/pages/Main/model/productsSlice.types";
import { createSlice } from "@reduxjs/toolkit";

export type ItemType = Product & { quantity: number };

export type ShoppingCartType = {
  items: ItemType[];
  totalPrice: number;
};

const SHOPPING_CART_STORAGE_KEY = "shopping-cart";

const emptyCartState = (): ShoppingCartType => ({
  items: [],
  totalPrice: 0,
});

const roundCurrency = (value: number) => Number(value.toFixed(2));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isValidRating = (value: unknown): value is Product["rating"] =>
  isRecord(value) &&
  isFiniteNumber(value.rate) &&
  isFiniteNumber(value.count) &&
  value.count >= 0;

const isValidCartItem = (value: unknown): value is ItemType =>
  isRecord(value) &&
  isFiniteNumber(value.id) &&
  typeof value.title === "string" &&
  isFiniteNumber(value.price) &&
  typeof value.description === "string" &&
  typeof value.category === "string" &&
  typeof value.image === "string" &&
  isValidRating(value.rating) &&
  isFiniteNumber(value.stock) &&
  Number.isInteger(value.stock) &&
  value.stock >= 0 &&
  isFiniteNumber(value.quantity) &&
  Number.isInteger(value.quantity) &&
  value.quantity > 0 &&
  value.quantity <= Math.max(value.stock, 1);

const calculateTotalPrice = (items: ItemType[]) =>
  roundCurrency(
    items.reduce((total, item) => total + item.price * item.quantity, 0),
  );

const sanitizeCartState = (value: unknown): ShoppingCartType => {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return emptyCartState();
  }

  const items = value.items.filter(isValidCartItem);

  return {
    items,
    totalPrice: calculateTotalPrice(items),
  };
};

const loadShoppingCartFromLocalStorage = (): ShoppingCartType => {
  if (typeof window === "undefined") {
    return emptyCartState();
  }

  try {
    const persistedCart = window.localStorage.getItem(
      SHOPPING_CART_STORAGE_KEY,
    );

    if (!persistedCart) {
      return emptyCartState();
    }

    const sanitizedCart = sanitizeCartState(JSON.parse(persistedCart));

    if (sanitizedCart.items.length === 0) {
      window.localStorage.removeItem(SHOPPING_CART_STORAGE_KEY);
      return emptyCartState();
    }

    return sanitizedCart;
  } catch {
    window.localStorage.removeItem(SHOPPING_CART_STORAGE_KEY);
    return emptyCartState();
  }
};

export const saveShoppingCartToLocalStorage = (
  shoppingCart: ShoppingCartType,
) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (shoppingCart.items.length === 0) {
      window.localStorage.removeItem(SHOPPING_CART_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      SHOPPING_CART_STORAGE_KEY,
      JSON.stringify({
        items: shoppingCart.items,
        totalPrice: calculateTotalPrice(shoppingCart.items),
      }),
    );
  } catch {
    // Ignore write failures so cart interactions keep working.
  }
};

const syncCartTotals = (state: ShoppingCartType) => {
  state.totalPrice = calculateTotalPrice(state.items);
};

export const shoppingCartSlice = createSlice({
  name: "shoppingCartSlice",
  initialState: loadShoppingCartFromLocalStorage(),
  selectors: {
    selectItemsInShoppingCart: (state) => state.items,
    selectTotalPrice: (state) => state.totalPrice,
    selectTotalQuantityItemInShoppingCart: (state) =>
      state.items.reduce((total, item) => total + item.quantity, 0),
  },
  reducers: (create) => ({
    addNewItem: create.reducer<{ item: Product }>((state, action) => {
      state.items.push({ ...action.payload.item, quantity: 1 });
      syncCartTotals(state);
    }),
    addItem: create.reducer<{ id: number }>((state, action) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload.id);

      if (!item || item.quantity >= item.stock) {
        return;
      }

      item.quantity += 1;
      syncCartTotals(state);
    }),
    deleteItem: create.reducer<{ id: number }>((state, action) => {
      const itemIndex = state.items.findIndex(
        (cartItem) => cartItem.id === action.payload.id,
      );

      if (itemIndex === -1) {
        return;
      }

      state.items[itemIndex].quantity -= 1;

      if (state.items[itemIndex].quantity <= 0) {
        state.items.splice(itemIndex, 1);
      }

      syncCartTotals(state);
    }),
    fullDeleteItem: create.reducer<{ id: number }>((state, action) => {
      const itemIndex = state.items.findIndex(
        (cartItem) => cartItem.id === action.payload.id,
      );

      if (itemIndex === -1) {
        return;
      }

      state.items.splice(itemIndex, 1);
      syncCartTotals(state);
    }),
  }),
});

export const { addItem, addNewItem, deleteItem, fullDeleteItem } =
  shoppingCartSlice.actions;
export const {
  selectItemsInShoppingCart,
  selectTotalPrice,
  selectTotalQuantityItemInShoppingCart,
} = shoppingCartSlice.selectors;
export const shoppingCartReducer = shoppingCartSlice.reducer;
