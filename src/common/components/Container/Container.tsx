import type { ReactNode } from "react";
import styles from "./Container.module.scss";

type ContainerPropsType = {
  children: ReactNode;
};

export const Container = ({ children }: ContainerPropsType) => {
  return <div className={styles.container}>{children}</div>;
};
