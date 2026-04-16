import { createSlice } from "@reduxjs/toolkit";
import type { RequestStatus, ThemeMode } from "../config/types";

const THEME_STORAGE_KEY = "theme-mode";

const isThemeMode = (value: unknown): value is ThemeMode =>
  value === "dark" || value === "light";

const getSystemThemeMode = (): ThemeMode => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const getInitialThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "dark";
  }

  try {
    const storedThemeMode = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (isThemeMode(storedThemeMode)) {
      return storedThemeMode;
    }
  } catch {
    return getSystemThemeMode();
  }

  return getSystemThemeMode();
};

export const applyThemeMode = (themeMode: ThemeMode) => {
  if (typeof document === "undefined") {
    return;
  }

  const rootElement = document.documentElement;

  rootElement.classList.toggle("dark", themeMode === "dark");
  rootElement.dataset.theme = themeMode;
  rootElement.style.colorScheme = themeMode;
};

export const persistThemeMode = (themeMode: ThemeMode) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  } catch {
    // Ignore persistence failures so theme toggling still works.
  }
};

export const initialThemeMode = getInitialThemeMode();

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: initialThemeMode,
    status: "idle" as RequestStatus,
    error: null as string | null,
    toast: {
      message: "" as string,
      isVisible: false as boolean,
      version: 0 as number,
    },
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
    selectToast: (state) => state.toast,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>(
      (state, action) => {
        state.themeMode = action.payload.themeMode;
      },
    ),
    setAppStatusAC: create.reducer<{ status: RequestStatus }>(
      (state, action) => {
        state.status = action.payload.status;
      },
    ),
    setAppErrorAC: create.reducer<{ error: string | null }>((state, action) => {
      state.error = action.payload.error;
    }),
    setAppToast: create.reducer<{ message: string; isVisible: boolean }>(
      (state, action) => {
        state.toast.message = action.payload.message;
        state.toast.isVisible = action.payload.isVisible;
        state.toast.version += 1;
      },
    ),
  }),
});

export const { changeThemeModeAC, setAppStatusAC, setAppErrorAC, setAppToast } =
  appSlice.actions;
export const { selectThemeMode, selectStatus, selectError, selectToast } =
  appSlice.selectors;
export const appReducer = appSlice.reducer;
