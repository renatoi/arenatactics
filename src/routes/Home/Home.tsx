import React from "react";
import styles from "./Home.module.css";
import { PageContainer } from "../../components/PageContainer/PageContainer";

const Home: React.FC = () => {
  return (
    <PageContainer className={styles.home}>
      <p>Welcome to Kobogi. Home of the best video game guides.</p>
    </PageContainer>
  );
};

export { Home };
