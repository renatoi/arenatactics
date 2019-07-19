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
          draft.champions = dataLoadedAction.payload.champions;
          draft.traits = dataLoadedAction.payload.traits;
          draft.items = dataLoadedAction.payload.items;
          break;

        case TFTActions.FilterChampions:
          const filterChampionsAction = action as TFTActionFilterChampions;
          const visibleChampions = Object.keys(state.champions.byKey).filter(
            championKey => {
              return (
                state.champions.byId[state.champions.byKey[championKey]].name
                  .toLowerCase()
                  .search(
                    escapeStringRegexp(
                      filterChampionsAction.query.toLowerCase()
                    )
                  ) >= 0
              );
            }
          );
          draft.visibleChampions = visibleChampions;
          break;

        case TFTActions.FilterItems:
          const filterItemsAction = action as TFTActionFilterItems;
          const visibleItems = Object.keys(state.items.byKey).filter(
            itemKey => {
              return (
                state.items.byId[state.items.byKey[itemKey]].name
                  .toLowerCase()
                  .search(
                    escapeStringRegexp(filterItemsAction.query.toLowerCase())
                  ) >= 0
              );
            }
          );
          draft.visibleItems = visibleItems;
          break;

        default:
        // do nothing
      }
    }
  );
};
