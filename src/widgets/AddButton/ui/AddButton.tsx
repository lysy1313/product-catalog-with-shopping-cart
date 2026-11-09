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

  if (!cartItem) {
    return (
      <Button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className={styles.addButton}
      >
        Add to Bag
      </Button>
    );
  }

  return (
    <div className={styles.boxAddBtn}>
      <button
        type="button"
        onClick={handleRemoveFromCart}
        disabled={cartItem.quantity === 0}
        className={styles.counterBtn}
        aria-label={`Remove one ${product.title} from cart`}
      >
        −
      </button>
      <span className={styles.quantity}>{cartItem.quantity}</span>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={cartItem.quantity >= product.stock}
        className={styles.counterBtn}
        aria-label={`Add one more ${product.title} to cart`}
      >
        +
      </button>
    </div>
  );
};
