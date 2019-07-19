import React from "react";
import { NavLink } from "react-router-dom";
import cx from "classnames";
import styles from "./Items.module.css";
import { TFTItem } from "../types";
import { ConnectedTFTItem } from "./Item";
import { getPath } from "./utils";

interface ItemListItemProps {
  readonly path: string;
  readonly isSelected: boolean;
  readonly dontFocus: boolean;
  readonly itemId: string;
  readonly item: TFTItem;
}
class ItemListItem extends React.Component<ItemListItemProps> {
  linkRef: React.RefObject<HTMLAnchorElement>;

  constructor(props: ItemListItemProps) {
    super(props);
    this.linkRef = React.createRef();
  }

  componentDidMount() {
    const { isSelected, dontFocus } = this.props;
    if (isSelected && !dontFocus && this.linkRef.current != null) {
      this.linkRef.current.focus();
    }
  }

  render() {
    const { isSelected, path, item, itemId } = this.props;
    if (item == null) {
      return <></>;
    }
    return (
      <li className={styles.itemsListItem}>
        <NavLink
          innerRef={this.linkRef}
          className={cx(styles.itemLink, {
            [styles.itemsLinkSelected]: isSelected
          })}
          to={getPath(path, ":itemKey", item.name)}
        >
          <ConnectedTFTItem itemId={itemId} width={32} height={32} />
          {item.name}
        </NavLink>
      </li>
    );
  }
}

export { ItemListItem };
