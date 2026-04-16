import { generatePath } from "react-router";

export const routePaths = {
  root: "/",
  catalog: "/catalog",
  product: "/catalog/:id",
  basket: "/basket",
} as const;

export const buildProductRoute = (id: number | string) =>
  generatePath(routePaths.product, { id: String(id) });
