import React, { HTMLAttributes } from "react";
import cx from "classnames";
import styles from "./Filter.module.scss";

export interface FilterPopoverProps extends HTMLAttributes<HTMLUListElement> {
  readonly shouldSplitColumns?: boolean;
}
export const FilterPopover: React.FC<FilterPopoverProps> = ({
  children,
  shouldSplitColumns
}) => {
  return (
    <ul
      className={cx(styles.filterList, {
        [styles.filterListSplit]: shouldSplitColumns
      })}
    >
      {children}
    </ul>
  );
};
