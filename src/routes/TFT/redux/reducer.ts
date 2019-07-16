import produce from "immer";
import { ChampionsLoadedAction, TFTActionTypes } from "./actions";
import { TFTState } from "../types";
import { TFTActions } from "../constants";

export const TFTReducer = (
  state: TFTState,
  action: TFTActionTypes
): TFTState => {
  return produce<TFTState>(state || {}, draft => {
    switch (action.type) {
      case TFTActions.ChampionsLoaded:
        const typedAction = action as ChampionsLoadedAction;
        draft.champions = typedAction.payload;
        break;
      default:
      // do nothing
    }
  });
};
