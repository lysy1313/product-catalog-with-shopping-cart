import type {
  ProductFromServer,
  ProductsResponse,
} from "../model/productsSlice.types";

const DUMMY_JSON_BASE_URL = "https://dummyjson.com/products";

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
      const statusSuffix = response.statusText ? ` ${response.statusText}` : "";
      throw new Error(`Request failed with status ${response.status}${statusSuffix}`.trim());
    }
    return (await response.json()) as T;
  } catch (error) {
    throw new Error(normalizeFetchError(error));
  }
};

export const productsApi = {
  getProducts() {
    return fetchJson<ProductsResponse>(`${DUMMY_JSON_BASE_URL}?limit=0`);
  },
  getCategories() {
    return fetchJson<string[]>(`${DUMMY_JSON_BASE_URL}/category-list`);
  },
  getProductById(id: number) {
    return fetchJson<ProductFromServer>(`${DUMMY_JSON_BASE_URL}/${id}`);
  },
};
