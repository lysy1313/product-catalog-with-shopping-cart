import React, { useEffect, useState } from "react";
import styles from "./Toast.module.scss";
import { useAppDispatch, useAppSelector } from "@/common/hooks";
import { selectToaast, setAppToast } from "@/app/app-slice";

export const Toast: React.FC = () => {
  const { isVisible, message } = useAppSelector(selectToaast);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setAppToast({ isVisible: false, message: "" }));
    }, 2000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.toast} ${styles.success}`}>
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
      </div>
    </div>
  );
};
