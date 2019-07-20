import React from "react";
import styles from "./MasterDetail.module.css";
import cx from "classnames";

export const Master: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cx(styles.master, className)} {...rest}>
    {children}
  </div>
);
