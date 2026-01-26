import { useEffect } from "react";
import { Container } from "../../../common/components/Container/Container";
import { Skeleton } from "../../../common/components/ShimmerSkeleton/Skeleton";
import { useAppDispatch, useAppSelector } from "../../../common/hooks";
import {
  fetchProductsByCategoryTC,
  fetchProductsTC,
  selectFilters,
  selectProducts,
} from "../../model/productsSlice";
import styles from "./Main.module.scss";
import { Pagination } from "./Pagination/Pagination";
import { ProductItem } from "./ProductItem/ProductItem";
import { ProductsToolbar } from "./ProductsToolbar/ProductsToolbar";
import { selectStatus } from "../../../app/app-slice";

export const Main: React.FC = () => {
  const filteredProducts = useAppSelector(selectProducts);
  const filters = useAppSelector(selectFilters);
  const status = useAppSelector(selectStatus);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductsByCategoryTC({ category: filters.category }));
  }, [filters.category]);

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
        <div className={styles.warapper}>
          {filteredProducts?.map((el) => {
            return <ProductItem key={el.id} item={el} />;
          })}
        </div>
        <Pagination />
      </Container>
    </main>
  );
};
