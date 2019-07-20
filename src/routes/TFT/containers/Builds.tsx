import React from "react";
import { PageContainer } from "../../../components/PageContainer/PageContainer";
import { Helmet } from "react-helmet";

const Builds: React.FC = () => (
  <PageContainer>
    <Helmet>
      <title>Best Team Compositions / Builds for Teamfight Tactics</title>
      <meta
        name="description"
        content="Detailed step-by-step builds / team compositions guides for Teamfight Tactics (TFT)"
      />
    </Helmet>
    <p>
      Builds coming soon... This section will include detailed build guides for
      the current patch.
    </p>
  </PageContainer>
);

export { Builds };
