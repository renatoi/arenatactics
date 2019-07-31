import produce from "immer";
import {
  IDataLoaded,
  TFTActionTypes,
  ISearchChampions,
  ISearchItems,
  IAddTraitToChampionsFilter,
  IRemoveTraitFromChampionsFilter,
  IRemoveCostFromChampionsFilter,
  IAddCostToChampionsFilter
} from "./actions";
import { TFTState } from "../types";
import { TFTActions } from "../constants";
import escapeStringRegexp from "escape-string-regexp";

export const TFTReducer = (
  state: TFTState,
  action: TFTActionTypes
): TFTState => {
  return produce<TFTState>(
    state || { visibleChampions: [], visibleItems: [] },
    draft => {
      switch (action.type) {
        case TFTActions.DataLoaded:
          const dataLoadedAction = action as IDataLoaded;
          const champions = dataLoadedAction.payload.champions;
          const items = dataLoadedAction.payload.items;
          const builds = dataLoadedAction.payload.builds;
          draft.champions = champions;
          draft.traits = dataLoadedAction.payload.traits;
          draft.items = items;
          draft.builds = builds;
          draft.visibleChampions = Object.keys(champions.byKey)
            .sort()
            .map(key => champions.byKey[key]);
          draft.visibleItems = Object.keys(items.byKey)
            .sort()
            .map(key => items.byKey[key]);
          draft.visibleBuilds = Object.keys(builds.byKey)
            .sort()
            .map(key => builds.byKey[key]);
          draft.championsSearchQuery = "";
          draft.championsFilterTraits = [];
          draft.championsFilterCosts = [];
          draft.buildsSearchQuery = "";
          draft.buildsFilterTraits = [];
          draft.buildsFilterTiers = [];
          break;

        case TFTActions.SearchChampions:
          const filterChampionsAction = action as ISearchChampions;
          draft.championsSearchQuery = filterChampionsAction.query || "";
          draft.visibleChampions = getFilteredChampions(draft);
          break;

        case TFTActions.ResetChampionsFilter:
          draft.championsFilterTraits = [];
          draft.championsFilterCosts = [];
          draft.visibleChampions = getFilteredChampions(draft);
          break;

        case TFTActions.AddTraitToChampionsFilter:
          draft.championsFilterTraits.push(
            (action as IAddTraitToChampionsFilter).trait
          );
          draft.visibleChampions = getFilteredChampions(draft);
          break;

        case TFTActions.RemoveTraitFromChampionsFilter:
          const traitIndex = draft.championsFilterTraits.indexOf(
            (action as IRemoveTraitFromChampionsFilter).trait
          );
          if (traitIndex !== -1) {
            draft.championsFilterTraits.splice(traitIndex, 1);
            draft.visibleChampions = getFilteredChampions(draft);
          }
          break;

        case TFTActions.ResetTraitsInChampionsFilter:
          draft.championsFilterTraits = [];
          draft.visibleChampions = getFilteredChampions(draft);
          break;

        case TFTActions.AddCostToChampionsFilter:
          draft.championsFilterCosts.push(
            (action as IAddCostToChampionsFilter).cost
          );
          draft.visibleChampions = getFilteredChampions(draft);
          break;

        case TFTActions.RemoveCostFromChampionsFilter:
          const costIndex = draft.championsFilterCosts.indexOf(
            (action as IRemoveCostFromChampionsFilter).cost
          );
          if (costIndex !== -1) {
            draft.championsFilterCosts.splice(costIndex, 1);
            draft.visibleChampions = getFilteredChampions(draft);
          }
          break;

        case TFTActions.ResetCostsInChampionsFilter:
          draft.championsFilterCosts = [];
          draft.visibleChampions = getFilteredChampions(draft);
          break;

        case TFTActions.SearchItems:
          const filterItemsAction = action as ISearchItems;
          const visibleItems = Object.keys(state.items.byId).filter(itemId => {
            return (
              state.items.byId[itemId].name
                .toLowerCase()
                .search(
                  escapeStringRegexp(filterItemsAction.query.toLowerCase())
                ) >= 0
            );
          });
          draft.visibleItems = visibleItems;
          draft.itemsSearchQuery = filterItemsAction.query;
          break;

        default:
      }
    }
  );
};

const getFilteredChampions = (state: TFTState): string[] => {
  const {
    champions,
    championsSearchQuery,
    championsFilterTraits,
    championsFilterCosts
  } = state;
  const query = escapeStringRegexp(championsSearchQuery.toLowerCase());
  return (
    Object.keys(champions.byId)
      .filter(championId => {
        const champion = champions.byId[championId];
        // search
        const traits = [...champion.traits].map(trait => trait.toLowerCase());
        const searchItems = [
          champion.name.toLowerCase(),
          ...traits,
          champion.cost.toString()
        ];
        const matchesSearch = searchItems.some(item => item.includes(query));

        // trait
        const matchesTrait =
          championsFilterTraits.length === 0
            ? true
            : championsFilterTraits.some(filterTrait => {
                return champion.traits.includes(filterTrait);
              });

        // cost
        const matchesCost =
          championsFilterCosts.length === 0
            ? true
            : championsFilterCosts.includes(champion.cost);

        // if it matches all, then return true to filter item
        return matchesSearch && matchesTrait && matchesCost;
      })
      // sort result by champion name
      .sort((championId1, championId2) =>
        champions.byId[championId1].name > champions.byId[championId2].name
          ? 1
          : -1
      )
  );
};
