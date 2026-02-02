export const productsApi = {
  getProducts() {
    return fetch("https://fakestoreapi.com/products");
  },
  getProductsCategories() {
    return fetch("https://fakestoreapi.com/products/categories");
  },
  getProductsByCategory(category: string) {
    return fetch(`https://fakestoreapi.com/products/category/${category}`);
  },
};
