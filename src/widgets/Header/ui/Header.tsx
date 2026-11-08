import { routePaths } from "@/app/providers/router/routes";
import { selectTotalQuantityItemInShoppingCart } from "@/entities/cart";
import { useAppSelector } from "@/shared/lib/hooks";
import { Container, Icon } from "@/shared/ui";
import { Link } from "react-router";
import styles from "./Header.module.scss";
import { ThemeMode } from "./ThemeMode/ThemeMode";

export const Header: React.FC = () => {
  const quantityItemInShoppingCart = useAppSelector(
    selectTotalQuantityItemInShoppingCart,
  );

  const basketLabel =
    quantityItemInShoppingCart > 0
      ? `Open basket with ${quantityItemInShoppingCart} item${quantityItemInShoppingCart === 1 ? "" : "s"}`
      : "Open basket";

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.boxItem}>
          <h1 className={styles.brand}>
            <Link
              to={routePaths.catalog}
              className={styles.title}
              aria-label="Go to catalog"
            >
              Shop
            </Link>
          </h1>
          <div className={styles.btnBox}>
            <ThemeMode />
            <Link to={routePaths.basket} aria-label={basketLabel}>
              <Icon
                iconId="basket"
                width="30"
                height="30"
                viewBox="0 0 23 20"
              />
              {quantityItemInShoppingCart > 0 && (
                <span aria-hidden="true">{quantityItemInShoppingCart}</span>
              )}
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
};
