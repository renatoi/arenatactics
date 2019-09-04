import React from "react";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";
// import styles from "./Login.module.css";
import { PageContainer } from "../../components/PageContainer/PageContainer";

const Login: React.FC = () => {
  ReactGA.pageview("/login");
  return (
    <PageContainer>
      <Helmet>
        <title>Login: Connect to Arena Tactics</title>
        <meta
          name="description"
          content="Login to start sharing guides, ideas, and vote on your favorite builds."
        />
      </Helmet>
      Login coming soon...
    </PageContainer>
  );
};

export { Login };
