import { forwardRef, type ComponentPropsWithoutRef } from "react";
import styles from "./Input.module.scss";

export type InputProps = ComponentPropsWithoutRef<"input"> & {
  label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...rest }, ref) => {
    const inputClassName = [styles.inputRoot, className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <input ref={ref} className={inputClassName} {...rest} />
      </div>
    );
  },
);

Input.displayName = "Input";
