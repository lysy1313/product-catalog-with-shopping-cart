import { useAppSelector } from "@/shared/lib/hooks";
import { selectAllProducts } from "@/pages/Main/model/productsSlice";
import { Link, Navigate, useParams } from "react-router";
import styles from "./Product.module.scss";
import { Container } from "@/shared/ui";
import { AddButton } from "@/widgets/AddButton/ui/AddButton";

type ProductParams = {
  id: string;
};

export const Product = () => {
  const allProducts = useAppSelector(selectAllProducts);
  const { id } = useParams<ProductParams>();

  if (!id) {
    return (
      <Navigate to="/product-catalog-with-shopping-cart/catalog" replace />
    );
  }

  const product = allProducts.find((el) => el.id === +id);

  if (!product) {
    return (
      <section className={styles.infoAboutProducts}>
        <Container>
          <div>Product not found</div>
        </Container>
      </section>
    );
  }

  return (
    <section className={styles.infoAboutProducts}>
      <Container>
        <Link
          to="/product-catalog-with-shopping-cart/catalog"
          className={styles.link}
        >
          Back to catalog
        </Link>

        <div className={styles.product}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.productImage}
          />

          <div className={styles.productContent}>
            <h2 className={styles.productTitle}>{product.title}</h2>

            <h4 className={styles.productCategory}>{product.category}</h4>

            <div className={styles.productPriceSection}>
              <span className={styles.productPrice}>
                {product.price.toFixed(2)}
              </span>
              <span
                className={`${styles.productStockBadge} ${product.stock === 0 ? styles.outOfStock : ""}`}
              >
                {product.stock === 0 ? "Not available" : "In stock"}
              </span>
            </div>

            <p className={styles.productDescription}>{product.description}</p>
          </div>
        </div>
        <AddButton product={product} />
      </Container>
    </section>
  );
};
