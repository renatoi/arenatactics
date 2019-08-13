import React from "react";
import cx from "classnames";
import styles from "./Grid.module.css";
import { ChampionImage } from "../ChampionImage/ChampionImage";
import { TFTBuildPositioning, TFTChampions } from "../../types";
import { Popover } from "../../../../components/Popover/Popover";

const xOffset = 11.5;
const yOffset = 20;

const topOffset = 30;
const avatarSize = 64;

const leftInitialOffsetRow2 = 17;
const leftInitialOffsetOtherRows = 70;
const leftOffset = 105;

interface PodProps {
  readonly x: number;
  readonly y: number;
  readonly popoverContent?: (x: number, y: number) => React.ReactNode;
}
const Pod: React.FC<PodProps> = ({ x, y, popoverContent }) => {
  const useElement = (
    <use
      className={cx(styles.hex, { [styles.clickable]: popoverContent != null })}
      xlinkHref="#pod"
      transform={`translate(${xOffset * x * 2 + (!(y % 2) ? xOffset : 0)}, ${y *
        yOffset})`}
    />
  );
  if (popoverContent != null) {
    return (
      <Popover
        key={`${x},${y}`}
        content={() => popoverContent(y + 1, x + 1)}
        placement="auto"
      >
        {useElement}
      </Popover>
    );
  } else {
    return useElement;
  }
};

export interface GridProps {
  readonly positions: TFTBuildPositioning;
  readonly champions: TFTChampions;
  readonly popoverContent?: (x: number, y: number) => React.ReactNode;
}
export const Grid: React.FC<GridProps> = ({
  positions,
  champions,
  popoverContent
}) => {
  const pods = [];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 7; x++) {
      pods.push(
        <Pod key={`${x},${y}`} x={x} y={y} popoverContent={popoverContent} />
      );
    }
  }
  return (
    <div className={styles.gridContainer}>
      {Object.keys(positions).map(position => {
        const pos = position.split(",");
        const row = parseInt(pos[0]);
        const column = parseInt(pos[1]);
        const champion = champions.byId[positions[position]];
        let top = (row - 1) * avatarSize + row * topOffset;
        if (row === 1) {
          top += 3;
        }
        if (row === 3) {
          top -= 2;
        }
        let left = 0;
        if (row !== 2) {
          left += leftInitialOffsetOtherRows;
        } else {
          left += leftInitialOffsetRow2;
        }
        left += 1;

        left += (column - 1) * leftOffset;

        return (
          <div
            key={position}
            className={styles.gridChampion}
            style={{
              top,
              left
            }}
          >
            <ChampionImage
              className={styles.gridChampionAvatar}
              championKey={champion.key}
            />
            <span className="VisuallyHidden">{champion.name}</span>
          </div>
        );
      })}
      <svg viewBox="0 0 140 55" className={styles.svg}>
        <defs>
          <g id="pod">
            <polygon points="11 1.5 21.8 7.8 21.8 20.3 11 26.5 0.2 20.3 0.2 7.8" />
          </g>
        </defs>
        <g className={styles.hexGroup}>{pods}</g>
      </svg>
    </div>
  );
};
