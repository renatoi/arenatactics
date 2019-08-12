import React, { ChangeEvent } from "react";
import uuidv4 from "uuid/v4";
import styles from "./CreateBuild.module.scss";
import { PageContainer } from "../../../components/PageContainer/PageContainer";
import Helmet from "react-helmet";
import {
  TFTChampions,
  TFTItems,
  TFTBuild,
  TFTBuildComposition
} from "../types";
import { AppState } from "../../../types";
import { connect } from "react-redux";
import produce from "immer";
import cx from "classnames";
import { RichEditor } from "../components/RichEditor/RichEditor";
import { Value } from "slate";
import { ChampionImage } from "../components/ChampionImage/ChampionImage";
import { Popover } from "../../../components/Popover/Popover";
import { ItemImage } from "../components/ItemImage/ItemImage";

interface CreateBuildOwnProps {}
interface CreateBuildStateProps {
  readonly isLoading: boolean;
  readonly champions?: TFTChampions;
  readonly items?: TFTItems;
}
interface CreateBuildDispatchProps {}
interface CreateBuildProps
  extends CreateBuildOwnProps,
    CreateBuildStateProps,
    CreateBuildDispatchProps {}

interface CreateBuildState extends TFTBuild {
  readonly editorValue: string;
}
class CreateBuild extends React.Component<CreateBuildProps, CreateBuildState> {
  state: CreateBuildState = {
    id: "",
    key: "",
    name: "",
    tier: "",
    author: "",
    lang: "",
    composition: [],
    positioning: {},
    guide: "",
    editorValue: ""
  };

  handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.target.value });
  };

  handleAuthorChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ author: e.target.value });
  };

  handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ lang: e.target.value });
  };

  handleEditorChange = (value: Value) => {
    this.setState({
      editorValue: JSON.stringify(value.toJSON())
    });
  };

  getJSON = () => {
    const json = produce<CreateBuildState>(this.state, draft => {
      draft.guide = draft.editorValue;
      delete draft.editorValue;
      delete draft.id;
      delete draft.key;
    });
    return JSON.stringify(json, null, 2);
  };

  handleChampionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const championId = e.currentTarget.dataset.champion || "";
    if (
      this.state.composition.some(
        championInfo => championInfo.champion === championId
      )
    ) {
      this.setState(prevState => ({
        composition: prevState.composition.filter(
          championInfo => championInfo.champion !== championId
        )
      }));
      return;
    }

    if (this.state.composition.length === 9) {
      return;
    }
    const championInfo: TFTBuildComposition = {
      champion: championId,
      items: ["-1", "-1", "-1"],
      isCarry: false
    };
    this.setState(prevState => ({
      composition: [...prevState.composition, championInfo]
    }));
  };

  handleIsCarryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentTarget = e.currentTarget;
    const championId = currentTarget.dataset.champion;
    this.setState(prevState => ({
      composition: prevState.composition.map(championInfo => {
        if (championInfo.champion !== championId) {
          return championInfo;
        }
        return {
          ...championInfo,
          isCarry: currentTarget.checked
        };
      })
    }));
  };

  renderComposition() {
    const { champions } = this.props;
    if (champions == null) {
      return <></>;
    }
    return (
      <div className={styles.composition}>
        {Object.keys(champions.byKey)
          .sort()
          .map(championKey => {
            const championId = champions.byKey[championKey];
            const isChampionSelected = this.state.composition.some(
              championInfo => championInfo.champion === championId
            );
            return (
              <button
                key={championId}
                type="button"
                className={cx(styles.championButton, {
                  [styles.championButtonSelected]: isChampionSelected
                })}
                onClick={this.handleChampionClick}
                data-champion={championId}
              >
                <ChampionImage
                  championKey={championKey}
                  className={styles.championImage}
                />
                <span className={styles.championName}>
                  {champions.byId[champions.byKey[championKey]].name}
                </span>
              </button>
            );
          })}
      </div>
    );
  }

  handleItemClick = (championId: string, itemId: string, slotIndex: number) => {
    this.setState(prevState => ({
      composition: prevState.composition.map(championInfo => {
        if (championInfo.champion !== championId) {
          return championInfo;
        }
        return {
          ...championInfo,
          items: championInfo.items.map((item, index) =>
            index === slotIndex ? itemId : item
          )
        };
      })
    }));
  };

  itemsPopover = (championId: string, slotIndex: number) => {
    const { items } = this.props;
    if (items == null) {
      return <></>;
    }
    const listItems = [];
    for (let itemId in items.byId) {
      if (items.byId.hasOwnProperty(itemId)) {
        const item = items.byId[itemId];
        if (item.from.length > 0) {
          listItems.push(
            <button
              type="button"
              className={styles.itemSelectButton}
              key={uuidv4()}
              onClick={() =>
                this.handleItemClick(championId, itemId, slotIndex)
              }
            >
              <ItemImage name={item.name} width={32} height={32} />
            </button>
          );
        }
      }
    }
    return <div className={styles.itemsSelectList}>{listItems}</div>;
  };

  renderChampionsInfo() {
    const { champions, items } = this.props;
    if (champions == null || items == null) {
      return <></>;
    }
    return (
      <div className={styles.championsInfo}>
        {this.state.composition.map(championInfo => {
          const champion = champions.byId[championInfo.champion];
          const isCarryId = `isCarry-${champion.id}`;
          return (
            <fieldset key={champion.id} className={styles.championInfo}>
              <legend>{champion.name}</legend>
              <div>
                <label htmlFor={isCarryId}>Is Carry?</label>
                <input
                  id={isCarryId}
                  type="checkbox"
                  data-champion={champion.id}
                  onChange={this.handleIsCarryChange}
                />
              </div>
              <div className={styles.championItems}>
                {championInfo.items.map((item, index) => (
                  <Popover
                    key={uuidv4()}
                    placement="bottom-start"
                    content={() =>
                      this.itemsPopover(championInfo.champion, index)
                    }
                  >
                    <button type="button" className={styles.itemButton}>
                      {item !== "-1" ? (
                        <ItemImage
                          name={items.byId[item].name}
                          width={32}
                          height={32}
                        />
                      ) : (
                        ""
                      )}
                    </button>
                  </Popover>
                ))}
              </div>
            </fieldset>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <PageContainer>
        <Helmet>
          <title>Create builds for Teamfight Tactics</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <h1>Create build</h1>
        <h2>Build info</h2>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="lang">
            Language:
          </label>
          <select
            id="lang"
            name="lang"
            className={styles.fieldSelect}
            onChange={this.handleLangChange}
          >
            <option value="" />
            <option value="pt-br">Português - Brasil</option>
            <option value="en-us">English - US</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="name">
            Name:
          </label>
          <input
            className={styles.fieldTextInput}
            id="name"
            name="name"
            type="text"
            onChange={this.handleNameChange}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="author">
            Author:
          </label>
          <input
            className={styles.fieldTextInput}
            id="author"
            name="author"
            type="text"
            onChange={this.handleAuthorChange}
          />
        </div>
        <h2>Composition:</h2>
        {this.renderComposition()}
        <h3>Champions Info:</h3>
        {this.renderChampionsInfo()}
        <div className={cx(styles.field, styles.fieldExpanded)}>
          <h2>Guide:</h2>
          <RichEditor onChange={this.handleEditorChange} />
        </div>
        <div className={cx(styles.field, styles.fieldExpanded)}>
          <label className={styles.fieldLabel} htmlFor="author">
            Generated JSON:
          </label>
          <textarea readOnly className={styles.json} value={this.getJSON()} />
        </div>
      </PageContainer>
    );
  }
}

const mapStateToProps = (
  state: AppState,
  ownProps: CreateBuildOwnProps
): CreateBuildStateProps => {
  if (!state.TFT || !state.TFT.champions) {
    return {
      ...ownProps,
      isLoading: true
    };
  }
  return {
    ...ownProps,
    isLoading: false,
    champions: state.TFT.champions,
    items: state.TFT.items
  };
};

export const ConnectedCreateBuild = connect<
  CreateBuildStateProps,
  CreateBuildDispatchProps,
  CreateBuildOwnProps,
  AppState
>(
  mapStateToProps,
  {}
)(CreateBuild);
