import cx from "classnames";
import React from "react";
import styles from "./MasterDetail.module.scss";

export const MasterGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cx(styles.masterGroup, className)} {...rest}>
    {children}
  </div>
);
