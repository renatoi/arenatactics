import React from "react";
import { getNormalizedName } from "../utils";

type ImgProps = JSX.IntrinsicElements["img"];
interface ItemImageProps extends ImgProps {
  readonly name: string;
}
export const ItemImage = React.forwardRef<HTMLImageElement, ItemImageProps>(
  ({ name, ...rest }, ref?) => (
    <img
      ref={ref}
      src={`${process.env.PUBLIC_URL}/tft/tft_item_${getNormalizedName(
        name
      )}.tft.png`}
      aria-hidden="true"
      alt=""
      {...rest}
    />
  )
);
