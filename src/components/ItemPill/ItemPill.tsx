import cx from "classnames";
import React from "react";
import { connect } from "react-redux";
import { AppState, TFTItems } from "../../types";
import { Item } from "../Item/Item";
import styles from "./ItemPill.module.scss";

export interface ItemPillOwnProps {
  readonly itemId?: string;
  readonly className?: string;
}
interface ItemPillStateProps {
  readonly isLoading: boolean;
  readonly items?: TFTItems;
}
interface ItemPillProps extends ItemPillOwnProps, ItemPillStateProps {}

const ItemPillComponent: React.FC<ItemPillProps> = ({
  isLoading,
  items,
  itemId,
  className
}) => {
  if (
    isLoading ||
    items == null ||
    itemId == null ||
    items.byKey[itemId] == null
  ) {
    return <></>;
  }
  return (
    <span className={cx(styles.pill, className)}>
      <Item itemId={itemId} width={16} height={16} className={styles.item} />
      {items.byId[items.byKey[itemId]].name}
    </span>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: ItemPillOwnProps
): ItemPillStateProps => {
  if (!state.TFT || Object.keys(state.TFT.items).length === 0) {
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

export const ItemPill = connect<
  ItemPillStateProps,
  {},
  ItemPillOwnProps,
  AppState
>(mapStateToProps)(ItemPillComponent);
