import React from "react";
import cx from "classnames";
import styles from "./Header.module.css";
import { Link, NavLink, Route, match } from "react-router-dom";

export enum Routes {
  TFT = "teamfight-tactics",
  Forums = "forums"
}

const ContextualNav: React.FC = ({ children }) => (
  <nav className={styles.chNav}>{children}</nav>
);

interface TFTNavProps {
  readonly match: match;
}
const TFTNav: React.FC<TFTNavProps> = ({ match }) => (
  <>
    <ContextualNav>
      <NavLink
        exact
        className={styles.chNavLink}
        activeClassName={styles.chNavLinkActive}
        to={`${match.url}`}
      >
        Home
      </NavLink>
      <NavLink
        className={styles.chNavLink}
        activeClassName={styles.chNavLinkActive}
        to={`${match.url}/builds`}
      >
        Builds
      </NavLink>
      <NavLink
        className={styles.chNavLink}
        activeClassName={styles.chNavLinkActive}
        to={`${match.url}/champions`}
      >
        Champions
      </NavLink>
      <NavLink
        className={styles.chNavLink}
        activeClassName={styles.chNavLinkActive}
        to={`${match.url}/items`}
      >
        Items
      </NavLink>
    </ContextualNav>
  </>
);

interface HeaderProps {
  readonly match: match;
}

const Header: React.FC<HeaderProps> = ({ match }) => {
  return (
    <header className={styles.header}>
      <div className={styles.uh}>
        <nav className={styles.uhNav}>
          <h1 className={styles.logo}>
            <NavLink
              className={cx(styles.uhNavLink, styles.logoLink)}
              activeClassName={styles.uhNavLinkActive}
              exact
              to="/"
            >
              <span className="VisuallyHidden">Kobogi</span>
            </NavLink>
          </h1>
          <span className={styles.uhNavPrimary}>
            <NavLink
              className={styles.uhNavLink}
              activeClassName={styles.uhNavLinkActive}
              to="/teamfight-tactics"
            >
              <i className={cx(styles.gameIcon, styles.tftLogo)} aria-hidden />
              Teamfight Tactics
            </NavLink>
          </span>
          <span className={styles.uhNavSecondary}>
            <NavLink
              className={styles.uhNavLink}
              activeClassName={styles.uhNavLinkActive}
              to="/login"
            >
              Login
            </NavLink>
            <NavLink
              className={styles.uhNavLink}
              activeClassName={styles.uhNavLinkActive}
              to="/register"
            >
              Register
            </NavLink>
          </span>
        </nav>
      </div>
      <div className={cx(styles.ch)}>
        <Route path={`/${Routes.TFT}`} component={TFTNav} />
      </div>
    </header>
  );
};

export { Header };
