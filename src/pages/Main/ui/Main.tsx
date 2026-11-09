import { selectStatus } from "@/app/model/app-slice";
import {
  selectAllProducts,
  selectProducts,
  selectTotalItems,
} from "@/entities/product";
import { useAppSelector } from "@/shared/lib/hooks";
import { Container, Skeleton } from "@/shared/ui";
import React, { useState } from "react";
import styles from "./Main.module.scss";
import { Pagination } from "./Pagination/Pagination";
import { ProductItem } from "./ProductItem/ProductItem";
import { ProductsToolbar } from "./ProductsToolbar/ProductsToolbar";
import { SidebarFilter } from "./SidebarFilter/SidebarFilter";

export const Main: React.FC = () => {
  const visibleProducts = useAppSelector(selectProducts);
  const allProducts = useAppSelector(selectAllProducts);
  const status = useAppSelector(selectStatus);
  const totalItems = useAppSelector(selectTotalItems);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  if (status === "loading" && allProducts.length === 0) {
    return (
      <main className={styles.main}>
        <Container>
          <Skeleton height="70vh" borderRadius="16px" />
        </Container>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <Container>
        <ProductsToolbar onOpenMobileFilters={() => setIsFilterModalOpen(true)} />
        <div className={styles.layout}>
          <SidebarFilter
            isModalOpen={isFilterModalOpen}
            onCloseModal={() => setIsFilterModalOpen(false)}
          />
          <div className={styles.content}>
            {visibleProducts.length === 0 ? (
              <div className={styles.emptyState}>
                No products match your current filters. Try resetting search or price range.
              </div>
            ) : (
              <div className={styles.grid}>
                {visibleProducts.map((item) => (
                  <ProductItem key={item.id} item={item} />
                ))}
              </div>
            )}
            {totalItems > 0 && <Pagination />}
          </div>
        </div>
      </Container>
    </main>
  );
};
