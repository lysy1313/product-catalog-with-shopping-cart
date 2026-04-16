import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";
import { Button, Container, Icon } from "@/shared/ui";
import { AddButton } from "@/widgets/AddButton/ui/AddButton";
import React, { useCallback } from "react";
import { Link } from "react-router";
import {
  buildProductRoute,
  routePaths,
} from "@/app/providers/router/routes";
import {
  fullDeleteItem,
  selectItemsInShoppingCart,
  selectTotalPrice,
} from "../model/shoppingCartSlice";
import styles from "./ShoppingCart.module.scss";

export const ShoppingCart: React.FC = () => {
  const shoppingCartItems = useAppSelector(selectItemsInShoppingCart);
  const shoppingCartTotalPrice = useAppSelector(selectTotalPrice);

  const dispatch = useAppDispatch();

  const deleteItemFromShoppingCart = useCallback(
    (id: number) => {
      dispatch(fullDeleteItem({ id }));
    },
    [dispatch],
  );

  const isEmpty = shoppingCartItems.length === 0;
  const checkoutButtonLabel = "Checkout coming soon";

  return isEmpty ? (
    <section>
      <Container>
        <h2>Shopping cart</h2>
        <div className={styles.shoppingCart}>
          <div className={`${styles.checkoutAllCart} ${styles.emptyList}`}>
            Your cart is empty. Browse the catalog to add something you like.
            <Link to={routePaths.catalog} className={styles.link}>
              Back to catalog
            </Link>
          </div>
          <div className={styles.checkout}>
            <h5 className={styles.totalAmount}>
              Total price: ${shoppingCartTotalPrice.toFixed(2)}
            </h5>
            <Button disabled>{checkoutButtonLabel}</Button>
          </div>
        </div>
      </Container>
    </section>
  ) : (
    <section>
      <Container>
        <Link to={routePaths.catalog} className={styles.link}>
          Back to catalog
        </Link>
        <h2>Shopping cart</h2>
        <div className={styles.shoppingCart}>
          <div className={styles.checkoutAllCart}>
            {shoppingCartItems.map((item) => {
              return (
                <div key={item.id} className={styles.cart}>
                  <div className={styles.boxImage}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className={styles.cartImage}
                    />
                  </div>
                  <div className={styles.infoCart}>
                    <Link to={buildProductRoute(item.id)}>
                      <h2>{item.title}</h2>
                    </Link>
                    <p>{item.description}</p>
                  </div>
                  <div className={styles.infoPrice}>
                    <span>${item.price.toFixed(2)}</span>
                    <AddButton product={item} />
                  </div>
                  <Button
                    onClick={() => {
                      deleteItemFromShoppingCart(item.id);
                    }}
                    className={styles.deleteBtn}
                  >
                    <Icon
                      iconId="trash"
                      width="25"
                      height="25"
                      viewBox="0 0 23 20"
                    />
                  </Button>
                </div>
              );
            })}
          </div>
          <div className={styles.checkout}>
            <h5 className={styles.totalAmount}>
              Total price: ${shoppingCartTotalPrice.toFixed(2)}
            </h5>
            <Button disabled>{checkoutButtonLabel}</Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
