import React from "react";
import styles from "./ThemeMode.module.scss";
import { useAppDispatch, useAppSelector } from "@/common/hooks";
import { changeThemeModeAC, selectThemeMode } from "@/app/app-slice";

export const ThemeMode: React.FC = () => {
  const themeMode = useAppSelector(selectThemeMode);
  const dispatch = useAppDispatch();

  const changeThemeModeHadler = () => {
    dispatch(
      changeThemeModeAC({
        themeMode: themeMode === "light" ? "dark" : "light",
      }),
    );
  };
  if (themeMode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  return (
    <div className={styles.themeMode} onClick={changeThemeModeHadler}>
      <span
        className={`${styles.switchDark} ${themeMode === "light" ? styles.switchLigth : ""}`}
      ></span>
    </div>
  );
};
