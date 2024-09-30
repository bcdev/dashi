import appStore, { PanelState } from "../store/appStore";
import fetchApiResult from "../utils/fetchApiResult";
import { fetchContributions, fetchExtensions } from "../api";
import { ContributionModel } from "../model/contribution";

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
