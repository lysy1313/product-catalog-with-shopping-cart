import { setAppToast } from "@/app/model/app-slice";
import type { Product } from "@/pages/Main/model/productsSlice.types";
import {
  addItem,
  addNewItem,
  deleteItem,
  selectItemsInShoppingCart,
} from "@/pages/ShoppingCart/model/shoppingCartSlice";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";
import React, { useCallback, type MouseEvent } from "react";
import { Button } from "../../../shared/ui/Button/Button";
import styles from "./AddButton.module.scss";

type PropsType = {
  product: Product;
};

export const AddButton: React.FC<PropsType> = ({ product }) => {
  const shoppingCart = useAppSelector(selectItemsInShoppingCart);

  const cartItem = shoppingCart.find((el) => el.id === product.id);

  const dispatch = useAppDispatch();

  const handleAddToCart = useCallback(
    (e?: MouseEvent<HTMLButtonElement>) => {
      e?.stopPropagation();
      e?.preventDefault();

      if (cartItem) {
        dispatch(addItem({ id: product.id }));
      } else {
        dispatch(addNewItem({ item: product }));
      }

      dispatch(setAppToast({ message: "Added to cart!", isVisible: true }));
    },
    [cartItem, dispatch, product],
  );

  const handleRemoveFromCart = useCallback(
    (e?: MouseEvent<HTMLButtonElement>) => {
      e?.stopPropagation();
      e?.preventDefault();
      dispatch(deleteItem({ id: product.id }));
    },
    [dispatch, product.id],
  );

  const stopPropagation = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

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
      <span onClick={stopPropagation} className={styles.quantity}>
        {cartItem.quantity}
      </span>
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
