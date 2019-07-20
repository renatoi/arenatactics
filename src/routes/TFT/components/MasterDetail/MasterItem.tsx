import React from "react";
import cx from "classnames";
import { NavLink } from "react-router-dom";
import styles from "./MasterDetail.module.css";

export interface MasterItemProps {
  readonly to: string;
  readonly isSelected: boolean;
}
export const MasterItem: React.FC<MasterItemProps> = ({
  children,
  to,
  isSelected
}) => (
  <li className={styles.masterItem}>
    <NavLink
      className={cx(styles.navLink, { [styles.navLinkSelected]: isSelected })}
      to={to}
    >
      {children}
    </NavLink>
  </li>
);
