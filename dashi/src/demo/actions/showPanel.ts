import { setComponentVisibility } from "@/lib";

export function showPanel(panelIndex: number) {
  setComponentVisibility("panels", panelIndex, true);
}
