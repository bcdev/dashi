import appStore from "../store/appStore";
import fetchApiResult from "../utils/fetchApiResult";
import { fetchContributionsRecord, fetchExtensions } from "../api";
import { Contribution } from "../model/contribution";
import { ContributionState } from "../state/contribution";

export function initAppStore() {
  const set = appStore.setState;

  set({ extensionsResult: { status: "pending" } });
  fetchApiResult(fetchExtensions).then((extensionsResult) => {
    set({ extensionsResult });
  });

  set({ contributionsRecordResult: { status: "pending" } });
  fetchApiResult(fetchContributionsRecord).then((contributionsRecordResult) => {
    if (contributionsRecordResult.data) {
      const contributionStatesRecord: Record<string, ContributionState[]> = {};
      Object.getOwnPropertyNames(contributionsRecordResult.data).forEach(
        (contribPoint) => {
          const contributions: Contribution[] =
            contributionsRecordResult.data![contribPoint];
          contributionStatesRecord[contribPoint] = contributions.map(() => ({
            componentModelResult: {},
          }));
        },
      );
      set({ contributionsRecordResult, contributionStatesRecord });
    } else {
      set({ contributionsRecordResult });
    }
  });
}
