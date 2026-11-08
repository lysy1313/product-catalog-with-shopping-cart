import { setAppToast } from "@/app/model/app-slice";
import {
  addItem,
  addNewItem,
  deleteItem,
  selectItemsInShoppingCart,
} from "@/entities/cart";
import type { Product } from "@/entities/product";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";
import { Button } from "@/shared/ui";
import React, { useCallback } from "react";
import styles from "./AddButton.module.scss";

type PropsType = {
  product: Product;
};

export const AddButton: React.FC<PropsType> = ({ product }) => {
  const shoppingCart = useAppSelector(selectItemsInShoppingCart);
  const cartItem = shoppingCart.find((el) => el.id === product.id);
  const dispatch = useAppDispatch();

  const handleAddToCart = useCallback(() => {
    if (cartItem) {
      dispatch(addItem({ id: product.id }));
    } else {
      dispatch(addNewItem({ item: product }));
    }

    dispatch(setAppToast({ message: "Added to cart!", isVisible: true }));
  }, [cartItem, dispatch, product]);

  const handleRemoveFromCart = useCallback(() => {
    dispatch(deleteItem({ id: product.id }));
  }, [dispatch, product.id]);

  return !cartItem ? (
    <Button
      onClick={handleAddToCart}
      disabled={product.stock === 0}
      className={styles.addButton}
    >
      Add to cart
    </Button>
  ) : (
    <div className={styles.boxAddBtn}>
      <Button
        onClick={handleRemoveFromCart}
        disabled={cartItem.quantity === 0}
        className={styles.addButton}
        aria-label={`Remove one ${product.title} from cart`}
      >
        -
      </Button>
      <span className={styles.quantity}>{cartItem.quantity}</span>
      <Button
        onClick={handleAddToCart}
        disabled={cartItem.quantity === cartItem.stock}
        className={styles.addButton}
        aria-label={`Add one more ${product.title} to cart`}
      >
        +
      </Button>
    </div>
  );
};
