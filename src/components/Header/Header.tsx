import cx from "classnames";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { getLocale } from "../../utils";
import { PathNavLink } from "../PathNavlink/PathNavLink";
import { Popover } from "../Popover/Popover";
import styles from "./Header.module.scss";

const isLangSelected = (lang: "en-us" | "pt-br") => getLocale() === lang;

interface HeaderProps extends RouteComponentProps {}
const HeaderComponent: React.FC<HeaderProps> = ({ match }) => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navPrimary}>
          <PathNavLink
            className={styles.navLink}
            activeClassName={styles.navLinkActive}
            exact
            to="/"
          >
            <i className={cx(styles.gameIcon, styles.tftLogo)} aria-hidden />
            Arena Tactics
          </PathNavLink>
          <PathNavLink
            className={styles.navLink}
            activeClassName={styles.navLinkActive}
            to="/champions"
          >
            Champions
          </PathNavLink>
          <PathNavLink
            className={styles.navLink}
            activeClassName={styles.navLinkActive}
            to="/items"
          >
            Items
          </PathNavLink>
          <PathNavLink
            className={styles.navLink}
            activeClassName={styles.navLinkActive}
            to="/builds"
          >
            Builds
          </PathNavLink>
          <PathNavLink
            className={cx(styles.navLink, styles.hidden)}
            activeClassName={styles.navLinkActive}
            to="/create-build"
          >
            Create Build
          </PathNavLink>
        </div>
        <div className={styles.navSecondary}>
          <Popover
            placement="bottom-start"
            content={
              <div className={styles.langContainer}>
                <a
                  href={`${match.url}?hl=en-us`}
                  className={cx(styles.langLink, {
                    [styles.langLinkActive]: isLangSelected("en-us")
                  })}
                >
                  English
                </a>
                <a
                  href={`${match.url}?hl=pt-br`}
                  className={cx(styles.langLink, {
                    [styles.langLinkActive]: isLangSelected("pt-br")
                  })}
                >
                  Português
                </a>
              </div>
            }
          >
            <button type="button" className={styles.lang}>
              {getLocale() === "pt-br" ? "Português" : "English"}
            </button>
          </Popover>
          {/* <PathNavLink
            className={styles.uhNavLink}
            activeClassName={styles.uhNavLinkActive}
            to="/login"
          >
            Login
          </PathNavLink>
          <PathNavLink
            className={styles.uhNavLink}
            activeClassName={styles.uhNavLinkActive}
            to="/register"
          >
            Register
          </PathNavLink> */}
        </div>
      </nav>
    </header>
  );
};

const Header = withRouter(HeaderComponent);

export { Header };
