import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { normalizeFetchError, productsApi } from "../api/productsApi";
import type {
  FiltersType,
  PaginationStateType,
  Product,
  ProductsResponse,
  SortType,
} from "./productsSlice.types";
import {
  filterProducts,
  getPaginationData,
  mapProductFromServer,
  paginateProducts,
} from "./products.utils";

type ProductsState = {
  allProducts: Product[];
  availableCategories: string[];
  filters: FiltersType;
  pagination: PaginationStateType;
};

const initialState: ProductsState = {
  allProducts: [],
  availableCategories: [],
  filters: {
    category: "All",
    sort: "Featured",
    search: "",
    minPrice: 0,
    maxPrice: 0,
    minRating: 0,
    brands: [],
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 12,
  },
};

export const fetchProductsTC = createAsyncThunk<
  ProductsResponse,
  void,
  { rejectValue: string }
>("products/fetchProductsTC", async (_, { rejectWithValue }) => {
  try {
    return await productsApi.getProducts();
  } catch (error) {
    return rejectWithValue(normalizeFetchError(error));
  }
});

export const fetchProductsCategoriesTC = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>("products/fetchProductsCategoriesTC", async (_, { rejectWithValue }) => {
  try {
    return await productsApi.getCategories();
  } catch (error) {
    return rejectWithValue(normalizeFetchError(error));
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
    changeCategory: create.reducer<{ category: string }>(
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
    setPriceRange: create.reducer<{ minPrice: number; maxPrice: number }>(
      (state, action) => {
        state.filters.minPrice = action.payload.minPrice;
        state.filters.maxPrice = action.payload.maxPrice;
        state.pagination.currentPage = 1;
      },
    ),
    setMinRating: create.reducer<{ minRating: number }>((state, action) => {
      state.filters.minRating = action.payload.minRating;
      state.pagination.currentPage = 1;
    }),
    toggleBrand: create.reducer<{ brand: string }>((state, action) => {
      const brand = action.payload.brand;
      const index = state.filters.brands.indexOf(brand);
      if (index === -1) {
        state.filters.brands.push(brand);
      } else {
        state.filters.brands.splice(index, 1);
      }
      state.pagination.currentPage = 1;
    }),
    resetFilters: create.reducer((state) => {
      state.filters.category = "All";
      state.filters.search = "";
      state.filters.sort = "Featured";
      state.filters.minPrice = 0;
      state.filters.maxPrice = 0;
      state.filters.minRating = 0;
      state.filters.brands = [];
      state.pagination.currentPage = 1;
    }),
    setPage: create.reducer<{ page: number }>((state, action) => {
      state.pagination.currentPage = action.payload.page;
    }),
  }),
  extraReducers(builder) {
    builder
      .addCase(fetchProductsTC.fulfilled, (state, action) => {
        state.allProducts = action.payload.products.map(mapProductFromServer);
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

const selectAvailableBrands = createSelector(
  [selectAllProducts, selectFilters],
  (products, filters) => {
    const relevant = filters.category === "All"
      ? products
      : products.filter((p) => p.category === filters.category);
    const brandsSet = new Set<string>();
    for (const item of relevant) {
      if (item.brand && item.brand !== "Generic") {
        brandsSet.add(item.brand);
      }
    }
    return Array.from(brandsSet).sort();
  },
);

const selectPriceBounds = createSelector([selectAllProducts], (products) => {
  if (products.length === 0) return { min: 0, max: 2000 };
  let min = products[0].price;
  let max = products[0].price;
  for (const item of products) {
    if (item.price < min) min = item.price;
    if (item.price > max) max = item.price;
  }
  return { min: Math.floor(min), max: Math.ceil(max) };
});

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
  selectAvailableBrands,
  selectAvailableCategories,
  selectFilters,
  selectPagination,
  selectPriceBounds,
  selectProducts,
  selectTotalItems,
};

export const {
  changeCategory,
  changeSorting,
  resetFilters,
  setMinRating,
  setPage,
  setPriceRange,
  setSearch,
  toggleBrand,
} = productsSlice.actions;

export const productsReducer = productsSlice.reducer;
