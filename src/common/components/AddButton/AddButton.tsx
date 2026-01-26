import { setAppToast } from "@/app/app-slice";
import { useAppDispatch, useAppSelector } from "@/common/hooks";
import type { Product } from "@/features/model/productsSlice.types";
import {
  addItem,
  addNewItem,
  deleteItem,
  selectItemsInShoppingCart,
} from "@/features/model/shoppingCartSlice";
import React, { type MouseEvent } from "react";
import { Button } from "../Button/Button";
import styles from "./AddButton.module.scss";

type PropsType = {
  product: Product;
};

export const AddButton: React.FC<PropsType> = ({ product }) => {
  const shoppingCart = useAppSelector(selectItemsInShoppingCart);

  const item = shoppingCart.find((el) => el.id === product.id);

  const dispatch = useAppDispatch();

  const addItemInShoppingCart = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (item) {
      dispatch(addItem({ id: product.id }));
    } else {
      dispatch(addNewItem({ item: product }));
    }
    dispatch(setAppToast({ message: "Добавлено в корзину!", isVisible: true }));
  };

  const deleteItemFromShoppingCart = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    e?.preventDefault();
    dispatch(deleteItem({ id: product.id }));
  };

  const stopPropagation = (e: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    e?.preventDefault();
    return;
  };

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
