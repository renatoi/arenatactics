import React from "react";
import { connect } from "react-redux";
import uuidv4 from "uuid/v4";
import cx from "classnames";
import { NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import styles from "./Champions.module.css";
import {
  TFTChampionDictionary,
  TFTChampion,
  TFTItemDictionary
} from "../types";
import { AppState } from "../../../types";
import { tftFilterChampions } from "../redux/actions";
import { History } from "history";
import { render } from "react-dom";

const getPath = (path: string, championId: string): string =>
  path
    .replace(":championId", championId.replace(/'/g, ""))
    .replace(/\s/g, "-")
    .toLocaleLowerCase();

interface ChampionImageProps {
  readonly championId: string;
  readonly width: number;
  readonly height: number;
}
const ChampionImage: React.FC<ChampionImageProps> = ({
  championId,
  width,
  height
}) => (
  <img
    width={width}
    height={height}
    className={styles.championIcon}
    src={`${process.env.PUBLIC_URL}/tft/tft_${championId}.png`}
    alt=""
  />
);

interface ChampionListProps {
  readonly history: History;
  readonly path: string;
  readonly selectedChampionId?: string;
  readonly champions: TFTChampionDictionary;
  readonly visibleChampions: string[];
}
class ChampionList extends React.Component<ChampionListProps> {
  renderedChampions: string[] = [];

  filterRenderedChampions() {
    const { champions, visibleChampions } = this.props;

    if (champions == null) {
      return;
    }

    this.renderedChampions = Object.keys(champions)
      .sort()
      .filter(id =>
        Array.isArray(visibleChampions) && visibleChampions.length > 0
          ? visibleChampions.includes(id)
          : true
      );
  }

  handleKeyDown = (e: React.KeyboardEvent) => {
    const { selectedChampionId, path, history } = this.props;
    if (selectedChampionId != null) {
      const currentIndex = this.renderedChampions.indexOf(selectedChampionId);
      let nextIndex: number | undefined;
      if (e.keyCode === 38) {
        nextIndex =
          currentIndex == 0
            ? this.renderedChampions.length - 1
            : currentIndex - 1;
      }
      if (e.keyCode === 40) {
        nextIndex =
          currentIndex == this.renderedChampions.length - 1
            ? 0
            : currentIndex + 1;
      }
      if (nextIndex != null) {
        history.push(
          path.replace(":championId", this.renderedChampions[nextIndex])
        );

        e.preventDefault();
      }
    }
  };

  render() {
    const {
      path,
      selectedChampionId,
      champions,
      history,
      visibleChampions
    } = this.props;
    if (champions == null) {
      return <></>;
    }
    this.filterRenderedChampions();
    if (selectedChampionId == null) {
      history.push(path.replace(":championId", this.renderedChampions[0]));
    }
    // TODO: figure out a solution for this
    const dontFocus = true;
    return (
      <ul className={styles.championsList} onKeyDown={this.handleKeyDown}>
        {this.renderedChampions &&
          this.renderedChampions.map(championKey => (
            <ChampionListItem
              key={uuidv4()}
              path={path}
              isSelected={selectedChampionId === championKey}
              dontFocus={dontFocus}
              championId={championKey}
              champion={champions[championKey]}
            />
          ))}
      </ul>
    );
  }
}

interface ChampionListItemProps {
  readonly path: string;
  readonly isSelected: boolean;
  readonly dontFocus: boolean;
  readonly championId: string;
  readonly champion: TFTChampion;
}
class ChampionListItem extends React.Component<ChampionListItemProps> {
  linkRef: React.RefObject<HTMLAnchorElement>;

  constructor(props: ChampionListItemProps) {
    super(props);
    this.linkRef = React.createRef();
  }

  componentDidMount() {
    const { isSelected, dontFocus } = this.props;
    if (isSelected && !dontFocus && this.linkRef.current != null) {
      this.linkRef.current.focus();
    }
  }

  render() {
    const { isSelected, path, champion, championId } = this.props;
    return (
      <li className={styles.championsListItem}>
        <NavLink
          innerRef={this.linkRef}
          //tabIndex={isSelected ? 0 : -1}
          className={cx(styles.championLink, {
            [styles.championsLinkSelected]: isSelected
          })}
          to={getPath(path, champion.name)}
        >
          <ChampionImage championId={championId} width={32} height={32} />
          {champion.name}
        </NavLink>
      </li>
    );
  }
}

interface ChampionDetailProps {
  readonly selectedChampionId?: string;
  readonly selectedChampion?: TFTChampion;
  readonly items: TFTItemDictionary;
}

const ChampionDetail: React.FC<ChampionDetailProps> = ({
  selectedChampionId,
  selectedChampion,
  items
}) => {
  let championArtStyle;
  let content;
  if (selectedChampion == null) {
    content = <h3>Select a champion to view details.</h3>;
  } else {
    championArtStyle = {
      background: `linear-gradient(180deg, rgba(33,41,54,0.9) 0%, rgba(33,41,54,1) 75%, rgba(33,41,54,1) 95%),
        url(${
          process.env.PUBLIC_URL
        }/tft/tft_${selectedChampionId}_splash.png) no-repeat`
    };
    content = (
      <>
        <h2>{selectedChampion.name}</h2>
        <h3>Best item sets</h3>
        {selectedChampion.bestSets.map(set => (
          <div key={uuidv4()}>
            <h4>{set.name}</h4>
            <p>{set.description}</p>
            <ul>
              {set.items.map(itemId => (
                <li key={uuidv4()}>{items[itemId].name}</li>
              ))}
            </ul>
          </div>
        ))}
      </>
    );
  }

  return (
    <div
      className={cx(styles.championDetail, "Scrollable")}
      style={championArtStyle}
    >
      {content}
    </div>
  );
};

interface MatchParams {
  readonly championId?: string;
}
export interface TFTChampionsProps extends RouteComponentProps<MatchParams> {
  readonly selectedChampionKey: string;
  readonly visibleChampions: string[];
  readonly champions: TFTChampionDictionary;
  readonly items: TFTItemDictionary;
  readonly isLoading: boolean;
  readonly dispatchFilterChampions: (query: string) => void;
}

class Champions extends React.Component<TFTChampionsProps> {
  handleFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.dispatchFilterChampions(e.currentTarget.value);
  };

  render() {
    const { match, champions, visibleChampions, items, history } = this.props;

    const selectedChampionId = match.params.championId;
    const selectedChampion =
      selectedChampionId != null && champions != null
        ? champions[selectedChampionId]
        : undefined;

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
              selectedChampionId={selectedChampionId}
              visibleChampions={visibleChampions}
              path={match.path}
              history={history}
            />
          </div>
        </div>
        <ChampionDetail
          items={items}
          selectedChampion={selectedChampion}
          selectedChampionId={selectedChampionId}
        />
      </div>
    );
  }
}

const mapDispatchToProps = {
  dispatchFilterChampions: tftFilterChampions
};

const mapStateToProps = (
  state: AppState,
  ownProps: TFTChampionsProps
): TFTChampionsProps => {
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

export const ConnectedChampions = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Champions)
);
