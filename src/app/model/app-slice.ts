import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RequestStatus, ThemeMode } from "../config/types";
import type { RootState } from "../providers/store/store";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "dark" as ThemeMode,
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
    selectToast: (state) => state.toast,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>(
      (state, action) => {
        const { themeMode } = action.payload;
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
  extraReducers(builder) {
    builder.addCase(
      loadThemeModeInLS.fulfilled,
      (state, action: PayloadAction<ThemeMode>) => {
        state.themeMode = action.payload;
      },
    );
  },
});

export const setThemeModeInLS = createAsyncThunk(
  `${appSlice.name}/setThemeModeInLS`,
  (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      localStorage.setItem("theme-mode", state.app.themeMode);
    } catch (error) {
      dispatch(setAppStatusAC({ status: "failed" }));
      dispatch(setAppErrorAC({ error: error as string }));
      return rejectWithValue(error);
    }
  },
);
export const loadThemeModeInLS = createAsyncThunk(
  `${appSlice.name}/loadThemeModeInLS`,
  (_, { dispatch, rejectWithValue }) => {
    try {
      const theme = localStorage.getItem("theme-mode");
      if ((theme && theme !== "" && theme === "dark") || theme === "light")
        return theme as ThemeMode;
      return "dark";
    } catch (error) {
      dispatch(setAppStatusAC({ status: "failed" }));
      dispatch(setAppErrorAC({ error: error as string }));
      return rejectWithValue(error);
    }
  },
);

export const { changeThemeModeAC, setAppStatusAC, setAppErrorAC, setAppToast } =
  appSlice.actions;
export const { selectThemeMode, selectStatus, selectError, selectToast } =
  appSlice.selectors;
export const appReducer = appSlice.reducer;
