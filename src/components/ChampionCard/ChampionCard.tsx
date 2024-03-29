import cx from "classnames";
import React from "react";
import { connect } from "react-redux";
import uuidv4 from "uuid/v4";
import { AppState, TFTChampions, TFTItems } from "../../types";
import { Champion } from "../Champion/Champion";
import { Item } from "../Item/Item";
import styles from "./ChampionCard.module.scss";

interface ChampionCardOwnProps {
  readonly championId: string;
  readonly championItems: string[];
  readonly isCarry: boolean;
}
interface ChampionCardStateProps {
  readonly isLoading: boolean;
  readonly champions?: TFTChampions;
  readonly items?: TFTItems;
}
interface ChampionCardProps
  extends ChampionCardOwnProps,
    ChampionCardStateProps {}

const ChampionCardFC: React.FC<ChampionCardProps> = ({
  isLoading,
  champions,
  items,
  championId,
  championItems,
  isCarry
}) => {
  if (isLoading || champions == null || items == null) {
    return <></>;
  }
  const champion = champions.byId[championId];
  return (
    <div
      className={cx(styles.card, {
        [styles.cardCarry]: isCarry
      })}
    >
      <h3 className={styles.cardTitle}>{champion.name}</h3>
      <Champion
        className={styles.championImage}
        width={120}
        height={120}
        championKey={champion.key}
        showItems={false}
      />
      <ul className={styles.items}>
        {championItems &&
          championItems.map(item => (
            <li
              key={uuidv4()}
              className={cx(styles.item, { [styles.itemCarry]: isCarry })}
            >
              <Item
                itemId={item}
                width={40}
                height={40}
                className={styles.itemImage}
              />
              <div className={styles.itemSources}>
                {items.byId[item].from.map(sourceId => (
                  <Item
                    key={uuidv4()}
                    itemId={sourceId}
                    width={20}
                    height={20}
                    className={styles.itemSourceImage}
                  />
                ))}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: ChampionCardOwnProps
): ChampionCardStateProps => {
  if (
    !state.TFT ||
    Object.keys(state.TFT.champions.byId).length === 0 ||
    Object.keys(state.TFT.items.byId).length === 0
  ) {
    return {
      ...ownProps,
      isLoading: true
    };
  }
  return {
    ...ownProps,
    isLoading: false,
    champions: state.TFT.champions,
    items: state.TFT.items
  };
};

export const ChampionCard = connect<
  ChampionCardStateProps,
  {},
  ChampionCardOwnProps,
  AppState
>(mapStateToProps)(ChampionCardFC);
