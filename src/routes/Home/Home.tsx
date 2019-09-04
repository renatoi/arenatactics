import React from "react";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";
import { RouteComponentProps } from "react-router";
import { Disclaimer } from "../../components/Disclaimer/Disclaimer";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { PathNavLink } from "../../components/PathNavlink/PathNavLink";

export interface HomeProps extends RouteComponentProps {}
const Home: React.FC<HomeProps> = ({ match }) => {
  ReactGA.pageview(match.url);
  return (
    <PageContainer>
      <Helmet>
        <title>
          Arena Tactics: Teamfight Tactics Best Builds, Guides, Champions, and
          Items
        </title>
        <meta
          name="description"
          content="Detailed step-by-step builds / team compositions guides, champions, and items for Teamfight Tactics (TFT)"
        />
      </Helmet>
      <h1>Arena Tactics</h1>
      <p>
        We're currently working hard to create the best guides and tools for
        Teamfight Tactics. You will get the latest updates live even if it's a
        little rough.
      </p>
      <p>
        Our <PathNavLink to="/champions">Champions</PathNavLink> and{" "}
        <PathNavLink to="/items">Items</PathNavLink> sections are now ready. If
        you have any feedback, please send them to{" "}
        <a href="mailto:feedback@arenatactics.com">feedback@arenatactics.com</a>
        .
      </p>
      <Disclaimer />
    </PageContainer>
  );
};

export { Home };
