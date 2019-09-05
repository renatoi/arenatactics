import React from "react";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";
import { RouteComponentProps } from "react-router";
import { Disclaimer } from "../../components/Disclaimer/Disclaimer";
import { getLocalizedText } from "../../components/LocalizedText/LocalizedText";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import styles from "./Home.module.scss";

export interface HomeProps extends RouteComponentProps {}
const Home: React.FC<HomeProps> = ({ match }) => {
  ReactGA.pageview(match.url);
  return (
    <PageContainer>
      <Helmet>
        <title>{getLocalizedText("home.title")}</title>
        <meta
          name="description"
          content={getLocalizedText("home.description")}
        />
      </Helmet>
      <h1 className={styles.title}>Arena Tactics</h1>
      <h2 className={styles.subtitle}>{getLocalizedText("home.subtitle")}</h2>
      <div className={styles.splash}></div>
      <Disclaimer />
    </PageContainer>
  );
};

export { Home };
