import { useEffect } from "react";
import { Header } from "../widgets/Header/ui/Header";
import { AppRoutes } from "./providers/router/AppRoutes";
import { useAppDispatch } from "../shared/lib/hooks";
import "./styles/global.scss";
import { fetchProductsTC } from "../pages/Main/model/productsSlice";
import { Toast } from "@/shared/ui";
import { loadFromLocalStorageCart } from "@/pages/ShoppingCart/model/shoppingCartSlice";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProductsTC());
    dispatch(loadFromLocalStorageCart());
  }, []);
  return (
    <>
      <Header />
      <AppRoutes />
      <Toast />
    </>
  );
}

export default App;
