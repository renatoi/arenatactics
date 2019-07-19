import React from "react";
import { History } from "history";
import uuidv4 from "uuid/v4";
import styles from "./Items.module.css";
import { TFTItems } from "../types";
import { ItemListItem } from "./ItemsListItem";

interface ItemListProps {
  readonly history: History;
  readonly path: string;
  readonly selectedItemKey?: string;
  readonly items: TFTItems;
  readonly visibleItems: string[];
}

class ItemList extends React.Component<ItemListProps> {
  renderedItems: string[] = [];

  filterRenderedItems() {
    const { items, visibleItems } = this.props;

    if (items == null) {
      return;
    }

    this.renderedItems = Object.keys(items.byKey)
      .sort()
      .filter(key => {
        if (Array.isArray(visibleItems) && visibleItems.length > 0) {
          return visibleItems.includes(key);
        } else if (items.byId[items.byKey[key]].from.length === 0) {
          return true;
        }
      });
  }

  handleKeyDown = (e: React.KeyboardEvent) => {
    const { selectedItemKey, path, history } = this.props;
    if (selectedItemKey != null) {
      const currentIndex = this.renderedItems.indexOf(selectedItemKey);
      let nextIndex: number | undefined;
      if (e.keyCode === 38) {
        nextIndex =
          currentIndex === 0 ? this.renderedItems.length - 1 : currentIndex - 1;
      }
      if (e.keyCode === 40) {
        nextIndex =
          currentIndex === this.renderedItems.length - 1 ? 0 : currentIndex + 1;
      }
      if (nextIndex != null) {
        history.push(path.replace(":itemId", this.renderedItems[nextIndex]));
        e.preventDefault();
      }
    }
  };

  render() {
    const { path, selectedItemKey, items } = this.props;
    if (items == null) {
      return <></>;
    }
    this.filterRenderedItems();
    const dontFocus = true;
    return (
      <ul className={styles.itemsList} onKeyDown={this.handleKeyDown}>
        {this.renderedItems &&
          this.renderedItems.map(itemKey => (
            <ItemListItem
              key={uuidv4()}
              path={path}
              isSelected={selectedItemKey === itemKey}
              dontFocus={dontFocus}
              itemId={items.byKey[itemKey]}
              item={items.byId[items.byKey[itemKey]]}
            />
          ))}
      </ul>
    );
  }
}

export { ItemList };
