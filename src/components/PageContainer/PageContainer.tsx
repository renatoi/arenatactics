import cx from "classnames";
import React from "react";
import styles from "./PageContainer.module.css";

const PageContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <main className={cx(styles.container, "Scrollable", className)} {...rest}>
    {children}
  </main>
);

export { PageContainer };
