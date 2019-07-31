import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { RouteComponentProps, withRouter } from "react-router";
import ReactGA from "react-ga";
import { Grid } from "../components/Grid/Grid";
import styles from "./Builds.module.css";
import {
  MasterDetail,
  Master,
  MasterHeader,
  MasterSearchBox,
  MasterList,
  Detail,
  MasterItem
} from "../components/MasterDetail";
import { TFTChampions, TFTItems, TFTTraits, TFTBuilds } from "../types";
import { Popover } from "../../../components/Popover/Popover";
import { ConnectedTFTChampion } from "../components/Champion";
import cx from "classnames";
import { AppState } from "../../../types";
import { connect } from "react-redux";
import {
  resetBuildsFilter,
  searchBuilds,
  addTraitToBuildsFilter,
  removeTraitFromBuildsFilter,
  resetTraitsInBuildsFilter,
  addTierToBuildsFilter,
  removeTierFromBuildsFilter,
  resetTiersInBuildsFilter
} from "../redux/actions";

export interface BuildsDispatchProps {
  readonly dispatchResetFilter: () => void;
  readonly dispatchSearchBuilds: (query: string) => void;
  readonly dispatchAddTraitToFilter: (trait: string) => void;
  readonly dispatchRemoveTraitFromFilter: (trait: string) => void;
  readonly dispatchResetTraits: () => void;
  readonly dispatchAddTierToFilter: (tier: string) => void;
  readonly dispatchRemoveTierFromFilter: (tier: string) => void;
  readonly dispatchResetTiers: () => void;
}
export interface BuildsStateProps {
  readonly isLoading: boolean;
  readonly builds?: TFTBuilds;
  readonly buildsSearchQuery?: string;
  readonly buildsFilterTraits?: string[];
  readonly buildsFilterTiers?: string[];
  readonly visibleBuilds?: string[];
  readonly champions?: TFTChampions;
  readonly items?: TFTItems;
  readonly traits?: TFTTraits;
}
interface MatchParams {
  readonly buildKey?: string;
}
export interface BuildsOwnProps extends RouteComponentProps<MatchParams> {}

export interface BuildsProps
  extends BuildsDispatchProps,
    BuildsStateProps,
    BuildsOwnProps {}

const Builds: React.FC<BuildsProps> = ({
  match,
  isLoading,
  builds,
  champions,
  visibleBuilds,
  items,
  traits,
  buildsSearchQuery,
  dispatchSearchBuilds
}) => {
  // page view
  useEffect(() => {
    ReactGA.pageview(match.url);
  }, [match.url]);

  const buildKeyParam = match.params.buildKey;
  let selectedBuildId: string | undefined;
  if (buildKeyParam != null) {
    const buildIdMatch = buildKeyParam.match(/^\d+/);
    if (buildIdMatch != null) {
      selectedBuildId = buildIdMatch[0];
    }
  }
  const selectedBuild =
    selectedBuildId != null && builds != null
      ? builds.byId[selectedBuildId]
      : undefined;

  // isLoading
  if (
    isLoading ||
    champions == null ||
    builds == null ||
    visibleBuilds == null ||
    items == null ||
    traits == null
  ) {
    return <></>;
  }

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchSearchBuilds(e.currentTarget.value);
  };

  const handleClearSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatchSearchBuilds("");
  };

  return (
    <MasterDetail>
      <Helmet>
        <title>Best Team Compositions / Builds for Teamfight Tactics</title>
        <meta
          name="description"
          content="Detailed step-by-step builds / team compositions guides for Teamfight Tactics (TFT)"
        />
      </Helmet>
      <Master>
        <MasterHeader className={styles.masterHeader}>
          <MasterSearchBox
            value={buildsSearchQuery}
            label="Search champions"
            placeholder="Search by name, trait, or tier"
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />
          {/* <Popover placement="right-start" content={filterPopover}>
            <button type="button" className={styles.filterBoxButton}>
              Filter
            </button>
          </Popover> */}
        </MasterHeader>
        <MasterList className={styles.buildsList}>
          {visibleBuilds.map(buildId => {
            const build = builds.byId[buildId];
            return (
              <MasterItem
                key={build.id}
                to={match.path.replace(":buildKey", build.id)}
                isSelected={selectedBuildId === build.id}
              >
                <span className={styles.buildName}>{build.name}</span>
                <span className={styles.buildTier}>{build.tier}</span>
              </MasterItem>
            );
          })}
        </MasterList>
      </Master>
      <Detail className={cx(styles.championsDetail, "Scrollable")}>
        <h1>Phantom Glacial Rangers</h1>
        <p>by Lysandra, last updated July 30, 2019 (Patch 9.15).</p>
        <h2 id="team-composition">Team composition</h2>
        <h2 id="position">Positioning</h2>
        <Grid />
        <h2 id="build-guide">Build guide</h2>
        <p>Detailed guide here</p>
      </Detail>
    </MasterDetail>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: BuildsOwnProps
): BuildsStateProps => {
  if (!state.TFT || !state.TFT.champions) {
    return {
      ...ownProps,
      isLoading: true
    };
  }
  return {
    ...ownProps,
    isLoading: false,
    visibleBuilds: state.TFT.visibleBuilds,
    champions: state.TFT.champions,
    items: state.TFT.items,
    traits: state.TFT.traits,
    buildsSearchQuery: state.TFT.buildsSearchQuery,
    buildsFilterTraits: state.TFT.buildsFilterTraits,
    buildsFilterTiers: state.TFT.buildsFilterTiers,
    builds: state.TFT.builds
  };
};

const mapDispatchToProps = {
  dispatchResetFilter: resetBuildsFilter,
  dispatchSearchBuilds: searchBuilds,
  dispatchAddTraitToFilter: addTraitToBuildsFilter,
  dispatchRemoveTraitFromFilter: removeTraitFromBuildsFilter,
  dispatchResetTraits: resetTraitsInBuildsFilter,
  dispatchAddTierToFilter: addTierToBuildsFilter,
  dispatchRemoveTierFromFilter: removeTierFromBuildsFilter,
  dispatchResetTiers: resetTiersInBuildsFilter
};

export const ConnectedBuilds = withRouter(
  connect<BuildsStateProps, BuildsDispatchProps, BuildsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(Builds)
);
