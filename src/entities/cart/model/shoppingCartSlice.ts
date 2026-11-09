import type { Product } from "@/entities/product";
import { createSlice } from "@reduxjs/toolkit";

export type ItemType = Product & { quantity: number };

export type ShoppingCartType = {
  items: ItemType[];
  totalPrice: number;
  totalDiscount: number;
  rawSubtotal: number;
};

const SHOPPING_CART_STORAGE_KEY = "shopping-cart";

const emptyCartState = (): ShoppingCartType => ({
  items: [],
  totalPrice: 0,
  totalDiscount: 0,
  rawSubtotal: 0,
});

const roundCurrency = (value: number) => Number(value.toFixed(2));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isValidCartItem = (value: unknown): value is ItemType =>
  isRecord(value) &&
  isFiniteNumber(value.id) &&
  typeof value.title === "string" &&
  isFiniteNumber(value.price) &&
  typeof value.description === "string" &&
  typeof value.category === "string" &&
  typeof value.thumbnail === "string" &&
  isFiniteNumber(value.stock) &&
  value.stock >= 0 &&
  isFiniteNumber(value.quantity) &&
  value.quantity > 0 &&
  value.quantity <= Math.max(value.stock, 1);

const calculateTotals = (items: ItemType[]) => {
  let subtotal = 0;
  let totalPrice = 0;

  for (const item of items) {
    const original = item.originalPrice || item.price;
    subtotal += original * item.quantity;
    totalPrice += item.price * item.quantity;
  }

  const rawSubtotal = roundCurrency(subtotal);
  const finalPrice = roundCurrency(totalPrice);
  const totalDiscount = roundCurrency(Math.max(0, rawSubtotal - finalPrice));

  return {
    rawSubtotal,
    totalPrice: finalPrice,
    totalDiscount,
  };
};

const sanitizeCartState = (value: unknown): ShoppingCartType => {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return emptyCartState();
  }

  const items = value.items.filter(isValidCartItem);
  const totals = calculateTotals(items);

  return {
    items,
    ...totals,
  };
};

const loadShoppingCartFromLocalStorage = (): ShoppingCartType => {
  if (typeof window === "undefined") {
    return emptyCartState();
  }

  try {
    const persisted = window.localStorage.getItem(SHOPPING_CART_STORAGE_KEY);
    if (!persisted) return emptyCartState();
    const sanitized = sanitizeCartState(JSON.parse(persisted));
    if (sanitized.items.length === 0) {
      window.localStorage.removeItem(SHOPPING_CART_STORAGE_KEY);
      return emptyCartState();
    }
    return sanitized;
  } catch {
    window.localStorage.removeItem(SHOPPING_CART_STORAGE_KEY);
    return emptyCartState();
  }
};

export const saveShoppingCartToLocalStorage = (cart: ShoppingCartType) => {
  if (typeof window === "undefined") return;
  try {
    if (cart.items.length === 0) {
      window.localStorage.removeItem(SHOPPING_CART_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(
      SHOPPING_CART_STORAGE_KEY,
      JSON.stringify(cart),
    );
  } catch {
    return;
  }
};

const syncCartTotals = (state: ShoppingCartType) => {
  const totals = calculateTotals(state.items);
  state.rawSubtotal = totals.rawSubtotal;
  state.totalPrice = totals.totalPrice;
  state.totalDiscount = totals.totalDiscount;
};

export const shoppingCartSlice = createSlice({
  name: "shoppingCartSlice",
  initialState: loadShoppingCartFromLocalStorage(),
  selectors: {
    selectItemsInShoppingCart: (state) => state.items,
    selectTotalPrice: (state) => state.totalPrice,
    selectTotalDiscount: (state) => state.totalDiscount,
    selectRawSubtotal: (state) => state.rawSubtotal,
    selectTotalQuantityItemInShoppingCart: (state) =>
      state.items.reduce((total, item) => total + item.quantity, 0),
  },
  reducers: (create) => ({
    addNewItem: create.reducer<{ item: Product }>((state, action) => {
      state.items.push({ ...action.payload.item, quantity: 1 });
      syncCartTotals(state);
    }),
    addItem: create.reducer<{ id: number }>((state, action) => {
      const item = state.items.find((el) => el.id === action.payload.id);
      if (!item || item.quantity >= item.stock) return;
      item.quantity += 1;
      syncCartTotals(state);
    }),
    deleteItem: create.reducer<{ id: number }>((state, action) => {
      const index = state.items.findIndex((el) => el.id === action.payload.id);
      if (index === -1) return;
      state.items[index].quantity -= 1;
      if (state.items[index].quantity <= 0) {
        state.items.splice(index, 1);
      }
      syncCartTotals(state);
    }),
    fullDeleteItem: create.reducer<{ id: number }>((state, action) => {
      const index = state.items.findIndex((el) => el.id === action.payload.id);
      if (index === -1) return;
      state.items.splice(index, 1);
      syncCartTotals(state);
    }),
    clearCart: create.reducer((state) => {
      state.items = [];
      syncCartTotals(state);
    }),
  }),
});

export const { addItem, addNewItem, clearCart, deleteItem, fullDeleteItem } =
  shoppingCartSlice.actions;

export const {
  selectItemsInShoppingCart,
  selectRawSubtotal,
  selectTotalDiscount,
  selectTotalPrice,
  selectTotalQuantityItemInShoppingCart,
} = shoppingCartSlice.selectors;

export const shoppingCartReducer = shoppingCartSlice.reducer;
