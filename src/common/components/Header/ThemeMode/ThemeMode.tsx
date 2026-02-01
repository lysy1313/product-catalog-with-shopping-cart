import React, { useCallback, useEffect } from "react";
import styles from "./ThemeMode.module.scss";
import { useAppDispatch, useAppSelector } from "@/common/hooks";
import { changeThemeModeAC, selectThemeMode } from "@/app/app-slice";

export const ThemeMode: React.FC = () => {
  const themeMode = useAppSelector(selectThemeMode);
  const dispatch = useAppDispatch();

  const changeThemeModeHandler = useCallback(() => {
    dispatch(
      changeThemeModeAC({
        themeMode: themeMode === "light" ? "dark" : "light",
      }),
    );
  }, [dispatch, themeMode]);

  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  return (
    <div className={styles.themeMode} onClick={changeThemeModeHandler}>
      <span
        className={`${styles.switchDark} ${themeMode === "light" ? styles.switchLigth : ""}`}
      ></span>
    </div>
  );
};
