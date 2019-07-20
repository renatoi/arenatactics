import React from "react";
import cx from "classnames";
import { NavLink } from "react-router-dom";
import styles from "./MasterDetail.module.css";

export const MasterGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cx(styles.masterGroup, className)} {...rest}>
    {children}
  </div>
);