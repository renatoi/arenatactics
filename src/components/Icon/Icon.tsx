import React from "react";

export type Icons =
  | "h1"
  | "h2"
  | "download-active"
  | "download-all"
  | "quotes-left"
  | "search"
  | "bin"
  | "shield"
  | "list-numbered"
  | "list"
  | "frustrated"
  | "plus"
  | "cancel-circle"
  | "cross"
  | "bold"
  | "italic"
  | "code";

export interface IconProps {
  readonly type: Icons;
}
export const Icon: React.FC<IconProps> = ({ type, children }) => {
  return (
    <i className={`icon-${type}`} aria-hidden={true}>
      <span className="VisuallyHidden">{children}</span>
    </i>
  );
};
