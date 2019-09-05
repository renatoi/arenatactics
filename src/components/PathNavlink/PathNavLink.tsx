import React from "react";
import { NavLink } from "react-router-dom";
import { getLocale } from "../../utils";

interface MatchParams {
  readonly locale?: string;
}
export interface PathNavLinkComponentProps {
  readonly to: string;
  readonly exact?: boolean;
  readonly className?: string;
  readonly activeClassName?: string;
}

export const PathNavLink: React.FC<PathNavLinkComponentProps> = ({
  to,
  exact,
  ...props
}) => {
  let path = to.replace(/^\/(en-us|pt-br)?\/?/g, `/${getLocale()}/`);
  return (
    <NavLink
      to={path}
      isActive={(match, location) => {
        return exact
          ? location.pathname === to.toString() ||
              new RegExp(`/(en-us|pt-br)${to.toString()}$`).test(
                location.pathname
              )
          : location.pathname.includes(to.toString());
      }}
      {...props}
    />
  );
};
