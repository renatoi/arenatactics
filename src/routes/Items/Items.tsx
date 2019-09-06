import cx from "classnames";
import React from "react";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import {
  generatePath,
  RouteComponentProps,
  withRouter
} from "react-router-dom";
import uuidv4 from "uuid/v4";
import { Disclaimer } from "../../components/Disclaimer/Disclaimer";
import { Item } from "../../components/Item/Item";
import { getLocalizedText } from "../../components/LocalizedText/LocalizedText";
import {
  Detail,
  Master,
  MasterDetail,
  MasterGroup,
  MasterHeader,
  MasterHeading,
  MasterItem,
  MasterList,
  MasterSearchBox
} from "../../components/MasterDetail";
import { getItemDescription } from "../../components/utils";
import { itemsSearch } from "../../redux/actions";
import { AppState, TFTItem, TFTItems } from "../../types";
import { getLocale, getObjectByKey } from "../../utils";
import styles from "./Items.module.css";

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

class ItemsComponent extends React.Component<TFTItemsProps> {
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

    const locale = getLocale();

    const selectedItemKey = match.params.itemKey;
    const selectedItem =
      selectedItemKey != null
        ? getObjectByKey<TFTItem>(items, selectedItemKey)
        : undefined;

    const getItemDetails = () => {
      if (selectedItem == null) {
        return (
          <p style={{ minHeight: "80%" }}>
            {getLocalizedText("items.itemSelect")}
          </p>
        );
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
                  {getLocalizedText("items.recipe")}
                </div>
                <div
                  role="columnheader"
                  className={cx(styles.combination, styles.combinationHeading)}
                >
                  {getLocalizedText("items.combination")}
                </div>
              </div>
            </div>
            <div role="rowgroup">
              {combinedItems.map(combinedItem => {
                const from = combinedItem.from
                  .sort(firstEl => {
                    return items.byId[firstEl].id === selectedItem.id ? -1 : 1;
                  })
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
            {selectedItem.from.length === 0 && (
              <p className={styles.itemDesc}>
                {getItemDescription(selectedItem.desc, selectedItem.effects)}
              </p>
            )}
          </header>
          {combinations}
        </>
      );
    };

    const title = selectedItem
      ? `${selectedItem.name} Item Stats and Combinations for Teamfight Tactics`
      : "Item Stats and Combinations for Teamfight Tactics";
    const description = selectedItem
      ? `${selectedItem.name}'s Stats and Combinations for Teamfight Tactics (TFT)`
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
                {getLocalizedText("items.baseItems")}
              </MasterHeading>
            </MasterHeader>
            <MasterList className={styles.masterList}>
              {baseIds.map(baseId => {
                const item = items.byId[baseId];
                return (
                  <MasterItem
                    key={item.key}
                    to={generatePath(match.path, { locale, itemKey: item.key })}
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
                {getLocalizedText("items.combinedItems")}
              </MasterHeading>
              <MasterSearchBox
                value={itemsSearchQuery}
                label={getLocalizedText("items.searchLabel")}
                placeholder={getLocalizedText("items.searchPlaceholder")}
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
                    to={generatePath(match.path, { locale, itemKey: item.key })}
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
  if (state.TFT == null || Object.keys(state.TFT.items.byId).length === 0) {
    return {
      ...ownProps,
      isLoading: true
    };
  }
  const tftState = state.TFT;
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
    tftState.visibleItems.includes(combinedId)
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
  dispatchSearchItems: itemsSearch
};

export const Items = withRouter(
  connect<
    TFTItemsStateProps,
    TFTItemsDispatchProps,
    TFTItemsOwnProps,
    AppState
  >(
    mapStateToProps,
    mapDispatchToProps
  )(ItemsComponent)
);
