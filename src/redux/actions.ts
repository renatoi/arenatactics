import { Locale, TFTState } from "../types";

export enum Actions {
  // Strings
  LocalizedStringsFetch = "StringsFetch",
  LocalizedStringsLoaded = "StringsLoaded",
  // Data
  GameDataFetch = "DataFetch",
  GameDataLoaded = "DataLoaded",
  // Builds
  BuildsSearch = "BuildsSearch",
  BuildsAddTraitToFilter = "BuildsAddTraitToFilter",
  BuildsRemoveTraitFromFilter = "BuildsRemoveTraitFromFilter",
  BuildsResetTraitsInFilter = "BuildsResetTraitsInFilter",
  BuildsAddTierToFilter = "BuildsAddTierToFilter",
  BuildsRemoveTierFromFilter = "BuildsRemoveTierFromFilter",
  BuildsResetTiersInFilter = "BuildsResetTiersInFilter",
  BuildsResetFilter = "BuildsResetFilter",
  // Champions
  ChampionsSearch = "ChampionsSearch",
  ChampionsAddTraitToFilter = "ChampionsAddTraitToFilter",
  ChampionsRemoveTraitFromFilter = "ChampionsRemoveTraitFromFilter",
  ChampionsResetTraitsInFilter = "ChampionsResetTraitsInFilter",
  ChampionsAddCostToFilter = "ChampionsAddCostToFilter",
  ChampionsRemoveCostFromFilter = "ChampionsRemoveCostFromFilter",
  ChampionsResetCostsInFilter = "ChampionsResetCostsInFilter",
  ChampionsResetFilter = "ChampionsResetFilter",
  // Items
  ItemsSearch = "ItemsSearch"
}

//
// ─── DATA ───────────────────────────────────────────────────────────────────────
//
//#region DATA
export interface IGameDataFetch {
  readonly type: Actions.GameDataFetch;
  readonly locale: Locale;
}
export const gameDataFetch = (locale: Locale): IGameDataFetch => ({
  type: Actions.GameDataFetch,
  locale
});
export interface IGameDataLoaded {
  readonly type: Actions.GameDataLoaded;
  readonly payload: TFTState;
}
export const gameDataLoaded = (payload: TFTState): IGameDataLoaded => ({
  type: Actions.GameDataLoaded,
  payload: payload
});
//#endregion

//
// ─── CHAMPIONS ──────────────────────────────────────────────────────────────────
//
//#region CHAMPIONS
// champions: search
export interface IChampionsSearch {
  readonly type: Actions.ChampionsSearch;
  readonly query?: string;
}
export const championsSearch = (query?: string): IChampionsSearch => ({
  type: Actions.ChampionsSearch,
  query
});

// reset filter
export interface IChampionsResetFilter {
  readonly type: Actions.ChampionsResetFilter;
}
export const championsResetFilter = (): IChampionsResetFilter => ({
  type: Actions.ChampionsResetFilter
});

// traits: add
export interface IChampionsAddTraitToFilter {
  readonly type: Actions.ChampionsAddTraitToFilter;
  readonly trait: string;
}
export const championsAddTraitToFilter = (
  trait: string
): IChampionsAddTraitToFilter => ({
  type: Actions.ChampionsAddTraitToFilter,
  trait
});

// traits: remove
export interface IChampionsRemoveTraitFromFilter {
  readonly type: Actions.ChampionsRemoveTraitFromFilter;
  readonly trait: string;
}
export const championsRemoveTraitFromFilter = (
  trait: string
): IChampionsRemoveTraitFromFilter => ({
  type: Actions.ChampionsRemoveTraitFromFilter,
  trait
});

// traits: reset traits
export interface IChampionsResetTraitsInFilter {
  readonly type: Actions.ChampionsResetTraitsInFilter;
}
export const championsResetTraitsInFilter = (): IChampionsResetTraitsInFilter => ({
  type: Actions.ChampionsResetTraitsInFilter
});

// cost: add
export interface IChampionsAddCostToFilter {
  readonly type: Actions.ChampionsAddCostToFilter;
  readonly cost: number;
}
export const championsAddCostToFilter = (
  cost: number
): IChampionsAddCostToFilter => ({
  type: Actions.ChampionsAddCostToFilter,
  cost
});

// cost: remove
export interface IChampionsRemoveCostFromFilter {
  readonly type: Actions.ChampionsRemoveCostFromFilter;
  readonly cost: number;
}
export const championsRemoveCostFromFilter = (
  cost: number
): IChampionsRemoveCostFromFilter => ({
  type: Actions.ChampionsRemoveCostFromFilter,
  cost
});

// cost: reset
export interface IChampionsResetCostsInFilter {
  readonly type: Actions.ChampionsResetCostsInFilter;
}
export const championsResetCostsInFilter = (): IChampionsResetCostsInFilter => ({
  type: Actions.ChampionsResetCostsInFilter
});
//#endregion

//
// ─── BUILDS ──────────────────────────────────────────────────────────────────
//
//#region BUILDS
// builds: search
export interface IBuildsSearch {
  readonly type: Actions;
  readonly query?: string;
}
export const buildsSearch = (query?: string): IBuildsSearch => ({
  type: Actions.BuildsSearch,
  query
});

// reset filter
export interface IBuildsResetFilter {
  readonly type: Actions.BuildsResetFilter;
}
export const buildsResetFilter = (): IBuildsResetFilter => ({
  type: Actions.BuildsResetFilter
});

// traits: add
export interface IBuildsAddTraitToFilter {
  readonly type: Actions.BuildsAddTraitToFilter;
  readonly trait: string;
}
export const buildsAddTraitToFilter = (
  trait: string
): IBuildsAddTraitToFilter => ({
  type: Actions.BuildsAddTraitToFilter,
  trait
});

// traits: remove
export interface IBuildsRemoveTraitFromFilter {
  readonly type: Actions.BuildsRemoveTraitFromFilter;
  readonly trait: string;
}
export const buildsRemoveTraitFromFilter = (
  trait: string
): IBuildsRemoveTraitFromFilter => ({
  type: Actions.BuildsRemoveTraitFromFilter,
  trait
});

// traits: reset traits
export interface IBuildsResetTraitsInFilter {
  readonly type: Actions.BuildsResetTraitsInFilter;
}
export const buildsResetTraitsInFilter = (): IBuildsResetTraitsInFilter => ({
  type: Actions.BuildsResetTraitsInFilter
});

// tier: add
export interface IBuildsAddTierToFilter {
  readonly type: Actions.BuildsAddTierToFilter;
  readonly tier: string;
}
export const buildsAddTierToFilter = (
  tier: string
): IBuildsAddTierToFilter => ({
  type: Actions.BuildsAddTierToFilter,
  tier
});

// tier: remove
export interface IBuildsRemoveTierFromFilter {
  readonly type: Actions.BuildsRemoveTierFromFilter;
  readonly tier: string;
}
export const buildsRemoveTierFromFilter = (
  tier: string
): IBuildsRemoveTierFromFilter => ({
  type: Actions.BuildsRemoveTierFromFilter,
  tier
});

// tier: reset
export interface IBuildsResetTiersInFilter {
  readonly type: Actions.BuildsResetTiersInFilter;
}
export const buildsResetTiersInFilter = (): IBuildsResetTiersInFilter => ({
  type: Actions.BuildsResetTiersInFilter
});
//#endregion

//
// ─── ITEMS ──────────────────────────────────────────────────────────────────────
//
//#region ITEMS
// items: search
export interface IItemsSearch {
  readonly type: Actions;
  readonly query: string;
}
export const itemsSearch = (query: string): IItemsSearch => ({
  type: Actions.ItemsSearch,
  query
});
//#endregion

export type ActionTypes =
  | IGameDataFetch
  | IGameDataLoaded
  | IBuildsSearch
  | IBuildsAddTraitToFilter
  | IBuildsRemoveTraitFromFilter
  | IBuildsResetTraitsInFilter
  | IBuildsAddTierToFilter
  | IBuildsRemoveTierFromFilter
  | IBuildsResetTiersInFilter
  | IBuildsResetFilter
  | IChampionsSearch
  | IChampionsAddTraitToFilter
  | IChampionsRemoveTraitFromFilter
  | IChampionsResetTraitsInFilter
  | IChampionsAddCostToFilter
  | IChampionsRemoveCostFromFilter
  | IChampionsResetCostsInFilter
  | IChampionsResetFilter
  | IItemsSearch;
