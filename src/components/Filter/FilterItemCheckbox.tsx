import React, { ChangeEventHandler } from "react";
import styles from "./Filter.module.scss";

export interface FilterItemProps {
  readonly id: string;
  readonly checked: boolean;
  readonly onChange: ChangeEventHandler;
  readonly value: string;
  readonly children: string;
}
export const FilterItemCheckbox: React.FC<FilterItemProps> = ({
  id,
  onChange,
  value,
  checked,
  children
}) => {
  return (
    <li className={styles.filterListItem}>
      <input
        id={id}
        type="checkbox"
        value={value}
        className={styles.filterListCheckbox}
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor={id} className={styles.filterListLabel}>
        {children}
      </label>
    </li>
  );
};
