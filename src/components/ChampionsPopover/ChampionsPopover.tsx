import React from "react";
import { connect } from "react-redux";
import { AppState, TFTChampions } from "../../types";
import { ChampionImage } from "../ChampionImage/ChampionImage";
import styles from "./ChampionsPopover.module.scss";

interface ChampionsPopoverOwnProps {
  readonly onClick: (championKey: string) => void;
}
interface ChampionsPopoverStateProps {
  readonly champions?: TFTChampions;
  readonly isLoading: boolean;
}
interface ChampionsPopoverProps
  extends ChampionsPopoverOwnProps,
    ChampionsPopoverStateProps {}

const ChampionsPopoverSFC: React.FC<ChampionsPopoverProps> = ({
  onClick,
  champions,
  isLoading
}) => {
  if (isLoading || champions == null) {
    return <></>;
  }
  return (
    <div className={styles.container}>
      {Object.keys(champions.byKey)
        .sort()
        .map(championKey => {
          const championId = champions.byKey[championKey];
          return (
            <button
              key={championId}
              type="button"
              className={styles.button}
              onClick={() => onClick(championKey)}
            >
              <ChampionImage
                championKey={championKey}
                className={styles.championImage}
                width={32}
                height={32}
              />
              <span className={styles.championName}>
                {champions.byId[champions.byKey[championKey]].name}
              </span>
            </button>
          );
        })}
    </div>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: ChampionsPopoverOwnProps
): ChampionsPopoverStateProps => {
  if (!state.TFT || Object.keys(state.TFT.champions.byId).length === 0) {
    return {
      ...ownProps,
      isLoading: true
    };
  }
  return {
    ...ownProps,
    isLoading: false,
    champions: state.TFT.champions
  };
};

export const ChampionsPopover = connect<
  ChampionsPopoverStateProps,
  {},
  ChampionsPopoverOwnProps,
  AppState
>(mapStateToProps)(ChampionsPopoverSFC);
