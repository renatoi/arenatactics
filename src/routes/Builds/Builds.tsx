import cx from "classnames";
import { getIn } from "immutable";
import React, { ChangeEvent, useEffect } from "react";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { ChampionCard } from "../../components/ChampionCard";
import { Disclaimer } from "../../components/Disclaimer/Disclaimer";
import {
  FilterButton,
  FilterItem,
  FilterItemCheckbox,
  FilterPopover
} from "../../components/Filter";
import { Grid } from "../../components/Grid/Grid";
import {
  Detail,
  Master,
  MasterDetail,
  MasterHeader,
  MasterItem,
  MasterList,
  MasterSearchBox
} from "../../components/MasterDetail";
import {
  buildsAddTierToFilter,
  buildsAddTraitToFilter,
  buildsRemoveTierFromFilter,
  buildsRemoveTraitFromFilter,
  buildsResetFilter,
  buildsResetTiersInFilter,
  buildsResetTraitsInFilter,
  buildsSearch
} from "../../redux/actions";
import {
  AppState,
  TFTBuilds,
  TFTChampions,
  TFTItems,
  TFTTraits
} from "../../types";
import styles from "./Builds.module.css";

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
  readonly titleText?: string;
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

const BuildsComponent: React.FC<BuildsProps> = ({
  match,
  isLoading,
  titleText,
  builds,
  champions,
  visibleBuilds,
  items,
  traits,
  buildsSearchQuery,
  buildsFilterTraits,
  buildsFilterTiers,
  dispatchSearchBuilds,
  dispatchResetFilter,
  dispatchResetTraits,
  dispatchAddTraitToFilter,
  dispatchRemoveTraitFromFilter,
  dispatchAddTierToFilter,
  dispatchRemoveTierFromFilter,
  dispatchResetTiers
}) => {
  // page view
  useEffect(() => {
    ReactGA.pageview(match.url);
  }, [match.url]);

  const buildKeyParam = match.params.buildKey;
  let selectedBuildId =
    buildKeyParam != null ? buildKeyParam.substr(0, 8) : null;
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

  const handleTraitCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      dispatchAddTraitToFilter(event.currentTarget.value);
    } else {
      dispatchRemoveTraitFromFilter(event.currentTarget.value);
    }
  };

  const handleTierCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      dispatchAddTierToFilter(event.currentTarget.value);
    } else {
      dispatchRemoveTierFromFilter(event.currentTarget.value);
    }
  };

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchSearchBuilds(e.currentTarget.value);
  };

  const handleClearSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatchSearchBuilds("");
  };
  return (
    <MasterDetail>
      <Helmet>
        <title>{titleText}</title>
        <meta
          name="description"
          content="Detailed step-by-step builds / team compositions guides for Teamfight Tactics (TFT)"
        />
      </Helmet>
      <Master>
        <MasterHeader className={cx(styles.masterHeader)}>
          <MasterSearchBox
            value={buildsSearchQuery}
            label="Search champions"
            placeholder="Search by name, trait, or tier"
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />
          <FilterButton>
            <FilterPopover>
              <FilterItem onClick={dispatchResetFilter}>Reset All</FilterItem>
              <FilterItem
                content={
                  <FilterPopover>
                    <FilterItem onClick={dispatchResetTiers}>Reset</FilterItem>
                    {["S", "A", "B", "C", "D"].map(tier => (
                      <FilterItemCheckbox
                        key={`tier_${tier}`}
                        id={`tier_${tier}`}
                        value={tier}
                        onChange={handleTierCheckboxChange}
                        checked={
                          Array.isArray(buildsFilterTiers) &&
                          buildsFilterTiers.includes(tier)
                        }
                      >
                        {tier}
                      </FilterItemCheckbox>
                    ))}
                  </FilterPopover>
                }
              >
                Tier
              </FilterItem>
              {/* <FilterItem>Traits</FilterItem> */}
            </FilterPopover>
          </FilterButton>
        </MasterHeader>
        <MasterList className={styles.buildsList}>
          {visibleBuilds.map(buildId => {
            const build = builds.byId[buildId];
            return (
              <MasterItem
                key={build.id}
                to={match.path.replace(":buildKey", `${build.id}-${build.key}`)}
                isSelected={selectedBuildId === build.id}
                linkClassName={styles.buildLink}
              >
                <span className={styles.buildName}>{build.name}</span>
                <span
                  className={cx(styles.buildTier, styles[`tier${build.tier}`])}
                >
                  {build.tier}
                </span>
              </MasterItem>
            );
          })}
        </MasterList>
      </Master>
      <Detail className={cx(styles.buildsDetail, "Scrollable")}>
        {selectedBuild != null ? (
          <>
            <h1 className={styles.buildsTitle}>{selectedBuild.name}</h1>
            <p>by Lysandra, last updated July 30, 2019 (Patch 9.15).</p>
            <h2 id="team-composition" className={styles.heading}>
              Team composition
            </h2>
            <div className={styles.cards}>
              {selectedBuild.composition.map(championInfo => (
                <ChampionCard
                  key={championInfo.champion}
                  championId={championInfo.champion}
                  championItems={championInfo.items}
                  isCarry={championInfo.isCarry}
                />
              ))}
            </div>
            <h2 id="position" className={styles.heading}>
              Positioning
            </h2>
            <Grid positions={selectedBuild.positioning} champions={champions} />
            <h2 id="build-guide" className={styles.heading}>
              Build guide
            </h2>
            <p>Detailed guide here</p>
          </>
        ) : (
          <h1 className={styles.buildsTitle}>Please select a build</h1>
        )}
        <Disclaimer />
      </Detail>
    </MasterDetail>
  );
};

const mapStateToProps = (
  state: AppState,
  ownProps: BuildsOwnProps
): BuildsStateProps => {
  if (!state.TFT || !state.TFT.champions || !state.localizedStrings) {
    return {
      ...ownProps,
      isLoading: true
    };
  }
  return {
    ...ownProps,
    isLoading: false,
    titleText: getIn(state.localizedStrings, ["builds", "title"], ""),
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
  dispatchResetFilter: buildsResetFilter,
  dispatchSearchBuilds: buildsSearch,
  dispatchAddTraitToFilter: buildsAddTraitToFilter,
  dispatchRemoveTraitFromFilter: buildsRemoveTraitFromFilter,
  dispatchResetTraits: buildsResetTraitsInFilter,
  dispatchAddTierToFilter: buildsAddTierToFilter,
  dispatchRemoveTierFromFilter: buildsRemoveTierFromFilter,
  dispatchResetTiers: buildsResetTiersInFilter
};

export const Builds = withRouter(
  connect<BuildsStateProps, BuildsDispatchProps, BuildsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(BuildsComponent)
);
