import { buildProductRoute } from "@/app/providers/router/routes";
import type { Product } from "@/entities/product";
import { AddButton } from "@/widgets/AddButton/ui/AddButton";
import React from "react";
import { Link } from "react-router";
import styles from "./ProductItem.module.scss";

type ProductItemType = {
  item: Product;
};

export const ProductItem: React.FC<ProductItemType> = ({
  item,
}: ProductItemType) => {
  const productUrl = buildProductRoute(item.id);

  return (
    <article className={styles.cart}>
      <Link to={productUrl} className={styles.imageContainer}>
        <img className={styles.imgCart} src={item.image} alt={item.title} />
      </Link>
      <div className={styles.productInfo}>
        <Link to={productUrl} className={styles.titleLink}>
          <h3 className={styles.title}>{item.title}</h3>
        </Link>

        <div className={styles.priceSection}>
          <span className={styles.price}>${item.price.toFixed(2)}</span>
          <span
            className={`${styles.badge} ${item.stock === 0 ? styles.red : ""}`}
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
    </article>
  );
};
