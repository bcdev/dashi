import { updateContributionContainer } from "@/lib";
import type { PanelState } from "@/demo/types";

export function showPanel(panelIndex: number) {
  updateContributionContainer<PanelState>("panels", panelIndex, {
    visible: true,
  });
}
