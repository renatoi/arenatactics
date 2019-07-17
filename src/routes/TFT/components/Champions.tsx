import React from "react";
import { connect } from "react-redux";
import uuidv4 from "uuid/v4";
import cx from "classnames";
import { NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import styles from "./Champions.module.css";
import { TFTChampionDictionary, TFTChampion } from "../types";
import { AppState } from "../../../types";

interface MatchParams {
  readonly championId?: string;
}
export interface TFTChampionsProps extends RouteComponentProps<MatchParams> {
  readonly champions: TFTChampionDictionary;
  readonly isLoading: boolean;
}

const getPath = (path: string, championId: string): string =>
  path
    .replace(":championId", championId.replace(/'/g, ""))
    .replace(/\s/g, "-")
    .toLocaleLowerCase();

const getChampionListItem = (
  path: string,
  championId: string,
  champion: TFTChampion
) => (
  <li key={uuidv4()} className={styles.championsListItem}>
    <NavLink className={styles.championLink} to={getPath(path, champion.name)}>
      <img
        width="32"
        height="32"
        className={styles.championIcon}
        src={`${process.env.PUBLIC_URL}/tft/tft_${championId}.png`}
        alt=""
      />
      {champion.name}
    </NavLink>
  </li>
);

const Champions: React.FC<TFTChampionsProps> = ({ match, champions }) => {
  const championsList =
    champions != null ? (
      <ul className={styles.championsList}>
        {Object.keys(champions)
          .sort()
          .map((id: string) =>
            getChampionListItem(match.path, id, champions[id])
          )}
      </ul>
    ) : null;

  let selectedChampion;
  if (
    match.params.championId != null &&
    champions != null &&
    champions[match.params.championId] != null
  ) {
    selectedChampion = champions[match.params.championId];
  }

  let championDetail;
  if (selectedChampion == null) {
    championDetail = (
      <>
        <h3>Select a champion to view details.</h3>
      </>
    );
  } else {
    championDetail = (
      <>
        <h3>{selectedChampion.name}</h3>
        <ul>
          <li />
        </ul>
      </>
    );
  }

  return (
    <div className={cx(styles.container, "PageContainer")}>
      <div className={styles.championsAside}>
        <input
          className={styles.championsSearchBox}
          type="text"
          placeholder="Filter"
        />
        <div className={styles.championsListContainer}>{championsList}</div>
      </div>
      <div className={styles.championDetail}>{championDetail}</div>
    </div>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: TFTChampionsProps
): TFTChampionsProps => {
  if (!state.TFT || !state.TFT.champions) {
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

export const ConnectedChampions = withRouter(
  connect(mapStateToProps)(Champions)
);
