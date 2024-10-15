import { setComponentVisibility } from "@/lib";

export function hidePanel(panelIndex: number) {
  setComponentVisibility("panels", panelIndex, false);
}
