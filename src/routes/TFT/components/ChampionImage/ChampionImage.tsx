import React from "react";
import { RenderAttributes } from "slate-react";

interface ChampionImageProps {
  readonly championKey?: string;
  readonly width?: number;
  readonly height?: number;
  readonly className?: string;
  readonly attributes?: RenderAttributes;
  readonly children?: React.ReactNode;
}

export const ChampionImage = React.forwardRef<
  HTMLImageElement,
  ChampionImageProps
>(({ championKey, width = 64, height = 64, className, attributes }, ref?) => {
  return (
    <img
      ref={ref}
      {...attributes}
      width={width}
      height={height}
      className={className}
      src={`${process.env.PUBLIC_URL}/tft/tft_${championKey}.png`}
      alt=""
    />
  );
});
