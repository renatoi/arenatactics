import cx from "classnames";
import React from "react";
import championIcon from "../../assets/Champions.module.css";
import styles from "./ChampionImage.module.css";

interface ChampionImageProps {
  readonly championKey?: string;
  readonly width?: number;
  readonly height?: number;
  readonly className?: string;
  readonly children?: React.ReactNode;
}

export const ChampionImage = React.forwardRef<
  HTMLImageElement,
  ChampionImageProps
>(({ championKey, width = 64, height = 64, className }, ref?) => {
  return (
    <div
      ref={ref}
      className={cx(
        styles.championImage,
        championIcon[`tft_${championKey}`],
        className
      )}
      style={{
        width,
        height
      }}
    />
  );
});
