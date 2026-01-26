import { AddButton, Container } from "@/common/components";
import { useAppSelector } from "@/common/hooks";
import { selectAllProducts } from "@/features/model/productsSlice";
import { Link, Navigate, useParams } from "react-router";
import styles from "./Product.module.scss";

type ProductParams = {
  id: string;
};

export const Product = () => {
  const allProducts = useAppSelector(selectAllProducts);
  const { id } = useParams<ProductParams>();

  if (!id) {
    return <Navigate to="/catalog" replace />;
  }

  const product = allProducts.find((el) => el.id === +id);

  if (!product) {
    return (
      <section className={styles.infoAboutProduts}>
        <Container>
          <div>Товар не найден</div>
        </Container>
      </section>
    );
  }

  return (
    <section className={styles.infoAboutProduts}>
      <Container>
        <Link to="/catalog" className={styles.link}>
          Назад в каталог
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
                {product.stock === 0 ? "Нет в наличии" : "В наличии"}
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
