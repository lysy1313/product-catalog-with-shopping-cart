export type CategoryType =
  | "electronics"
  | "jewelery"
  | "men's clothing"
  | "women's clothing";
export type UIFilterCategoryType = CategoryType | "All";

export type SortType =
  | "Sort by"
  | "Expensive"
  | "Cheap"
  | "Name A-Z"
  | "Name Z-A";

export type FiltersType = {
  category: CategoryType | "All";
  sort: SortType;
  search: string;
};
export type PaginationStateType = {
  currentPage: number;
  itemsPerPage: number;
};

export type PaginationDataType = PaginationStateType & {
  totalPages: number;
  totalItems: number;
};

type Rating = {
  rate: number;
  count: number;
};

export type ProductFromServer = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: CategoryType;
  image: string;
  rating: Rating;
};

export type Product = ProductFromServer & { stock: number };
