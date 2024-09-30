import appStore, { ContributionState } from "../store/appStore";
import fetchApiResult from "../utils/fetchApiResult";
import { fetchContributionsRecord, fetchExtensions } from "../api";
import { Contribution } from "../model/contribution";

export function initAppStore() {
  const set = appStore.setState;

  set({ extensionsResult: { status: "pending" } });
  fetchApiResult(fetchExtensions).then((result) => {
    set({ extensionsResult: result });
  });

  set({ contributionsRecordResult: { status: "pending" } });
  fetchApiResult(fetchContributionsRecord).then((result) => {
    if (result.data) {
      const contributionPointStates: Record<string, ContributionState[]> = {};
      Object.getOwnPropertyNames(result.data).forEach((contribPoint) => {
        const contributions: Contribution[] = result.data![contribPoint];
        contributionPointStates[contribPoint] = contributions.map(() => ({
          componentModelResult: {},
        }));
      });
      set({
        contributionsRecordResult: result,
        contributionStatesRecord: contributionPointStates,
      });
    } else {
      set({ contributionsRecordResult: result });
    }
  });
}
