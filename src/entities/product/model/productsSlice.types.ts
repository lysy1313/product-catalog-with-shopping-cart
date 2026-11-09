export type ProductDimensions = {
  width: number;
  height: number;
  depth: number;
};

export type ProductReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

export type ProductMeta = {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
};

export type ProductFromServer = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
  thumbnail: string;
  images: string[];
};

export type Product = ProductFromServer & {
  originalPrice: number;
};

export type ProductsResponse = {
  products: ProductFromServer[];
  total: number;
  skip: number;
  limit: number;
};

export type SortType =
  | "Featured"
  | "Price: Low to High"
  | "Price: High to Low"
  | "Highest Rated"
  | "Name A-Z"
  | "Name Z-A";

export type FiltersType = {
  category: string;
  sort: SortType;
  search: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  brands: string[];
};

export type PaginationStateType = {
  currentPage: number;
  itemsPerPage: number;
};

export type PaginationDataType = PaginationStateType & {
  totalPages: number;
  totalItems: number;
};
