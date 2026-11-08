import { appReducer, appSlice } from "@/app/model/app-slice";
import {
  saveShoppingCartToLocalStorage,
  shoppingCartReducer,
  shoppingCartSlice,
} from "@/entities/cart";
import { productsReducer, productsSlice } from "@/entities/product";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [appSlice.name]: appReducer,
    [productsSlice.name]: productsReducer,
    [shoppingCartSlice.name]: shoppingCartReducer,
  },
});

let previousShoppingCartState = store.getState()[shoppingCartSlice.name];

store.subscribe(() => {
  const currentShoppingCartState = store.getState()[shoppingCartSlice.name];

  if (currentShoppingCartState === previousShoppingCartState) {
    return;
  }

  previousShoppingCartState = currentShoppingCartState;
  saveShoppingCartToLocalStorage(currentShoppingCartState);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
