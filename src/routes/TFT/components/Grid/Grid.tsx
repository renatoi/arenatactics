import React from "react";
import styles from "./Grid.module.css";

const xOffset = 11.5;
const yOffset = 20;

interface PodProps {
  readonly x: number;
  readonly y: number;
}
const Pod: React.FC<PodProps> = ({ x, y }) => {
  return (
    <use
      className={styles.hex}
      xlinkHref="#pod"
      transform={`translate(${xOffset * x * 2 + (!(y % 2) ? xOffset : 0)}, ${y *
        yOffset})`}
    />
  );
};

export const Grid: React.FC = () => {
  const pods = [];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 7; x++) {
      pods.push(<Pod key={`${x},${y}`} x={x} y={y} />);
    }
  }
  return (
    <div className={styles.gridContainer}>
      <div className={styles.gridChampion}>
        <span
          className={styles.gridChampionAvatar}
          style={{
            backgroundImage: `url(${
              process.env.PUBLIC_URL
            }/tft/tft_mordekaiser.png)`
          }}
        />
        <span className="VisuallyHidden">Mordekaiser</span>
      </div>
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
