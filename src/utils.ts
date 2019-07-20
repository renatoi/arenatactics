import { ICollectionLookup } from "./types";

export const getObjectByKey = <T>(
  collectionLookup: ICollectionLookup<T>,
  key: string
): T => collectionLookup.byId[collectionLookup.byKey[key]];
