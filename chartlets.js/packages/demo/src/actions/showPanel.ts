import { updateContributionContainer } from "chartlets";

import type { PanelState } from "@/types";

export function showPanel(panelIndex: number) {
  updateContributionContainer<PanelState>("panels", panelIndex, {
    visible: true,
  });
}
