export const interpolateText = (
  text: string,
  values?: { readonly [key: string]: string }
): string => {
  if (typeof text === "string" && text.length > 0) {
    if (values != null && Object.keys(values).length > 0) {
      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          text = text.replace(new RegExp(`{${key}}`, "g"), values[key]);
        }
      }
    }
  }
  return text;
};
