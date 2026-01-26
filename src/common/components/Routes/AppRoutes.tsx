import { Main, Product, ShoppingCart } from "@/features/ui";
import { Navigate, Route, Routes } from "react-router";

export const PATH = {
  CATALOG: "/catalog",
  PRODUCT: "/catalog/:id",
  BASKET: "/basket",
} as const;

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={PATH.CATALOG} element={<Main />} />
      <Route path={PATH.PRODUCT} element={<Product />} />
      <Route path={PATH.BASKET} element={<ShoppingCart />} />
      <Route path="/*" element={<Navigate to={PATH.CATALOG} replace />} />
    </Routes>
  );
};
