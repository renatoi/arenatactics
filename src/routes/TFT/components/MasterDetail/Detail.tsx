import React from "react";
import cx from "classnames";
import styles from "./MasterDetail.module.css";

export const Detail: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cx(styles.detail, className)} {...rest}>
    {children}
  </div>
);
