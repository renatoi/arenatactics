import cx from "classnames";
import React from "react";
import styles from "./MasterDetail.module.scss";

export const MasterHeading: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <h2 className={cx(styles.masterHeading, className)} {...rest}>
    {children}
  </h2>
);
