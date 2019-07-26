import React from "react";
import styles from "./Home.module.css";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga";
import { NavLink } from "react-router-dom";

const Home: React.FC = () => {
  ReactGA.pageview("/home");
  return (
    <PageContainer className={styles.home}>
      <Helmet>
        <title>Kobogi</title>
        <meta
          name="description"
          content="A new video gaming community committed to build and share the best games, gaming guides, and tools."
        />
      </Helmet>
      <h1>Welcome to Kobogi!</h1>
      <p>
        We're a new video gaming community commited to build and share games,
        tools, and gaming guides to help you play your favorite games.
      </p>
      <p>
        Head over to the{" "}
        <NavLink to="/teamfight-tactics">Teamfight Tactics</NavLink> portal to
        start enjoying the tools we've been creating.
      </p>
      <p>
        If you have any feedback or ideas, please send them to{" "}
        <a href="mailto:feedback@kobogi.com">feedback@kobogi.com</a>.
      </p>
    </PageContainer>
  );
};

export { Home };
