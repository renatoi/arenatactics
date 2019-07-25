import { TFTActions } from "../constants";
import { TFTState } from "../types";

export interface IDataLoaded {
  readonly type: TFTActions;
  readonly payload: TFTState;
}
export const dataLoaded = (payload: TFTState): IDataLoaded => ({
  type: TFTActions.DataLoaded,
  payload: payload
});

export interface ISearchChampions {
  readonly type: TFTActions;
  readonly query?: string;
}
export const searchChampions = (query?: string): ISearchChampions => ({
  type: TFTActions.SearchChampions,
  query
});

// reset filter
export interface IResetChampionsFilter {
  readonly type: TFTActions.ResetChampionsFilter;
}
export const resetChampionsFilter = (): IResetChampionsFilter => ({
  type: TFTActions.ResetChampionsFilter
});

// traits: add
export interface IAddTraitToChampionsFilter {
  readonly type: TFTActions.AddTraitToChampionsFilter;
  readonly trait: string;
}
export const addTraitToChampionsFilter = (
  trait: string
): IAddTraitToChampionsFilter => ({
  type: TFTActions.AddTraitToChampionsFilter,
  trait
});

// traits: remove
export interface IRemoveTraitFromChampionsFilter {
  readonly type: TFTActions.RemoveTraitFromChampionsFilter;
  readonly trait: string;
}
export const removeTraitFromChampionsFilter = (
  trait: string
): IRemoveTraitFromChampionsFilter => ({
  type: TFTActions.RemoveTraitFromChampionsFilter,
  trait
});

// traits: reset traits
export interface IResetTraitsInChampionsFilter {
  readonly type: TFTActions.ResetTraitsInChampionsFilter;
}
export const resetTraitsInChampionsFilter = (): IResetTraitsInChampionsFilter => ({
  type: TFTActions.ResetTraitsInChampionsFilter
});

// cost: add
export interface IAddCostToChampionsFilter {
  readonly type: TFTActions.AddCostToChampionsFilter;
  readonly cost: number;
}
export const addCostToChampionsFilter = (
  cost: number
): IAddCostToChampionsFilter => ({
  type: TFTActions.AddCostToChampionsFilter,
  cost
});

// cost: remove
export interface IRemoveCostFromChampionsFilter {
  readonly type: TFTActions.RemoveCostFromChampionsFilter;
  readonly cost: number;
}
export const removeCostFromChampionsFilter = (
  cost: number
): IRemoveCostFromChampionsFilter => ({
  type: TFTActions.RemoveCostFromChampionsFilter,
  cost
});

// cost: reset
export interface IResetCostsInChampionsFilter {
  readonly type: TFTActions.ResetCostsInChampionsFilter;
}
export const resetCostsInChampionsFilter = (): IResetCostsInChampionsFilter => ({
  type: TFTActions.ResetCostsInChampionsFilter
});

// items: search
export interface ISearchItems {
  readonly type: TFTActions;
  readonly query: string;
}
export const searchItems = (query: string): ISearchItems => ({
  type: TFTActions.FilterItems,
  query
});

export type TFTActionTypes =
  | IDataLoaded
  | ISearchChampions
  | ISearchItems
  | IResetChampionsFilter
  | IAddTraitToChampionsFilter
  | IRemoveTraitFromChampionsFilter
  | IResetTraitsInChampionsFilter
  | IAddCostToChampionsFilter
  | IRemoveCostFromChampionsFilter
  | IResetCostsInChampionsFilter;
