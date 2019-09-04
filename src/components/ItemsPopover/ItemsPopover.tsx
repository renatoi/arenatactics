import cx from "classnames";
import React from "react";
import { connect } from "react-redux";
import { AppState, TFTItems } from "../../types";
import { ItemImage } from "../ItemImage/ItemImage";
import styles from "./ItemsPopover.module.scss";

interface ItemsPopoverOwnProps {
  readonly onClick: (itemKey: string) => void;
  readonly showByType?: "all" | "base" | "combined";
}
interface ItemsPopoverStateProps {
  readonly items?: TFTItems;
  readonly isLoading: boolean;
}
interface ItemsPopoverProps
  extends ItemsPopoverOwnProps,
    ItemsPopoverStateProps {}

const ItemsPopoverSFC: React.FC<ItemsPopoverProps> = ({
  onClick,
  items,
  isLoading,
  showByType = "all"
}) => {
  if (isLoading || items == null) {
    return <></>;
  }
  return (
    <div
      className={cx(styles.container, {
        [styles.combined]: showByType === "combined"
      })}
    >
      {Object.keys(items.byKey)
        .sort()
        .filter(itemKey => {
          const itemId = items.byKey[itemKey];
          const item = items.byId[itemId];
          switch (showByType) {
            case "all":
              return true;
            case "combined":
              if (item.from.length > 0) {
                return true;
              }
              return false;
            case "base":
              if (item.from.length === 0) {
                return true;
              }
              return false;
          }
          return true;
        })
        .map(itemKey => {
          const itemId = items.byKey[itemKey];
          return (
            <button
              key={itemId}
              type="button"
              className={styles.button}
              onClick={() => onClick(itemKey)}
            >
              <ItemImage itemKey={itemKey} width={32} height={32} />
            </button>
          );
        })}
    </div>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: ItemsPopoverOwnProps
): ItemsPopoverStateProps => {
  if (!state.TFT || !state.TFT.items) {
    return {
      ...ownProps,
      isLoading: true
    };
  }
  return {
    ...ownProps,
    isLoading: false,
    items: state.TFT.items
  };
};

export const ItemsPopover = connect<
  ItemsPopoverStateProps,
  {},
  ItemsPopoverOwnProps,
  AppState
>(mapStateToProps)(ItemsPopoverSFC);
