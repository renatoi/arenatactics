import cx from "classnames";
import React from "react";
import { NavLink, RouteComponentProps, withRouter } from "react-router-dom";
import { getLocale } from "../../utils";
import { LocalizedText } from "../LocalizedText/LocalizedText";
import { PathNavLink } from "../PathNavlink/PathNavLink";
import { Popover } from "../Popover/Popover";
import styles from "./Header.module.scss";

const isLangSelected = (lang: "en-us" | "pt-br") => getLocale() === lang;

const replaceWithLang = (lang: string) => {
  const parsedUrl = new URL(window.location.href);
  return parsedUrl.pathname.replace(
    /^\/([a-zA-Z]{2}-[a-zA-Z]{2}\/)?/,
    `/${lang}/`
  );
};

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
            <LocalizedText id="champions.navText" />
          </PathNavLink>
          <PathNavLink
            className={styles.navLink}
            activeClassName={styles.navLinkActive}
            to="/items"
          >
            <LocalizedText id="items.navText" />
          </PathNavLink>
          <PathNavLink
            className={styles.navLink}
            activeClassName={styles.navLinkActive}
            to="/team-compositions"
          >
            <LocalizedText id="comps.navText" />
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
                <NavLink
                  to={replaceWithLang("en-us")}
                  className={cx(styles.langLink, {
                    [styles.langLinkActive]: isLangSelected("en-us")
                  })}
                >
                  English
                </NavLink>
                <NavLink
                  to={replaceWithLang("pt-br")}
                  className={cx(styles.langLink, {
                    [styles.langLinkActive]: isLangSelected("pt-br")
                  })}
                >
                  Português
                </NavLink>
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
