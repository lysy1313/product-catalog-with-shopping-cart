import { type MouseEvent, type ReactNode } from "react";
import styles from "./Button.module.scss";

type ButtonPropsType = {
  children: ReactNode;
  disabled?: boolean;
  onClick: (e?: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

export const Button = ({
  children,
  onClick,
  disabled,
  className,
}: ButtonPropsType) => {
  return (
    <button
      className={className ? className : styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
