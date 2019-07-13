import React from "react";
import cx from "classnames";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={cx(styles.headerContainer, "PageContainer")}>
        <h1 className={styles.logo}>
          <Link className={styles.logoLink} to="/">
            Arena Tactics
          </Link>
        </h1>
        <nav className={styles.nav}>
          <Link to="/forums/">Forums</Link>
          <Link to="/tft/">Teamfight Tactics</Link>
        </nav>
      </div>
    </header>
  );
};

export { Header };
