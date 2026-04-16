import { selectError, selectStatus } from "@/app/model/app-slice";
import { routePaths } from "@/app/providers/router/routes";
import { selectAllProducts } from "@/pages/Main/model/productsSlice";
import { useAppSelector } from "@/shared/lib/hooks";
import { Container } from "@/shared/ui";
import { AddButton } from "@/widgets/AddButton/ui/AddButton";
import { Link, Navigate, useParams } from "react-router";
import styles from "./Product.module.scss";

type ProductParams = {
  id: string;
};

export const Product = () => {
  const allProducts = useAppSelector(selectAllProducts);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const { id } = useParams<ProductParams>();

  if (!id) {
    return <Navigate to={routePaths.catalog} replace />;
  }

  const productId = Number(id);
  const isValidProductId = Number.isInteger(productId) && productId > 0;
  const product = isValidProductId
    ? allProducts.find((item) => item.id === productId)
    : undefined;
  const isInitialLoad = allProducts.length === 0 && status !== "succeeded";

  if (isInitialLoad) {
    return (
      <section className={styles.infoAboutProducts}>
        <Container>
          <Link to={routePaths.catalog} className={styles.link}>
            Back to catalog
          </Link>
          <div>Loading product...</div>
        </Container>
      </section>
    );
  }

  if (status === "failed" && allProducts.length === 0) {
    return (
      <section className={styles.infoAboutProducts}>
        <Container>
          <Link to={routePaths.catalog} className={styles.link}>
            Back to catalog
          </Link>
          <div>{error ?? "Unable to load product details."}</div>
        </Container>
      </section>
    );
  }

  if (!product) {
    return (
      <section className={styles.infoAboutProducts}>
        <Container>
          <Link to={routePaths.catalog} className={styles.link}>
            Back to catalog
          </Link>
          <div>Product not found</div>
        </Container>
      </section>
    );
  }

  return (
    <section className={styles.infoAboutProducts}>
      <Container>
        <Link to={routePaths.catalog} className={styles.link}>
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
              <span className={styles.productPrice}>${product.price.toFixed(2)}</span>
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
