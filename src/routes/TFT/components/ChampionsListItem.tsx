import React from "react";
import cx from "classnames";
import styles from "./Champions.module.css";
import { TFTChampion } from "../types";
import { NavLink } from "react-router-dom";
import { ChampionImage } from "./ChampionImage";
import { getPath } from "./utils";

interface ChampionListItemProps {
  readonly path: string;
  readonly isSelected: boolean;
  readonly championKey: string;
  readonly champion?: TFTChampion;
}
class ChampionListItem extends React.Component<ChampionListItemProps> {
  linkRef: React.RefObject<HTMLAnchorElement>;

  constructor(props: ChampionListItemProps) {
    super(props);
    this.linkRef = React.createRef();
  }

  componentDidMount() {
    const { isSelected } = this.props;
    if (isSelected && this.linkRef.current != null) {
      this.linkRef.current.focus();
    }
  }

  render() {
    const { isSelected, path, champion, championKey } = this.props;
    if (champion == null) {
      return <></>;
    }
    return (
      <li className={styles.championsListItem}>
        <NavLink
          innerRef={this.linkRef}
          className={cx(styles.championLink, {
            [styles.championsLinkSelected]: isSelected
          })}
          to={getPath(path, ":championKey", champion.name)}
        >
          <ChampionImage championKey={championKey} width={32} height={32} />
          {champion.name}
        </NavLink>
      </li>
    );
  }
}

export { ChampionListItem };
