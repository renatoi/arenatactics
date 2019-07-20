import React from "react";
import styles from "./MasterDetail.module.css";

export const MasterHeader: React.FC = ({ children }) => (
  <div className={styles.masterHeader}>{children}</div>
);
