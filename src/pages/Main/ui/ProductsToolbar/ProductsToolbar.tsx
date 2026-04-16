import { useCallback, useEffect, useState } from "react";

import styles from "./Toolbar.module.scss";
import {
  useAppDispatch,
  useAppSelector,
  useDebounce,
} from "@/shared/lib/hooks";
import {
  changeCategory,
  changeSorting,
  fetchProductsCategoriesTC,
  selectAvailableCategories,
  selectFilters,
  setSearch,
} from "../../model/productsSlice";
import type {
  SortType,
  UIFilterCategoryType,
} from "../../model/productsSlice.types";

const allSort = [
  "Sort by",
  "Expensive",
  "Cheap",
  "Name A-Z",
  "Name Z-A",
];

export const ProductsToolbar: React.FC = () => {
  const productsCategories = useAppSelector(selectAvailableCategories);
  const filters = useAppSelector(selectFilters);
  const [nameForSearch, setNameForSearch] = useState<string>(filters.search);
  const debouncedSearch = useDebounce(nameForSearch, 500);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductsCategoriesTC());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSearch({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(
        changeCategory({
          category: e.currentTarget.value as UIFilterCategoryType,
        }),
      );
    },
    [dispatch],
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(changeSorting({ sortBy: e.currentTarget.value as SortType }));
    },
    [dispatch],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNameForSearch(e.currentTarget.value);
    },
    [],
  );

  return (
    <section className={styles.toolbar}>
      <input
        className={styles.search}
        name="search"
        type="text"
        placeholder="Search products"
        value={nameForSearch}
        onChange={handleSearchChange}
      />
      <select
        className={styles.select}
        name="categories"
        value={filters.category}
        onChange={handleCategoryChange}
      >
        {productsCategories.map((el) => (
          <option key={el} value={el}>
            {el}
          </option>
        ))}
      </select>
      <select
        className={styles.select}
        name="sorting"
        value={filters.sort}
        onChange={handleSortChange}
      >
        {allSort.map((el) => (
          <option key={el} value={el}>
            {el}
          </option>
        ))}
      </select>
    </section>
  );
};
