import React from "react";

interface ChampionImageProps {
  readonly championKey: string;
  readonly width?: number;
  readonly height?: number;
  readonly className?: string;
}
const ChampionImage: React.FC<ChampionImageProps> = ({
  championKey,
  width = 64,
  height = 64,
  className
}) => (
  <img
    width={width}
    height={height}
    className={className}
    src={`${process.env.PUBLIC_URL}/tft/tft_${championKey}.png`}
    alt=""
  />
);
export { ChampionImage };
