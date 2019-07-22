import React from "react";
import cx from "classnames";
import { NavLink } from "react-router-dom";
import styles from "./MasterDetail.module.scss";

export interface MasterItemProps extends React.HTMLProps<HTMLLIElement> {
  readonly to: string;
  readonly isSelected: boolean;
}
export const MasterItem: React.FC<MasterItemProps> = ({
  children,
  to,
  isSelected,
  className,
  ...rest
}) => (
  <li className={cx(styles.masterItem, className)} {...rest}>
    <NavLink
      className={cx(styles.navLink, { [styles.navLinkSelected]: isSelected })}
      to={to}
    >
      {children}
    </NavLink>
  </li>
);
