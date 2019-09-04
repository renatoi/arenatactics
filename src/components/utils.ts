import { TFTItemEffect } from "../types";

export const getNormalizedName = (name: string = ""): string =>
  name.replace(/-|'|\s|\./g, "").toLocaleLowerCase();

export const getItemDescription = (
  description: string,
  effects: TFTItemEffect[]
): string => {
  let newDesc = description;
  effects.forEach(
    effect =>
      (newDesc = newDesc.replace(
        new RegExp(`@${effect.name}@`, "g"),
        effect.value.toString()
      ))
  );
  return newDesc;
};
