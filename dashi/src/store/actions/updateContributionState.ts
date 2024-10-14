import systemStore from "@/store/system";
import { updateArray } from "@/utils/updateArray";
import { ContributionState } from "@/state/contribution";
import { ContribPoint } from "@/model/extension";

export function updateContributionState(
  contribPoint: ContribPoint,
  panelIndex: number,
  panelState: Partial<ContributionState>,
) {
  const { contributionStatesRecord } = systemStore.getState();
  const contribStates = contributionStatesRecord[contribPoint]!;
  systemStore.setState({
    contributionStatesRecord: {
      ...contributionStatesRecord,
      [contribPoint]: updateArray<ContributionState>(
        contribStates,
        panelIndex,
        panelState,
      ),
    },
  });
}
