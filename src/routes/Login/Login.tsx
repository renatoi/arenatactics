import React from "react";
// import styles from "./Login.module.css";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { Helmet } from "react-helmet";

const Login: React.FC = () => {
  return (
    <PageContainer>
      <Helmet>
        <title>Login: Connect to Kobogi</title>
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
