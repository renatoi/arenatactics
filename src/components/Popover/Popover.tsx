import React from "react";
import uuidv4 from "uuid/v4";
import styles from "./Popover.module.scss";
import ReactDOM from "react-dom";
import PopperJS, { Placement } from "popper.js";
import { GlobalMousePos } from "../../globals";

const portalRootId = "popovers-root";
let portalRoot = document.getElementById(portalRootId);
if (portalRoot == null) {
  portalRoot = document.createElement("div");
  portalRoot.id = portalRootId;
  document.body.appendChild(portalRoot);
}

export enum PopoverEvents {
  MouseOver,
  Click
}

export interface PopoverProps {
  readonly isOpen?: boolean;
  readonly children: React.ReactElement<HTMLButtonElement>;
  readonly placement: Placement;
  readonly content: React.ReactNode | (() => React.ReactNode);
  readonly eventType?: PopoverEvents;
  readonly onOpen?: () => void;
  readonly onClose?: () => void;
  readonly onClick?: () => void;
  readonly onMouseLeave?: (isMouseOverPopover: boolean) => void;
}

export interface PopoverState {
  isOpen: boolean;
}

export class Popover extends React.PureComponent<PopoverProps, PopoverState> {
  private anchorRef = React.createRef<HTMLButtonElement>();
  private popoverRef = React.createRef<HTMLDivElement>();
  private popoverId = uuidv4();
  private leaveTimer: number = 0;
  private enterTimer: number = 0;
  private isControlled = this.props.isOpen !== undefined;

  public state = {
    isOpen: false
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleDocumentClick, false);
    document.addEventListener<"keyup">(
      "keyup",
      this.handleDocumentKeyUp,
      false
    );
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleDocumentClick, false);
    document.removeEventListener<"keyup">(
      "keyup",
      this.handleDocumentKeyUp,
      false
    );
    clearTimeout(this.leaveTimer);
    clearTimeout(this.enterTimer);
  }

  componentDidUpdate(prevProps: PopoverProps, prevState: PopoverState) {
    const { isOpen: isOpenProp, placement } = this.props;
    const { isOpen: isOpenState } = this.state;
    const anchorEl = this.anchorRef.current;
    const popoverEl = this.popoverRef.current;
    const isControlled = this.isControlled;
    if (
      (isControlled && prevProps.isOpen !== isOpenProp) ||
      (!isControlled && prevState.isOpen !== isOpenState)
    ) {
      clearTimeout(this.leaveTimer);
      if (this.getIsOpen() && anchorEl != null && popoverEl != null) {
        new PopperJS(anchorEl, popoverEl, {
          placement,
          modifiers: {
            preventOverflow: {
              boundariesElement: "window"
            }
          }
        });
        popoverEl.focus();
      }
    }
  }

  getIsOpen() {
    return this.isControlled ? this.props.isOpen : this.state.isOpen;
  }

  private handleDocumentClick = (event: Event) => {
    if (
      (this.anchorRef.current != null &&
        this.anchorRef.current.contains(event.target as Node)) ||
      (portalRoot && portalRoot.contains(event.target as Node))
    ) {
      return;
    }
    this.closePopover();
  };

  private handleDocumentKeyUp = (event: KeyboardEvent) => {
    // Escape key
    if (event.keyCode === 27) {
      this.closePopover();
    }
  };

  private handleMouseOver = (event: React.MouseEvent) => {
    this.enterTimer = window.setTimeout(this.openPopover, 150);
  };

  private handlePopoverMouseLeave = (event: React.MouseEvent) => {
    const anchorElement = this.anchorRef.current;
    if (anchorElement == null) {
      return;
    }
    const mouseoverElement = document.elementFromPoint(
      GlobalMousePos.mouseX,
      GlobalMousePos.mouseY
    );
    const isMouseOverAnchor = anchorElement.contains(mouseoverElement);
    if (!isMouseOverAnchor) {
      this.closePopover();
    }
  };

  private handleMouseLeave = (event: React.MouseEvent) => {
    const { onMouseLeave } = this.props;
    this.leaveTimer = window.setTimeout(() => {
      if (this.popoverRef.current == null) {
        return;
      }
      clearTimeout(this.enterTimer);
      // we use this because if we get coords or element from the event,
      // it will be the data from before the event was fired.
      const mouseoverElement = document.elementFromPoint(
        GlobalMousePos.mouseX,
        GlobalMousePos.mouseY
      );
      const popoverElement = this.popoverRef.current;
      const isMouseOverPopover = popoverElement.contains(mouseoverElement);
      if (typeof onMouseLeave === "function") {
        onMouseLeave(isMouseOverPopover);
      }
      if (!isMouseOverPopover) {
        this.closePopover();
      }
    }, 125);
  };

  private handleCLick = () => {
    const { onClick } = this.props;
    if (typeof onClick === "function") {
      onClick();
    }
    if (this.state.isOpen) {
      this.closePopover();
    } else {
      this.openPopover();
    }
  };

  private openPopover = () => {
    const { onOpen } = this.props;
    if (typeof onOpen === "function") {
      onOpen();
    }
    if (!this.isControlled) {
      this.setState({ isOpen: true });
    }
  };

  private closePopover = () => {
    const { onClose } = this.props;
    if (typeof onClose === "function") {
      onClose();
    }
    if (!this.isControlled) {
      this.setState({ isOpen: false });
    }
  };

  render() {
    const { children, content, eventType = PopoverEvents.Click } = this.props;

    const isOpen = this.getIsOpen();

    const childrenProps = {
      ...children.props,
      ref: this.anchorRef,
      onClick: this.handleCLick,
      "aria-expanded": isOpen,
      "aria-controls": isOpen ? this.popoverId : undefined
    };

    // handle mouseover
    if (eventType === PopoverEvents.MouseOver) {
      childrenProps.onMouseOver = this.handleMouseOver;
      childrenProps.onMouseLeave = this.handleMouseLeave;
    }

    if (portalRoot == null) {
      return { children };
    }

    return (
      <>
        {React.cloneElement(children, childrenProps)}
        {isOpen &&
          ReactDOM.createPortal(
            <div
              id={this.popoverId}
              ref={this.popoverRef}
              className={styles.popover}
              tabIndex={-1}
              onMouseLeave={this.handlePopoverMouseLeave}
            >
              {typeof content === "function" ? content() : content}
            </div>,
            portalRoot
          )}
      </>
    );
  }
}
