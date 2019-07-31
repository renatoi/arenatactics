export interface TFTState {
  readonly visibleItems: string[];
  readonly itemsSearchQuery: string;

  readonly visibleChampions: string[];
  readonly championsSearchQuery: string;
  readonly championsFilterTraits: string[];
  readonly championsFilterCosts: number[];

  readonly visibleBuilds: string[];
  readonly buildsSearchQuery: string;
  readonly buildsFilterTraits: string[];
  readonly buildsFilterTiers: string[];

  readonly champions: TFTChampions;
  readonly items: TFTItems;
  readonly traits: TFTTraits;
  readonly builds: TFTBuilds;
}

// Builds
export interface TFTBuilds {
  readonly byId: TFTBuildMap;
  readonly byKey: TFTBuildKeyMap;
}
export interface TFTBuildMap {
  readonly [key: string]: TFTBuild;
}
export interface TFTBuildKeyMap {
  readonly [key: string]: string;
}
export interface TFTBuild {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly tier: string;
  readonly composition: TFTBuildComposition[];
  readonly positioning: TFTBuildPositioning;
  readonly guide: string; // TODO: Change to EditorState from DraftJS
}
export interface TFTBuildComposition {
  readonly champion: string;
  readonly items: string[];
}
export interface TFTBuildPositioning {
  readonly [id: string]: string;
}

// Traits
export interface TFTTraits {
  readonly byId: TFTTraitMap;
}
export interface TFTTraitMap {
  readonly [id: string]: TFTTrait;
}
export interface TFTTrait {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly desc: string;
  readonly icon: string;
  readonly effects: TFTTraitEffects[];
}
export interface TFTTraitVars {
  readonly name: string;
  readonly value: number;
}
export interface TFTTraitEffects {
  readonly minUnits: number;
  readonly vars: TFTTraitVars[];
}

// Items
export interface TFTItems {
  readonly byId: TFTItemIdMap;
  readonly byKey: TFTItemKeyMap;
}

export interface TFTItemIdMap {
  readonly [id: string]: TFTItem;
}

export interface TFTItemKeyMap {
  readonly [key: string]: string;
}

export interface TFTItem {
  readonly id: string;
  readonly name: string;
  readonly desc: string;
  readonly from: string[];
  readonly effects: TFTItemEffect[];
  readonly key: string;
}

export interface TFTItemEffect {
  readonly name: string;
  readonly value: number;
}

// Champions
export interface TFTChampions {
  readonly byId: TFTChampionIdMap;
  readonly byKey: TFTChampionKeyMap;
}

export interface TFTChampionIdMap {
  readonly [id: string]: TFTChampion;
}

export interface TFTChampion {
  readonly id: string;
  readonly name: string;
  readonly cost: number;
  readonly stats: TFTChampionStats;
  readonly traits: string[];
  readonly ability: TFTChampionAbility;
  readonly bestSets: TFTChampionBestSet[];
  readonly key: string;
}

export interface TFTChampionKeyMap {
  readonly [key: string]: string;
}

export interface TFTChampionStats {
  readonly hp: number;
  readonly hpScaleFactor: number;
  readonly mana: number;
  readonly initialMana: number;
  readonly damage: number;
  readonly damageScaleFactor: number;
  readonly armor: number;
  readonly magicResist: number;
  readonly critMultiplier: number;
  readonly critChance: number;
  readonly attackSpeed: number;
  readonly range: number;
}

export interface TFTChampionAbilityVariable {
  readonly key: string;
  readonly values: number[];
}

export interface TFTChampionAbility {
  readonly name: number;
  readonly desc: number;
  readonly variables: TFTChampionAbilityVariable[];
}

export interface TFTChampionBestSet {
  readonly name: string;
  readonly description: string;
  readonly items: string[];
}
