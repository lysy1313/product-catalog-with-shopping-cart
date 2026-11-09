import { buildProductRoute, routePaths } from "@/app/providers/router/routes";
import {
  clearCart,
  fullDeleteItem,
  selectItemsInShoppingCart,
  selectRawSubtotal,
  selectTotalDiscount,
  selectTotalPrice,
} from "@/entities/cart";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";
import { Button, Container, Icon } from "@/shared/ui";
import { AddButton } from "@/widgets/AddButton/ui/AddButton";
import React, { useState } from "react";
import { Link } from "react-router";
import styles from "./ShoppingCart.module.scss";

export const ShoppingCart: React.FC = () => {
  const items = useAppSelector(selectItemsInShoppingCart);
  const totalPrice = useAppSelector(selectTotalPrice);
  const subtotal = useAppSelector(selectRawSubtotal);
  const discount = useAppSelector(selectTotalDiscount);
  const dispatch = useAppDispatch();

  const [isOrdered, setIsOrdered] = useState(false);

  const handleCheckout = () => {
    setIsOrdered(true);
    dispatch(clearCart());
  };

  return (
    <section className={styles.section}>
      <Container>
        <Link to={routePaths.catalog} className={styles.backLink}>
          ← Back to catalog
        </Link>
        <h2 className={styles.pageTitle}>Shopping Bag</h2>

        <div className={styles.layout}>
          <div className={styles.itemsList}>
            {items.length === 0 ? (
              <div className={styles.emptyCard}>
                <p>Your shopping bag is currently empty.</p>
                <Link to={routePaths.catalog}>
                  <Button>Explore Products</Button>
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className={styles.itemCard}>
                  <img
                    src={item.thumbnail || item.images?.[0]}
                    alt={item.title}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemInfo}>
                    <Link to={buildProductRoute(item.id)} className={styles.itemTitle}>
                      {item.title}
                    </Link>
                    <div className={styles.itemCategory}>{item.category}</div>
                  </div>
                  <div className={styles.itemControls}>
                    <span className={styles.itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <AddButton product={item} />
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => dispatch(fullDeleteItem({ id: item.id }))}
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <Icon iconId="trash" width="20" height="20" viewBox="0 0 23 20" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className={`${styles.summaryRow} ${styles.discount}`}>
                <span>Total Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className={styles.summaryRow}>
              <span>Estimated Shipping</span>
              <span>Free</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <Button
              className={styles.checkoutBtn}
              disabled={items.length === 0}
              onClick={handleCheckout}
            >
              Checkout (${totalPrice.toFixed(2)})
            </Button>
          </div>
        </div>

        {isOrdered && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Order Placed Successfully! 🎉</h3>
              <p>
                Thank you for your purchase. We have received your order and started processing it.
              </p>
              <Button onClick={() => setIsOrdered(false)}>Continue Shopping</Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};
