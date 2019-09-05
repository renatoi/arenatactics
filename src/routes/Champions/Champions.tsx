import cx from "classnames";
import React, { ChangeEvent, useEffect } from "react";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import {
  generatePath,
  RouteComponentProps,
  withRouter
} from "react-router-dom";
import uuidv4 from "uuid/v4";
import traitStyles from "../../assets/Traits.module.scss";
import { Champion } from "../../components/Champion/Champion";
import { Disclaimer } from "../../components/Disclaimer/Disclaimer";
import {
  FilterButton,
  FilterItem,
  FilterItemCheckbox,
  FilterPopover
} from "../../components/Filter";
import { Item } from "../../components/Item/Item";
import { getLocalizedText } from "../../components/LocalizedText/LocalizedText";
import {
  Detail,
  Master,
  MasterDetail,
  MasterHeader,
  MasterItem,
  MasterList,
  MasterSearchBox
} from "../../components/MasterDetail";
import { TraitImage } from "../../components/TraitImage/TraitImage";
import { getItemDescription } from "../../components/utils";
import {
  championsAddCostToFilter,
  championsAddTraitToFilter,
  championsRemoveCostFromFilter,
  championsRemoveTraitFromFilter,
  championsResetCostsInFilter,
  championsResetFilter,
  championsResetTraitsInFilter,
  championsSearch
} from "../../redux/actions";
import { AppState, TFTChampions, TFTItems, TFTTraits } from "../../types";
import { getLocale, interpolateText } from "../../utils";
import styles from "./Champions.module.scss";

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
  readonly descriptionText?: string;
  readonly descriptionTextWithChampion?: string;
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

const ChampionsComponent: React.FC<TFTChampionsProps> = ({
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

  const locale = getLocale();

  const championArtStyle =
    selectedChampionKey != null
      ? {
          background: `
      url(${process.env.PUBLIC_URL}/tft/tft_${selectedChampionKey}_splash.png) 0 0 no-repeat fixed / cover`
        }
      : undefined;

  const title = selectedChampion
    ? interpolateText(getLocalizedText("champions.titleWithChampion"), {
        championName: selectedChampion.name
      })
    : getLocalizedText("champions.title");

  const description = selectedChampion
    ? interpolateText(getLocalizedText("champions.descriptionWithChampion"), {
        championName: selectedChampion.name
      })
    : getLocalizedText("champions.description");

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
            label={getLocalizedText("champions.searchLabel")}
            placeholder={getLocalizedText("champions.searchPlaceholder")}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />
          <FilterButton>
            <FilterPopover>
              <FilterItem onClick={dispatchResetFilter}>
                {getLocalizedText("filter.resetAll")}
              </FilterItem>
              <FilterItem
                content={
                  <FilterPopover shouldSplitColumns={true}>
                    <FilterItem onClick={dispatchResetTraits}>
                      {getLocalizedText("filter.reset")}
                    </FilterItem>
                    {Object.keys(traits.byId)
                      .sort()
                      .map(trait => (
                        <FilterItemCheckbox
                          key={`trait_${trait}`}
                          id={`trait_${trait}`}
                          value={trait}
                          onChange={handleTraitCheckboxChange}
                          checked={
                            Array.isArray(championsFilterTraits) &&
                            championsFilterTraits.includes(trait)
                          }
                        >
                          {trait}
                        </FilterItemCheckbox>
                      ))}
                  </FilterPopover>
                }
              >
                {getLocalizedText("filter.traits")}
              </FilterItem>
              <FilterItem
                content={
                  <FilterPopover>
                    <FilterItem onClick={dispatchResetCosts}>
                      {getLocalizedText("filter.reset")}
                    </FilterItem>
                    {[1, 2, 3, 4, 5].sort().map(cost => (
                      <FilterItemCheckbox
                        key={`cost_${cost}`}
                        id={`cost_${cost}`}
                        value={cost.toString()}
                        onChange={handleCostCheckboxChange}
                        checked={
                          Array.isArray(championsFilterCosts) &&
                          championsFilterCosts.includes(cost)
                        }
                      >
                        {cost.toString()}
                      </FilterItemCheckbox>
                    ))}
                  </FilterPopover>
                }
              >
                {getLocalizedText("filter.costs")}
              </FilterItem>
            </FilterPopover>
          </FilterButton>
        </MasterHeader>
        <MasterList className={styles.championsList}>
          {visibleChampions.map(championId => {
            const champion = champions.byId[championId];
            return (
              <MasterItem
                key={champion.key}
                to={generatePath(match.path, {
                  locale,
                  championKey: champion.key
                })}
                isSelected={selectedChampionKey === champion.key}
                linkClassName={styles.championsListItemLink}
              >
                <Champion championId={championId} />
                {champion.name}
              </MasterItem>
            );
          })}
        </MasterList>
      </Master>
      <Detail className="Scrollable" style={championArtStyle}>
        {selectedChampion != null ? (
          <>
            <header className={styles.championHeader}>
              <h1 className={styles.championTitle}>{selectedChampion.name}</h1>
              <ul className={styles.championTraits}>
                {selectedChampion.traits.map((trait, index) => {
                  const traitKey = selectedChampion.traitsSource[
                    index
                  ].toLocaleLowerCase();
                  return (
                    <li
                      key={traitKey}
                      className={cx(
                        styles.championTrait,
                        traitStyles.trait_pill,
                        traitStyles[`trait_pill_${traitKey.toLowerCase()}`]
                      )}
                    >
                      <TraitImage name={traitKey} />
                      {trait}
                    </li>
                  );
                })}
              </ul>
            </header>
            {/* Using index as keys since these don't change, it's fine! */}
            {selectedChampion.bestSets != null
              ? selectedChampion.bestSets.map((set, setIndex) => (
                  <div className={styles.itemSet} key={setIndex}>
                    <h3 className={styles.itemSetTitle}>{set.name}</h3>
                    <div className={styles.itemSetBody}>
                      <ul className={styles.itemSetItemsList}>
                        {set.items.map((itemId, itemIndex) => {
                          const item = items.byId[itemId];
                          return (
                            <li key={itemIndex} className={styles.itemSetItem}>
                              <h4 className={styles.itemSetItemName}>
                                {<Item itemId={itemId} />}
                                {item.name}
                              </h4>
                              <div className={styles.itemSetItemRecipe}>
                                <h5>Recipe:</h5>
                                {item.from.map(fromId => (
                                  <Item
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
                ))
              : "Coming soon"}
          </>
        ) : (
          <p style={{ minHeight: "80%" }}>
            {getLocalizedText("champions.championSelect")}
          </p>
        )}
        <Disclaimer />
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
  dispatchResetFilter: championsResetFilter,
  dispatchSearchChampions: championsSearch,
  dispatchAddTraitToFilter: championsAddTraitToFilter,
  dispatchRemoveTraitFromFilter: championsRemoveTraitFromFilter,
  dispatchResetTraits: championsResetTraitsInFilter,
  dispatchAddCostToFilter: championsAddCostToFilter,
  dispatchRemoveCostFromFilter: championsRemoveCostFromFilter,
  dispatchResetCosts: championsResetCostsInFilter
};

export const Champions = withRouter(
  connect<
    TFTChampionsStateProps,
    TFTChampionsDispatchProps,
    TFTChampionsOwnProps,
    AppState
  >(
    mapStateToProps,
    mapDispatchToProps
  )(ChampionsComponent)
);
