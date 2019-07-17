import produce from "immer";
import { TFTDataLoadedAction, TFTActionTypes } from "./actions";
import { TFTState } from "../types";
import { TFTActions } from "../constants";

export const TFTReducer = (
  state: TFTState,
  action: TFTActionTypes
): TFTState => {
  return produce<TFTState>(state || {}, draft => {
    switch (action.type) {
      case TFTActions.DataLoaded:
        const typedAction = action as TFTDataLoadedAction;
        draft.champions = typedAction.payload.champions;
        draft.traits = typedAction.payload.traits;
        draft.items = typedAction.payload.items;
        break;
      default:
      // do nothing
    }
  });
};
