import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { setAppErrorAC, setAppStatusAC } from "../../../app/model/app-slice";
import { normalizeFetchError, productsApi } from "../api/productsApi";
import type {
  CategoryType,
  FiltersType,
  PaginationStateType,
  Product,
  ProductFromServer,
  SortType,
  UIFilterCategoryType,
} from "./productsSlice.types";
import {
  filterProducts,
  getPaginationData,
  mapProductFromServer,
  paginateProducts,
} from "./products.utils";

type ProductsState = {
  allProducts: Product[];
  filters: FiltersType;
  pagination: PaginationStateType;
  availableCategories: UIFilterCategoryType[];
};

const initialState: ProductsState = {
  allProducts: [],
  filters: {
    category: "All",
    sort: "Sort by",
    search: "",
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 12,
  },
  availableCategories: [],
};

export const fetchProductsTC = createAsyncThunk<
  ProductFromServer[],
  void,
  { rejectValue: string }
>("products/fetchProductsTC", async (_, { dispatch, rejectWithValue }) => {
  dispatch(setAppStatusAC({ status: "loading" }));

  try {
    const response = await productsApi.getProducts();
    dispatch(setAppStatusAC({ status: "succeeded" }));
    return response;
  } catch (error) {
    const message = normalizeFetchError(error);

    dispatch(setAppStatusAC({ status: "failed" }));
    dispatch(setAppErrorAC({ error: message }));

    return rejectWithValue(message);
  }
});

export const fetchProductsCategoriesTC = createAsyncThunk<
  CategoryType[],
  void,
  { rejectValue: string }
>("products/fetchProductsCategoriesTC", async (_, { dispatch, rejectWithValue }) => {
  try {
    return await productsApi.getProductsCategories();
  } catch (error) {
    const message = normalizeFetchError(error);

    dispatch(setAppErrorAC({ error: message }));
    return rejectWithValue(message);
  }
});

export const productsSlice = createSlice({
  name: "products",
  initialState,
  selectors: {
    selectAllProducts: (state) => state.allProducts,
    selectFilters: (state) => state.filters,
    selectAvailableCategories: (state) => state.availableCategories,
    selectPaginationState: (state) => state.pagination,
  },
  reducers: (create) => ({
    changeCategory: create.reducer<{ category: UIFilterCategoryType }>(
      (state, action) => {
        state.filters.category = action.payload.category;
        state.pagination.currentPage = 1;
      },
    ),
    changeSorting: create.reducer<{ sortBy: SortType }>((state, action) => {
      state.filters.sort = action.payload.sortBy;
      state.pagination.currentPage = 1;
    }),
    setSearch: create.reducer<{ search: string }>((state, action) => {
      state.filters.search = action.payload.search;
      state.pagination.currentPage = 1;
    }),
    setPage: create.reducer<{ page: number }>((state, action) => {
      state.pagination.currentPage = action.payload.page;
    }),
  }),
  extraReducers(builder) {
    builder
      .addCase(fetchProductsTC.fulfilled, (state, action) => {
        state.allProducts = action.payload.map(mapProductFromServer);
      })
      .addCase(fetchProductsCategoriesTC.fulfilled, (state, action) => {
        state.availableCategories = ["All", ...action.payload];
      });
  },
});

const {
  selectAllProducts,
  selectFilters,
  selectAvailableCategories,
  selectPaginationState,
} = productsSlice.selectors;

const selectFilteredProducts = createSelector(
  [selectAllProducts, selectFilters],
  filterProducts,
);

const selectPagination = createSelector(
  [selectFilteredProducts, selectPaginationState],
  getPaginationData,
);

const selectProducts = createSelector(
  [selectFilteredProducts, selectPagination],
  (filteredProducts, pagination) => {
    return paginateProducts(filteredProducts, pagination).items;
  },
);

const selectTotalItems = createSelector(
  [selectFilteredProducts],
  (filteredProducts) => filteredProducts.length,
);

export {
  selectAllProducts,
  selectAvailableCategories,
  selectFilters,
  selectPagination,
  selectProducts,
  selectTotalItems,
};

export const { changeCategory, changeSorting, setPage, setSearch } =
  productsSlice.actions;
export const productsReducer = productsSlice.reducer;
