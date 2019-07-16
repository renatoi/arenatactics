import { TFTChampionTraits } from "./constants";

export interface TFTState {
  readonly champions: TFTChampionDictionary;
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

export interface TFTChampion {
  readonly id: string;
  readonly name: string;
  readonly cost: number;
  readonly icon: string;
  readonly stats: TFTChampionStats;
  readonly traits: TFTChampionTraits[];
  readonly ability: TFTChampionAbility;
}

export interface TFTChampionDictionary {
  readonly [id: string]: TFTChampion;
}
