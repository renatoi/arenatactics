import React from "react";
import { connect } from "react-redux";
import cx from "classnames";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styles from "./Champions.module.css";
import { TFTChampions, TFTItems } from "../types";
import { AppState } from "../../../types";
import { tftFilterChampions } from "../redux/actions";
import { ChampionsDetail } from "./ChampionsDetail";
import { ChampionList } from "./ChampionsList";

export interface TFTChampionsDispatchProps {
  readonly dispatchFilterChampions: (query: string) => void;
}
export interface TFTChampionsStateProps {
  readonly isLoading: boolean;
  readonly visibleChampions?: string[];
  readonly champions?: TFTChampions;
  readonly items?: TFTItems;
}
interface MatchParams {
  readonly championKey?: string;
}
export interface TFTChampionsOwnProps
  extends RouteComponentProps<MatchParams> {}

export interface TFTChampionsProps
  extends TFTChampionsDispatchProps,
    TFTChampionsStateProps,
    TFTChampionsOwnProps {}

class Champions extends React.Component<TFTChampionsProps> {
  handleFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.dispatchFilterChampions(e.currentTarget.value);
  };

  render() {
    const {
      match,
      champions,
      visibleChampions,
      items,
      history,
      isLoading
    } = this.props;

    const selectedChampionKey = match.params.championKey;
    const selectedChampion =
      selectedChampionKey != null && champions != null
        ? champions.byId[champions.byKey[selectedChampionKey]]
        : undefined;

    if (
      isLoading ||
      champions == null ||
      visibleChampions == null ||
      items == null
    ) {
      return <></>;
    }

    return (
      <div className={cx(styles.container)}>
        <div className={styles.championsAside}>
          <input
            className={styles.championsSearchBox}
            type="text"
            placeholder="Filter"
            onChange={this.handleFilterChange}
          />
          <div className={cx(styles.championsListContainer, "Scrollable")}>
            <ChampionList
              champions={champions}
              selectedChampionKey={selectedChampionKey}
              visibleChampions={visibleChampions}
              path={match.path}
              history={history}
            />
          </div>
        </div>
        <ChampionsDetail
          selectedChampion={selectedChampion}
          selectedChampionId={selectedChampionKey}
        />
      </div>
    );
  }
}

const mapStateToProps = (
  state: AppState,
  ownProps: TFTChampionsOwnProps
): TFTChampionsStateProps => {
  if (!state.TFT || !state.TFT.champions) {
    return {
      ...ownProps,
      isLoading: true
    };
  }
  return {
    ...ownProps,
    isLoading: false,
    visibleChampions: state.TFT.visibleChampions,
    champions: state.TFT.champions,
    items: state.TFT.items
  };
};

const mapDispatchToProps = {
  dispatchFilterChampions: tftFilterChampions
};

export const ConnectedChampions = withRouter(
  connect<
    TFTChampionsStateProps,
    TFTChampionsDispatchProps,
    TFTChampionsOwnProps,
    AppState
  >(
    mapStateToProps,
    mapDispatchToProps
  )(Champions)
);
