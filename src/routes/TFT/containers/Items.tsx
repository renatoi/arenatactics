import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import cx from "classnames";
import ReactGA from "react-ga";
import uuidv4 from "uuid/v4";
import { searchItems } from "../redux/actions";
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
import { Item } from "../components/Item/Item";
import { getItemDescription } from "../components/utils";
import { Helmet } from "react-helmet";
import { Disclaimer } from "../components/Disclaimer/Disclaimer";

export interface TFTItemsDispatchProps {
  readonly dispatchSearchItems: (query: string) => void;
}
export interface TFTItemsStateProps {
  readonly isLoading: boolean;
  readonly itemsSearchQuery?: string;
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
    this.props.dispatchSearchItems(e.currentTarget.value);
  };

  handleClearSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.props.dispatchSearchItems("");
  };

  render() {
    const {
      match,
      items,
      isLoading,
      baseIds,
      combinedIds,
      itemsSearchQuery
    } = this.props;

    ReactGA.pageview(match.url);

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
        return <h1>Select an item to view details.</h1>;
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
          <div className={styles.combinations} role="table">
            <div role="rowgroup">
              <div role="row" className={styles.combinationRow}>
                <div
                  role="columnheader"
                  className={cx(
                    styles.combinationRecipe,
                    styles.combinationHeading
                  )}
                >
                  Recipe
                </div>
                <div
                  role="columnheader"
                  className={cx(styles.combination, styles.combinationHeading)}
                >
                  Combination
                </div>
              </div>
            </div>
            <div role="rowgroup">
              {combinedItems.map(combinedItem => {
                const from = combinedItem.from
                  .sort(firstEl =>
                    items.byId[firstEl].id === selectedItem.id ? -1 : 1
                  )
                  .map(fromId => <Item key={uuidv4()} itemId={fromId} />);
                return (
                  <div
                    key={uuidv4()}
                    role="row"
                    className={styles.combinationRow}
                  >
                    <div role="cell" className={styles.combinationRecipe}>
                      {from}
                    </div>
                    <div role="cell" className={styles.combination}>
                      <Item itemId={combinedItem.id} />
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
          <header className={styles.itemHeader}>
            <h1 className={styles.itemTitle}>{selectedItem.name}</h1>
            <p className={styles.itemDesc}>
              {getItemDescription(selectedItem.desc, selectedItem.effects)}
            </p>
          </header>
          {combinations}
        </>
      );
    };

    const title = selectedItem
      ? `${
          selectedItem.name
        } Item Stats and Combinations for Teamfight Tactics | Kobogi`
      : "Item Stats and Combinations for Teamfight Tactics | Kobogi";
    const description = selectedItem
      ? `${
          selectedItem.name
        }'s Stats and Combinations for Teamfight Tactics (TFT)`
      : "Items stats and combinations for Teamfight Tactics (TFT)";

    return (
      <MasterDetail className={styles.masterContainer}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>
        <Master className={styles.master}>
          <MasterGroup>
            <MasterHeader>
              <MasterHeading className={styles.itemsHeading}>
                Base items
              </MasterHeading>
            </MasterHeader>
            <MasterList className={styles.masterList}>
              {baseIds.map(baseId => {
                const item = items.byId[baseId];
                return (
                  <MasterItem
                    key={item.key}
                    to={match.path.replace(":itemKey", item.key)}
                    isSelected={item.key === selectedItemKey}
                  >
                    <Item itemId={item.id} />
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
              <MasterSearchBox
                value={itemsSearchQuery}
                label="Search combined items"
                placeholder="Search"
                onSearchChange={this.handleSearchChange}
                onClearSearch={this.handleClearSearch}
              />
            </MasterHeader>
            <MasterList className={styles.masterList}>
              {combinedIds.map(combinedId => {
                const item = items.byId[combinedId];
                return (
                  <MasterItem
                    key={item.key}
                    to={match.path.replace(":itemKey", item.key)}
                    isSelected={item.key === selectedItemKey}
                  >
                    <Item itemId={item.id} />
                  </MasterItem>
                );
              })}
            </MasterList>
          </MasterGroup>
        </Master>
        <Detail className={styles.itemDetails}>
          {getItemDetails()}
          <Disclaimer />
        </Detail>
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
    combinedIds,
    itemsSearchQuery: state.TFT.itemsSearchQuery
  };
};

const mapDispatchToProps = {
  dispatchSearchItems: searchItems
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
