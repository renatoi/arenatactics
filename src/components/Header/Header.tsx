import React from "react";
import cx from "classnames";
import styles from "./Header.module.css";
import { Link, NavLink, Route, match } from "react-router-dom";

export enum Routes {
  TFT = "teamfight-tactics",
  Forums = "forums"
}

const SecondaryNav: React.FC = ({ children }) => (
  <nav className={styles.secondaryNav}>{children}</nav>
);

interface TFTNavProps {
  readonly match: match;
}
const TFTNav: React.FC<TFTNavProps> = ({ match }) => (
  <>
    <SecondaryNav>
      <NavLink
        exact
        activeClassName={styles.secondaryActive}
        to={`${match.url}`}
      >
        Home
      </NavLink>
      <NavLink
        activeClassName={styles.secondaryActive}
        to={`${match.url}/builds`}
      >
        Builds
      </NavLink>
      <NavLink
        activeClassName={styles.secondaryActive}
        to={`${match.url}/champions`}
      >
        Champions
      </NavLink>
      <NavLink
        activeClassName={styles.secondaryActive}
        to={`${match.url}/items`}
      >
        Items
      </NavLink>
    </SecondaryNav>
  </>
);

interface HeaderProps {
  readonly match: match;
}

const Header: React.FC<HeaderProps> = ({ match }) => {
  return (
    <header className={styles.header}>
      <div className={styles.uh}>
        <div className={cx(styles.uhContainer, "PageContainer")}>
          <h1 className={styles.logo}>
            <Link className={styles.logoLink} to="/">
              <span className="VisuallyHidden">Kobogi</span>
            </Link>
          </h1>
          <p className={styles.uhSubtitle}>Games, Guides, Community, eSports</p>
          <nav className={styles.uhNav}>
            <NavLink
              className={styles.uhNavLink}
              activeClassName={styles.uhActiveNavLink}
              to="/teamfight-tactics"
            >
              <i className={cx(styles.gameIcon, styles.tftLogo)} aria-hidden />
              Teamfight Tactics
            </NavLink>
            <NavLink
              className={styles.uhNavLink}
              activeClassName={styles.uhActiveNavLink}
              to="/login"
            >
              Login
            </NavLink>
            <NavLink
              className={styles.uhNavLink}
              activeClassName={styles.uhActiveNavLink}
              to="/register"
            >
              Register
            </NavLink>
          </nav>
        </div>
      </div>
      <div className={cx(styles.gh, "PageContainer")}>
        <Route path={`/${Routes.TFT}`} component={TFTNav} />
      </div>
    </header>
  );
};

export { Header };
