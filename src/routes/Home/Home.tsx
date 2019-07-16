import React from "react";
import styles from "./Home.module.css";
import cx from "classnames";

const Home: React.FC = () => {
  return (
    <div className={cx(styles.homne, "PageContainer")}>
      <h2>Home</h2>
      <p>
        Kobogi is a new gamer community. Our vision is to create one of the best
        video gaming communities of the internet. To do this, we will help our
        community grow with the best guides and discussions for video games.
      </p>
      <p>
        Join us and help create one of the best video game communities of the
        world!
      </p>
    </div>
  );
};

export { Home };
