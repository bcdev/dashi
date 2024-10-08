import { create } from "zustand";

import { Extension } from "../model/extension";
import { ComponentModel } from "../model/component";
import { Contribution } from "../model/contribution";
import { ApiResult } from "../utils/fetchApiResult";

export type ContribPoint = string;

export interface ContributionState {
  visible?: boolean;
  componentModelResult: ApiResult<ComponentModel>;
  componentState?: ComponentModel;
}

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
