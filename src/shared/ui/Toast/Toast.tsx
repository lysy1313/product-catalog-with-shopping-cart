import {
  selectError,
  selectStatus,
  selectToast,
  setAppErrorAC,
  setAppStatusAC,
  setAppToast,
} from "@/app/model/app-slice";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";
import React, { useEffect } from "react";
import styles from "./Toast.module.scss";

export const Toast: React.FC = () => {
  const { isVisible, message, version } = useAppSelector(selectToast);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status !== "failed") {
      return;
    }

    dispatch(
      setAppToast({
        isVisible: true,
        message: error ?? "The server is unavailable!",
      }),
    );
  }, [dispatch, error, status]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timer = window.setTimeout(() => {
      dispatch(setAppToast({ isVisible: false, message: "" }));

      if (status === "failed") {
        dispatch(setAppStatusAC({ status: "idle" }));
        dispatch(setAppErrorAC({ error: null }));
      }
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [dispatch, isVisible, status, version]);

  if (!isVisible) {
    return null;
  }

  const isErrorToast = status === "failed";

  return (
    <div
      className={`${styles.toast} ${isErrorToast ? styles.error : styles.success}`}
      role={isErrorToast ? "alert" : "status"}
      aria-live={isErrorToast ? "assertive" : "polite"}
    >
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
      </div>
    </div>
  );
};
