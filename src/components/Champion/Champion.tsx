import React from "react";
import { connect } from "react-redux";
import { Tooltip } from "../../components/Tooltip/Tooltip";
import { AppState, TFTChampion, TFTChampions, TFTItems } from "../../types";
import styles from "./Champion.module.css";
import { ItemImage } from "../ItemImage/ItemImage";

export interface ChampionOwnProps {
  readonly championId?: string;
  readonly championKey?: string;
  readonly width?: number;
  readonly height?: number;
  readonly showItems?: boolean;
}
interface ChampionStateProps {
  readonly isLoading: boolean;
  readonly champions?: TFTChampions;
  readonly items?: TFTItems;
}
interface ChampionProps extends ChampionOwnProps, ChampionStateProps { }

const ChampionSFC: React.FC<ChampionProps> = ({
  champions,
  championId,
  championKey,
  items,
  width = 32,
  height = 32,
  showItems = true
}) => {
  if (
    champions == null ||
    items == null ||
    (championKey == null && championId == null)
  ) {
    return <></>;
  }

  let currentChampion: TFTChampion | undefined;
  if (championId != null) {
    currentChampion = champions.byId[championId];
  } else if (championKey != null) {
    currentChampion = champions.byId[champions.byKey[championKey]];
  }

  const tooltipContent = () =>
    currentChampion == null ? (
      <></>
    ) : (
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
          {showItems ? (
            <ul className={styles.championBestSets}>
              {Array.isArray(currentChampion.bestSets) &&
                currentChampion.bestSets.map((bestSet, index) => (
                  <li key={index} className={styles.championBestSet}>
                    {bestSet.items.map((itemId, index) => (
                      <ItemImage
                        key={index}
                        itemKey={items.byId[itemId].key}
                        width="32"
                        height="32"
                        alt={items.byId[itemId].name}
                      />
                    ))}
                  </li>
                ))}
            </ul>
          ) : (
              undefined
            )}
        </div>
      );
  return currentChampion == null ? (
    <></>
  ) : (
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
