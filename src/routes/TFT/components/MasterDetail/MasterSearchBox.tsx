import React, { ChangeEventHandler } from "react";
import styles from "./MasterDetail.module.css";

export interface MasterSearchProps {
  readonly onSearchChange: ChangeEventHandler<HTMLInputElement>;
  readonly value?: string;
}
export const MasterSearchBox: React.FC<MasterSearchProps> = ({
  onSearchChange,
  value
}) => (
  <input
    className={styles.searchBox}
    type="text"
    placeholder="Filter"
    value={value}
    onChange={onSearchChange}
  />
);
