import { updateContributionState } from "@/lib";
import type { PanelState } from "@/demo/types";

export function hidePanel(panelIndex: number) {
  updateContributionState<PanelState>("panels", panelIndex, { visible: false });
}
