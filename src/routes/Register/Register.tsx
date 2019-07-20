import React from "react";
// import styles from "./Register.module.css";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { Helmet } from "react-helmet";

const Register: React.FC = () => {
  return (
    <PageContainer>
      <Helmet>
        <title>Register: Become a Kobogi Member</title>
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
