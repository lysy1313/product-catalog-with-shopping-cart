import { routePaths } from "@/app/providers/router/routes";
import {
  selectTotalQuantityItemInShoppingCart,
} from "@/pages/ShoppingCart/model/shoppingCartSlice";
import { useAppSelector } from "@/shared/lib/hooks";
import { Link } from "react-router";
import { Container } from "../../../shared/ui/Container/Container";
import { Icon } from "../../../shared/ui/Icon/Icon";
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
