import { Link, useNavigate } from "react-router";
import { Container } from "../Container/Container";
import { Icon } from "../Icon/Icon";
import styles from "./Header.module.scss";
import { ThemeMode } from "./ThemeMode/ThemeMode";
import { useAppSelector } from "@/common/hooks";
import { selectTotalQuantityItemInShoppingCart } from "@/features/model/shoppingCartSlice";

export const Header: React.FC = () => {
  const quantityItemInShoppingCart = useAppSelector(
    selectTotalQuantityItemInShoppingCart,
  );
  const navigate = useNavigate();
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.boxItem}>
          <h1 onClick={() => navigate("/catalog")} className={styles.title}>
            Shop
          </h1>
          <div className={styles.btnBox}>
            <ThemeMode />
            <Link to="/basket">
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
