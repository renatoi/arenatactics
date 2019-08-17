import React, { ChangeEvent } from "react";
import uuidv4 from "uuid/v4";
import styles from "./CreateBuild.module.scss";
import { PageContainer } from "../../../components/PageContainer/PageContainer";
import Helmet from "react-helmet";
import { TFTChampions, TFTItems, TFTBuild } from "../types";
import { AppState } from "../../../types";
import { connect } from "react-redux";
import cx from "classnames";
import { ChampionImage } from "../components/ChampionImage/ChampionImage";
import { Popover } from "../../../components/Popover/Popover";
import { ItemImage } from "../components/ItemImage/ItemImage";
import { Grid } from "../components/Grid/Grid";
import { TextEditor } from "../components/TextEditor/TextEditor";
import { Icon } from "../../../components/Icon/Icon";

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

interface CreateBuildState {
  readonly userBuilds: TFTBuild[];
  readonly currentBuild: TFTBuild;
  readonly activeTab: number;
}
class CreateBuild extends React.Component<CreateBuildProps, CreateBuildState> {
  constructor(props: CreateBuildProps) {
    super(props);
    const userBuilds = this.loadLocalJSON();
    this.state = {
      userBuilds,
      currentBuild: userBuilds[0],
      activeTab: 0
    };
  }

  loadLocalJSON() {
    const localBuilds = localStorage.getItem("userBuilds");
    let userBuilds =
      localBuilds != null ? (JSON.parse(localBuilds) as TFTBuild[]) : [];

    if (!Array.isArray(userBuilds) || userBuilds.length === 0) {
      userBuilds = [this.getEmptyBuild()];
    }

    return userBuilds;
  }

  saveLocalJSON() {
    localStorage.setItem(
      "userBuilds",
      JSON.stringify([...this.state.userBuilds])
    );
  }

  copyCurrentBuildToUserBuildsAndSave() {
    this.setState(
      prevState => {
        const { currentBuild, userBuilds } = prevState;
        if (userBuilds.some(userBuild => userBuild.id === currentBuild.id)) {
          return {
            userBuilds: userBuilds.map(userBuild =>
              userBuild.id === currentBuild.id ? currentBuild : userBuild
            )
          };
        } else {
          return {
            userBuilds: [...userBuilds, currentBuild]
          };
        }
      },
      () => this.saveLocalJSON()
    );
  }

  handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState(
      prevState => ({
        currentBuild: { ...prevState.currentBuild, name: value }
      }),
      () => this.copyCurrentBuildToUserBuildsAndSave()
    );
  };

  handleAuthorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState(
      prevState => ({
        currentBuild: { ...prevState.currentBuild, author: value }
      }),
      () => this.copyCurrentBuildToUserBuildsAndSave()
    );
  };

  handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    this.setState(
      prevState => ({
        currentBuild: { ...prevState.currentBuild, lang: value }
      }),
      () => this.copyCurrentBuildToUserBuildsAndSave()
    );
  };

  handleTierChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    this.setState(
      prevState => ({
        currentBuild: { ...prevState.currentBuild, tier: value }
      }),
      () => this.copyCurrentBuildToUserBuildsAndSave()
    );
  };

  handleEditorChange = (value: string) => {
    this.setState(
      prevState => ({
        currentBuild: {
          ...prevState.currentBuild,
          guide: value
        }
      }),
      () => this.copyCurrentBuildToUserBuildsAndSave()
    );
  };

  getEmptyBuild = () => {
    return {
      id: uuidv4(),
      key: "",
      name: "Untitled",
      tier: "",
      author: "",
      lang: "",
      composition: [],
      positioning: {},
      guide: ""
    };
  };

  createNewBuild = () => {
    this.setState(
      {
        currentBuild: this.getEmptyBuild()
      },
      () => this.copyCurrentBuildToUserBuildsAndSave()
    );
  };

  editBuild = (buildId: string) => {
    this.setState(
      prevState => {
        const currentBuild = prevState.userBuilds.find(
          userBuild => userBuild.id === buildId
        );
        if (currentBuild == null) {
          return prevState;
        }
        return {
          currentBuild
        };
      },
      () => this.copyCurrentBuildToUserBuildsAndSave()
    );
  };

  deleteBuild = (buildId: string) => {
    if (window.confirm("Are you sure you want to delete this build?")) {
      if (this.state.userBuilds.length === 1) {
        const currentBuild = this.getEmptyBuild();
        this.setState(
          {
            userBuilds: [currentBuild],
            currentBuild
          },
          () => this.saveLocalJSON()
        );
      } else {
        this.setState(
          prevState => {
            const userBuilds = prevState.userBuilds.filter(
              userBuild => userBuild.id !== buildId
            );
            return {
              userBuilds,
              currentBuild: { ...userBuilds[userBuilds.length - 1] }
            };
          },
          () => this.saveLocalJSON()
        );
      }
    }
  };

  handleChampionClick = (championId: string, x: number, y: number) => {
    const positioningKey = `${x},${y}`;
    if (championId === "-1") {
      this.setState(
        prevState => {
          let previousChampionId =
            prevState.currentBuild.positioning[positioningKey];
          const newPositioning = { ...prevState.currentBuild.positioning };
          delete newPositioning[positioningKey];
          return {
            currentBuild: {
              ...prevState.currentBuild,
              positioning: newPositioning,
              composition: prevState.currentBuild.composition.filter(
                championInfo => championInfo.champion !== previousChampionId
              )
            }
          };
        },
        () => this.copyCurrentBuildToUserBuildsAndSave()
      );
      return;
    }

    if (
      this.state.currentBuild.composition.some(
        championInfo => championInfo.champion === championId
      )
    ) {
      this.setState(
        prevState => {
          const newPositioning = { ...prevState.currentBuild.positioning };
          for (let position in newPositioning) {
            if (newPositioning.hasOwnProperty(position)) {
              if (newPositioning[position] === championId) {
                delete newPositioning[position];
              }
            }
          }
          return {
            currentBuild: {
              ...prevState.currentBuild,
              positioning: {
                ...newPositioning,
                [`${x},${y}`]: championId
              }
            }
          };
        },
        () => this.copyCurrentBuildToUserBuildsAndSave()
      );
      return;
    }

    if (this.state.currentBuild.composition.length === 9) {
      return;
    }

    this.setState(
      prevState => {
        const newPositioning = {
          ...prevState.currentBuild.positioning,
          [`${x},${y}`]: championId
        };
        return {
          currentBuild: {
            ...prevState.currentBuild,
            positioning: newPositioning,
            composition: Object.values(newPositioning).map(championId => ({
              champion: championId,
              items: ["-1", "-1", "-1"],
              isCarry: false
            }))
          }
        };
      },
      () => this.copyCurrentBuildToUserBuildsAndSave()
    );
  };

  championSelectPopover = (x: number, y: number) => {
    const { champions } = this.props;
    if (champions == null) {
      return <></>;
    }
    return (
      <div className={styles.championsSelect}>
        <button
          key="none"
          type="button"
          className={styles.championButton}
          onClick={() => this.handleChampionClick("-1", x, y)}
        >
          <span className={styles.championName}>None</span>
        </button>
        {Object.keys(champions.byKey)
          .sort()
          .map(championKey => {
            const championId = champions.byKey[championKey];
            return (
              <button
                key={championId}
                type="button"
                className={styles.championButton}
                onClick={() => this.handleChampionClick(championId, x, y)}
              >
                <ChampionImage
                  championKey={championKey}
                  className={styles.championImage}
                  width={32}
                  height={32}
                />
                <span className={styles.championName}>
                  {champions.byId[champions.byKey[championKey]].name}
                </span>
              </button>
            );
          })}
      </div>
    );
  };

  renderPositioning() {
    const { champions } = this.props;
    if (champions == null) {
      return <></>;
    }
    return (
      <Grid
        positions={this.state.currentBuild.positioning}
        champions={champions}
        popoverContent={this.championSelectPopover}
      />
    );
  }

  handleIsCarryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentTarget = e.currentTarget;
    const championId = currentTarget.dataset.champion;
    this.setState(
      prevState => ({
        currentBuild: {
          ...prevState.currentBuild,
          composition: prevState.currentBuild.composition.map(championInfo => {
            if (championInfo.champion !== championId) {
              return championInfo;
            }
            return {
              ...championInfo,
              isCarry: currentTarget.checked
            };
          })
        }
      }),
      () => this.copyCurrentBuildToUserBuildsAndSave()
    );
  };

  handleItemClick = (championId: string, itemId: string, slotIndex: number) => {
    this.setState(
      prevState => ({
        currentBuild: {
          ...prevState.currentBuild,
          composition: prevState.currentBuild.composition.map(championInfo => {
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
        }
      }),
      () => this.copyCurrentBuildToUserBuildsAndSave()
    );
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
        {this.state.currentBuild.composition.map(championInfo => {
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

  download(filename: string, text: string) {
    const el = document.createElement("a");
    el.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    el.setAttribute("download", filename);
    el.style.display = "none";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }

  exportActiveBuild = () => {
    const { currentBuild } = this.state;
    this.download(
      `${currentBuild.name}.json`,
      JSON.stringify(currentBuild, null, 2)
    );
  };

  exportAllBuilds = () => {
    const { userBuilds } = this.state;
    this.download("builds.json", JSON.stringify(userBuilds, null, 2));
  };

  handleActiveBuildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.editBuild(e.currentTarget.value);
  };

  handleTabChange = (tab: number) => {
    this.setState({
      activeTab: tab
    });
  };

  render() {
    const { activeTab } = this.state;
    const { lang, tier, id: currentBuildId } = this.state.currentBuild;
    return (
      <PageContainer>
        <Helmet>
          <title>Create builds for Teamfight Tactics</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className={styles.userBuilds}>
          <div className={styles.toolbar}>
            <div className={styles.buildToolbar}>
              <label className={styles.fieldLabel} htmlFor="build-select">
                Build:
              </label>
              <select
                id="build-select"
                className={cx(styles.fieldSelect, styles.fieldBuilds)}
                value={currentBuildId}
                onChange={this.handleActiveBuildChange}
              >
                {this.state.userBuilds.map(userBuild => (
                  <option key={userBuild.id} value={userBuild.id}>
                    {userBuild.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => this.deleteBuild(currentBuildId)}
              >
                <Icon type="bin">Delete active build</Icon>
              </button>
              <button
                className={cx(styles.button, styles.createNewBuildButton)}
                type="button"
                onClick={this.createNewBuild}
              >
                <Icon type="plus">Add new build</Icon>
              </button>
              <button
                className={styles.button}
                type="button"
                onClick={this.exportActiveBuild}
              >
                <Icon type="download-active">Export active build</Icon>
              </button>
              <button
                className={styles.button}
                type="button"
                onClick={this.exportAllBuilds}
              >
                <Icon type="download-all">Export all builds</Icon>
              </button>
            </div>
            <div className={styles.tabs}>
              <button
                type="button"
                className={cx(styles.tab, {
                  [styles.tabActive]: activeTab === 0
                })}
                onClick={() => this.handleTabChange(0)}
              >
                Data
              </button>
              <button
                type="button"
                className={cx(styles.tab, {
                  [styles.tabActive]: activeTab === 1
                })}
                onClick={() => this.handleTabChange(1)}
              >
                Guide
              </button>
            </div>
          </div>
        </div>
        {activeTab === 0 ? (
          <>
            <div className={styles.sideBySide}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="lang">
                  Language:
                </label>
                <select
                  id="lang"
                  className={styles.fieldSelect}
                  onChange={this.handleLangChange}
                  value={lang}
                >
                  <option value="" />
                  <option value="pt-br">Português - Brasil</option>
                  <option value="en-us">English - US</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="tier">
                  Tier:
                </label>
                <select
                  id="tier"
                  className={styles.fieldSelect}
                  onChange={this.handleTierChange}
                  value={tier}
                >
                  <option value="" />
                  <option value="S">S</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>
            <div className={styles.sideBySide}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="name">
                  Name:
                </label>
                <input
                  className={styles.fieldTextInput}
                  id="name"
                  name="name"
                  type="text"
                  value={this.state.currentBuild.name}
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
                  value={this.state.currentBuild.author}
                  onChange={this.handleAuthorChange}
                />
              </div>
            </div>
            <div className={styles.sideBySide}>
              <div>{this.renderPositioning()}</div>
              <div>{this.renderChampionsInfo()}</div>
            </div>
          </>
        ) : (
          <TextEditor
            onChange={this.handleEditorChange}
            value={this.state.currentBuild.guide}
          />
        )}
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
