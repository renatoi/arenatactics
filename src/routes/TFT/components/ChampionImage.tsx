import React from "react";
import styles from "./Champions.module.css";

interface ChampionImageProps {
  readonly championKey: string;
  readonly width: number;
  readonly height: number;
}
const ChampionImage: React.FC<ChampionImageProps> = ({
  championKey,
  width,
  height
}) => (
  <img
    width={width}
    height={height}
    className={styles.championIcon}
    src={`${process.env.PUBLIC_URL}/tft/tft_${championKey}.png`}
    alt=""
  />
);
export { ChampionImage };
