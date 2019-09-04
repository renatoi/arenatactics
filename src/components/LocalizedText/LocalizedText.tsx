import React from "react";
import { connect } from "react-redux";
import { AppState } from "../../types";
import { interpolateText } from "../../utils";

interface LocalizedTextOwnProps {
  readonly id: string;
  readonly values?: { readonly [key: string]: string };
}
interface LocalizedTextStateProps {
  readonly isLoading: boolean;
  readonly localizedStrings?: any;
}
interface LocalizedTextProps
  extends LocalizedTextOwnProps,
    LocalizedTextStateProps {}

const LocalizedTextComponent: React.FC<LocalizedTextProps> = ({
  id,
  localizedStrings,
  values
}) => {
  let text = localizedStrings[id];
  if (typeof text === "string" && text.length > 0) {
    return <>{interpolateText(text, values)}</>;
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

const mapStateToProps = (
  state: AppState,
  ownProps: LocalizedTextOwnProps
): LocalizedTextStateProps => {
  if (!state.localizedStrings) {
    return {
      ...ownProps,
      isLoading: true
    };
  }
  return {
    ...ownProps,
    isLoading: false,
    localizedStrings: state.localizedStrings
  };
};

export const LocalizedText = connect<
  LocalizedTextStateProps,
  {},
  LocalizedTextOwnProps,
  AppState
>(mapStateToProps)(LocalizedTextComponent);
