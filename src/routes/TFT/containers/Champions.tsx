import React from "react";
import { connect } from "react-redux";
import cx from "classnames";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styles from "./Champions.module.css";
import { AppState } from "../../../types";
import { tftFilterChampions } from "../redux/actions";
import {
  MasterDetail,
  Detail,
  MasterHeader,
  MasterSearchBox,
  Master,
  MasterList,
  MasterItem
} from "../components/MasterDetail";
import { TFTChampions, TFTItems } from "../types";
import { ConnectedTFTChampion } from "../components/Champion";
import { ConnectedTFTItem } from "../components/Item";

export interface TFTChampionsDispatchProps {
  readonly dispatchFilterChampions: (query: string) => void;
}
export interface TFTChampionsStateProps {
  readonly isLoading: boolean;
  readonly visibleChampions?: string[];
  readonly champions?: TFTChampions;
  readonly items?: TFTItems;
}
interface MatchParams {
  readonly championKey?: string;
}
export interface TFTChampionsOwnProps
  extends RouteComponentProps<MatchParams> {}

export interface TFTChampionsProps
  extends TFTChampionsDispatchProps,
    TFTChampionsStateProps,
    TFTChampionsOwnProps {}

class Champions extends React.Component<TFTChampionsProps> {
  handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.dispatchFilterChampions(e.currentTarget.value);
  };

  render() {
    const { match, champions, visibleChampions, items, isLoading } = this.props;

    const selectedChampionKey = match.params.championKey;
    const selectedChampion =
      selectedChampionKey != null && champions != null
        ? champions.byId[champions.byKey[selectedChampionKey]]
        : undefined;

    if (
      isLoading ||
      champions == null ||
      visibleChampions == null ||
      items == null
    ) {
      return <></>;
    }

    const championArtStyle =
      selectedChampionKey != null
        ? {
            background: `linear-gradient(180deg, rgba(33,41,54,0.9) 0%, rgba(33,41,54,1) 75%, rgba(33,41,54,1) 95%),
        url(${
          process.env.PUBLIC_URL
        }/tft/tft_${selectedChampionKey}_splash.png) no-repeat`
          }
        : undefined;

    return (
      <MasterDetail>
        <Master>
          <MasterHeader>
            <MasterSearchBox onSearchChange={this.handleSearchChange} />
          </MasterHeader>
          <MasterList className={styles.championsList}>
            {visibleChampions.map(championId => {
              const champion = champions.byId[championId];
              return (
                <MasterItem
                  key={champion.key}
                  to={match.path.replace(":championKey", champion.key)}
                  isSelected={selectedChampionKey === champion.key}
                >
                  <ConnectedTFTChampion championId={championId} />
                  {champion.name}
                </MasterItem>
              );
            })}
          </MasterList>
        </Master>
        <Detail
          className={cx(styles.championsDetail, "Scrollable")}
          style={championArtStyle}
        >
          {selectedChampion != null ? (
            <>
              <h1 className={styles.championTitle}>{selectedChampion.name}</h1>
              <h2>Best item sets</h2>
              <div className={styles.bestSets}>
                {/* Using index as keys since these don't change, it's fine! */}
                {selectedChampion.bestSets.map((set, setIndex) => (
                  <div className={styles.itemSet} key={setIndex}>
                    <h3 className={styles.itemSetTitle}>{set.name}</h3>
                    <div className={styles.itemSetBody}>
                      <p>{set.description}</p>
                      <ul className={styles.itemSetList}>
                        {set.items.map((itemId, itemIndex) => (
                          <li key={itemIndex}>
                            {<ConnectedTFTItem itemId={itemId} />}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <h2>Traits</h2>
              <ul>
                {selectedChampion.traits.map(trait => (
                  <li>{trait}</li>
                ))}
              </ul>
            </>
          ) : (
            <h1 className={styles.championTitle}>
              Select a champion to view details.
            </h1>
          )}
        </Detail>
      </MasterDetail>
    );
  }
}

const mapStateToProps = (
  state: AppState,
  ownProps: TFTChampionsOwnProps
): TFTChampionsStateProps => {
  if (!state.TFT || !state.TFT.champions) {
    return {
      ...ownProps,
      isLoading: true
    };
  }
  return {
    ...ownProps,
    isLoading: false,
    visibleChampions: state.TFT.visibleChampions,
    champions: state.TFT.champions,
    items: state.TFT.items
  };
};

const mapDispatchToProps = {
  dispatchFilterChampions: tftFilterChampions
};

export const ConnectedChampions = withRouter(
  connect<
    TFTChampionsStateProps,
    TFTChampionsDispatchProps,
    TFTChampionsOwnProps,
    AppState
  >(
    mapStateToProps,
    mapDispatchToProps
  )(Champions)
);
