import { createSlice } from "@reduxjs/toolkit";
import type { RequestStatus, ThemeMode } from "../common/types/types";

const getThemeModeFromLS = (): ThemeMode => {
  const theme = localStorage.getItem("theme-mode");
  if ((theme && theme !== "" && theme === "dark") || theme === "light")
    return theme;
  return "dark";
};

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: getThemeModeFromLS() as ThemeMode,
    status: "idle" as RequestStatus,
    error: null as string | null,
    toast: {
      message: "" as string,
      isVisible: false as boolean,
    },
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
    selectToaast: (state) => state.toast,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>(
      (state, action) => {
        const { themeMode } = action.payload;
        localStorage.setItem("theme-mode", themeMode);
        state.themeMode = themeMode;
      },
    ),
    setAppStatusAC: create.reducer<{ status: RequestStatus }>(
      (state, action) => {
        state.status = action.payload.status;
      },
    ),
    setAppErrorAC: create.reducer<{ error: string }>((state, action) => {
      state.error = action.payload.error;
    }),
    setAppToast: create.reducer<{ message: string; isVisible: boolean }>(
      (state, action) => {
        state.toast.message = action.payload.message;
        state.toast.isVisible = action.payload.isVisible;
      },
    ),
  }),
});

export const { changeThemeModeAC, setAppStatusAC, setAppErrorAC, setAppToast } =
  appSlice.actions;
export const { selectThemeMode, selectStatus, selectError, selectToaast } =
  appSlice.selectors;
export const appReducer = appSlice.reducer;
