import React from "react";
import cx from "classnames";
import uuidv4 from "uuid/v4";
import styles from "./Champions.module.css";
import { TFTChampion } from "../types";
import { ConnectedTFTItem } from "./Item";

interface ChampionsDetailProps {
  readonly selectedChampionId?: string;
  readonly selectedChampion?: TFTChampion;
}

const ChampionsDetail: React.FC<ChampionsDetailProps> = ({
  selectedChampionId,
  selectedChampion
}) => {
  let championArtStyle;
  let content;
  if (selectedChampion == null) {
    content = <h3>Select a champion to view details.</h3>;
  } else {
    championArtStyle = {
      background: `linear-gradient(180deg, rgba(33,41,54,0.9) 0%, rgba(33,41,54,1) 75%, rgba(33,41,54,1) 95%),
        url(${
          process.env.PUBLIC_URL
        }/tft/tft_${selectedChampionId}_splash.png) no-repeat`
    };
    content = (
      <>
        <h2>{selectedChampion.name}</h2>
        <h3>Best item sets</h3>
        {selectedChampion.bestSets.map(set => (
          <div key={uuidv4()}>
            <h4>{set.name}</h4>
            <p>{set.description}</p>
            <ul className={styles.setList}>
              {set.items.map(itemId => (
                <li className={styles.setListItem} key={uuidv4()}>
                  {<ConnectedTFTItem itemId={itemId} />}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </>
    );
  }

  return (
    <div
      className={cx(styles.championDetail, "Scrollable")}
      style={championArtStyle}
    >
      {content}
    </div>
  );
};

export { ChampionsDetail };
