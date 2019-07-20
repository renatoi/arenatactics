import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import cx from "classnames";
import { tftFilterItems } from "../redux/actions";
import { TFTItems, TFTItem } from "../types";
import { AppState } from "../../../types";
import {
  MasterDetail,
  MasterHeader,
  MasterSearchBox,
  MasterItem,
  Master,
  MasterList,
  Detail,
  MasterGroup,
  MasterHeading
} from "../components/MasterDetail";
import styles from "./Items.module.css";
import { getObjectByKey } from "../../../utils";
import { ConnectedTFTItem } from "../components/Item";
import { getItemDescription } from "../components/utils";

export interface TFTItemsDispatchProps {
  readonly dispatchFilterItems: (query: string) => void;
}
export interface TFTItemsStateProps {
  readonly isLoading: boolean;
  readonly baseIds?: string[];
  readonly combinedIds?: string[];
  readonly items?: TFTItems;
}
interface MatchParams {
  readonly itemKey?: string;
}
export interface TFTItemsOwnProps extends RouteComponentProps<MatchParams> {}

export interface TFTItemsProps
  extends TFTItemsDispatchProps,
    TFTItemsStateProps,
    TFTItemsOwnProps {}

class Items extends React.Component<TFTItemsProps> {
  handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.dispatchFilterItems(e.currentTarget.value);
  };

  render() {
    const { match, items, isLoading, baseIds, combinedIds } = this.props;

    if (isLoading || items == null || baseIds == null || combinedIds == null) {
      return <></>;
    }

    const selectedItemKey = match.params.itemKey;
    const selectedItem =
      selectedItemKey != null
        ? getObjectByKey<TFTItem>(items, selectedItemKey)
        : undefined;

    const getItemDetails = () => {
      if (selectedItem == null) {
        return <h3>Select an item to view details.</h3>;
      }

      let combinedItems = [];
      for (let itemId in items.byId) {
        if (items.byId.hasOwnProperty(itemId)) {
          if (items.byId[itemId].from.includes(items.byKey[selectedItem.key])) {
            combinedItems.push(items.byId[itemId]);
          }
        }
      }
      if (combinedItems.length === 0) {
        combinedItems.push(selectedItem);
      }
      const combinations = combinedItems.length > 0 && (
        <>
          <h2>Combinations</h2>
          <div className={styles.combinations} role="table">
            <div role="rolegroup">
              <div role="row" className={styles.combinationRow}>
                <div
                  role="columheader"
                  className={cx(
                    styles.combinationRecipe,
                    styles.combinationHeading
                  )}
                >
                  Recipe
                </div>
                <div
                  role="columheader"
                  className={cx(styles.combination, styles.combinationHeading)}
                >
                  Combination
                </div>
              </div>
            </div>
            <div role="rolegroup">
              {combinedItems.map(combinedItem => {
                const from = combinedItem.from
                  .sort(firstEl =>
                    items.byId[firstEl].id === selectedItem.id ? -1 : 1
                  )
                  .map(fromId => <ConnectedTFTItem itemId={fromId} />);
                return (
                  <div role="row" className={styles.combinationRow}>
                    <div role="cell" className={styles.combinationRecipe}>
                      {from}
                    </div>
                    <div role="cell" className={styles.combination}>
                      <ConnectedTFTItem itemId={combinedItem.id} />
                      <span className={styles.combinationDescription}>
                        {getItemDescription(
                          combinedItem.desc,
                          combinedItem.effects
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      );

      return (
        <>
          <h1>{selectedItem.name}</h1>
          <p>{getItemDescription(selectedItem.desc, selectedItem.effects)}</p>
          {combinations}
        </>
      );
    };

    return (
      <MasterDetail className={styles.masterContainer}>
        <Master className={styles.master}>
          <MasterGroup>
            <MasterHeader>
              <MasterHeading className={styles.itemsHeading}>
                Base items
              </MasterHeading>
            </MasterHeader>
            <MasterList>
              {baseIds.map(baseId => {
                const item = items.byId[baseId];
                return (
                  <MasterItem
                    to={match.path.replace(":itemKey", item.key)}
                    isSelected={item.key === selectedItemKey}
                  >
                    <ConnectedTFTItem itemId={item.id} />
                  </MasterItem>
                );
              })}
            </MasterList>
          </MasterGroup>
          <MasterGroup>
            <MasterHeader>
              <MasterHeading className={styles.itemsHeading}>
                Combined items
              </MasterHeading>
              <MasterSearchBox onSearchChange={this.handleSearchChange} />
            </MasterHeader>
            <MasterList>
              {combinedIds.map(combinedId => {
                const item = items.byId[combinedId];
                return (
                  <MasterItem
                    to={match.path.replace(":itemKey", item.key)}
                    isSelected={item.key === selectedItemKey}
                  >
                    <ConnectedTFTItem itemId={item.id} />
                  </MasterItem>
                );
              })}
            </MasterList>
          </MasterGroup>
        </Master>
        <Detail>{getItemDetails()}</Detail>
      </MasterDetail>
    );
  }
}

const mapStateToProps = (
  state: AppState,
  ownProps: TFTItemsOwnProps
): TFTItemsStateProps => {
  if (!state.TFT || !state.TFT.items) {
    return {
      ...ownProps,
      isLoading: true
    };
  }
  const baseIds = [];
  let combinedIds = [];
  for (const itemId in state.TFT.items.byId) {
    if (state.TFT.items.byId.hasOwnProperty(itemId)) {
      const item = state.TFT.items.byId[itemId];
      if (item.from.length > 0) {
        combinedIds.push(item.id);
      } else {
        baseIds.push(item.id);
      }
    }
  }
  combinedIds = combinedIds.filter(combinedId =>
    state.TFT.visibleItems.includes(combinedId)
  );
  return {
    ...ownProps,
    isLoading: false,
    items: state.TFT.items,
    baseIds,
    combinedIds
  };
};

const mapDispatchToProps = {
  dispatchFilterItems: tftFilterItems
};

export const ConnectedItems = withRouter(
  connect<
    TFTItemsStateProps,
    TFTItemsDispatchProps,
    TFTItemsOwnProps,
    AppState
  >(
    mapStateToProps,
    mapDispatchToProps
  )(Items)
);
