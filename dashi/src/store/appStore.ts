import { create } from "zustand";

import { ContribPoint, Extension } from "../model/extension";
import { Contribution } from "../model/contribution";
import { ApiResult } from "../utils/fetchApiResult";
import { ContributionState } from "../state/contribution";

export interface AppState {
  // API call result all extensions
  extensionsResult: ApiResult<Extension[]>;
  // API call result of a record that maps contribPoint --> Contribution[]
  contributionsRecordResult: ApiResult<Record<ContribPoint, Contribution[]>>;
  // A record that maps contribPoint --> ContributionState[]
  contributionStatesRecord: Record<ContribPoint, ContributionState[]>;
}

const appStore = create<AppState>(() => ({
  extensionsResult: {},
  contributionsRecordResult: {},
  contributionStatesRecord: {},
}));

export default appStore;
