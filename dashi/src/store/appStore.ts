import { create } from "zustand";

import { ExtensionModel } from "../model/extension";
import { ComponentModel } from "../model/component";
import { ContributionModel } from "../model/contribution";
import { ApiResult } from "../utils/fetchApiResult";

export interface PanelState {
  visible?: boolean;
  componentModelResult: ApiResult<ComponentModel>;
}

export interface AppState {
  extensionModelsResult: ApiResult<ExtensionModel[]>;
  contributionPointsResult: ApiResult<Record<string, ContributionModel[]>>;
  panelStates: PanelState[] | undefined;
}

const appStore = create<AppState>(() => ({
  extensionModelsResult: {},
  contributionPointsResult: {},
  panelStates: undefined,
}));

export default appStore;
