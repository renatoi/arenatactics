import React from "react";
import uuidv4 from "uuid/v4";
import { connect } from "react-redux";
import { AppState } from "../../../types";
import styles from "./Item.module.css";
import { TFTItems } from "../types";
import { getItemDescription, getNormalizedItemName } from "./utils";
import { Tooltip } from "../../../components/Tooltip/Tooltip";

export interface TFTItemOwnProps {
  readonly itemId: string;
  readonly width?: number;
  readonly height?: number;
}
export interface TFTItemStateProps {
  readonly isLoading: boolean;
  readonly items?: TFTItems;
}

interface TFTItemProps extends TFTItemOwnProps, TFTItemStateProps {}

const TFTItem: React.FC<TFTItemProps> = ({
  items,
  itemId,
  width = 32,
  height = 32
}) => {
  if (items == null || itemId == null) return <></>;
  const currentItem = items.byId[itemId] || items.byId[items.byKey[itemId]];
  const tooltipContent = () => {
    if (currentItem == null) {
      return <></>;
    }
    return (
      <div className={styles.tooltip}>
        <h3 className={styles.itemTitle}>
          <img
            src={`${
              process.env.PUBLIC_URL
            }/tft/tft_item_${getNormalizedItemName(currentItem.name)}.tft.png`}
            width={16}
            height={16}
            alt=""
          />
          {currentItem.name}
        </h3>
        <p className={styles.itemDesc}>
          {getItemDescription(currentItem.desc, currentItem.effects)}
        </p>
        <div className={styles.itemSourceList}>
          {Array.isArray(currentItem.from) &&
            currentItem.from.map(fromId => (
              <img
                key={uuidv4()}
                className={styles.itemSource}
                src={`${
                  process.env.PUBLIC_URL
                }/tft/tft_item_${getNormalizedItemName(
                  items.byId[fromId].name
                )}.tft.png`}
                width={width}
                height={height}
                alt={items.byId[fromId].name}
              />
            ))}
        </div>
      </div>
    );
  };
  return (
    <Tooltip title={tooltipContent}>
      <img
        src={`${process.env.PUBLIC_URL}/tft/tft_item_${getNormalizedItemName(
          currentItem.name
        )}.tft.png`}
        width={width}
        height={height}
        alt={currentItem.name}
      />
    </Tooltip>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: TFTItemOwnProps
): TFTItemStateProps => {
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

export const ConnectedTFTItem = connect<
  TFTItemStateProps,
  {},
  TFTItemOwnProps,
  AppState
>(mapStateToProps)(TFTItem);
