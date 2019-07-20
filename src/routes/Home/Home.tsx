import React from "react";
import styles from "./Home.module.css";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { Helmet } from "react-helmet";

const Home: React.FC = () => {
  return (
    <PageContainer className={styles.home}>
      <Helmet>
        <title>Kobogi</title>
        <meta
          name="description"
          content="A new video gaming community committed to build and share the best games, gaming guides, and tools."
        />
      </Helmet>
      <p>
        Welcome to Kobogi. We're a new video gaming community commited to build
        and share the best games, gaming guides, and tools of the internet.
      </p>
    </PageContainer>
  );
};

export { Home };
