import React, { useCallback, useEffect } from "react";
import styles from "./ThemeMode.module.scss";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";
import {
  applyThemeMode,
  changeThemeModeAC,
  persistThemeMode,
  selectThemeMode,
} from "@/app/model/app-slice";

export const ThemeMode: React.FC = () => {
  const themeMode = useAppSelector(selectThemeMode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    applyThemeMode(themeMode);
  }, [themeMode]);

  const changeThemeModeHandler = useCallback(() => {
    const nextThemeMode = themeMode === "light" ? "dark" : "light";

    dispatch(changeThemeModeAC({ themeMode: nextThemeMode }));
    persistThemeMode(nextThemeMode);
  }, [dispatch, themeMode]);

  const nextThemeLabel = themeMode === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      className={styles.themeMode}
      onClick={changeThemeModeHandler}
      aria-label={`Switch to ${nextThemeLabel} theme`}
      aria-pressed={themeMode === "dark"}
      title={`Switch to ${nextThemeLabel} theme`}
    >
      <span className={styles.track}>
        <span
          aria-hidden="true"
          className={`${styles.thumb} ${themeMode === "light" ? styles.thumbLight : ""}`}
        />
      </span>
    </button>
  );
};
