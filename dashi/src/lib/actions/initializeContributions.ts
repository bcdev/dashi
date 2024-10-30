import { store } from "@/lib/store";
import { fetchApiResult } from "@/lib/utils/fetchApiResult";
import { fetchContributions } from "@/lib/api";
import { type Contribution } from "@/lib/types/model/contribution";
import { type ContributionState } from "@/lib/types/state/contribution";
import { type ContribPoint } from "@/lib/types/model/extension";
import type { FrameworkOptions } from "@/lib/types/state/store";
import { configureFramework } from "@/lib";

export function initializeContributions<T>(options?: FrameworkOptions<T>) {
  if (options) {
    configureFramework(options);
  }
  const apiOptions = store.getState().configuration.api;
  store.setState({ contributionsResult: { status: "pending" } });
  fetchApiResult(fetchContributions, apiOptions).then((contributionsResult) => {
    // TODO: validate contributionsResult and contributionsResult.data
    const { extensions, contributions: rawContributionsRecord } =
      contributionsResult.data!;
    const contributionsRecord: Record<ContribPoint, ContributionState[]> = {};
    Object.getOwnPropertyNames(rawContributionsRecord).forEach(
      (contribPoint: ContribPoint) => {
        const rawContributions: Contribution[] =
          rawContributionsRecord[contribPoint];
        contributionsRecord[contribPoint] = rawContributions.map(
          // Contribution --> ContributionState
          (rawContribution) => ({
            ...rawContribution,
            state: { ...rawContribution.initialState },
            componentResult: {},
          }),
        );
      },
    );
    store.setState({
      extensions,
      contributionsResult,
      contributionsRecord,
    });
  });
}
