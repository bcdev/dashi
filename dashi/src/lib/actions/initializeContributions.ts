import { store } from "@/lib/store";
import { fetchApiResult } from "@/lib/utils/fetchApiResult";
import { fetchContributions } from "@/lib/api";
import { type Contribution } from "@/lib/types/model/contribution";
import { type ContributionState } from "@/lib/types/state/contribution";
import { type ContribPoint } from "@/lib/types/model/extension";
import type { FrameworkOptions } from "@/lib/types/state/store";
import { configureFramework } from "@/lib";

export function initializeContributions(options?: FrameworkOptions) {
  if (options) {
    configureFramework(options);
  }
  const apiOptions = store.getState().apiOptions;
  store.setState({ contributionsResult: { status: "pending" } });
  fetchApiResult(fetchContributions, apiOptions).then((contributionsResult) => {
    // TODO: validate contributionsResult and contributionsResult.data
    const { extensions, contributions: contributionModelsRecord } =
      contributionsResult.data!;
    const contributionStatesRecord: Record<ContribPoint, ContributionState[]> =
      {};
    Object.getOwnPropertyNames(contributionModelsRecord).forEach(
      (contribPoint: ContribPoint) => {
        const contributionModels: Contribution[] =
          contributionModelsRecord[contribPoint];
        contributionStatesRecord[contribPoint] = contributionModels.map(
          (contribution) => ({
            title: contribution.title,
            visible: contribution.visible,
            componentStateResult: {},
          }),
        );
      },
    );
    store.setState({
      contributionsResult,
      extensions,
      contributionModelsRecord,
      contributionStatesRecord,
    });
  });
}
