import React from "react";
import { connect } from "react-redux";
import { AppState } from "../../../../types";
import styles from "./Champion.module.css";
import { TFTChampions, TFTItems } from "../../types";
import { Tooltip } from "../../../../components/Tooltip/Tooltip";
import { getNormalizedItemName } from "../utils";

export interface ChampionOwnProps {
  readonly championId: string;
  readonly width?: number;
  readonly height?: number;
}
interface ChampionStateProps {
  readonly isLoading: boolean;
  readonly champions?: TFTChampions;
  readonly items?: TFTItems;
}
interface ChampionProps extends ChampionOwnProps, ChampionStateProps {}

const ChampionSFC: React.FC<ChampionProps> = ({
  champions,
  championId,
  items,
  width = 32,
  height = 32
}) => {
  if (champions == null || championId == null || items == null) return <></>;
  const currentChampion = champions.byId[championId];
  const tooltipContent = () => (
    <div className={styles.championTooltip}>
      <h3 className={styles.championTitle}>
        <img
          src={`${process.env.PUBLIC_URL}/tft/tft_${currentChampion.key}.png`}
          width={16}
          height={16}
          alt={currentChampion.name}
        />
        {currentChampion.name}
      </h3>
      <div className={styles.championDesc}>
        <p>Cost: {currentChampion.cost}</p>
        <ul className={styles.championTraits}>
          {currentChampion.traits.map(trait => (
            <li key={trait}>{trait}</li>
          ))}
        </ul>
      </div>
      <ul className={styles.championBestSets}>
        {Array.isArray(currentChampion.bestSets) &&
          currentChampion.bestSets.map((bestSet, index) => (
            <li key={index} className={styles.championBestSet}>
              {bestSet.items.map((itemId, index) => (
                <img
                  key={index}
                  src={`${
                    process.env.PUBLIC_URL
                  }/tft/tft_item_${getNormalizedItemName(
                    items.byId[itemId].name
                  )}.tft.png`}
                  width="32"
                  height="32"
                  alt={items.byId[itemId].name}
                />
              ))}
            </li>
          ))}
      </ul>
    </div>
  );
  return (
    <Tooltip title={tooltipContent}>
      <img
        src={`${process.env.PUBLIC_URL}/tft/tft_${currentChampion.key}.png`}
        width={width}
        height={height}
        alt=""
      />
    </Tooltip>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: ChampionOwnProps
): ChampionStateProps => {
  if (!state.TFT || !state.TFT.champions || !state.TFT.items) {
    return {
      ...ownProps,
      isLoading: true
    };
  }
  return {
    ...ownProps,
    isLoading: false,
    champions: state.TFT.champions,
    items: state.TFT.items
  };
};

export const Champion = connect<
  ChampionStateProps,
  {},
  ChampionOwnProps,
  AppState
>(mapStateToProps)(ChampionSFC);
