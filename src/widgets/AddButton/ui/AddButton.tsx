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

  const item = shoppingCart.find((el) => el.id === product.id);

  const dispatch = useAppDispatch();

  const addItemInShoppingCart = useCallback(
    (e?: MouseEvent<HTMLButtonElement>) => {
      e?.stopPropagation();
      e?.preventDefault();

      if (item) {
        dispatch(addItem({ id: product.id }));
      } else {
        dispatch(addNewItem({ item: product }));
      }

      dispatch(setAppToast({ message: "Added to cart!", isVisible: true }));
    },
    [dispatch, item, product],
  );

  const deleteItemFromShoppingCart = useCallback(
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

  return !item ? (
    <Button
      onClick={addItemInShoppingCart}
      disabled={product.stock === 0}
      className={styles.addButton}
    >
      Add product in basket
    </Button>
  ) : (
    <div className={styles.boxAddBtn}>
      <Button
        onClick={deleteItemFromShoppingCart}
        disabled={item.quantity === 0}
        className={styles.addButton}
      >
        -
      </Button>
      <span onClick={stopPropagation} className={styles.quantity}>
        {item.quantity}
      </span>
      <Button
        onClick={addItemInShoppingCart}
        disabled={item.quantity === item.stock}
        className={styles.addButton}
      >
        +
      </Button>
    </div>
  );
};
