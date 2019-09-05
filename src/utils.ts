import { Locale } from "./types";

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

export const getLocale = (): Locale => {
  const defaultLocale = "en-us";
  const parsedUrl = new URL(window.location.href);
  const locale = parsedUrl.pathname.match(/(en-us|pt-br)/g);
  if (locale == null) {
    return defaultLocale;
  }
  return locale[0] === "pt-br" ? "pt-br" : defaultLocale;
};

export const hasKey = (obj: any, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key);

export const dig = (obj: any, keys: string[]): any => {
  if (!obj) {
    return null;
  }

  const [first, ...rest] = keys;

  if (rest.length === 0) {
    if (hasKey(obj, first)) {
      return obj[first];
    }

    return null;
  }

  if (hasKey(obj, first)) {
    return dig(obj[first], rest);
  }

  return null;
};

export const interpolateText = (
  text?: string,
  values?: { readonly [key: string]: string }
): string => {
  if (text == null) return "";
  if (values != null && Object.keys(values).length > 0) {
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        text = text.replace(new RegExp(`{${key}}`, "g"), values[key]);
      }
    }
  }
  return text;
};
