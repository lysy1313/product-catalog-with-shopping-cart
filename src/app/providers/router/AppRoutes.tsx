import { ShoppingCart } from "@/pages";
import { Navigate, Route, Routes } from "react-router";
import ErrorBoundary from "../../../widgets/ErrorBoundary/ui/ErrorBoundary";
import { Main } from "@/pages/Main/ui/Main";
import { Product } from "@/pages/Product/ui/Product";
import { routePaths } from "./routes";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={routePaths.root} element={<Navigate to={routePaths.catalog} replace />} />
      <Route
        path={routePaths.catalog}
        element={
          <ErrorBoundary>
            <Main />
          </ErrorBoundary>
        }
      />
      <Route
        path={routePaths.product}
        element={
          <ErrorBoundary>
            <Product />
          </ErrorBoundary>
        }
      />
      <Route path={routePaths.basket} element={<ShoppingCart />} />
      <Route path="*" element={<Navigate to={routePaths.catalog} replace />} />
    </Routes>
  );
};
