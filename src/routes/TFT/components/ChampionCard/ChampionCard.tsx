import React from "react";
import cx from "classnames";
import uuidv4 from "uuid/v4";
import styles from "./ChampionCard.module.scss";
import { AppState } from "../../../../types";
import { TFTChampions, TFTItems } from "../../types";
import { connect } from "react-redux";
import { ChampionImage } from "../ChampionImage/ChampionImage";
import { Item } from "../Item/Item";

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
      <ChampionImage
        className={styles.championImage}
        width={120}
        height={120}
        championKey={champion.key}
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
  if (!state.TFT || !state.TFT.champions || !state.TFT.items) {
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
