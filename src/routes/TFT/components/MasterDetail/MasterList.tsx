import React from "react";
import cx from "classnames";
import styles from "./MasterDetail.module.css";

export const MasterList: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  className,
  ...rest
}) => (
  <ul className={cx(styles.masterList, "Scrollable", className)} {...rest}>
    {children}
  </ul>
);
