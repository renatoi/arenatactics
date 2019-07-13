import React from "react";
import styles from "./TftHome.module.css";
import { Link } from "react-router-dom";

const TftHome: React.FC = () => {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link to="/forums/">Forums</Link>
        <Link to="/tft/">Teamfight Tactics</Link>
      </nav>
    </div>
  );
};

export { TftHome };
