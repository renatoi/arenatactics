import React from "react";
import cx from "classnames";
import styles from "./MasterDetail.module.css";

export const MasterHeading: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <h2 className={cx(styles.masterHeading, className)} {...rest}>
    {children}
  </h2>
);
