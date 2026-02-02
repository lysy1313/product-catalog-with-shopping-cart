import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { productsApi } from "../api/productsApi";
import type {
  CategoryType,
  FiltersType,
  PaginationDataType,
  Product,
  ProductFromServer,
  SortType,
  UIFilterCategoryType,
} from "./productsSlice.types";
import { setAppErrorAC, setAppStatusAC } from "../../../app/model/app-slice";

type ProductsState = {
  allProducts: Product[];
  filteredProducts: Product[];
  filters: FiltersType;
  pagination: PaginationDataType;
  availableCategories: CategoryType[];
};

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    allProducts: [],
    filteredProducts: [],
    filters: {
      category: "All",
      sort: "Selected sorting",
      search: "",
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 12,
      totalPages: 0,
      totalItems: 0,
    },
    availableCategories: [],
  } as ProductsState,
  selectors: {
    selectProducts: (state) => state.filteredProducts,
    selectAllProducts: (state) => state.allProducts,
    selectFilters: (state) => state.filters,
    selectAvailableCategories: (state) => state.availableCategories,
    selectPagination: (state) => state.pagination,
    selectTotalItems: (state) => state.pagination.totalItems,
  },
  reducers: (create) => {
    return {
      changeCategory: create.reducer<{ category: UIFilterCategoryType }>(
        (state, action) => {
          state.filters.category = action.payload.category;
          state.pagination.currentPage = 1;
        },
      ),
      changeSorting: create.reducer<{ sortBy: SortType }>((state, action) => {
        state.filters.sort = action.payload.sortBy;
        applyFiltersAndPagination(state);
      }),
      setSearch: create.reducer<{ search: string }>((state, action) => {
        state.filters.search = action.payload.search;
        state.pagination.currentPage = 1;
        applyFiltersAndPagination(state);
      }),
      setPage: create.reducer<{ page: number }>((state, action) => {
        state.pagination.currentPage = action.payload.page;
        applyFiltersAndPagination(state);
      }),
    };
  },
  extraReducers(builder) {
    builder
      .addCase(
        fetchProductsTC.fulfilled,
        (state, action: PayloadAction<ProductFromServer[]>) => {
          const productsFromServer = action.payload.map((el) => ({
            ...el,
            stock: Math.floor(Math.random() * 11),
          }));
          state.allProducts = productsFromServer;
          state.filteredProducts = productsFromServer;
          state.pagination.totalItems = action.payload.length;
          applyFiltersAndPagination(state);
        },
      )

      .addCase(fetchProductsCategoriesTC.fulfilled, (state, action) => {
        state.availableCategories = ["All", ...action.payload];
      })
      .addCase(
        fetchProductsByCategoryTC.fulfilled,
        (state, action: PayloadAction<ProductFromServer[]>) => {
          const productsFromServer = action.payload.map((el) => ({
            ...el,
            stock: Math.floor(Math.random() * 11),
          }));
          state.filteredProducts = productsFromServer;
          state.pagination.totalItems = action.payload.length;
          applyFiltersAndPagination(state);
        },
      );
  },
});

function applyFiltersAndPagination(state: ProductsState) {
  let filtered = [...state.filteredProducts];

  if (state.filters.category === "All") {
    filtered = [...state.allProducts];
  }

  if (state.filters.search.trim()) {
    const searchLower = state.filters.search.toLowerCase();
    filtered = filtered.filter((product) =>
      product.title.toLowerCase().includes(searchLower),
    );
  }

  filtered.sort((a, b) => {
    switch (state.filters.sort) {
      case "Expensive":
        return b.price - a.price;
      case "Cheap":
        return a.price - b.price;
      case "Name A-Z":
        return a.title.localeCompare(b.title);
      case "Name Z-A":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const totalItems = filtered.length;
  const itemsPerPage = state.pagination.itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  let currentPage = state.pagination.currentPage;
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayed = filtered.slice(startIndex, endIndex);

  state.filteredProducts = displayed;
  state.pagination.totalItems = totalItems;
  state.pagination.totalPages = totalPages;
  state.pagination.currentPage = currentPage;
}

export const fetchProductsTC = createAsyncThunk(
  `${productsSlice.name}/fetchProductsTC`,
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const response = await productsApi
        .getProducts()
        .then((response) => response.json());
      dispatch(setAppStatusAC({ status: "succeeded" }));
      return response;
    } catch (error) {
      dispatch(setAppStatusAC({ status: "failed" }));
      dispatch(setAppErrorAC({ error: error as string }));
      return rejectWithValue(error);
    }
  },
);
export const fetchProductsCategoriesTC = createAsyncThunk(
  `${productsSlice.name}/fetchProductsCategoriesTC`,
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await productsApi
        .getProductsCategories()
        .then((response) => response.json());

      return response;
    } catch (error) {
      dispatch(setAppErrorAC({ error: error as string }));
      return rejectWithValue(error);
    }
  },
);
export const fetchProductsByCategoryTC = createAsyncThunk(
  `${productsSlice.name}/fetchProductsByCategoryTC`,
  async (
    args: { category: UIFilterCategoryType },
    { dispatch, rejectWithValue },
  ) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      let response;

      response = await productsApi
        .getProductsByCategory(args.category)
        .then((response) => response.json());

      dispatch(setAppStatusAC({ status: "succeeded" }));
      return response;
    } catch (error) {
      dispatch(setAppStatusAC({ status: "failed" }));
      dispatch(setAppErrorAC({ error: JSON.stringify(error) }));
      return rejectWithValue(error);
    }
  },
);

export const {
  selectProducts,
  selectAllProducts,
  selectFilters,
  selectAvailableCategories,
  selectPagination,
  selectTotalItems,
} = productsSlice.selectors;
export const { changeCategory, changeSorting, setSearch, setPage } =
  productsSlice.actions;
export const productsReducer = productsSlice.reducer;
