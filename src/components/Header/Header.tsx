import React from "react";
import cx from "classnames";
import styles from "./Header.module.css";
import { NavLink, Route, match } from "react-router-dom";

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
          <NavLink
            className={cx(styles.uhNavLink, styles.logoLink)}
            activeClassName={styles.uhNavLinkActive}
            exact
            to="/"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="87"
              height="20"
              viewBox="0 0 23.019 5.292"
              aria-hidden
            >
              <path
                fill="#37abc8"
                d="M20.944.033h1.943V5.21h-1.943zm-8.337.015l.008 5.21h3.87V.049zm1.52 1.124h.851l.017 2.914h-.869zm2.66-1.124v5.21h3.88v-3.17h-2.369V1.18h2.369V.048zm1.54 3.19h1.011v.87h-1.011zM4.31.048l.008 5.21h3.87V.049zm1.52 1.124h.85l.017 2.914H5.83zM.131.058l1.635-.01.009 1.556.538-1.555 1.68.009-.89 2.565.899 2.618-1.689.009-.53-1.599-.008 1.607H.132zm8.353-.01l.008 5.21h3.87V.049zm1.482 1.136h.992v.87h-.992zm.016 2.036h.993v.87h-.993z"
              />
            </svg>
            <span className="VisuallyHidden">Kobogi</span>
          </NavLink>
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
            {/* <NavLink
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
            </NavLink> */}
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
