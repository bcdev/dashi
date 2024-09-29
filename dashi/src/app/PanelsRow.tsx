import { ReactElement } from "react";
import { PropertyChangeEvent } from "../model/component.ts";
import { useAppStore } from "./appStore.ts";
import Panel from "./Panel.tsx";

function PanelsRow() {
  const appState = useAppStore();

  console.log("appState", appState);

  let panelElements: ReactElement | null = null;
  const contributionPointsResult = appState.contributionPointsResult;
  if (contributionPointsResult.data) {
    const panelModels = contributionPointsResult.data["panels"];
    const panelStates = appState.panelStates;
    if (
      !panelModels ||
      !panelStates ||
      panelModels.length != panelStates?.length
    ) {
      throw new Error("internal state error");
    }

    const handlePropertyChange = (
      panelIndex: number,
      panelEvent: PropertyChangeEvent,
    ) => {
      // TODO: invoke server-side callbacks
      //  and process result (-> change states)
      console.log(
        "propertyChange:",
        panelModels[panelIndex],
        panelStates[panelIndex],
        panelEvent,
      );
    };

    panelElements = (
      <>
        {panelStates
          .filter((panelState) => panelState.visible)
          .map((panelState, panelIndex) => (
            <Panel
              key={panelIndex}
              panelState={panelState}
              panelModel={panelModels[panelIndex]}
              onPropertyChange={(e) => handlePropertyChange(panelIndex, e)}
            />
          ))}
      </>
    );
  } else if (contributionPointsResult.error) {
    panelElements = (
      <div>Failed loading panels: {contributionPointsResult.error.message}</div>
    );
  } else if (contributionPointsResult.status === "pending") {
    panelElements = <div>Loading panels...</div>;
  } else {
    panelElements = <div>Weird panels state</div>;
  }
  return (
    <div style={{ display: "flex", gap: 5, paddingTop: 10 }}>
      {panelElements}
    </div>
  );
}

export default PanelsRow;
