import { create } from "zustand";

import { ContribPoint, Contributions, Extension } from "../model/extension";
import { Contribution } from "../model/contribution";
import { ApiResult } from "../utils/fetchApiResult";
import { ContributionState } from "../state/contribution";

export interface AppState {
  // API call result /dashi/contributions
  contributionsResult: ApiResult<Contributions>;
  // All extensions
  extensions: Extension[];
  // A record that maps contribPoint --> Contribution[]
  contributionModelsRecord: Record<ContribPoint, Contribution[]>;
  // A record that maps contribPoint --> ContributionState[]
  contributionStatesRecord: Record<ContribPoint, ContributionState[]>;
}

const appStore = create<AppState>(() => ({
  contributionsResult: {},
  extensions: [],
  contributionModelsRecord: {},
  contributionStatesRecord: {},
}));

export default appStore;
