import { selectError, selectStatus } from "@/app/model/app-slice";
import { routePaths } from "@/app/providers/router/routes";
import { selectAllProducts } from "@/entities/product";
import { useAppSelector } from "@/shared/lib/hooks";
import { Container } from "@/shared/ui";
import { AddButton } from "@/widgets/AddButton/ui/AddButton";
import React, { useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import styles from "./Product.module.scss";

type ProductParams = {
  id: string;
};

export const Product: React.FC = () => {
  const allProducts = useAppSelector(selectAllProducts);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const { id } = useParams<ProductParams>();

  const [activeImage, setActiveImage] = useState<string>("");

  if (!id) {
    return <Navigate to={routePaths.catalog} replace />;
  }

  const productId = Number(id);
  const product = allProducts.find((p) => p.id === productId);

  if (allProducts.length === 0 && status === "loading") {
    return (
      <section className={styles.infoAboutProducts}>
        <Container>
          <div>Loading product details...</div>
        </Container>
      </section>
    );
  }

  if (!product) {
    return (
      <section className={styles.infoAboutProducts}>
        <Container>
          <Link to={routePaths.catalog} className={styles.backLink}>
            ← Back to catalog
          </Link>
          <div>{error ?? "Product not found."}</div>
        </Container>
      </section>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const displayedImage = activeImage || images[0];

  return (
    <section className={styles.infoAboutProducts}>
      <Container>
        <Link to={routePaths.catalog} className={styles.backLink}>
          ← Back to catalog
        </Link>

        <div className={styles.productCard}>
          <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
              <img src={displayedImage} alt={product.title} className={styles.mainImage} />
            </div>
            {images.length > 1 && (
              <div className={styles.thumbnailsRow}>
                {images.map((imgUrl, i) => (
                  <button
                    key={imgUrl + i}
                    type="button"
                    className={`${styles.thumbBtn} ${displayedImage === imgUrl ? styles.active : ""}`}
                    onClick={() => setActiveImage(imgUrl)}
                  >
                    <img src={imgUrl} alt={`${product.title} thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.details}>
            <span className={styles.brand}>{product.brand || product.category}</span>
            <h2 className={styles.title}>{product.title}</h2>

            <div className={styles.ratingRow}>
              <span className={styles.star}>★</span>
              <span>{product.rating.toFixed(1)}</span>
              <span className={styles.reviewCount}>({product.reviews?.length || 0} reviews)</span>
            </div>

            <div className={styles.priceBox}>
              <span className={styles.price}>${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
              )}
              {product.discountPercentage > 0 && (
                <span className={styles.discountPill}>
                  Save {Math.round(product.discountPercentage)}%
                </span>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.specsGrid}>
              <div className={styles.specItem}>
                <strong>SKU:</strong> {product.sku}
              </div>
              <div className={styles.specItem}>
                <strong>Stock:</strong> {product.stock} units ({product.availabilityStatus})
              </div>
              <div className={styles.specItem}>
                <strong>Shipping:</strong> {product.shippingInformation || "Standard delivery"}
              </div>
              <div className={styles.specItem}>
                <strong>Warranty:</strong> {product.warrantyInformation || "1 year warranty"}
              </div>
            </div>

            <AddButton product={product} />
          </div>
        </div>

        {product.reviews && product.reviews.length > 0 && (
          <div className={styles.reviewsSection}>
            <h3 className={styles.reviewsTitle}>Customer Reviews</h3>
            {product.reviews.map((rev, index) => (
              <div key={index} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <span>{rev.reviewerName}</span>
                  <span>★ {rev.rating}</span>
                </div>
                <p className={styles.reviewComment}>{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};
