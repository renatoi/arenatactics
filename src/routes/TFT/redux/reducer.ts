import produce from "immer";
import {
  TFTActionDataLoaded,
  TFTActionTypes,
  TFTActionFilterChampions
} from "./actions";
import { TFTState } from "../types";
import { TFTActions } from "../constants";

export const TFTReducer = (
  state: TFTState,
  action: TFTActionTypes
): TFTState => {
  return produce<TFTState>(state || {}, draft => {
    switch (action.type) {
      case TFTActions.DataLoaded:
        const dataLoadedAction = action as TFTActionDataLoaded;
        draft.champions = dataLoadedAction.payload.champions;
        draft.traits = dataLoadedAction.payload.traits;
        draft.items = dataLoadedAction.payload.items;
        break;

      case TFTActions.FilterChampions:
        const filterChampionsAction = action as TFTActionFilterChampions;
        const visibleChampions = Object.keys(state.champions).filter(
          championKey => {
            return (
              state.champions[championKey].name
                .toLowerCase()
                .search(filterChampionsAction.query.toLowerCase()) >= 0
            );
          }
        );
        draft.visibleChampions = visibleChampions;
        break;

      default:
      // do nothing
    }
  });
};
