import React from "react";
import { getNormalizedItemName } from "../utils";

type ImgProps = JSX.IntrinsicElements["img"];
interface TraitImageProps extends ImgProps {
  readonly name: string;
}
export const TraitImage = React.forwardRef<HTMLImageElement, TraitImageProps>(
  ({ name, ...rest }, ref?) => (
    <img
      ref={ref}
      src={`${process.env.PUBLIC_URL}/tft/trait_icon_${getNormalizedItemName(
        name
      )}.png`}
      aria-hidden="true"
      alt=""
      {...rest}
    />
  )
);
