export interface ICollectionLookup<T> {
  readonly byKey: { [key: string]: string };
  readonly byId: { [key: string]: T };
}

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

export const getLocale = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const locale = urlParams.get("hl");
  return locale === "pt-br" ? locale : "en-us";
};

export const interpolateText = (
  text: string,
  values?: { readonly [key: string]: string }
): string => {
  if (values != null && Object.keys(values).length > 0) {
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        text = text.replace(new RegExp(`{${key}}`, "g"), values[key]);
      }
    }
  }
  return text;
};
