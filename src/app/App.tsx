import { Toast } from "@/common/components";
import { useEffect } from "react";
import { Header } from "../common/components/Header/Header";
import { AppRoutes } from "../common/components/Routes/AppRoutes";
import { useAppDispatch } from "../common/hooks";
import "../common/style/global.scss";
import { fetchProductsTC } from "../features/model/productsSlice";

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
