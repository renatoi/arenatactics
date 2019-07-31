export enum TFTChampionTraits {
  Assassin = "Assassin",
  Blademaster = "Blademaster",
  Brawler = "Brawler",
  Demon = "Demon",
  Dragon = "Dragon",
  Elementalist = "Elementalist",
  Exile = "Exile",
  Glacial = "Glacial",
  Guardian = "Guardian",
  Gunslinger = "Gunslinger",
  Imperial = "Imperial",
  Knight = "Knight",
  Ninja = "Ninja",
  Noble = "Noble",
  Phantom = "Phantom",
  Pirate = "Pirate",
  Ranger = "Ranger",
  Robot = "Robot",
  Shapeshifter = "Shapeshifter",
  Sorcerer = "Sorcerer",
  Void = "Void",
  Wild = "Wild",
  Yordle = "Yordle"
}

export enum TFTActions {
  DataLoaded = "TFTDataLoaded",

  // Builds
  SearchBuilds = "TFTSearchBuilds",
  AddTraitToBuildsFilter = "TFTAddTraitToBuildsFilter",
  RemoveTraitFromBuildsFilter = "TFTRemoveTraitFromBuildsFilter",
  ResetTraitsInBuildsFilter = "TFTResetTraitsInBuildsFilter",
  AddTierToBuildsFilter = "TFTAddCostToBuildsFilter",
  RemoveTierFromBuildsFilter = "TFTRemoveCostFromBuildsFilter",
  ResetTiersInBuildsFilter = "TFTResetCostsInBuildsFilter",
  ResetBuildsFilter = "TFTResetBuildsFilter",

  // Champions
  SearchChampions = "TFTSearchChampions",
  AddTraitToChampionsFilter = "TFTAddTraitToChampionsFilter",
  RemoveTraitFromChampionsFilter = "TFTRemoveTraitFromChampionsFilter",
  ResetTraitsInChampionsFilter = "TFTResetTraitsInChampionsFilter",
  AddCostToChampionsFilter = "TFTAddCostToChampionsFilter",
  RemoveCostFromChampionsFilter = "TFTRemoveCostFromChampionsFilter",
  ResetCostsInChampionsFilter = "TFTResetCostsInChampionsFilter",
  ResetChampionsFilter = "TFTResetChampionsFilter",

  // Items
  SearchItems = "TFTFilterItems"
}
