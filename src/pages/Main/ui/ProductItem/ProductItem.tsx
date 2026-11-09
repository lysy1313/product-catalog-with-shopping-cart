import { buildProductRoute } from "@/app/providers/router/routes";
import type { Product } from "@/entities/product";
import { AddButton } from "@/widgets/AddButton/ui/AddButton";
import React from "react";
import { Link } from "react-router";
import styles from "./ProductItem.module.scss";

type ProductItemType = {
  item: Product;
};

export const ProductItem: React.FC<ProductItemType> = ({ item }) => {
  const productUrl = buildProductRoute(item.id);
  const discount = Math.round(item.discountPercentage);
  const reviewCount = item.reviews ? item.reviews.length : 0;
  const isOutOfStock = item.stock === 0;

  return (
    <article className={styles.cart}>
      <Link to={productUrl} className={styles.imageContainer}>
        {discount > 0 && (
          <span className={styles.discountBadge}>-{discount}%</span>
        )}
        <div className={styles.topRating}>
          <span className={styles.star}>★</span>
          <span>{item.rating.toFixed(1)}</span>
          {reviewCount > 0 && (
            <span className={styles.reviewCount}>({reviewCount})</span>
          )}
        </div>
        <img
          className={styles.imgCart}
          src={item.thumbnail || (item.images && item.images[0])}
          alt={item.title}
          loading="lazy"
        />
      </Link>

      <div className={styles.productInfo}>
        <div className={styles.metaRow}>
          <span className={styles.brand}>{item.brand || item.category}</span>
          <span
            className={`${styles.stockStatus} ${item.stock < 5 ? styles.lowStock : ""}`}
          >
            {isOutOfStock ? "Out of stock" : item.stock < 5 ? "Low stock" : "In stock"}
          </span>
        </div>

        <Link to={productUrl} className={styles.titleLink}>
          <h3 className={styles.title}>{item.title}</h3>
        </Link>

        <div className={styles.priceSection}>
          <span className={styles.price}>${item.price.toFixed(2)}</span>
          {item.originalPrice > item.price && (
            <span className={styles.originalPrice}>
              ${item.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className={styles.addButtonContainer}>
          <AddButton product={item} />
        </div>
      </div>
    </article>
  );
};
