import { store } from "@/store";
import { type ApiResult } from "@/types/api";
import { fetchContributions } from "@/api/fetchContributions";
import { type Contribution } from "@/types/model/contribution";
import { type ContributionState } from "@/types/state/contribution";
import { type Contributions } from "@/types/model/extension";
import { type FrameworkOptions } from "@/types/state/options";
import { type StoreState } from "@/types/state/store";
import { configureFramework } from "./configureFramework";
import { mapObject } from "@/utils/mapObject";

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
