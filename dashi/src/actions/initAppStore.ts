import appStore, { ContributionState } from "../store/appStore";
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
    if (result.data) {
      const contributionPointStates: Record<string, ContributionState[]> = {};
      Object.getOwnPropertyNames(result.data).forEach((contribPoint) => {
        const contributions: ContributionModel[] = result.data![contribPoint];
        contributionPointStates[contribPoint] = contributions.map(() => ({
          componentModelResult: {},
        }));
      });
      set({ contributionPointsResult: result, contributionPointStates });
    } else {
      set({ contributionPointsResult: result });
    }
  });
}
