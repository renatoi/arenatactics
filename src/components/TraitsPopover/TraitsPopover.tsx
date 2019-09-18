import React from "react";
import { connect } from "react-redux";
import { AppState, TFTTraits } from "../../types";
import { TraitImage } from "../TraitImage/TraitImage";
import styles from "./TraitsPopover.module.scss";

interface TraitsPopoverOwnProps {
  readonly onClick: (championKey: string) => void;
}
interface TraitsPopoverStateProps {
  readonly traits?: TFTTraits;
  readonly isLoading: boolean;
}
interface TraitsPopoverProps
  extends TraitsPopoverOwnProps,
    TraitsPopoverStateProps {}

const TraitsPopoverSFC: React.FC<TraitsPopoverProps> = ({
  onClick,
  traits,
  isLoading
}) => {
  if (isLoading || traits == null) {
    return <></>;
  }
  return (
    <div className={styles.container}>
      {Object.keys(traits.byId)
        .sort()
        .map(traitId => {
          return (
            <button
              key={traitId}
              type="button"
              className={styles.button}
              onClick={() => onClick(traitId)}
            >
              <TraitImage traitKey={traitId} />
              <span className={styles.traitName}>
                {traits.byId[traitId].name}
              </span>
            </button>
          );
        })}
    </div>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: TraitsPopoverOwnProps
): TraitsPopoverStateProps => {
  if (!state.TFT || Object.keys(state.TFT.traits.byId).length === 0) {
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

export const TraitsPopover = connect<
  TraitsPopoverStateProps,
  {},
  TraitsPopoverOwnProps,
  AppState
>(mapStateToProps)(TraitsPopoverSFC);
