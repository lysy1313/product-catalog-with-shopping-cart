import {
  selectStatus,
  selectToaast,
  setAppStatusAC,
  setAppToast,
} from "@/app/app-slice";
import { useAppDispatch, useAppSelector } from "@/common/hooks";
import React, { useEffect } from "react";
import styles from "./Toast.module.scss";

export const Toast: React.FC = () => {
  const { isVisible, message } = useAppSelector(selectToaast);
  const status = useAppSelector(selectStatus);
  const dispatch = useAppDispatch();

  if (status === "failed") {
    dispatch(
      setAppToast({ isVisible: true, message: "The server is unavailable!" }),
    );
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setAppToast({ isVisible: false, message: "" }));
      if (status === "failed") {
        dispatch(setAppStatusAC({ status: "idle" }));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  if (isVisible === false) return null;

  return status !== "failed" ? (
    <div className={`${styles.toast} ${styles.success}`}>
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
      </div>
    </div>
  ) : (
    <div className={`${styles.toast} ${styles.error}`}>
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
      </div>
    </div>
  );
};
