import React from "react";
import {
  useContributionModelsRecord,
  useContributionStatesRecord,
} from "@/hooks";
import applyPropertyChange from "@/store/actions/applyPropertyChange";
import { PropertyChangeEvent } from "@/model/event";
import Panel from "./Panel";

const contribPoint = "panels";

function PanelsRow() {
  const contributionModelsRecord = useContributionModelsRecord();
  const contributionStatesRecord = useContributionStatesRecord();
  const panelModels = contributionModelsRecord[contribPoint];
  const panelStates = contributionStatesRecord[contribPoint];
  if (!panelModels || !panelStates) {
    // Ok, not ready yet
    return null;
  }
  // TODO: assert panelModels.length === panelStates.length
  if (panelModels.length != panelStates?.length) {
    throw Error("internal state error");
  }

  const handlePropertyChange = (
    panelIndex: number,
    panelEvent: PropertyChangeEvent,
  ) => {
    applyPropertyChange(contribPoint, panelIndex, panelEvent);
  };
  const visiblePanels: React.JSX.Element[] = [];
  panelStates.forEach((panelState, panelIndex) => {
    if (panelState.visible) {
      visiblePanels.push(
        <Panel
          key={panelIndex}
          panelState={panelState}
          panelModel={panelModels[panelIndex]}
          onPropertyChange={(e) => handlePropertyChange(panelIndex, e)}
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
