import cx from "classnames";
import React from "react";
import styles from "./MasterDetail.module.scss";

export const MasterDetail: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cx(styles.container, className)} {...rest}>
    {children}
  </div>
);
