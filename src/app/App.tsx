import { Header } from "../common/components/Header/Header";
import { Main } from "../features/ui/Main/Main";
import "../common/style/global.scss";
import { AppRoutes } from "../common/components/Routes/AppRoutes";
import { useEffect } from "react";
import { useAppDispatch } from "../common/hooks";
import { fetchProductsTC } from "../features/model/productsSlice";
import { Toast } from "@/common/components";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProductsTC());
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
