import React from "react";
import uuidv4 from "uuid/v4";
import { History } from "history";
import styles from "./Champions.module.css";
import { TFTChampions } from "../types";
import { ChampionListItem } from "./ChampionsListItem";

interface ChampionListProps {
  readonly history: History;
  readonly path: string;
  readonly selectedChampionKey?: string;
  readonly champions: TFTChampions;
  readonly visibleChampions: string[];
}

class ChampionList extends React.Component<ChampionListProps> {
  renderedChampions: string[] = [];

  filterRenderedChampions() {
    const { champions, visibleChampions } = this.props;

    if (champions == null) {
      return;
    }

    this.renderedChampions = Object.keys(champions.byKey)
      .sort()
      .filter(id =>
        Array.isArray(visibleChampions) && visibleChampions.length > 0
          ? visibleChampions.includes(id)
          : true
      );
  }

  handleKeyDown = (e: React.KeyboardEvent) => {
    const { selectedChampionKey, path, history } = this.props;
    if (selectedChampionKey != null) {
      const currentIndex = this.renderedChampions.indexOf(selectedChampionKey);
      let nextIndex: number | undefined;
      if (e.keyCode === 38) {
        nextIndex =
          currentIndex === 0
            ? this.renderedChampions.length - 1
            : currentIndex - 1;
      }
      if (e.keyCode === 40) {
        nextIndex =
          currentIndex === this.renderedChampions.length - 1
            ? 0
            : currentIndex + 1;
      }
      if (nextIndex != null) {
        history.replace(
          path.replace(":championKey", this.renderedChampions[nextIndex])
        );

        e.preventDefault();
      }
    }
  };

  render() {
    const { path, selectedChampionKey, champions } = this.props;
    if (champions == null) {
      return <></>;
    }
    this.filterRenderedChampions();
    return (
      <ul className={styles.championsList} onKeyDown={this.handleKeyDown}>
        {this.renderedChampions &&
          this.renderedChampions.map(championKey => (
            <ChampionListItem
              key={uuidv4()}
              path={path}
              isSelected={selectedChampionKey === championKey}
              championKey={championKey}
              champion={champions.byId[champions.byKey[championKey]]}
            />
          ))}
      </ul>
    );
  }
}

export { ChampionList };
