import appStore, { ContribPoint } from "../store/appStore";
import { updateContributionState } from "./updateContributionState";

export function hidePanel(panelIndex: number) {
  const contribPoint: ContribPoint = "panels";
  const panelStates =
    appStore.getState().contributionStatesRecord[contribPoint];
  if (panelStates && panelStates[panelIndex].visible) {
    updateContributionState(panelIndex, { visible: false });
  }
}
