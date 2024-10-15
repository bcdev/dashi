import { store } from "@/lib/store";
import { updateArray } from "@/lib/utils/updateArray";
import { type ContributionState } from "@/lib/types/state/contribution";
import { type ContribPoint } from "@/lib/types/model/extension";

export function updateContributionState(
  contribPoint: ContribPoint,
  panelIndex: number,
  panelState: Partial<ContributionState>,
) {
  const { contributionStatesRecord } = store.getState();
  const contribStates = contributionStatesRecord[contribPoint]!;
  store.setState({
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
