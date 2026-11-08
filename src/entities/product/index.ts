export { productsApi, normalizeFetchError } from "./api/productsApi";
export {
  changeCategory,
  changeSorting,
  fetchProductsCategoriesTC,
  fetchProductsTC,
  productsReducer,
  productsSlice,
  selectAllProducts,
  selectAvailableCategories,
  selectFilters,
  selectPagination,
  selectProducts,
  selectTotalItems,
  setPage,
  setSearch,
} from "./model/productsSlice";
export type {
  CategoryType,
  FiltersType,
  PaginationDataType,
  PaginationStateType,
  Product,
  ProductFromServer,
  SortType,
  UIFilterCategoryType,
} from "./model/productsSlice.types";
