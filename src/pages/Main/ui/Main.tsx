import { useEffect } from "react";
import { selectStatus } from "../../../app/model/app-slice";

import styles from "./Main.module.scss";
import { Pagination } from "./Pagination/Pagination";
import { ProductItem } from "./ProductItem/ProductItem";
import { ProductsToolbar } from "./ProductsToolbar/ProductsToolbar";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";
import {
  fetchProductsByCategoryTC,
  selectFilters,
  selectProducts,
} from "../model/productsSlice";
import { Container, Skeleton } from "@/shared/ui";

export const Main: React.FC = () => {
  const filteredProducts = useAppSelector(selectProducts);
  const filters = useAppSelector(selectFilters);
  const status = useAppSelector(selectStatus);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductsByCategoryTC({ category: filters.category }));
  }, [filters.category, filters.search]);

  if (status === "loading") {
    return (
      <main className={styles.main}>
        <Container>
          <ProductsToolbar />
          <Skeleton />
        </Container>
      </main>
    );
  }
  if (
    (filteredProducts.length === 0 && status === "idle") ||
    filteredProducts.length === 0
  ) {
    return (
      <main className={styles.main}>
        <Container>
          <ProductsToolbar />
          <div style={{ textAlign: "center", margin: "40vh auto" }}>
            No products available or undefined
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <Container>
        <ProductsToolbar />
        <div className={styles.wrapper}>
          {filteredProducts?.map((el) => {
            return <ProductItem key={el.id} item={el} />;
          })}
        </div>
        <Pagination />
      </Container>
    </main>
  );
};
