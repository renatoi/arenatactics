import cx from "classnames";
import React, { ChangeEvent, useEffect } from "react";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { generatePath, RouteComponentProps, withRouter } from "react-router";
import { ChampionCard } from "../../components/ChampionCard";
import { Disclaimer } from "../../components/Disclaimer/Disclaimer";
import {
  FilterButton,
  FilterItem,
  FilterItemCheckbox,
  FilterPopover
} from "../../components/Filter";
import { Grid } from "../../components/Grid/Grid";
import { getLocalizedText } from "../../components/LocalizedText/LocalizedText";
import { MarkdownViewer } from "../../components/MarkdownViewer/MarkdownViewer";
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
import { getLocale } from "../../utils";
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
  readonly compKey?: string;
}
export interface BuildsOwnProps extends RouteComponentProps<MatchParams> {}

export interface BuildsProps
  extends BuildsDispatchProps,
    BuildsStateProps,
    BuildsOwnProps {}

const BuildsComponent: React.FC<BuildsProps> = ({
  match,
  isLoading,
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

  const buildKeyParam = match.params.compKey;
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

  const locale = getLocale();

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
        <title>{getLocalizedText("comps.title")}</title>
        <meta
          name="description"
          content={getLocalizedText("comps.description")}
        />
      </Helmet>
      <Master>
        <MasterHeader className={cx(styles.masterHeader)}>
          <MasterSearchBox
            value={buildsSearchQuery}
            label={getLocalizedText("comps.searchLabel")}
            placeholder={getLocalizedText("comps.searchPlaceholder")}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />
          <FilterButton>
            <FilterPopover>
              <FilterItem onClick={dispatchResetFilter}>
                {getLocalizedText("filter.resetAll")}
              </FilterItem>
              <FilterItem
                content={
                  <FilterPopover>
                    <FilterItem onClick={dispatchResetTiers}>
                      {getLocalizedText("filter.reset")}
                    </FilterItem>
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
          {visibleBuilds
            .sort((buildId1, buildId2) => {
              const build1 = builds.byId[buildId1];
              const build2 = builds.byId[buildId2];
              const tierOrder: { [key: string]: number } = {
                S: 0,
                A: 1,
                B: 2,
                C: 3,
                D: 4
              };
              if (tierOrder[build1.tier] > tierOrder[build2.tier]) {
                return 1;
              } else if (tierOrder[build1.tier] === tierOrder[build2.tier]) {
                if (tierOrder[build1.name] > tierOrder[build2.name]) {
                  return 1;
                } else if (tierOrder[build1.name] < tierOrder[build2.name]) {
                  return -1;
                }
                return 0;
              }
              return -1;
            })
            .map(buildId => {
              const build = builds.byId[buildId];
              return (
                <MasterItem
                  key={build.id}
                  to={generatePath(match.path, {
                    locale,
                    compKey: `${build.id}-${build.key}`
                  })}
                  isSelected={selectedBuildId === build.id}
                  linkClassName={styles.buildLink}
                >
                  <span className={styles.buildName}>{build.name}</span>
                  <span
                    className={cx(
                      styles.buildTier,
                      styles[`tier${build.tier}`]
                    )}
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
            <p>Last update: Patch 9.18.</p>
            <h2 id="team-composition" className={styles.heading}>
              {getLocalizedText("comps.teamComposition")}
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
              {getLocalizedText("comps.positioning")}
            </h2>
            <Grid positions={selectedBuild.positioning} champions={champions} />
            <h2 id="build-guide" className={styles.heading}>
              {getLocalizedText("comps.guide")}
            </h2>
            <MarkdownViewer value={selectedBuild.guide} />
          </>
        ) : (
          <p style={{ minHeight: "80%" }}>
            {getLocalizedText("comps.compSelect")}
          </p>
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
  if (!state.TFT || Object.keys(state.TFT.champions.byId).length === 0) {
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
