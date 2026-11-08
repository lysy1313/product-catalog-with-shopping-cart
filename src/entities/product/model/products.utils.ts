import type {
  FiltersType,
  PaginationDataType,
  PaginationStateType,
  Product,
  ProductFromServer,
  SortType,
} from "./productsSlice.types.js";

export const getDeterministicStock = (productId: number) => (productId * 3) % 11;

export const mapProductFromServer = (product: ProductFromServer): Product => ({
  ...product,
  stock: getDeterministicStock(product.id),
});

export const sortProducts = (products: Product[], sortBy: SortType) => {
  const sortedProducts = [...products];

  sortedProducts.sort((a, b) => {
    switch (sortBy) {
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

  return sortedProducts;
};

export const filterProducts = (allProducts: Product[], filters: FiltersType) => {
  const productsByCategory =
    filters.category === "All"
      ? allProducts
      : allProducts.filter((product) => product.category === filters.category);

  const normalizedSearch = filters.search.trim().toLowerCase();

  const productsBySearch = normalizedSearch
    ? productsByCategory.filter((product) =>
        product.title.toLowerCase().includes(normalizedSearch),
      )
    : productsByCategory;

  return sortProducts(productsBySearch, filters.sort);
};

export const getPaginationData = (
  filteredProducts: Product[],
  pagination: PaginationStateType,
): PaginationDataType => {
  const totalItems = filteredProducts.length;
  const totalPages =
    totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.itemsPerPage);
  const currentPage =
    totalPages === 0 ? 1 : Math.min(pagination.currentPage, totalPages);

  return {
    ...pagination,
    currentPage,
    totalItems,
    totalPages,
  };
};

export const paginateProducts = (
  filteredProducts: Product[],
  pagination: PaginationStateType,
) => {
  const normalizedPagination = getPaginationData(filteredProducts, pagination);
  const startIndex =
    (normalizedPagination.currentPage - 1) * normalizedPagination.itemsPerPage;
  const endIndex = startIndex + normalizedPagination.itemsPerPage;

  return {
    items: filteredProducts.slice(startIndex, endIndex),
    pagination: normalizedPagination,
  };
};
