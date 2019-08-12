import produce from "immer";
import {
  IDataLoaded,
  TFTActionTypes,
  ISearchChampions,
  ISearchItems,
  IAddTraitToChampionsFilter,
  IRemoveTraitFromChampionsFilter,
  IRemoveCostFromChampionsFilter,
  IAddCostToChampionsFilter,
  ISearchBuilds,
  IAddTraitToBuildsFilter,
  IRemoveTraitFromBuildsFilter,
  IAddTierToBuildsFilter,
  IRemoveTierFromBuildsFilter
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

        //#region CHAMPIONS
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
          const championsTraitIndex = draft.championsFilterTraits.indexOf(
            (action as IRemoveTraitFromChampionsFilter).trait
          );
          if (championsTraitIndex !== -1) {
            draft.championsFilterTraits.splice(championsTraitIndex, 1);
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
        //#endregion

        //#region BUILDS
        case TFTActions.SearchBuilds:
          const filterBuildsAction = action as ISearchBuilds;
          draft.buildsSearchQuery = filterBuildsAction.query || "";
          draft.visibleBuilds = getFilteredBuilds(draft);
          break;

        case TFTActions.ResetBuildsFilter:
          draft.buildsFilterTraits = [];
          draft.buildsFilterTiers = [];
          draft.visibleBuilds = getFilteredBuilds(draft);
          break;

        case TFTActions.AddTraitToBuildsFilter:
          draft.buildsFilterTraits.push(
            (action as IAddTraitToBuildsFilter).trait
          );
          draft.visibleBuilds = getFilteredBuilds(draft);
          break;

        case TFTActions.RemoveTraitFromBuildsFilter:
          const buildsTraitIndex = draft.buildsFilterTraits.indexOf(
            (action as IRemoveTraitFromBuildsFilter).trait
          );
          if (buildsTraitIndex !== -1) {
            draft.buildsFilterTraits.splice(buildsTraitIndex, 1);
            draft.visibleBuilds = getFilteredBuilds(draft);
          }
          break;

        case TFTActions.ResetTraitsInBuildsFilter:
          draft.buildsFilterTraits = [];
          draft.visibleBuilds = getFilteredBuilds(draft);
          break;

        case TFTActions.AddTierToBuildsFilter:
          draft.buildsFilterTiers.push((action as IAddTierToBuildsFilter).tier);
          draft.visibleBuilds = getFilteredBuilds(draft);
          break;

        case TFTActions.RemoveTierFromBuildsFilter:
          const tierIndex = draft.buildsFilterTiers.indexOf(
            (action as IRemoveTierFromBuildsFilter).tier
          );
          if (tierIndex !== -1) {
            draft.buildsFilterTiers.splice(tierIndex, 1);
            draft.visibleBuilds = getFilteredBuilds(draft);
          }
          break;

        case TFTActions.ResetTiersInBuildsFilter:
          draft.buildsFilterTiers = [];
          draft.visibleBuilds = getFilteredBuilds(draft);
          break;
        //#endregion

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

const getFilteredBuilds = (state: TFTState): string[] => {
  const {
    builds,
    buildsSearchQuery,
    buildsFilterTraits,
    buildsFilterTiers
  } = state;
  const query = escapeStringRegexp(buildsSearchQuery.toLowerCase());
  return (
    Object.keys(builds.byId)
      .filter(buildId => {
        const build = builds.byId[buildId];
        // search
        //TODO: Handle trait const traits = [...build.traits].map(trait => trait.toLowerCase());
        const searchItems = [
          build.name.toLowerCase(),
          // ...traits,
          build.tier.toLowerCase()
        ];
        const matchesSearch = searchItems.some(item => item.includes(query));

        // trait
        // const matchesTrait =
        //   buildsFilterTraits.length === 0
        //     ? true
        //     : buildsFilterTraits.some(filterTrait => {
        //         return build.traits.includes(filterTrait);
        //       });

        // tier
        const matchesTier =
          buildsFilterTiers.length === 0
            ? true
            : buildsFilterTiers.includes(build.tier);

        // if it matches all, then return true to filter item
        return matchesSearch && matchesTier;
      })
      // sort result by build name
      .sort((buildId1, buildId2) =>
        builds.byId[buildId1].name > builds.byId[buildId2].name ? 1 : -1
      )
  );
};
