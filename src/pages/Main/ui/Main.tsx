import { selectStatus } from "../../../app/model/app-slice";

import styles from "./Main.module.scss";
import { Pagination } from "./Pagination/Pagination";
import { ProductItem } from "./ProductItem/ProductItem";
import { ProductsToolbar } from "./ProductsToolbar/ProductsToolbar";
import { useAppSelector } from "@/shared/lib/hooks";
import {
  selectAllProducts,
  selectFilters,
  selectProducts,
  selectTotalItems,
} from "../model/productsSlice";
import { Container, Skeleton } from "@/shared/ui";

export const Main: React.FC = () => {
  const visibleProducts = useAppSelector(selectProducts);
  const allProducts = useAppSelector(selectAllProducts);
  const status = useAppSelector(selectStatus);
  const filters = useAppSelector(selectFilters);
  const totalItems = useAppSelector(selectTotalItems);

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

  if (visibleProducts.length === 0) {
    const emptyMessage =
      allProducts.length === 0
        ? "No products available right now."
        : `No products match your current filters${
            filters.search ? ` for "${filters.search}"` : ""
          }.`;

    return (
      <main className={styles.main}>
        <Container>
          <ProductsToolbar />
          <div style={{ textAlign: "center", margin: "40vh auto" }}>
            {emptyMessage}
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
          {visibleProducts.map((el) => {
            return <ProductItem key={el.id} item={el} />;
          })}
        </div>
        {totalItems > 0 && <Pagination />}
      </Container>
    </main>
  );
};
