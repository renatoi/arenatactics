import React from "react";
import { Popover } from "../../../../components/Popover/Popover";
import styles from "./Filter.module.scss";

interface FilterButtonProps {
  readonly children: React.ReactNode;
}
export const FilterButton: React.FC<FilterButtonProps> = ({ children }) => {
  return (
    <Popover placement="right-start" content={children}>
      <button type="button" className={styles.filterBoxButton}>
        Filter
      </button>
    </Popover>
  );
};
