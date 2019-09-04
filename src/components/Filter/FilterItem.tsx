import cx from "classnames";
import React, { HTMLAttributes } from "react";
import { Popover, PopoverEvents } from "../../components/Popover/Popover";
import styles from "./Filter.module.scss";

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
