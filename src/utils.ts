import { ICollectionLookup } from "./types";

export const getObjectByKey = <T>(
  collectionLookup: ICollectionLookup<T>,
  key: string
): T => collectionLookup.byId[collectionLookup.byKey[key]];

export const arrayContainsAnotherArray = <T>(needle: T[], haystack: T[]) => {
  for (var i = 0; i < needle.length; i++) {
    if (haystack.indexOf(needle[i]) === -1) return false;
  }
  return true;
};
