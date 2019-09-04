import cx from "classnames";
import React from "react";
import styles from "./MasterDetail.module.scss";

export const Detail: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <main className={cx(styles.detail, className)} {...rest}>
    {children}
  </main>
);
