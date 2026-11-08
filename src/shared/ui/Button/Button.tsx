import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./Button.module.scss";

type ButtonPropsType = ComponentPropsWithoutRef<"button"> & {
  children: ReactNode;
};

export const Button = ({
  children,
  className,
  type = "button",
  ...rest
}: ButtonPropsType) => {
  const buttonClassName = [styles.button, className].filter(Boolean).join(" ");

  return (
    <button type={type} className={buttonClassName} {...rest}>
      {children}
    </button>
  );
};
