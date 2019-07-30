import React from "react";
import { PageContainer } from "../../../components/PageContainer/PageContainer";
import { Helmet } from "react-helmet";
import { RouteComponentProps } from "react-router";
import ReactGA from "react-ga";
import { Grid } from "../components/Grid/Grid";

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
      <h1>Phantom Glacial Rangers</h1>
      <ol>
        <li>
          <a href="#team-composition">Team composition</a>
        </li>
        <li>
          <a href="#team-composition">Items</a>
        </li>
        <li>
          <a href="#team-composition">Positioning</a>
        </li>
        <li>
          <a href="#team-composition">Pros</a>
        </li>
        <li>
          <a href="#team-composition">Cons</a>
        </li>
        <li>
          <a href="#team-composition">Build guide</a>
        </li>
      </ol>
      <h2 id="team-composition">1. Team composition</h2>
      <ul>
        <li>Mordekaiser</li>
        <li>Vayne</li>
        <li>Varus</li>
        <li>Ashe</li>
        <li>Volibear</li>
        <li>Kindred</li>
        <li>Sejuani</li>
        <li>Anivia</li>
      </ul>
      <h2>2. Items</h2>
      <p>Detailed build item map here</p>
      <h2>3. Positioning</h2>
      <Grid />
      <h2>4. Pros</h2>
      <ul>
        <li>Forte controle de campo;</li>
        <li>Sobrevivência extra graças à habilidade de Kindred;</li>
        <li>Neutralização de um campeão graças ao bônus de phantom;</li>
        <li>Baixa necessidade de mudança no posicionamento;</li>
        <li>Forte contra inimigos agrupados;</li>
      </ul>
      <h2>5. Cons</h2>
      <ul>
        <li>
          Build altamente dependente do Kindred (para os bônus de ranger e
          phantom);
        </li>
        <li>
          Build difícil de se obter eficiência completa (necessita nível 8 ou
          Force of Nature);
        </li>
        <li>4th glacial e ranger obtíveis apenas a partir do nível 5;</li>
        <li>
          4th bônus glacial dependente de nível do jogador ou Force of Nature;
        </li>
        <li>Campeões de custo médio para alto (custo mediano: $3);</li>
        <li>
          Eficiência de controle e de dano reduzidos contra campeãos espalhados.
        </li>
      </ul>
      <h2>6. Build guide</h2>
      <p>Detailed guide here</p>
    </PageContainer>
  );
};

export { TFTBuilds };
