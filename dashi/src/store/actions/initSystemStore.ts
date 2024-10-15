import systemStore from "@/store/system";
import fetchApiResult from "@/utils/fetchApiResult";
import { ApiOptions, fetchContributions } from "@/api";
import { Contribution } from "@/model/contribution";
import { ContributionState } from "@/state/contribution";
import { ContribPoint } from "@/model/extension";

export function initSystemStore(apiOptions?: ApiOptions) {
  const set = systemStore.setState;

  set({ apiOptions, contributionsResult: { status: "pending" } });
  fetchApiResult(fetchContributions, apiOptions).then((contributionsResult) => {
    // TODO: assert Boolean(contributionsResult.data)
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
    set({
      contributionsResult,
      extensions,
      contributionModelsRecord,
      contributionStatesRecord,
    });
  });
}
