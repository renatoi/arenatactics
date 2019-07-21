import React from "react";
import { connect } from "react-redux";
import cx from "classnames";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import styles from "./Champions.module.css";
import traitIcons from "../../../assets/Traits.module.css";
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
import { getItemDescription } from "../components/utils";

export interface TFTChampionsDispatchProps {
  readonly dispatchFilterChampions: (query: string) => void;
}
export interface TFTChampionsStateProps {
  readonly isLoading: boolean;
  readonly championsSearchQuery?: string;
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

  handleClearSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.props.dispatchFilterChampions("");
  };

  render() {
    const {
      match,
      champions,
      visibleChampions,
      items,
      isLoading,
      championsSearchQuery
    } = this.props;

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
        }/tft/tft_${selectedChampionKey}_splash.png) 0 0 no-repeat fixed`
          }
        : undefined;

    const title = selectedChampion
      ? `${
          selectedChampion.name
        } Best Items and Guides for Teamfight Tactics | Kobogi`
      : "Best Champion Items and Guides for Teamfight Tactics";
    const description = selectedChampion
      ? `${
          selectedChampion.name
        }'s best builds/team compositions, items, and guides for Teamfight Tactics (TFT)`
      : "Best builds/team compositions, items, and guides for Teamfight Tactics (TFT)";

    return (
      <MasterDetail>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>
        <Master>
          <MasterHeader>
            <MasterSearchBox
              value={championsSearchQuery}
              onSearchChange={this.handleSearchChange}
              onClearSearch={this.handleClearSearch}
            />
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
              <header className={styles.championHeader}>
                <h1 className={styles.championTitle}>
                  {selectedChampion.name}
                </h1>
                <ul className={styles.championTraits}>
                  {selectedChampion.traits.map(trait => (
                    <li key={trait} className={styles.championTrait}>
                      <i
                        className={
                          traitIcons[`trait_icon_${trait.toLowerCase()}`]
                        }
                      />
                      {trait}
                    </li>
                  ))}
                </ul>
              </header>
              <h2>Best item sets</h2>
              <div className={styles.bestSets}>
                {/* Using index as keys since these don't change, it's fine! */}
                {selectedChampion.bestSets.map((set, setIndex) => (
                  <div className={styles.itemSets} key={setIndex}>
                    <h3 className={styles.itemSetTitle}>{set.name}</h3>
                    <div className={styles.itemSetBody}>
                      <ul className={styles.itemSetItemsList}>
                        {set.items.map((itemId, itemIndex) => {
                          const item = items.byId[itemId];
                          return (
                            <li key={itemIndex} className={styles.itemSetItem}>
                              <h4 className={styles.itemSetItemName}>
                                {<ConnectedTFTItem itemId={itemId} />}
                                {item.name}
                              </h4>
                              <div className={styles.itemSetItemRecipe}>
                                <h5>Recipe:</h5>
                                {item.from.map(fromId => (
                                  <ConnectedTFTItem
                                    itemId={fromId}
                                    width={24}
                                    height={24}
                                  />
                                ))}
                              </div>
                              <p>
                                {getItemDescription(item.desc, item.effects)}
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                      <p>{set.description}</p>
                    </div>
                  </div>
                ))}
              </div>
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
    items: state.TFT.items,
    championsSearchQuery: state.TFT.championsSearchQuery
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
