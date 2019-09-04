import cx from "classnames";
import React from "react";
import { PathNavLink } from "../PathNavlink/PathNavLink";
import styles from "./MasterDetail.module.scss";

export interface MasterItemProps extends React.HTMLProps<HTMLLIElement> {
  readonly to: string;
  readonly isSelected: boolean;
  readonly linkClassName?: string;
}
export const MasterItem: React.FC<MasterItemProps> = ({
  children,
  to,
  isSelected,
  className,
  linkClassName,
  ...rest
}) => (
  <li className={cx(styles.masterItem, className)} {...rest}>
    <PathNavLink
      className={cx(
        styles.navLink,
        { [styles.navLinkSelected]: isSelected },
        linkClassName
      )}
      to={to}
    >
      {children}
    </PathNavLink>
  </li>
);
