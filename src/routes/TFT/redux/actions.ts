import { TFTActions } from "../constants";
import { TFTChampionDictionary, TFTState } from "../types";

export interface TFTDataLoadedAction {
  readonly type: TFTActions;
  readonly payload: TFTState;
}
export const tftDataLoaded = (payload: TFTState): TFTDataLoadedAction => ({
  type: TFTActions.DataLoaded,
  payload: payload
});

export type TFTActionTypes = TFTDataLoadedAction;
