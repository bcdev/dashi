import { create } from "zustand";

import { ExtensionModel } from "../model/extension";
import { ComponentModel } from "../model/component";
import { ContributionModel } from "../model/contribution";
import { ApiResult } from "../utils/fetchApiResult";

export interface ContributionState {
  visible?: boolean;
  componentModelResult: ApiResult<ComponentModel>;
}

export interface AppState {
  extensionModelsResult: ApiResult<ExtensionModel[]>;
  contributionPointsResult: ApiResult<Record<string, ContributionModel[]>>;
  contributionPointStates: Record<string, ContributionState[]>;
}

const appStore = create<AppState>(() => ({
  extensionModelsResult: {},
  contributionPointsResult: {},
  contributionPointStates: {},
}));

export default appStore;
