import React, { useState, type ChangeEvent } from "react";
import styles from "./Radio.module.scss";

export type RadioProps = {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string | number;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export const Radio: React.FC<RadioProps> = ({
  checked,
  onChange,
  name,
  value,
  label,
  disabled = false,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <label
      className={`${styles.label} ${disabled ? styles.disabled : ""} ${className || ""}`}
    >
      <input
        type="radio"
        className={styles.hiddenInput}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <span
        className={`${styles.circle} ${checked ? styles.checked : ""} ${isFocused ? styles.focused : ""}`}
        aria-hidden="true"
      >
        {checked && <span className={styles.dot} />}
      </span>
      {label && <span className={styles.text}>{label}</span>}
    </label>
  );
};
