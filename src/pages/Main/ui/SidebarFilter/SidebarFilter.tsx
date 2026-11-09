import {
  resetFilters,
  selectAvailableBrands,
  selectFilters,
  selectPriceBounds,
  setMinRating,
  setPriceRange,
  toggleBrand,
} from "@/entities/product";
import { useAppDispatch, useAppSelector, useScrollLock } from "@/shared/lib/hooks";
import { Button, Checkbox, Input, Radio } from "@/shared/ui";
import React from "react";
import styles from "./SidebarFilter.module.scss";

type SidebarFilterProps = {
  isModalOpen?: boolean;
  onCloseModal?: () => void;
};

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  isModalOpen = false,
  onCloseModal,
}) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const brands = useAppSelector(selectAvailableBrands);
  const bounds = useAppSelector(selectPriceBounds);

  useScrollLock(isModalOpen);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value) || 0;
    dispatch(setPriceRange({ minPrice: val, maxPrice: filters.maxPrice }));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value) || 0;
    dispatch(setPriceRange({ minPrice: filters.minPrice, maxPrice: val }));
  };

  const ratings = [4, 3, 2];

  const filterContent = (
    <>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Price Range ($)</h4>
        <div className={styles.priceRangeFields}>
          <div className={styles.priceFieldBox}>
            <span className={styles.fieldLabel}>Min</span>
            <Input
              type="number"
              placeholder={`$${bounds.min}`}
              value={filters.minPrice || ""}
              onChange={handleMinPriceChange}
            />
          </div>
          <span className={styles.divider}>—</span>
          <div className={styles.priceFieldBox}>
            <span className={styles.fieldLabel}>Max</span>
            <Input
              type="number"
              placeholder={`$${bounds.max}`}
              value={filters.maxPrice || ""}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
      </div>

      {brands.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Brands</h4>
          <div className={styles.checkList}>
            {brands.slice(0, 10).map((brand) => (
              <Checkbox
                key={brand}
                label={brand}
                checked={filters.brands.includes(brand)}
                onChange={() => dispatch(toggleBrand({ brand }))}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Minimum Rating</h4>
        <div className={styles.checkList}>
          {ratings.map((rate) => (
            <Radio
              key={rate}
              name="rating"
              label={`★ ${rate}.0 & Up`}
              checked={filters.minRating === rate}
              onChange={() => dispatch(setMinRating({ minRating: rate }))}
            />
          ))}
          <Radio
            name="rating"
            label="All Ratings"
            checked={filters.minRating === 0}
            onChange={() => dispatch(setMinRating({ minRating: 0 }))}
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>Filters</h3>
          <button
            type="button"
            onClick={() => dispatch(resetFilters())}
            className={styles.resetBtn}
          >
            Reset all
          </button>
        </div>
        {filterContent}
      </aside>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={onCloseModal}>
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.headerRow}>
              <h3 className={styles.title}>Filter Products</h3>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => dispatch(resetFilters())}
                  className={styles.resetBtn}
                >
                  Reset all
                </button>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={onCloseModal}
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className={styles.modalBody}>
              {filterContent}
            </div>

            <div className={styles.modalFooter}>
              <Button className={styles.modalApplyBtn} onClick={onCloseModal}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
