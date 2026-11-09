import { routePaths } from "@/app/providers/router/routes";
import { selectTotalQuantityItemInShoppingCart } from "@/entities/cart";
import {
  changeCategory,
  selectAvailableCategories,
  selectFilters,
} from "@/entities/product";
import { useAppDispatch, useAppSelector, useScrollLock } from "@/shared/lib/hooks";
import { Container } from "@/shared/ui";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./Header.module.scss";
import { ThemeMode } from "./ThemeMode/ThemeMode";

export const Header: React.FC = () => {
  const quantity = useAppSelector(selectTotalQuantityItemInShoppingCart);
  const filters = useAppSelector(selectFilters);
  const categories = useAppSelector(selectAvailableCategories);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useScrollLock(isDrawerOpen);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowCategoryMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (category: string) => {
    dispatch(changeCategory({ category }));
    setShowCategoryMenu(false);
    setIsDrawerOpen(false);
    navigate(routePaths.catalog);
  };

  const visibleCategories = categories.slice(0, 6);
  const remainingCategories = categories.slice(6);

  return (
    <>
      <header className={styles.header}>
        <Container>
          <div className={styles.boxItem}>
            <div className={styles.leftGroup}>
              <button
                type="button"
                className={styles.burgerBtn}
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Open categories menu"
              >
                <svg viewBox="0 0 24 24">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              <h1 className={styles.brand}>
                <Link to={routePaths.catalog} className={styles.title} aria-label="Go to catalog">
                  Shop<span className={styles.brandAccent}>Hub</span>
                </Link>
              </h1>

              <nav className={styles.navCategories} aria-label="Product categories">
                {visibleCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles.navPill} ${filters.category === cat ? styles.active : ""}`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </button>
                ))}

                {remainingCategories.length > 0 && (
                  <div className={styles.moreDropdownWrapper} ref={menuRef}>
                    <button
                      type="button"
                      className={styles.moreDropdownBtn}
                      onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                      aria-expanded={showCategoryMenu}
                    >
                      <span>More</span>
                      <span>▾</span>
                    </button>
                    {showCategoryMenu && (
                      <div className={styles.moreDropdownMenu}>
                        {remainingCategories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            className={`${styles.dropdownItem} ${filters.category === cat ? styles.active : ""}`}
                            onClick={() => handleCategoryClick(cat)}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </nav>
            </div>

            <div className={styles.btnBox}>
              <ThemeMode />
              <Link
                to={routePaths.basket}
                className={styles.basketBtn}
                aria-label={`Open shopping cart with ${quantity} items`}
              >
                <svg className={styles.bagIcon} viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {quantity > 0 && <span className={styles.badge}>{quantity}</span>}
              </Link>
            </div>
          </div>
        </Container>
      </header>

      {isDrawerOpen && (
        <>
          <div className={styles.drawerOverlay} onClick={() => setIsDrawerOpen(false)} />
          <aside className={styles.drawer} aria-label="Mobile categories drawer">
            <div className={styles.drawerHeader}>
              <h3>Categories</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <div className={styles.drawerCategories}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.drawerItem} ${filters.category === cat ? styles.active : ""}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>
        </>
      )}
    </>
  );
};
