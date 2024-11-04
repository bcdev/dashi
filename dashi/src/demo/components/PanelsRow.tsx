import type { JSX } from "react";

import { type PropertyChangeEvent, handleComponentChange } from "@/lib";
import { usePanelStates } from "@/demo/hooks";
import Panel from "./Panel";

function PanelsRow() {
  const panelStates = usePanelStates();
  if (!panelStates) {
    // Ok, not ready yet
    return null;
  }

  const handlePanelChange = (
    panelIndex: number,
    panelEvent: PropertyChangeEvent,
  ) => {
    handleComponentChange("panels", panelIndex, panelEvent);
  };
  const visiblePanels: JSX.Element[] = [];
  panelStates.forEach((panelState, panelIndex) => {
    if (panelState.state.visible) {
      visiblePanels.push(
        <Panel
          key={panelIndex}
          {...panelState}
          onPropertyChange={(e) => handlePanelChange(panelIndex, e)}
        />,
      );
    }
  });
  const panelElements = <>{visiblePanels}</>;
  return (
    <div style={{ display: "flex", gap: 5, paddingTop: 10 }}>
      {panelElements}
    </div>
  );
}

export default PanelsRow;
