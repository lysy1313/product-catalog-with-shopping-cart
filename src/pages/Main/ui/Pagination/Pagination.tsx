import React, { useMemo } from "react";
import styles from "./Pagination.module.scss";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";
import { selectPagination, setPage } from "../../model/productsSlice";

export const Pagination: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentPage, totalPages, totalItems } =
    useAppSelector(selectPagination);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    dispatch(setPage({ page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className={styles.pagination}>
      <div className={styles.info}>
        Shown: {Math.min(12, totalItems - (currentPage - 1) * 12)} из{" "}
        {totalItems} products
      </div>

      <div className={styles.controls}>
        {getPageNumbers.map((page) => (
          <button
            key={page}
            className={`${styles.pageButton} ${currentPage === page ? styles.active : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};
