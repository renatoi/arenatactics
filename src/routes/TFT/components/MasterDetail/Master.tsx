import React from "react";
import styles from "./MasterDetail.module.scss";
import cx from "classnames";

export const Master: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <aside className={cx(styles.master, className)} {...rest}>
    {children}
  </aside>
);
