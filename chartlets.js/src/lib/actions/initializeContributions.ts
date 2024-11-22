import { store } from "@/lib/store";
import { type ApiResult } from "@/lib/types/api";
import { fetchContributions } from "@/lib/api/fetchContributions";
import { type Contribution } from "@/lib/types/model/contribution";
import { type ContributionState } from "@/lib/types/state/contribution";
import { type Contributions } from "@/lib/types/model/extension";
import { type FrameworkOptions } from "@/lib/types/state/options";
import { type StoreState } from "@/lib/types/state/store";
import { configureFramework } from "./configureFramework";
import { mapObject } from "@/lib/utils/mapObject";

export function initializeContributions(options?: FrameworkOptions) {
  if (options) {
    configureFramework(options);
  }
  const { configuration } = store.getState();
  store.setState({ contributionsResult: { status: "pending" } });
  fetchContributions(configuration.api).then(initializeContributionsLater);
}

function initializeContributionsLater(
  contributionsResult: ApiResult<Contributions>,
) {
  let storeState: Partial<StoreState> = { contributionsResult };
  if (contributionsResult.data) {
    const { extensions, contributions: rawContributionsRecord } =
      contributionsResult.data;
    storeState = {
      ...storeState,
      extensions,
      contributionsRecord: mapObject(rawContributionsRecord, (contributions) =>
        contributions.map(newContributionState),
      ),
    };
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
