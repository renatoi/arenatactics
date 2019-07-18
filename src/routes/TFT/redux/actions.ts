import { TFTActions } from "../constants";
import { TFTState } from "../types";

export interface TFTActionDataLoaded {
  readonly type: TFTActions;
  readonly payload: TFTState;
}
export const tftDataLoaded = (payload: TFTState): TFTActionDataLoaded => ({
  type: TFTActions.DataLoaded,
  payload: payload
});

export interface TFTActionFilterChampions {
  readonly type: TFTActions;
  readonly query: string;
}
export const tftFilterChampions = (
  query: string
): TFTActionFilterChampions => ({
  type: TFTActions.FilterChampions,
  query
});

export type TFTActionTypes = TFTActionDataLoaded | TFTActionFilterChampions;
