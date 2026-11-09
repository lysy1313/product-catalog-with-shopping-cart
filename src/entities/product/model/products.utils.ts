import type {
  FiltersType,
  PaginationDataType,
  PaginationStateType,
  Product,
  ProductFromServer,
  SortType,
} from "./productsSlice.types.js";

export const calculateOriginalPrice = (
  price: number,
  discountPercentage: number,
): number => {
  if (discountPercentage <= 0 || discountPercentage >= 100) {
    return price;
  }
  const original = price / (1 - discountPercentage / 100);
  return Number(original.toFixed(2));
};

export const mapProductFromServer = (item: ProductFromServer): Product => ({
  ...item,
  brand: item.brand || "Generic",
  originalPrice: calculateOriginalPrice(item.price, item.discountPercentage || 0),
});

export const sortProducts = (products: Product[], sortBy: SortType): Product[] => {
  const sorted = [...products];

  sorted.sort((a, b) => {
    switch (sortBy) {
      case "Price: High to Low":
        return b.price - a.price;
      case "Price: Low to High":
        return a.price - b.price;
      case "Highest Rated":
        return b.rating - a.rating;
      case "Name A-Z":
        return a.title.localeCompare(b.title);
      case "Name Z-A":
        return b.title.localeCompare(a.title);
      case "Featured":
      default:
        return a.id - b.id;
    }
  });

  return sorted;
};

export const filterProducts = (
  allProducts: Product[],
  filters: FiltersType,
): Product[] => {
  const normalizedSearch = filters.search.trim().toLowerCase();

  const filtered = allProducts.filter((product) => {
    if (filters.category !== "All" && product.category !== filters.category) {
      return false;
    }

    if (normalizedSearch) {
      const titleMatch = product.title.toLowerCase().includes(normalizedSearch);
      const brandMatch = (product.brand || "").toLowerCase().includes(normalizedSearch);
      const categoryMatch = product.category.toLowerCase().includes(normalizedSearch);
      if (!titleMatch && !brandMatch && !categoryMatch) {
        return false;
      }
    }

    if (filters.minPrice > 0 && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice > 0 && product.price > filters.maxPrice) {
      return false;
    }

    if (filters.minRating > 0 && product.rating < filters.minRating) {
      return false;
    }

    if (filters.brands.length > 0 && (!product.brand || !filters.brands.includes(product.brand))) {
      return false;
    }

    return true;
  });

  return sortProducts(filtered, filters.sort);
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
