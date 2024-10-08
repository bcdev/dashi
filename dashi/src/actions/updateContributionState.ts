import appStore from "../store/appStore";
import { updateArray } from "../utils/updateArray";
import { ContribPoint, ContributionState } from "../state/contribution";

export function updateContributionState(
  contribPoint: ContribPoint,
  panelIndex: number,
  panelState: Partial<ContributionState>,
) {
  const { contributionStatesRecord } = appStore.getState();
  const contribStates = contributionStatesRecord[contribPoint]!;
  appStore.setState({
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
