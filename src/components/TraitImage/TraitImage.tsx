import cx from "classnames";
import React from "react";
import traitIcon from "../../assets/Traits.module.css";
import styles from "./TraitImage.module.css";

interface TraitImageProps {
  readonly traitKey?: string;
  readonly width?: number;
  readonly height?: number;
  readonly className?: string;
  readonly children?: React.ReactNode;
}

export const TraitImage = React.forwardRef<HTMLImageElement, TraitImageProps>(
  ({ traitKey, width = 32, height = 32, className }, ref?) => {
    return (
      <span
        ref={ref}
        className={cx(
          styles.traitImage,
          traitIcon[`trait_icon_${traitKey}`],
          className
        )}
        style={{
          width,
          height
        }}
      />
    );
  }
);
