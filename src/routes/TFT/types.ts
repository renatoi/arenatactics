import { TFTChampionTraits } from "./constants";

export interface TFTState {
  readonly visibleItems: string[];
  readonly visibleChampions: string[];
  readonly champions: TFTChampions;
  readonly items: TFTItems;
  readonly traits: TFTTrait[];
}

// Traits
export interface TFTTraitVars {
  readonly name: string;
  readonly value: number;
}

export interface TFTTraitEffects {
  readonly minUnits: number;
  readonly vars: TFTTraitVars[];
}

export interface TFTTrait {
  readonly name: string;
  readonly desc: string;
  readonly icon: string;
  readonly effects: TFTTraitEffects[];
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
  readonly traits: TFTChampionTraits[];
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
