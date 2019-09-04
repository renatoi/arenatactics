import escapeStringRegexp from "escape-string-regexp";
import produce from "immer";
import { combineReducers } from "redux";
import { AppState, TFTState } from "../types";
import {
  Actions,
  ActionTypes,
  IBuildsAddTierToFilter,
  IBuildsAddTraitToFilter,
  IBuildsRemoveTierFromFilter,
  IBuildsRemoveTraitFromFilter,
  IBuildsSearch,
  IChampionsAddCostToFilter,
  IChampionsAddTraitToFilter,
  IChampionsRemoveCostFromFilter,
  IChampionsRemoveTraitFromFilter,
  IChampionsSearch,
  IGameDataLoaded,
  IItemsSearch,
  ILocalizedStringsLoaded
} from "./actions";
import { emptyState } from "./emptyState";

const TFTReducer = (
  state: TFTState | undefined,
  action: ActionTypes
): TFTState => {
  if (state == null) {
    return emptyState.TFT;
  }
  return produce<TFTState>(state, draft => {
    switch (action.type) {
      case Actions.GameDataLoaded:
        const dataLoadedAction = action as IGameDataLoaded;
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
      case Actions.ChampionsSearch:
        const filterChampionsAction = action as IChampionsSearch;
        draft.championsSearchQuery = filterChampionsAction.query || "";
        draft.visibleChampions = getFilteredChampions(draft);
        break;

      case Actions.ChampionsResetFilter:
        draft.championsFilterTraits = [];
        draft.championsFilterCosts = [];
        draft.visibleChampions = getFilteredChampions(draft);
        break;

      case Actions.ChampionsAddTraitToFilter:
        draft.championsFilterTraits.push(
          (action as IChampionsAddTraitToFilter).trait
        );
        draft.visibleChampions = getFilteredChampions(draft);
        break;

      case Actions.ChampionsRemoveTraitFromFilter:
        const championsTraitIndex = draft.championsFilterTraits.indexOf(
          (action as IChampionsRemoveTraitFromFilter).trait
        );
        if (championsTraitIndex !== -1) {
          draft.championsFilterTraits.splice(championsTraitIndex, 1);
          draft.visibleChampions = getFilteredChampions(draft);
        }
        break;

      case Actions.ChampionsResetTraitsInFilter:
        draft.championsFilterTraits = [];
        draft.visibleChampions = getFilteredChampions(draft);
        break;

      case Actions.ChampionsAddCostToFilter:
        draft.championsFilterCosts.push(
          (action as IChampionsAddCostToFilter).cost
        );
        draft.visibleChampions = getFilteredChampions(draft);
        break;

      case Actions.ChampionsRemoveCostFromFilter:
        const costIndex = draft.championsFilterCosts.indexOf(
          (action as IChampionsRemoveCostFromFilter).cost
        );
        if (costIndex !== -1) {
          draft.championsFilterCosts.splice(costIndex, 1);
          draft.visibleChampions = getFilteredChampions(draft);
        }
        break;

      case Actions.ChampionsResetCostsInFilter:
        draft.championsFilterCosts = [];
        draft.visibleChampions = getFilteredChampions(draft);
        break;
      //#endregion

      //#region BUILDS
      case Actions.BuildsSearch:
        const filterBuildsAction = action as IBuildsSearch;
        draft.buildsSearchQuery = filterBuildsAction.query || "";
        draft.visibleBuilds = getFilteredBuilds(draft);
        break;

      case Actions.BuildsResetFilter:
        draft.buildsFilterTraits = [];
        draft.buildsFilterTiers = [];
        draft.visibleBuilds = getFilteredBuilds(draft);
        break;

      case Actions.BuildsAddTraitToFilter:
        draft.buildsFilterTraits.push(
          (action as IBuildsAddTraitToFilter).trait
        );
        draft.visibleBuilds = getFilteredBuilds(draft);
        break;

      case Actions.BuildsRemoveTraitFromFilter:
        const buildsTraitIndex = draft.buildsFilterTraits.indexOf(
          (action as IBuildsRemoveTraitFromFilter).trait
        );
        if (buildsTraitIndex !== -1) {
          draft.buildsFilterTraits.splice(buildsTraitIndex, 1);
          draft.visibleBuilds = getFilteredBuilds(draft);
        }
        break;

      case Actions.BuildsResetTraitsInFilter:
        draft.buildsFilterTraits = [];
        draft.visibleBuilds = getFilteredBuilds(draft);
        break;

      case Actions.BuildsAddTierToFilter:
        draft.buildsFilterTiers.push((action as IBuildsAddTierToFilter).tier);
        draft.visibleBuilds = getFilteredBuilds(draft);
        break;

      case Actions.BuildsRemoveTierFromFilter:
        const tierIndex = draft.buildsFilterTiers.indexOf(
          (action as IBuildsRemoveTierFromFilter).tier
        );
        if (tierIndex !== -1) {
          draft.buildsFilterTiers.splice(tierIndex, 1);
          draft.visibleBuilds = getFilteredBuilds(draft);
        }
        break;

      case Actions.BuildsResetTiersInFilter:
        draft.buildsFilterTiers = [];
        draft.visibleBuilds = getFilteredBuilds(draft);
        break;
      //#endregion

      case Actions.ItemsSearch:
        const filterItemsAction = action as IItemsSearch;
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
  });
};

const localizedStringsReducer = (state: any, action: ActionTypes): any => {
  if (action.type === Actions.LocalizedStringsLoaded) {
    return {
      ...state,
      ...(action as ILocalizedStringsLoaded).localizedStrings
    };
  }
  return {
    ...state
  };
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

export const reducers = combineReducers<AppState, ActionTypes>({
  TFT: TFTReducer,
  localizedStrings: localizedStringsReducer
});
