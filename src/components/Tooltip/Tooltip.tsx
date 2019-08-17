import React from "react";
import warning from "warning";
import ReactDOM from "react-dom";
import styles from "./Tooltip.module.scss";
import PopperJS from "popper.js";
import cx from "classnames";

const portalRoot = document.body;

export interface TooltipProps {
  readonly children: React.ReactElement;
  readonly title: React.ReactNode | (() => React.ReactNode);
  readonly isOpen?: boolean;
  readonly tooltipRootId?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  title,
  isOpen: isOpenProp
}) => {
  // refs: a ref is a mutable object that persists between renders
  const anchorRef = React.useRef<Element>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const thisId = React.useRef<string>();
  const { current: isControlled } = React.useRef(isOpenProp != null);

  // state
  const [, forceUpdate] = React.useState(false);
  const [isOpenState, setIsOpenState] = React.useState(false);
  const [placement, setPlacement] = React.useState<string>();

  // flag isOpen: tells if it's open either from prop (if passed) or from internal state (when not passed)
  let isOpen = isControlled ? isOpenProp : isOpenState;

  React.useEffect(() => {
    if (isOpen && anchorRef.current != null && tooltipRef.current != null) {
      const handlePopperCreate = (data: PopperJS.Data) => {
        setPlacement(data.placement);
      };
      new PopperJS(anchorRef.current, tooltipRef.current, {
        modifiers: {
          preventOverflow: {
            boundariesElement: "window"
          }
        },
        onCreate: handlePopperCreate
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!thisId.current) {
      thisId.current = `tooltip-${Math.round(Math.random() * 1e5)}`;
    }
    if (isOpenProp) {
      forceUpdate(n => !n);
    }
  }, [isOpenProp]);

  if (children == null) {
    warning(false, "Missing children for Tooltip!");
    return <></>;
  }

  const showTooltip = (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.FocusEvent<HTMLDivElement>
  ) => {
    if (!isControlled && !isOpenState) {
      setIsOpenState(true);
    }
  };

  const hideTooltip = (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.FocusEvent<HTMLDivElement>
  ) => {
    if (!isControlled) {
      setIsOpenState(false);
    }
  };

  const childrenProps = {
    ...children.props,
    "aria-describedby": isOpen ? thisId.current : null,
    onMouseOver: showTooltip,
    onFocus: showTooltip,
    onMouseLeave: hideTooltip,
    onBlur: hideTooltip
  };

  return (
    <>
      {React.cloneElement(children, { ref: anchorRef, ...childrenProps })}
      {isOpen &&
        ReactDOM.createPortal(
          <div
            id={thisId.current}
            ref={tooltipRef}
            className={cx(styles.tooltip, placement)}
          >
            {typeof title === "function" ? title() : title}
          </div>,
          portalRoot
        )}
    </>
  );
};
