import assert from "node:assert/strict";
import test from "node:test";
import { filterProducts, getDeterministicStock, paginateProducts, } from "./products.utils.js";
const sampleProducts = [
    {
        id: 1,
        title: "Alpha Jacket",
        price: 25,
        description: "Warm jacket",
        category: "men's clothing",
        image: "alpha.png",
        rating: { rate: 4.5, count: 10 },
        stock: 3,
    },
    {
        id: 2,
        title: "Bravo Ring",
        price: 80,
        description: "Silver ring",
        category: "jewelery",
        image: "bravo.png",
        rating: { rate: 4.8, count: 12 },
        stock: 6,
    },
    {
        id: 3,
        title: "Atlas Coat",
        price: 40,
        description: "Wool coat",
        category: "men's clothing",
        image: "atlas.png",
        rating: { rate: 4.2, count: 8 },
        stock: 9,
    },
];
test("filterProducts applies category, search, and sorting in a stable order", () => {
    const filters = {
        category: "men's clothing",
        sort: "Name A-Z",
        search: "a",
    };
    const result = filterProducts(sampleProducts, filters);
    assert.deepEqual(result.map((product) => product.title), ["Alpha Jacket", "Atlas Coat"]);
});
test("paginateProducts clamps the page and deterministic stock stays stable", () => {
    const pagination = {
        currentPage: 3,
        itemsPerPage: 2,
    };
    const { items, pagination: normalizedPagination } = paginateProducts(sampleProducts, pagination);
    assert.equal(normalizedPagination.currentPage, 2);
    assert.equal(normalizedPagination.totalPages, 2);
    assert.deepEqual(items.map((product) => product.id), [3]);
    assert.equal(getDeterministicStock(7), getDeterministicStock(7));
    assert.notEqual(getDeterministicStock(7), getDeterministicStock(8));
});
