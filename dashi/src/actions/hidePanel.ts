import appStore from "../store/appStore";
import { updatePanelState } from "./updatePanelState";

export function hidePanel(panelIndex: number) {
  const panelStates = appStore.getState().panelStates;
  if (panelStates && panelStates[panelIndex].visible) {
    updatePanelState(panelIndex, { visible: false });
  }
}
