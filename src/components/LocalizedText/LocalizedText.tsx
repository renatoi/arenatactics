import React from "react";
import { dig, getLocale, interpolateText } from "../../utils";
import { localizedTexts } from "./localizedTexts";

interface IValues {
  readonly [key: string]: string;
}

interface LocalizedTextProps {
  readonly id: string;
  readonly values?: IValues;
}

export const LocalizedText: React.FC<LocalizedTextProps> = ({ id, values }) => {
  const text = getLocalizedText(id, values);
  if (text != null) {
    return <>{text}</>;
  }
  if (process.env.NODE_ENV === "development") {
    return (
      <span style={{ fontSize: "24px", background: "pink" }}>
        STRING NOT FOUND
      </span>
    );
  }
  return <></>;
};

export const getLocalizedText = (id: string, values?: IValues) => {
  let text = dig(localizedTexts, [getLocale() as string].concat(id.split(".")));
  if (typeof text === "string" && text.length > 0) {
    return interpolateText(text, values);
  }
};
