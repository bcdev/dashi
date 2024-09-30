import { setComponentVisibility } from "./setComponentVisibility";

export function hidePanel(panelIndex: number) {
  setComponentVisibility("panels", panelIndex, false);
}
