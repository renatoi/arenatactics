import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { getLocale } from "../../utils";

export const PathNavLink = ({ to, exact, ...props }: NavLinkProps) => {
  const toWithLocale = `${to}?hl=${getLocale()}`;
  return (
    <NavLink
      to={toWithLocale}
      isActive={(match, location) => {
        return exact
          ? location.pathname === to.toString()
          : location.pathname.includes(to.toString());
      }}
      {...props}
    />
  );
};
