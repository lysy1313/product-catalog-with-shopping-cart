import React, { useState, type ChangeEvent } from "react";
import styles from "./Checkbox.module.scss";

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
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
        type="checkbox"
        className={styles.hiddenInput}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked, e)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <span
        className={`${styles.box} ${checked ? styles.checked : ""} ${isFocused ? styles.focused : ""}`}
        aria-hidden="true"
      >
        {checked && (
          <svg className={styles.checkIcon} viewBox="0 0 16 16">
            <polyline points="3 8 6.5 12 13 4" />
          </svg>
        )}
      </span>
      {label && <span className={styles.text}>{label}</span>}
    </label>
  );
};
