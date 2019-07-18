import React from "react";
import uuidv4 from "uuid/v4";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { AppState } from "../../../types";
import styles from "./Item.module.css";
import { TFTItemDictionary, TFTItemEffect } from "../types";

const getNormalizedItemName = (name: string): string =>
  name.replace(/'|\s|\./g, "").toLocaleLowerCase();

const getItemDescription = (
  description: string,
  effects: TFTItemEffect[]
): string => {
  let newDesc = description;
  effects.forEach(
    effect =>
      (newDesc = newDesc.replace(
        new RegExp(`@${effect.name}@`, "g"),
        effect.value.toString()
      ))
  );
  return newDesc;
};

export interface TFTItemOwnProps {
  readonly items?: TFTItemDictionary;
  readonly isLoading: boolean;
}
export interface TFTConnectedItemProps {
  readonly itemId: string;
  readonly width?: number;
  readonly height?: number;
}

interface TFTItemProps extends TFTItemOwnProps, TFTConnectedItemProps {}
interface TFTItemState {
  readonly isTooltipVisible: boolean;
  readonly tooltipAnchorPos: { top: number; left: number };
}

class TFTItem extends React.Component<TFTItemProps, TFTItemState> {
  state = { isTooltipVisible: false, tooltipAnchorPos: { top: 0, left: 0 } };
  tooltipRootEl: HTMLElement;

  constructor(props: TFTItemProps) {
    super(props);
    this.tooltipRootEl =
      document.getElementById("tooltip-root") || document.createElement("div");
    this.tooltipRootEl.id = "tooltip-root";
  }

  showTooltip = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.FocusEvent<HTMLDivElement>
  ) => {
    const anchorPos = e.currentTarget.getBoundingClientRect();
    this.setState({
      isTooltipVisible: true,
      tooltipAnchorPos: {
        top: anchorPos.top,
        left: anchorPos.left
      }
    });
  };
  hideTooltip = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.FocusEvent<HTMLDivElement>
  ) => {
    this.setState({
      isTooltipVisible: false
    });
  };

  render() {
    const { items, itemId, width = 32, height = 32 } = this.props;
    if (items == null || itemId == null) return <></>;
    const currentItem = items[itemId];
    return (
      <div
        className={styles.itemContainer}
        onMouseEnter={this.showTooltip}
        onFocus={this.showTooltip}
        onMouseLeave={this.hideTooltip}
        onBlur={this.hideTooltip}
      >
        {this.state.isTooltipVisible &&
          ReactDOM.createPortal(
            <div className={styles.tooltip} style={this.state.tooltipAnchorPos}>
              <h3 className={styles.itemTitle}>{currentItem.name}</h3>
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
                        items[fromId].name
                      )}.tft.png`}
                      width={width}
                      height={height}
                    />
                  ))}
              </div>
            </div>,
            this.tooltipRootEl
          )}
        <img
          src={`${process.env.PUBLIC_URL}/tft/tft_item_${getNormalizedItemName(
            currentItem.name
          )}.tft.png`}
          width={width}
          height={height}
        />
        <span className="VisuallyHidden">{currentItem.name}</span>
      </div>
    );
  }
}

const mapStateToProps = (
  state: AppState,
  connectedItemprops: TFTConnectedItemProps
): TFTItemProps => {
  if (!state.TFT || !state.TFT.items) {
    return {
      ...connectedItemprops,
      isLoading: true
    };
  }
  return {
    ...connectedItemprops,
    isLoading: false,
    items: state.TFT.items,
    itemId: connectedItemprops.itemId
  };
};

// item.from.map(fromId => state.TFT.items[fromId].name)

export const ConnectedTFTItem = connect(mapStateToProps)(TFTItem);
