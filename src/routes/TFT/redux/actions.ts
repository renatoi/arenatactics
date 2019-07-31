import { TFTActions } from "../constants";
import { TFTState } from "../types";

//
// ─── DATA ───────────────────────────────────────────────────────────────────────
//
//#region DATA
export interface IDataLoaded {
  readonly type: TFTActions;
  readonly payload: TFTState;
}
export const dataLoaded = (payload: TFTState): IDataLoaded => ({
  type: TFTActions.DataLoaded,
  payload: payload
});
//#endregion

//
// ─── CHAMPIONS ──────────────────────────────────────────────────────────────────
//
//#region CHAMPIONS
// champions: search
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
//#endregion

//
// ─── BUILDS ──────────────────────────────────────────────────────────────────
//
//#region BUILDS
// builds: search
export interface ISearchBuilds {
  readonly type: TFTActions;
  readonly query?: string;
}
export const searchBuilds = (query?: string): ISearchBuilds => ({
  type: TFTActions.SearchBuilds,
  query
});

// reset filter
export interface IResetBuildsFilter {
  readonly type: TFTActions.ResetBuildsFilter;
}
export const resetBuildsFilter = (): IResetBuildsFilter => ({
  type: TFTActions.ResetBuildsFilter
});

// traits: add
export interface IAddTraitToBuildsFilter {
  readonly type: TFTActions.AddTraitToBuildsFilter;
  readonly trait: string;
}
export const addTraitToBuildsFilter = (
  trait: string
): IAddTraitToBuildsFilter => ({
  type: TFTActions.AddTraitToBuildsFilter,
  trait
});

// traits: remove
export interface IRemoveTraitFromBuildsFilter {
  readonly type: TFTActions.RemoveTraitFromBuildsFilter;
  readonly trait: string;
}
export const removeTraitFromBuildsFilter = (
  trait: string
): IRemoveTraitFromBuildsFilter => ({
  type: TFTActions.RemoveTraitFromBuildsFilter,
  trait
});

// traits: reset traits
export interface IResetTraitsInBuildsFilter {
  readonly type: TFTActions.ResetTraitsInBuildsFilter;
}
export const resetTraitsInBuildsFilter = (): IResetTraitsInBuildsFilter => ({
  type: TFTActions.ResetTraitsInBuildsFilter
});

// tier: add
export interface IAddTierToBuildsFilter {
  readonly type: TFTActions.AddTierToBuildsFilter;
  readonly tier: string;
}
export const addTierToBuildsFilter = (
  tier: string
): IAddTierToBuildsFilter => ({
  type: TFTActions.AddTierToBuildsFilter,
  tier
});

// tier: remove
export interface IRemoveTierFromBuildsFilter {
  readonly type: TFTActions.RemoveTierFromBuildsFilter;
  readonly tier: string;
}
export const removeTierFromBuildsFilter = (
  tier: string
): IRemoveTierFromBuildsFilter => ({
  type: TFTActions.RemoveTierFromBuildsFilter,
  tier
});

// tier: reset
export interface IResetTiersInBuildsFilter {
  readonly type: TFTActions.ResetTiersInBuildsFilter;
}
export const resetTiersInBuildsFilter = (): IResetTiersInBuildsFilter => ({
  type: TFTActions.ResetTiersInBuildsFilter
});
//#endregion

//
// ─── ITEMS ──────────────────────────────────────────────────────────────────────
//
//#region ITEMS
// items: search
export interface ISearchItems {
  readonly type: TFTActions;
  readonly query: string;
}
export const searchItems = (query: string): ISearchItems => ({
  type: TFTActions.SearchItems,
  query
});
//#endregion

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
