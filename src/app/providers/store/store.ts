import { appReducer, appSlice } from "@/app/model/app-slice";
import {
  productsReducer,
  productsSlice,
} from "@/pages/Main/model/productsSlice";
import {
  shoppingCartReducer,
  shoppingCartSlice,
} from "@/pages/ShoppingCart/model/shoppingCartSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [appSlice.name]: appReducer,
    [productsSlice.name]: productsReducer,
    [shoppingCartSlice.name]: shoppingCartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
