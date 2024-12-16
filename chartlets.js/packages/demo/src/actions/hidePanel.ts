import { updateContributionContainer } from "chartlets";
import type { PanelState } from "@/types";

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
