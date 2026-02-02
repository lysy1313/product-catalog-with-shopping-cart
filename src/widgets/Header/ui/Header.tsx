import {
  saveInLocalStorageCart,
  selectItemsInShoppingCart,
  selectTotalQuantityItemInShoppingCart,
} from "@/pages/ShoppingCart/model/shoppingCartSlice";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";
import { Link, useNavigate } from "react-router";
import { Container } from "../../../shared/ui/Container/Container";
import { Icon } from "../../../shared/ui/Icon/Icon";
import styles from "./Header.module.scss";
import { ThemeMode } from "./ThemeMode/ThemeMode";
import { useEffect } from "react";

export const Header: React.FC = () => {
  const quantityItemInShoppingCart = useAppSelector(
    selectTotalQuantityItemInShoppingCart,
  );
  const itemsInShoppingCart = useAppSelector(selectItemsInShoppingCart);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(saveInLocalStorageCart());
  }, [itemsInShoppingCart]);
  const navigate = useNavigate();
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.boxItem}>
          <h1
            onClick={() =>
              navigate("/product-catalog-with-shopping-cart/catalog")
            }
            className={styles.title}
          >
            Shop
          </h1>
          <div className={styles.btnBox}>
            <ThemeMode />
            <Link to="/product-catalog-with-shopping-cart/basket">
              <Icon
                iconId="basket"
                width="30"
                height="30"
                viewBox="0 0 23 20"
              />
              {quantityItemInShoppingCart > 0 && (
                <span>{quantityItemInShoppingCart}</span>
              )}
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
};
