import React from "react";
import { PageContainer } from "../../../components/PageContainer/PageContainer";
import { Helmet } from "react-helmet";
import { RouteComponentProps } from "react-router";
import ReactGA from "react-ga";

export interface TFTBuildsProps extends RouteComponentProps {}
const TFTBuilds: React.FC<TFTBuildsProps> = ({ match }) => {
  ReactGA.pageview(match.url);
  return (
    <PageContainer>
      <Helmet>
        <title>Best Team Compositions / Builds for Teamfight Tactics</title>
        <meta
          name="description"
          content="Detailed step-by-step builds / team compositions guides for Teamfight Tactics (TFT)"
        />
      </Helmet>
      <h1>Builds</h1>
      <p>
        Builds coming soon... This section will include detailed build guides
        for the current patch.
      </p>
    </PageContainer>
  );
};

export { TFTBuilds };
