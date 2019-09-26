import cx from "classnames";
import React from "react";
import itemStyles from "../../assets/Items.module.css";
import { getNormalizedName } from "../utils";
import styles from "./ItemImage.module.css";

type ImgProps = JSX.IntrinsicElements["img"];
interface ItemImageProps extends ImgProps {
  readonly itemKey: string;
  readonly width?: number;
  readonly height?: number;
  readonly className?: string;
}
export const ItemImage = React.forwardRef<HTMLImageElement, ItemImageProps>(
  ({ itemKey, className, width = 64, height = 64, ...rest }, ref?) => (
    <span
      ref={ref}
      className={cx(
        styles.itemImage,
        itemStyles[`tft_item_${getNormalizedName(itemKey)}`],
        className
      )}
      style={{
        width,
        height
      }}
      {...rest}
    />
  )
);
