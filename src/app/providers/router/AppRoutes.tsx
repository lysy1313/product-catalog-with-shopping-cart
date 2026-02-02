import { ShoppingCart } from "@/pages";
import { Navigate, Route, Routes } from "react-router";
import ErrorBoundary from "../../../widgets/ErrorBoundary/ui/ErrorBoundary";
import { Main } from "@/pages/Main/ui/Main";
import { Product } from "@/pages/Product/ui/Product";

export const PATH = {
  CATALOG: "/product-catalog-with-shopping-cart/catalog",
  PRODUCT: "/product-catalog-with-shopping-cart/catalog/:id",
  BASKET: "/product-catalog-with-shopping-cart/basket",
} as const;

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path={PATH.CATALOG}
        element={
          <ErrorBoundary>
            <Main />
          </ErrorBoundary>
        }
      />
      <Route
        path={PATH.PRODUCT}
        element={
          <ErrorBoundary>
            <Product />
          </ErrorBoundary>
        }
      />
      <Route path={PATH.BASKET} element={<ShoppingCart />} />
      <Route path="/*" element={<Navigate to={PATH.CATALOG} replace />} />
    </Routes>
  );
};
