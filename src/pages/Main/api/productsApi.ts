import type {
  CategoryType,
  ProductFromServer,
} from "../model/productsSlice.types";

const PRODUCTS_API_BASE_URL = "https://fakestoreapi.com/products";

export const normalizeFetchError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load products right now.";
};

const fetchJson = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const statusSuffix = response.statusText
        ? ` ${response.statusText}`
        : "";

      throw new Error(
        `Request failed with status ${response.status}${statusSuffix}`.trim(),
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    throw new Error(normalizeFetchError(error));
  }
};

export const productsApi = {
  getProducts() {
    return fetchJson<ProductFromServer[]>(PRODUCTS_API_BASE_URL);
  },
  getProductsCategories() {
    return fetchJson<CategoryType[]>(`${PRODUCTS_API_BASE_URL}/categories`);
  },
};
