import React from "react";

export const Icon: React.FC = ({ children }) => {
  return (
    <i className="material-icons" aria-hidden={true}>
      {children}
    </i>
  );
};
