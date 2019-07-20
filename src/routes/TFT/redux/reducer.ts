import produce from "immer";
import {
  TFTActionDataLoaded,
  TFTActionTypes,
  TFTActionFilterChampions,
  TFTActionFilterItems
} from "./actions";
import { TFTState, TFTChampion } from "../types";
import { TFTActions } from "../constants";
import escapeStringRegexp from "escape-string-regexp";
import { getObjectByKey } from "../../../utils";

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
          const visibleChampions = Object.keys(state.champions.byId).filter(
            championId =>
              state.champions.byId[championId].name
                .toLowerCase()
                .search(
                  escapeStringRegexp(filterChampionsAction.query.toLowerCase())
                ) >= 0
          );
          draft.visibleChampions = visibleChampions;
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
          break;

        default:
      }
    }
  );
};
