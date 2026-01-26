import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../common/hooks";
import { useDebounce } from "../../../../common/hooks/useDebounce";
import {
  changeCategory,
  changeSorting,
  fetchProductsCategoriesTC,
  selectAvailableCategories,
  selectFilters,
  setSearch,
} from "../../../model/productsSlice";
import type {
  SortType,
  UIFilterCategoryType,
} from "../../../model/productsSlice.types";
import styles from "./Toolbar.module.scss";

const allSort = [
  "Selected sorting",
  "Expensive",
  "Cheap",
  "Name A-Z",
  "Name Z-A",
];

export const ProductsToolbar: React.FC = () => {
  const productsCategories = useAppSelector(selectAvailableCategories);

  const filters = useAppSelector(selectFilters);
  const [categoryValue, setCategoryValue] = useState<UIFilterCategoryType>(
    filters.category,
  );
  const [sortBy, setSortBy] = useState<SortType>(filters.sort);
  const [nameForSearch, setNameForSearch] = useState<string>("");
  const debouncedSearch = useDebounce(nameForSearch, 500);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductsCategoriesTC());
  }, []);

  useEffect(() => {
    dispatch(changeCategory({ category: categoryValue }));
  }, [categoryValue, dispatch]);
  useEffect(() => {
    dispatch(changeSorting({ sortBy }));
  }, [sortBy, dispatch]);
  useEffect(() => {
    dispatch(setSearch({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  return (
    <section className={styles.toolbar}>
      <input
        className={styles.search}
        name="search"
        type="text"
        placeholder="Search by name..."
        value={nameForSearch}
        onChange={(e) => setNameForSearch(e.currentTarget.value)}
      />
      <select
        className={styles.select}
        name="categories"
        value={categoryValue}
        onChange={(e) => {
          setCategoryValue(e.currentTarget.value as UIFilterCategoryType);
        }}
      >
        {productsCategories.map((el, i) => {
          return (
            <option key={i} value={el}>
              {el}
            </option>
          );
        })}
      </select>
      <select
        className={styles.select}
        name="sorting"
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.currentTarget.value as SortType);
        }}
      >
        {allSort.map((el, i) => {
          return (
            <option key={i} value={el}>
              {el}
            </option>
          );
        })}
      </select>
    </section>
  );
};
