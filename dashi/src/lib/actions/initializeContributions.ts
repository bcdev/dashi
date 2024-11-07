import { store } from "@/lib/store";
import { type ApiResult, fetchApiResult } from "@/lib/utils/fetchApiResult";
import { fetchContributions } from "@/lib/api";
import { type Contribution } from "@/lib/types/model/contribution";
import { type ContributionState } from "@/lib/types/state/contribution";
import {
  type ContribPoint,
  type Contributions,
} from "@/lib/types/model/extension";
import type { FrameworkOptions, StoreState } from "@/lib/types/state/store";
import { configureFramework } from "./configureFramework";

export function initializeContributions<S extends object = object>(
  options?: FrameworkOptions<S>,
) {
  if (options) {
    configureFramework(options);
  }
  const { configuration } = store.getState();
  store.setState({ contributionsResult: { status: "pending" } });
  fetchApiResult(fetchContributions, configuration.api).then(
    initializeContributionsLater,
  );
}

function initializeContributionsLater(
  contributionsResult: ApiResult<Contributions>,
) {
  let storeState: Partial<StoreState> = { contributionsResult };
  if (contributionsResult.data) {
    const { extensions, contributions: rawContributionsRecord } =
      contributionsResult.data;
    const contributionsRecord: Record<ContribPoint, ContributionState[]> = {};
    Object.getOwnPropertyNames(rawContributionsRecord).forEach(
      (contribPoint: ContribPoint) => {
        const contributions: Contribution[] =
          rawContributionsRecord[contribPoint];
        contributionsRecord[contribPoint] =
          contributions.map(newContributionState);
      },
    );
    storeState = { ...storeState, extensions, contributionsRecord };
  }
  store.setState(storeState);
}

function newContributionState(
  rawContribution: Contribution,
): ContributionState {
  return {
    ...rawContribution,
    container: { ...rawContribution.initialState },
    componentResult: {},
  };
}
