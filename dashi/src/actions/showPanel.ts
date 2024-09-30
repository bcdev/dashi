import { setComponentVisibility } from "./setComponentVisibility";

export function showPanel(panelIndex: number) {
  setComponentVisibility("panels", panelIndex, true);
}
