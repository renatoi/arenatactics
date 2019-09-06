import React from "react";
import { connect } from "react-redux";
import uuidv4 from "uuid/v4";
import { Tooltip } from "../../components/Tooltip/Tooltip";
import { AppState, TFTItems } from "../../types";
import { ItemImage } from "../ItemImage/ItemImage";
import { getItemDescription } from "../utils";
import styles from "./Item.module.css";

export interface ItemOwnProps {
  readonly itemId: string;
  readonly width?: number;
  readonly height?: number;
  readonly key?: string;
  readonly className?: string;
}
export interface ItemStateProps {
  readonly isLoading: boolean;
  readonly items?: TFTItems;
}

interface ItemProps extends ItemOwnProps, ItemStateProps {}

const ItemSFC: React.FC<ItemProps> = ({
  items,
  itemId,
  width = 32,
  height = 32,
  key,
  className
}) => {
  if (items == null || itemId == null) return <></>;
  const currentItem = items.byId[itemId] || items.byId[items.byKey[itemId]];
  if (currentItem == null) {
    return <></>;
  }
  const tooltipContent = () => {
    return (
      <div className={styles.tooltip}>
        <h3 className={styles.itemTitle}>
          <ItemImage itemKey={currentItem.key} width={16} height={16} alt="" />
          {currentItem.name}
        </h3>
        <p className={styles.itemDesc}>
          {getItemDescription(currentItem.desc, currentItem.effects)}
        </p>
        <div className={styles.itemSourceList}>
          {Array.isArray(currentItem.from) &&
            currentItem.from.map(fromId => (
              <ItemImage
                key={uuidv4()}
                itemKey={items.byId[fromId].key}
                width={width}
                height={height}
                alt={items.byId[fromId].name}
                className={styles.itemSource}
              />
            ))}
        </div>
      </div>
    );
  };
  return (
    <Tooltip title={tooltipContent}>
      <ItemImage
        key={key}
        itemKey={currentItem.key}
        width={width}
        height={height}
        alt={currentItem.name}
        className={className}
      />
    </Tooltip>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: ItemOwnProps
): ItemStateProps => {
  if (!state.TFT || Object.keys(state.TFT.items.byId).length === 0) {
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

export const Item = connect<ItemStateProps, {}, ItemOwnProps, AppState>(
  mapStateToProps
)(ItemSFC);
