import cx from "classnames";
import React from "react";
import { connect } from "react-redux";
import { AppState, TFTTraits } from "../../types";
import { TraitImage } from "../TraitImage/TraitImage";
import styles from "./TraitPill.module.scss";

export interface TraitPillOwnProps {
  readonly traitKey?: string;
  readonly className?: string;
}
interface TraitPillStateProps {
  readonly isLoading: boolean;
  readonly traits?: TFTTraits;
}
interface TraitPillProps extends TraitPillOwnProps, TraitPillStateProps {}

const TraitPillComponent: React.FC<TraitPillProps> = ({
  isLoading,
  traits,
  traitKey,
  className
}) => {
  if (
    isLoading ||
    traits == null ||
    traitKey == null ||
    traits.byId[traitKey] == null
  ) {
    return <></>;
  }
  return (
    <span
      className={cx(
        styles.trait_pill,
        styles[`trait_pill_${traitKey}`],
        className
      )}
    >
      <TraitImage traitKey={traitKey} />
      {traits.byId[traitKey].name}
    </span>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: TraitPillOwnProps
): TraitPillStateProps => {
  if (!state.TFT || Object.keys(state.TFT.traits).length === 0) {
    return {
      ...ownProps,
      isLoading: true
    };
  }
  return {
    ...ownProps,
    isLoading: false,
    traits: state.TFT.traits
  };
};

export const TraitPill = connect<
  TraitPillStateProps,
  {},
  TraitPillOwnProps,
  AppState
>(mapStateToProps)(TraitPillComponent);
