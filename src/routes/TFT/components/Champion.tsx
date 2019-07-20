import React from "react";
import { connect } from "react-redux";
import { AppState } from "../../../types";
import styles from "./Champion.module.css";
import { TFTChampions, TFTItems } from "../types";
import { Tooltip } from "../../../components/Tooltip/Tooltip";
import { getNormalizedItemName } from "./utils";

export interface TFTChampionOwnProps {
  readonly championId: string;
  readonly width?: number;
  readonly height?: number;
}
interface TFTChampionStateProps {
  readonly isLoading: boolean;
  readonly champions?: TFTChampions;
  readonly items?: TFTItems;
}
interface TFTChampionProps extends TFTChampionOwnProps, TFTChampionStateProps {}

const TFTChampion: React.FC<TFTChampionProps> = ({
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
            <li>{trait}</li>
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
        alt={currentChampion.name}
      />
    </Tooltip>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: TFTChampionOwnProps
): TFTChampionStateProps => {
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

export const ConnectedTFTChampion = connect<
  TFTChampionStateProps,
  {},
  TFTChampionOwnProps,
  AppState
>(mapStateToProps)(TFTChampion);
