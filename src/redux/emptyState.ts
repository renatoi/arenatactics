import { AppState } from "../types";

export const emptyState: AppState = {
  TFT: {
    visibleItems: [],
    itemsSearchQuery: "",
    visibleChampions: [],
    championsSearchQuery: "",
    championsFilterTraits: [],
    championsFilterCosts: [],
    visibleBuilds: [],
    buildsSearchQuery: "",
    buildsFilterTraits: [],
    buildsFilterTiers: [],
    champions: { byId: {}, byKey: {} },
    items: { byId: {}, byKey: {} },
    traits: { byId: {} },
    builds: { byId: {}, byKey: {} }
  },
  localizedStrings: undefined
};
