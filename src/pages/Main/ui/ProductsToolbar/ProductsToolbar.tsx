import {
  changeCategory,
  changeSorting,
  selectAllProducts,
  selectFilters,
  selectPagination,
  setSearch,
  type SortType,
} from "@/entities/product";
import { useAppDispatch, useAppSelector, useDebounce } from "@/shared/lib/hooks";
import { Select } from "@/shared/ui";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./Toolbar.module.scss";

const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: "Featured", label: "Featured" },
  { value: "Price: Low to High", label: "Price: Low to High" },
  { value: "Price: High to Low", label: "Price: High to Low" },
  { value: "Highest Rated", label: "Highest Rated" },
  { value: "Name A-Z", label: "Name A-Z" },
  { value: "Name Z-A", label: "Name Z-A" },
];

type ToolbarProps = {
  onOpenMobileFilters?: () => void;
};

export const ProductsToolbar: React.FC<ToolbarProps> = ({ onOpenMobileFilters }) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const allProducts = useAppSelector(selectAllProducts);
  const { currentPage, itemsPerPage, totalItems } = useAppSelector(selectPagination);

  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounced = useDebounce(searchQuery, 300);

  useEffect(() => {
    setSearchQuery(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (debounced !== filters.search) {
      dispatch(setSearch({ search: debounced }));
    }
  }, [debounced, dispatch, filters.search]);

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const matches: { title: string; category: string; id: number }[] = [];
    for (const p of allProducts) {
      if (p.title.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q))) {
        matches.push({ title: p.title, category: p.category, id: p.id });
        if (matches.length >= 5) break;
      }
    }
    return matches;
  }, [allProducts, searchQuery]);

  const handleSelectSuggestion = (title: string, category: string) => {
    dispatch(changeCategory({ category }));
    dispatch(setSearch({ search: title }));
    setSearchQuery(title);
    setShowSuggestions(false);
  };

  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={styles.toolbar}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(setSearch({ search: searchQuery }));
          setShowSuggestions(false);
        }}
        className={styles.searchSection}
      >
        <svg className={styles.searchIcon} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search products, brands, categories..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className={styles.suggestionsDropdown}>
            {suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.suggestionItem}
                onMouseDown={() => handleSelectSuggestion(item.title, item.category)}
              >
                <span>{item.title}</span>
                <span className={styles.suggestionCategory}>{item.category}</span>
              </button>
            ))}
          </div>
        )}
      </form>

      <div className={styles.actionsRow}>
        <div className={styles.leftControls}>
          <button
            type="button"
            className={styles.filterModalBtn}
            onClick={onOpenMobileFilters}
            aria-label="Open filters"
          >
            <svg viewBox="0 0 24 24">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filters</span>
          </button>
          <div className={styles.resultsCount}>
            Showing {start}–{end} of {totalItems} results
          </div>
        </div>

        <Select<SortType>
          value={filters.sort}
          onChange={(newSort) => dispatch(changeSorting({ sortBy: newSort }))}
          options={SORT_OPTIONS}
          prefix="Sort by:"
          ariaLabel="Sort products by"
        />
      </div>
    </div>
  );
};
