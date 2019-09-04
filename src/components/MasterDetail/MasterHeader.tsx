import cx from "classnames";
import React from "react";
import styles from "./MasterDetail.module.scss";

export const MasterHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cx(styles.masterHeader, className)} {...rest}>
    {children}
  </div>
);
