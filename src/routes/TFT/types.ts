import { TFTChampionTraits } from "./constants";

export interface TFTState {
  readonly champions: TFTChampionDictionary;
  readonly items: TFTItemDictionary;
  readonly traits: TFTTrait[];
}

export interface TFTTraitVars {
  readonly name: string;
  readonly value: number;
}

export interface TFTTraitEffects {
  readonly minUnits: 1;
  readonly vars: TFTTraitVars[];
}

export interface TFTTrait {
  readonly name: string;
  readonly desc: string;
  readonly icon: string;
  readonly effects: TFTTraitEffects[];
}

export interface TFTItemEffect {
  readonly name: string;
  readonly value: number;
}

export interface TFTItem {
  readonly name: string;
  readonly desc: string;
  readonly icon: string;
  readonly from: string[];
  readonly effects: TFTItemEffect[];
}

export interface TFTItemDictionary {
  readonly [id: string]: TFTItem;
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
  readonly icon: number;
  readonly variables: TFTChampionAbilityVariable[];
}

export interface TFTChampionBestSet {
  readonly name: string;
  readonly description: string;
  readonly items: string[];
}

export interface TFTChampion {
  readonly id: string;
  readonly name: string;
  readonly cost: number;
  readonly icon: string;
  readonly stats: TFTChampionStats;
  readonly traits: TFTChampionTraits[];
  readonly ability: TFTChampionAbility;
  readonly bestSets: TFTChampionBestSet[];
}

export interface TFTChampionDictionary {
  readonly [id: string]: TFTChampion;
}
