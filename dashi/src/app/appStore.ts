import { create } from "zustand";

import { ContributionModel, ExtensionModel } from "../model/extension.ts";
import { ComponentModel } from "../model/component.ts";
import fetchApiResult, { ApiResult } from "../utils/fetchApiResult.ts";
import {
  fetchContributions,
  fetchExtensions,
  fetchLayoutComponent,
} from "../api/api.ts";

export interface PanelState {
  visible?: boolean;
  componentModelResult: ApiResult<ComponentModel>;
}

export interface AppState {
  extensionModelsResult: ApiResult<ExtensionModel[]>;
  contributionPointsResult: ApiResult<Record<string, ContributionModel[]>>;
  panelStates: PanelState[] | undefined;
  showPanel: (panelIndex: number) => void;
  hidePanel: (panelIndex: number) => void;
}

const appStore = create<AppState>((set, getState) => ({
  extensionModelsResult: {},
  contributionPointsResult: {},
  panelStates: undefined,
  showPanel: (panelIndex: number) => {
    const panelStates = getState().panelStates;
    if (panelStates) {
      const panelState = panelStates[panelIndex];
      if (!panelState.visible) {
        console.log("Showing panel", panelIndex, panelStates);
        set({
          panelStates: insertPartial<PanelState>(panelStates, panelIndex, {
            visible: true,
          }),
        });
        const inputValues: unknown[] = []; // TODO!
        if (!panelState.componentModelResult.status) {
          set({
            panelStates: insertPartial<PanelState>(panelStates, panelIndex, {
              componentModelResult: { status: "pending" },
            }),
          });
          fetchApiResult(
            fetchLayoutComponent,
            "panels",
            panelIndex,
            inputValues,
          ).then((componentModelResult) => {
            set({
              panelStates: insertPartial<PanelState>(panelStates, panelIndex, {
                componentModelResult,
              }),
            });
          });
        }
      }
    }
  },
  hidePanel: (panelIndex: number) => {
    const panelStates = getState().panelStates;
    if (panelStates) {
      const panelState = panelStates[panelIndex];
      if (panelState.visible) {
        console.log("Hiding panel", panelIndex, panelState);
        set({
          panelStates: insertPartial<PanelState>(panelStates, panelIndex, {
            visible: false,
          }),
        });
      }
    }
  },
}));

export function initAppStore() {
  const set = appStore.setState;

  set({ extensionModelsResult: { status: "pending" } });
  fetchApiResult(fetchExtensions).then((result) => {
    set({ extensionModelsResult: result });
  });

  set({ contributionPointsResult: { status: "pending" } });
  fetchApiResult(fetchContributions).then((result) => {
    if (result.data && result.data["panels"]) {
      const panelModels: ContributionModel[] = result.data["panels"];
      const panelStates: PanelState[] = panelModels.map(() => ({
        componentModelResult: {},
      }));
      set({ contributionPointsResult: result, panelStates });
    } else {
      set({ contributionPointsResult: result });
    }
  });
}

function insertPartial<T>(array: T[], index: number, item: Partial<T>): T[] {
  return [
    ...array.slice(0, index),
    { ...array[index], ...item },
    ...array.slice(index + 1),
  ];
}

export const useAppStore = appStore;
export default appStore;
