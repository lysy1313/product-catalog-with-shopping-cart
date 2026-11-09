import assert from "node:assert/strict";
import test from "node:test";
import type {
  FiltersType,
  PaginationStateType,
  Product,
} from "./productsSlice.types.js";
import {
  calculateOriginalPrice,
  filterProducts,
  paginateProducts,
} from "./products.utils.js";

const sampleProducts: Product[] = [
  {
    id: 1,
    title: "Pro Smartphone 15",
    price: 999,
    discountPercentage: 10,
    originalPrice: 1110,
    description: "Flagship phone",
    category: "smartphones",
    brand: "Apple",
    stock: 12,
    rating: 4.8,
    availabilityStatus: "In Stock",
    reviews: [],
    thumbnail: "phone.png",
    images: ["phone.png"],
    sku: "AP-15",
    weight: 200,
    tags: ["tech"],
  },
  {
    id: 2,
    title: "Ultra Laptop Pro",
    price: 1999,
    discountPercentage: 5,
    originalPrice: 2104.21,
    description: "Sleek work machine",
    category: "laptops",
    brand: "Apple",
    stock: 4,
    rating: 4.9,
    availabilityStatus: "Low Stock",
    reviews: [],
    thumbnail: "laptop.png",
    images: ["laptop.png"],
    sku: "AP-LT",
    weight: 1400,
    tags: ["tech"],
  },
  {
    id: 3,
    title: "Designer Fragrance",
    price: 89,
    discountPercentage: 15,
    originalPrice: 104.71,
    description: "Eau de parfum",
    category: "fragrances",
    brand: "Chanel",
    stock: 20,
    rating: 4.2,
    availabilityStatus: "In Stock",
    reviews: [],
    thumbnail: "perfume.png",
    images: ["perfume.png"],
    sku: "CH-PF",
    weight: 100,
    tags: ["beauty"],
  },
];

test("calculateOriginalPrice correctly calculates undiscounted value", () => {
  const original = calculateOriginalPrice(90, 10);
  assert.equal(original, 100);
});

test("filterProducts applies multi-faceted filters (category, rating, price, brand)", () => {
  const filters: FiltersType = {
    category: "All",
    sort: "Price: Low to High",
    search: "",
    minPrice: 100,
    maxPrice: 2500,
    minRating: 4.5,
    brands: ["Apple"],
  };

  const result = filterProducts(sampleProducts, filters);
  assert.equal(result.length, 2);
  assert.deepEqual(
    result.map((p) => p.id),
    [1, 2],
  );
});

test("paginateProducts slices items correctly", () => {
  const pagination: PaginationStateType = {
    currentPage: 2,
    itemsPerPage: 1,
  };

  const { items, pagination: normalizedPagination } = paginateProducts(
    sampleProducts,
    pagination,
  );

  assert.equal(normalizedPagination.currentPage, 2);
  assert.equal(normalizedPagination.totalPages, 3);
  assert.deepEqual(items.map((p) => p.id), [2]);
});
