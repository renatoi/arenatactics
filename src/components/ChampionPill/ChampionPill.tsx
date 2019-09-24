import cx from "classnames";
import React from "react";
import { connect } from "react-redux";
import { AppState, TFTChampions } from "../../types";
import { Champion } from "../Champion/Champion";
import styles from "./ChampionPill.module.scss";

export interface ChampionPillOwnProps {
  readonly championKey?: string;
  readonly className?: string;
}
interface ChampionPillStateProps {
  readonly isLoading: boolean;
  readonly champions?: TFTChampions;
}
interface ChampionPillProps
  extends ChampionPillOwnProps,
    ChampionPillStateProps {}

const ChampionPillComponent: React.FC<ChampionPillProps> = ({
  isLoading,
  champions,
  championKey,
  className
}) => {
  if (
    isLoading ||
    champions == null ||
    championKey == null ||
    champions.byKey[championKey] == null
  ) {
    return <></>;
  }
  return (
    <span className={cx(styles.pill, className)}>
      <Champion
        championKey={championKey}
        className={styles.champion}
        width={24}
        height={24}
      />
      {champions.byId[champions.byKey[championKey]].name}
    </span>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: ChampionPillOwnProps
): ChampionPillStateProps => {
  if (!state.TFT || Object.keys(state.TFT.champions).length === 0) {
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

export const ChampionPill = connect<
  ChampionPillStateProps,
  {},
  ChampionPillOwnProps,
  AppState
>(mapStateToProps)(ChampionPillComponent);
