import { configureStore } from "@reduxjs/toolkit";
import { appReducer, appSlice } from "./app-slice";
import {
  productsReducer,
  productsSlice,
} from "../features/model/productsSlice";
import {
  shoppingCartReducer,
  shoppingCartSlice,
} from "../features/model/shoppingCartSlice";

export const store = configureStore({
  reducer: {
    [appSlice.name]: appReducer,
    [productsSlice.name]: productsReducer,
    [shoppingCartSlice.name]: shoppingCartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
