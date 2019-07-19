import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import cx from "classnames";
import { tftFilterItems } from "../redux/actions";
import { TFTItems } from "../types";
import { AppState } from "../../../types";
import styles from "./Items.module.css";
import { ItemList } from "./ItemsList";
import { ItemsDetail } from "./ItemsDetail";

export interface TFTItemsDispatchProps {
  readonly dispatchFilterItems: (query: string) => void;
}
export interface TFTItemsStateProps {
  readonly isLoading: boolean;
  readonly visibleItems?: string[];
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
  handleFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.dispatchFilterItems(e.currentTarget.value);
  };

  render() {
    const { match, items, visibleItems, history, isLoading } = this.props;

    const selectedItemKey = match.params.itemKey;

    if (isLoading || items == null || visibleItems == null || items == null) {
      return <></>;
    }

    const selectedItem =
      selectedItemKey != null && items != null
        ? items.byId[items.byKey[selectedItemKey]]
        : undefined;

    return (
      <div className={cx(styles.container)}>
        <div className={styles.itemsAside}>
          <div className={cx(styles.itemsListContainer, "Scrollable")}>
            <ItemList
              items={items}
              selectedItemKey={selectedItemKey}
              visibleItems={visibleItems}
              path={match.path}
              history={history}
            />
          </div>
        </div>
        <ItemsDetail items={items} selectedItem={selectedItem} />
      </div>
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
  return {
    ...ownProps,
    isLoading: false,
    visibleItems: state.TFT.visibleItems,
    items: state.TFT.items
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
