// src/components/Skeleton/Skeleton.tsx
import React from "react";
import styles from "./Skeleton.module.scss";
import { useAppSelector } from "../../hooks";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "80vh",
  borderRadius = "4px",
  className = "",
}) => {
  const themeMode = useAppSelector((state) => state.app.themeMode);
  const inlineStyles = {
    width,
    height,
    borderRadius,
  };

  return (
    <div
      className={`${themeMode === "light" ? styles.skeleton : styles.skeletonDark} ${className}`}
      style={inlineStyles}
    ></div>
  );
};
