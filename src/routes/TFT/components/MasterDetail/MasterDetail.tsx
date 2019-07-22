import React from "react";
import styles from "./MasterDetail.module.scss";
import cx from "classnames";

export const MasterDetail: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cx(styles.container, className)} {...rest}>
    {children}
  </div>
);
