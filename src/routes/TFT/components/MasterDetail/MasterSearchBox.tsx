import React, { ChangeEventHandler } from "react";
import styles from "./MasterDetail.module.css";

export interface MasterSearchProps {
  readonly onSearchChange: ChangeEventHandler<HTMLInputElement>;
}
export const MasterSearchBox: React.FC<MasterSearchProps> = ({
  onSearchChange
}) => (
  <input
    className={styles.searchBox}
    type="text"
    placeholder="Filter"
    onChange={onSearchChange}
  />
);
