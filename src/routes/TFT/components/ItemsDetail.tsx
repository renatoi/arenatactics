import React from "react";
import cx from "classnames";
import styles from "./Items.module.css";
import { TFTItem, TFTItems } from "../types";
import { ConnectedTFTItem } from "./Item";
import { getItemDescription } from "./utils";

interface ItemDetailProps {
  readonly selectedItemId?: string;
  readonly selectedItem?: TFTItem;
  readonly items: TFTItems;
}

const ItemsDetail: React.FC<ItemDetailProps> = ({ selectedItem, items }) => {
  let content;
  if (selectedItem == null) {
    content = <h3>Select a item to view details.</h3>;
  } else {
    let derivedItems = [];
    for (let itemId in items.byId) {
      if (items.byId.hasOwnProperty(itemId)) {
        if (items.byId[itemId].from.includes(items.byKey[selectedItem.key])) {
          derivedItems.push(items.byId[itemId]);
        }
      }
    }

    const combinations = derivedItems.length > 0 && (
      <>
        <h3>Combinations:</h3>
        {derivedItems.map(derivedItem => {
          const from = derivedItem.from
            .sort((firstEl, secondEl) =>
              items.byId[firstEl].id === selectedItem.id ? -1 : 1
            )
            .map(fromId => <ConnectedTFTItem itemId={fromId} />);
          return (
            <div className={styles.combinations}>
              {from} = <ConnectedTFTItem itemId={derivedItem.id} />{" "}
              <span className={styles.combinationDescription}>
                {getItemDescription(derivedItem.desc, derivedItem.effects)}
              </span>
            </div>
          );
        })}
      </>
    );

    content = (
      <>
        <h2>{selectedItem.name}</h2>
        {combinations}
      </>
    );
  }

  return <div className={cx(styles.itemsDetail, "Scrollable")}>{content}</div>;
};

export { ItemsDetail };
