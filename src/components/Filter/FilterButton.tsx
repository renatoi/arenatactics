import React from "react";
import { Popover } from "../../components/Popover/Popover";
import { getLocalizedText } from "../LocalizedText/LocalizedText";
import styles from "./Filter.module.scss";

interface FilterButtonProps {
  readonly children: React.ReactNode;
}
export const FilterButton: React.FC<FilterButtonProps> = ({ children }) => {
  return (
    <Popover placement="right-start" content={children}>
      <button type="button" className={styles.filterBoxButton}>
        {getLocalizedText("filter.filterButton")}
      </button>
    </Popover>
  );
};
