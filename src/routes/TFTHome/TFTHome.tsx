import React from "react";
import styles from "./TFTHome.module.css";

const TFTHome: React.FC = () => {
  return (
    <div id="lipsum" className="PageContainer">
      <h2>Lorem Ipsum</h2>
      <p>
        Morgana fires chains to nearby enemies, dealing damage and stunning
        after a short delay if they are still nearby.
      </p>
      <p>
        Attacks from Demons have a chance to burn all of an enemy's mana and
        deal that much true damage.
      </p>
    </div>
  );
};

export { TFTHome };
