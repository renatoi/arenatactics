import React from "react";

export type Icons =
  | "h1"
  | "h2"
  | "delete_forever"
  | "supervised_user_circle"
  | "copy"
  | "download-active"
  | "upload"
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
