import React from "react";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";
// import styles from "./Register.module.css";
import { PageContainer } from "../../components/PageContainer/PageContainer";

const Register: React.FC = () => {
  ReactGA.pageview("/register");
  return (
    <PageContainer>
      <Helmet>
        <title>Register: Become an Arena Tactics Member</title>
        <meta
          name="description"
          content="Become a contributor, share guides, ideas, and vote on your favorite builds."
        />
      </Helmet>
      Register coming soon...
    </PageContainer>
  );
};

export { Register };
