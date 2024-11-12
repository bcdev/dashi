import { type ComponentChangeEvent, handleComponentChange } from "@/lib";
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
    panelEvent: ComponentChangeEvent,
  ) => {
    handleComponentChange("panels", panelIndex, panelEvent);
  };
  const panels = panelStates.map((panelState, panelIndex) => {
    const { container, component, componentResult } = panelState;
    return (
      <Panel
        key={panelIndex}
        {...container}
        componentProps={component}
        componentStatus={componentResult.status}
        componentError={componentResult.error}
        onChange={(e) => handlePanelChange(panelIndex, e)}
      />
    );
  });
  return (
    <div style={{ display: "flex", gap: 5, paddingTop: 10 }}>{panels}</div>
  );
}

export default PanelsRow;
