import { updateContributionContainer } from "@/lib";
import type { PanelState } from "@/demo/types";

export function hidePanel(panelIndex: number) {
  updateContributionContainer<PanelState>(
    "panels",
    panelIndex,
    {
      visible: false,
    },
    false,
  );
}
