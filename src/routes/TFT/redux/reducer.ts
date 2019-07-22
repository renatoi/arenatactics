import produce from "immer";
import {
  TFTActionDataLoaded,
  TFTActionTypes,
  TFTActionFilterChampions,
  TFTActionFilterItems
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
          const dataLoadedAction = action as TFTActionDataLoaded;
          const champions = dataLoadedAction.payload.champions;
          const items = dataLoadedAction.payload.items;
          draft.champions = champions;
          draft.traits = dataLoadedAction.payload.traits;
          draft.items = items;
          draft.visibleChampions = Object.keys(champions.byKey)
            .sort()
            .map(key => champions.byKey[key]);
          draft.visibleItems = Object.keys(items.byKey)
            .sort()
            .map(key => items.byKey[key]);
          break;

        case TFTActions.FilterChampions:
          const filterChampionsAction = action as TFTActionFilterChampions;
          const visibleChampions = Object.keys(state.champions.byId)
            .filter(championId => {
              const champion = state.champions.byId[championId];
              const traits = [...champion.traits].map(trait =>
                trait.toLowerCase()
              );
              const searchItems = [
                champion.name,
                ...traits,
                champion.cost.toString()
              ];
              const query = escapeStringRegexp(
                filterChampionsAction.query.toLowerCase()
              );
              return searchItems.find(item => item.includes(query));
            })
            .sort((championId1, championId2) =>
              state.champions.byId[championId1].name >
              state.champions.byId[championId2].name
                ? 1
                : -1
            );
          draft.visibleChampions = visibleChampions;
          draft.championsSearchQuery = filterChampionsAction.query;
          break;

        case TFTActions.FilterItems:
          const filterItemsAction = action as TFTActionFilterItems;
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
