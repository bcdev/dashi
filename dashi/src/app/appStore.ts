import { create } from "zustand";

import { ExtensionModel } from "../model/extension.ts";
import { ComponentModel, PropertyChangeEvent } from "../model/component.ts";
import { ContributionModel } from "../model/contribution.ts";
import { CallbackCallRequest } from "../model/callback.ts";
import fetchApiResult, { ApiResult } from "../utils/fetchApiResult.ts";
import {
  fetchCallbackOutputs,
  fetchContributions,
  fetchExtensions,
  fetchLayoutComponent,
} from "../api.ts";

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
  handleComponentPropertyChange: (
    contributionPoint: string,
    contributionIndex: number,
    contributionEvent: PropertyChangeEvent,
  ) => void;
}

const appStore = create<AppState>((_set, getState) => ({
  extensionModelsResult: {},
  contributionPointsResult: {},
  panelStates: undefined,
  showPanel: (panelIndex: number) => {
    const panelStates = getState().panelStates;
    if (panelStates && !panelStates[panelIndex].visible) {
      const panelState = panelStates[panelIndex];
      if (panelState.componentModelResult.status) {
        updatePanelState(panelIndex, { visible: true });
      } else {
        updatePanelState(panelIndex, {
          visible: true,
          componentModelResult: { status: "pending" },
        });
        const inputValues = getLayoutInputValues("panels", panelIndex);
        fetchApiResult(
          fetchLayoutComponent,
          "panels",
          panelIndex,
          inputValues,
        ).then((componentModelResult) => {
          updatePanelState(panelIndex, { componentModelResult });
        });
      }
    }
  },
  hidePanel: (panelIndex: number) => {
    const panelStates = getState().panelStates;
    if (panelStates && panelStates[panelIndex].visible) {
      updatePanelState(panelIndex, { visible: false });
    }
  },
  handleComponentPropertyChange: (
    contribPoint: string,
    contribIndex: number,
    contribEvent: PropertyChangeEvent,
  ) => {
    const componentId = contribEvent.componentId;
    const componentPropertyName = contribEvent.propertyName;
    const componentPropertyValue = contribEvent.propertyValue;
    const contributionModels =
      getState().contributionPointsResult.data![contribPoint];
    const contributionModel = contributionModels[contribIndex];
    const callRequests: CallbackCallRequest[] = [];
    (contributionModel.callbacks || []).forEach((callback, callbackIndex) => {
      if (callback.inputs && callback.inputs.length > 0) {
        let triggerIndex: number = -1;
        const inputValues: unknown[] = callback.inputs.map(
          (input, inputIndex) => {
            const kind = input.kind || "Component";
            if (kind === "Component") {
              if (
                input.id === componentId &&
                input.property === componentPropertyName
              ) {
                triggerIndex = inputIndex;
                return componentPropertyValue;
              } else {
                // TODO: get inputValue from other component with given id/property.
                //    For time being we use null as it is JSON-serializable
              }
            } else {
              // TODO: get inputValue from other kinds.
              //   For time being we use null as it is JSON-serializable
            }
            console.warn(`callback input not supported yet:`, input);
            return null;
          },
        );
        if (triggerIndex >= 0) {
          callRequests.push({
            contribPoint,
            contribIndex,
            callbackIndex,
            inputValues,
          });
        }
      }
    });
    console.log("callRequests", callRequests);
    if (callRequests.length) {
      fetchApiResult(fetchCallbackOutputs, callRequests).then(
        (callResultResult) => {
          if (callResultResult.data) {
            const callResult = callResultResult.data;
            // TODO: process call result --> modify any targets in appState.
            console.warn(
              "processing of callback results not implemented yet:",
              callResult,
            );
          } else {
            console.error("callback failed:", callResultResult.error);
            console.error("  for requests:", callRequests);
          }
        },
      );
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

function getLayoutInputValues(
  contribPoint: string,
  contribIndex: number,
): unknown[] {
  const contributionModels =
    appStore.getState().contributionPointsResult.data![contribPoint];
  const contributionModel = contributionModels[contribIndex];
  const inputs = contributionModel.layout!.inputs;
  if (inputs && inputs.length > 0) {
    // TODO: get inputValue from sources specified by input.kind.
    //    For time being we use null as it is JSON-serializable
    return inputs.map((input) => {
      console.warn(`layout input not supported yet`, input);
      return null;
    });
  } else {
    return [];
  }
}

function updatePanelState(panelIndex: number, panelState: Partial<PanelState>) {
  const panelStates = appStore.getState().panelStates!;
  appStore.setState({
    panelStates: insertPartial<PanelState>(panelStates, panelIndex, panelState),
  });
}

function insertPartial<T>(array: T[], index: number, item: Partial<T>): T[] {
  return [
    ...array.slice(0, index),
    { ...array[index], ...item },
    ...array.slice(index + 1),
  ];
}

export default appStore;
