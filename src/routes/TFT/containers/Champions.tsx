import React, { useEffect, ChangeEvent } from "react";
import { connect } from "react-redux";
import cx from "classnames";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga";
import uuidv4 from "uuid/v4";
import styles from "./Champions.module.scss";
import traitStyles from "../../../assets/Traits.module.scss";
import { AppState } from "../../../types";
import {
  searchChampions,
  addTraitToChampionsFilter,
  resetTraitsInChampionsFilter,
  removeTraitFromChampionsFilter,
  resetChampionsFilter,
  addCostToChampionsFilter,
  removeCostFromChampionsFilter,
  resetCostsInChampionsFilter
} from "../redux/actions";
import {
  MasterDetail,
  Detail,
  MasterHeader,
  MasterSearchBox,
  Master,
  MasterList,
  MasterItem
} from "../components/MasterDetail";
import { TFTChampions, TFTItems, TFTTraits } from "../types";
import { ConnectedTFTChampion } from "../components/Champion";
import { ConnectedTFTItem } from "../components/Item";
import { getItemDescription } from "../components/utils";
import { Popover, PopoverEvents } from "../../../components/Popover/Popover";

export interface TFTChampionsDispatchProps {
  readonly dispatchResetFilter: () => void;
  readonly dispatchSearchChampions: (query: string) => void;
  readonly dispatchAddTraitToFilter: (trait: string) => void;
  readonly dispatchRemoveTraitFromFilter: (trait: string) => void;
  readonly dispatchResetTraits: () => void;
  readonly dispatchAddCostToFilter: (cost: number) => void;
  readonly dispatchRemoveCostFromFilter: (cost: number) => void;
  readonly dispatchResetCosts: () => void;
}
export interface TFTChampionsStateProps {
  readonly isLoading: boolean;
  readonly championsSearchQuery?: string;
  readonly championsFilterTraits?: string[];
  readonly championsFilterCosts?: number[];
  readonly visibleChampions?: string[];
  readonly champions?: TFTChampions;
  readonly items?: TFTItems;
  readonly traits?: TFTTraits;
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

const Champions: React.FC<TFTChampionsProps> = ({
  dispatchResetFilter,
  dispatchSearchChampions,
  dispatchAddTraitToFilter,
  dispatchRemoveTraitFromFilter,
  dispatchResetTraits,
  dispatchAddCostToFilter,
  dispatchRemoveCostFromFilter,
  dispatchResetCosts,
  match,
  champions,
  visibleChampions,
  items,
  traits,
  isLoading,
  championsSearchQuery,
  championsFilterTraits,
  championsFilterCosts
}) => {
  const selectedChampionKey = match.params.championKey;
  const selectedChampion =
    selectedChampionKey != null && champions != null
      ? champions.byId[champions.byKey[selectedChampionKey]]
      : undefined;

  useEffect(() => {
    ReactGA.pageview(match.url);
  }, [match.url]);

  if (
    isLoading ||
    champions == null ||
    visibleChampions == null ||
    items == null ||
    traits == null
  ) {
    return <></>;
  }

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchSearchChampions(e.currentTarget.value);
  };

  const handleClearSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatchSearchChampions("");
  };

  const championArtStyle =
    selectedChampionKey != null
      ? {
          background: `linear-gradient(180deg, rgba(33,41,54,0.9) 0%, rgba(33,41,54,1) 75%, rgba(33,41,54,1) 95%),
      url(${
        process.env.PUBLIC_URL
      }/tft/tft_${selectedChampionKey}_splash.png) 0 0 no-repeat fixed`,
          backgroundSize: "cover"
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

  const handleTraitCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      dispatchAddTraitToFilter(event.currentTarget.value);
    } else {
      dispatchRemoveTraitFromFilter(event.currentTarget.value);
    }
  };

  const handleCostCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      dispatchAddCostToFilter(parseInt(event.currentTarget.value));
    } else {
      dispatchRemoveCostFromFilter(parseInt(event.currentTarget.value));
    }
  };

  const traitListFilter = () => {
    return (
      <ul className={cx(styles.filterList, styles.filterListTraits)}>
        <li>
          <button
            className={styles.filterListButton}
            type="button"
            onClick={dispatchResetTraits}
          >
            Reset
          </button>
        </li>
        {Object.keys(traits.byId)
          .sort()
          .map(trait => (
            <li className={styles.filterListItem} key={trait}>
              <input
                id={`trait_${trait}`}
                type="checkbox"
                value={trait}
                className={styles.filterListCheckbox}
                onChange={handleTraitCheckboxChange}
                checked={
                  Array.isArray(championsFilterTraits) &&
                  championsFilterTraits.includes(trait)
                }
              />
              <label
                htmlFor={`trait_${trait}`}
                className={styles.filterListLabel}
              >
                {trait}
              </label>
            </li>
          ))}
      </ul>
    );
  };

  const costListFilter = () => {
    return (
      <ul className={cx(styles.filterList, styles.filterListTraits)}>
        <li>
          <button
            className={styles.filterListButton}
            type="button"
            onClick={dispatchResetCosts}
          >
            Reset
          </button>
        </li>
        {[1, 2, 3, 4, 5].sort().map(cost => (
          <li className={styles.filterListItem} key={cost}>
            <input
              id={`cost_${cost}`}
              type="checkbox"
              value={cost}
              className={styles.filterListCheckbox}
              onChange={handleCostCheckboxChange}
              checked={
                Array.isArray(championsFilterCosts) &&
                championsFilterCosts.includes(cost)
              }
            />
            <label htmlFor={`cost_${cost}`} className={styles.filterListLabel}>
              {cost}
            </label>
          </li>
        ))}
      </ul>
    );
  };

  const filterPopover = () => {
    return (
      <ul className={styles.filterList}>
        <li>
          <button
            className={styles.filterListButton}
            type="button"
            onClick={dispatchResetFilter}
          >
            Reset All
          </button>
        </li>
        <li>
          <Popover
            placement="right-start"
            content={traitListFilter()}
            eventType={PopoverEvents.MouseOver}
          >
            <button
              className={cx(styles.filterListButton, styles.filterListMore)}
              type="button"
            >
              Traits
            </button>
          </Popover>
        </li>
        <li>
          <Popover
            placement="right-start"
            content={costListFilter()}
            eventType={PopoverEvents.MouseOver}
          >
            <button
              className={cx(styles.filterListButton, styles.filterListMore)}
              type="button"
            >
              Costs
            </button>
          </Popover>
        </li>
      </ul>
    );
  };

  return (
    <MasterDetail>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <Master>
        <MasterHeader className={styles.masterHeader}>
          <MasterSearchBox
            value={championsSearchQuery}
            label="Search champions"
            placeholder="Search by name, trait, or cost"
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />
          <Popover placement="right-start" content={filterPopover}>
            <button type="button" className={styles.filterBoxButton}>
              Filter
            </button>
          </Popover>
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
              <h1 className={styles.championTitle}>{selectedChampion.name}</h1>
              <ul className={styles.championTraits}>
                {selectedChampion.traits.map(trait => (
                  <li
                    key={trait}
                    className={cx(
                      styles.championTrait,
                      traitStyles.trait_pill,
                      traitStyles[`trait_pill_${trait.toLowerCase()}`]
                    )}
                  >
                    <i
                      className={cx(
                        styles.traitIcon,
                        traitStyles[`trait_icon_${trait.toLowerCase()}`]
                      )}
                    />
                    {trait}
                  </li>
                ))}
              </ul>
            </header>
            <h2>Best item sets</h2>
            {/* Using index as keys since these don't change, it's fine! */}
            {selectedChampion.bestSets.map((set, setIndex) => (
              <div className={styles.itemSet} key={setIndex}>
                <h3 className={styles.itemSetTitle}>{set.name}</h3>
                <div className={styles.itemSetBody}>
                  <p className={styles.itemSetDescription}>{set.description}</p>
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
                                key={uuidv4()}
                                itemId={fromId}
                                width={24}
                                height={24}
                              />
                            ))}
                          </div>
                          <p className={styles.itemSetitemDescription}>
                            {getItemDescription(item.desc, item.effects)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </>
        ) : (
          <h1 className={styles.championTitle}>
            Select a champion to view details.
          </h1>
        )}
      </Detail>
    </MasterDetail>
  );
};

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
    traits: state.TFT.traits,
    championsSearchQuery: state.TFT.championsSearchQuery,
    championsFilterTraits: state.TFT.championsFilterTraits,
    championsFilterCosts: state.TFT.championsFilterCosts
  };
};

const mapDispatchToProps = {
  dispatchResetFilter: resetChampionsFilter,
  dispatchSearchChampions: searchChampions,
  dispatchAddTraitToFilter: addTraitToChampionsFilter,
  dispatchRemoveTraitFromFilter: removeTraitFromChampionsFilter,
  dispatchResetTraits: resetTraitsInChampionsFilter,
  dispatchAddCostToFilter: addCostToChampionsFilter,
  dispatchRemoveCostFromFilter: removeCostFromChampionsFilter,
  dispatchResetCosts: resetCostsInChampionsFilter
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
