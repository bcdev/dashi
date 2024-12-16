import type { PanelState } from "@/types";

import { useComponentChangeHandlers, useContributions } from "chartlets";

import Panel from "./Panel";

function PanelsRow() {
  const panelStates = useContributions<PanelState>("panels");
  const panelChangeHandlers = useComponentChangeHandlers(
    "panels",
    panelStates?.length || 0,
  );
  if (!panelStates) {
    // Ok, not ready yet
    return null;
  }

  const panels = panelStates.map((panelState, panelIndex) => {
    const { container, component, componentResult } = panelState;
    return (
      <Panel
        key={panelIndex}
        {...container}
        componentProps={component}
        componentStatus={componentResult.status}
        componentError={componentResult.error}
        onChange={panelChangeHandlers[panelIndex]}
      />
    );
  });
  return (
    <div style={{ display: "flex", gap: 5, paddingTop: 10 }}>{panels}</div>
  );
}

export default PanelsRow;
