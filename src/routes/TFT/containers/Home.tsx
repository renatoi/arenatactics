import React from "react";
import { PageContainer } from "../../../components/PageContainer/PageContainer";
import { Helmet } from "react-helmet";

const Home: React.FC = () => (
  <PageContainer>
    <Helmet>
      <title>Teamfight Tactics Best Builds, Guides, Champions, and Items</title>
      <meta
        name="description"
        content="Detailed step-by-step builds / team compositions guides, champions, and items for Teamfight Tactics (TFT)"
      />
    </Helmet>
    <p>
      We're working hard to create the best guides and tools for Teamfight
      Fortress. You will get the latest updates live even if it's a little
      rough.
    </p>
  </PageContainer>
);

export { Home };
