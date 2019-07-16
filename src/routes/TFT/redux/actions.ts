import { TFTActions } from "../constants";
import { TFTChampionDictionary } from "../types";

export interface ChampionsLoadedAction {
  readonly type: TFTActions;
  readonly payload: TFTChampionDictionary;
}
export const championsLoaded = (payload: TFTChampionDictionary) => ({
  type: TFTActions.ChampionsLoaded,
  payload: payload
});

export type TFTActionTypes = ChampionsLoadedAction;
