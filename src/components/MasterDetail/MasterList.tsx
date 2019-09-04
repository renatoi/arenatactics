import cx from "classnames";
import React from "react";
import styles from "./MasterDetail.module.scss";

export const MasterList: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  className,
  ...rest
}) => (
  <ul className={cx(styles.masterList, "Scrollable", className)} {...rest}>
    {children}
  </ul>
);
