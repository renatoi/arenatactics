import React from "react";
import { connect } from "react-redux";
import uuidv4 from "uuid/v4";
import cx from "classnames";
import { NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import styles from "./Champions.module.css";
import {
  TFTChampionDictionary,
  TFTChampion,
  TFTItemDictionary
} from "../types";
import { AppState } from "../../../types";

interface MatchParams {
  readonly championId?: string;
}
export interface TFTChampionsProps extends RouteComponentProps<MatchParams> {
  readonly champions: TFTChampionDictionary;
  readonly items: TFTItemDictionary;
  readonly isLoading: boolean;
}

const getPath = (path: string, championId: string): string =>
  path
    .replace(":championId", championId.replace(/'/g, ""))
    .replace(/\s/g, "-")
    .toLocaleLowerCase();

const getChampionImage = (
  championId: string = "",
  width: number,
  height: number
) => (
  <img
    width={width}
    height={height}
    className={styles.championIcon}
    src={`${process.env.PUBLIC_URL}/tft/tft_${championId}.png`}
    alt=""
  />
);

const getChampionListItem = (
  path: string,
  isSelected: boolean,
  championId: string,
  champion: TFTChampion
) => (
  <li key={uuidv4()} className={styles.championsListItem}>
    <NavLink
      className={cx(styles.championLink, {
        [styles.championsLinkSelected]: isSelected
      })}
      to={getPath(path, champion.name)}
    >
      {getChampionImage(championId, 32, 32)}
      {champion.name}
    </NavLink>
  </li>
);

const Champions: React.FC<TFTChampionsProps> = ({
  match,
  champions,
  items
}) => {
  const championsList =
    champions != null ? (
      <ul className={styles.championsList}>
        {Object.keys(champions)
          .sort()
          .map((id: string) =>
            getChampionListItem(
              match.path,
              match.params.championId === id,
              id,
              champions[id]
            )
          )}
      </ul>
    ) : null;

  let selectedChampionId;
  let selectedChampion;
  if (
    match.params.championId != null &&
    champions != null &&
    champions[match.params.championId] != null
  ) {
    selectedChampionId = match.params.championId;
    selectedChampion = champions[selectedChampionId];
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
        <h2>
          {getChampionImage(selectedChampionId, 48, 48)}
          {selectedChampion.name}
        </h2>
        <h3>Best item sets</h3>
        {selectedChampion.bestSets.map(set => (
          <>
            <h4>{set.name}</h4>
            <p>{set.description}</p>
            <ul>
              {set.items.map(itemId => (
                <li>{items[itemId].name}</li>
              ))}
            </ul>
          </>
        ))}
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
        <div className={cx(styles.championsListContainer, "scrollable")}>
          {championsList}
        </div>
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
    champions: state.TFT.champions,
    items: state.TFT.items
  };
};

export const ConnectedChampions = withRouter(
  connect(mapStateToProps)(Champions)
);
