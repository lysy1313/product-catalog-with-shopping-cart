import type { Product } from "@/pages/Main/model/productsSlice.types";
import React, { useState } from "react";
import { Link } from "react-router";
import styles from "./ProductItem.module.scss";
import { AddButton } from "@/widgets/AddButton/ui/AddButton";

type ProductItemType = {
  item: Product;
};

export const ProductItem: React.FC<ProductItemType> = ({
  item,
}: ProductItemType) => {
  const [isHover, setIsHover] = useState(false);

  const onMouseLeave = () => setIsHover(false);
  const onMouseEnter = () => setIsHover(true);

  return (
    <Link to={`/product-catalog-with-shopping-cart/catalog/${item.id}`}>
      <div
        className={styles.cart}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className={styles.imageContainer}>
          <img
            className={`${styles.imgCart} ${isHover ? styles.imageFadeOut : ""}`}
            src={item.image}
            alt={item.title}
          />
        </div>
        <div
          className={`${styles.productInfo} ${isHover ? styles.infoVisible : ""}`}
        >
          <h3 className={styles.title}>{item.title}</h3>

          <div className={styles.priceSection}>
            <span className={styles.price}>${item.price.toFixed(2)}</span>
            <span
              className={`${styles.badge} ${item.stock === 0 && styles.red}`}
            >
              {item.stock === 0 ? "Out of stock" : "In stock"}
            </span>
          </div>

          <p className={styles.description}>
            {item.description.length > 100
              ? `${item.description.substring(0, 100)}...`
              : item.description}
          </p>

          <div className={styles.addButtonContainer}>
            <AddButton product={item} />
          </div>
        </div>
      </div>
    </Link>
  );
};
