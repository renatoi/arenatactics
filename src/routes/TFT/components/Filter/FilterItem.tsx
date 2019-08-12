import React, { HTMLAttributes } from "react";
import cx from "classnames";
import styles from "./Filter.module.scss";
import { Popover, PopoverEvents } from "../../../../components/Popover/Popover";

export interface FilterItemProps extends HTMLAttributes<HTMLButtonElement> {
  readonly content?: React.ReactNode;
}
export const FilterItem: React.FC<FilterItemProps> = ({
  content,
  children,
  onClick
}) => {
  const button = (
    <button
      className={cx(styles.filterListButton, {
        [styles.filterListMore]: content != null
      })}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
  return (
    <li className={styles.filterListItem}>
      {content != null ? (
        <Popover
          placement="right-start"
          content={content}
          eventType={PopoverEvents.MouseOver}
        >
          {button}
        </Popover>
      ) : (
        button
      )}
    </li>
  );
};
