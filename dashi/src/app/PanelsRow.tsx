import { ReactElement } from "react";
import { PropertyChangeEvent } from "../model/component";
import useAppStore from "../store/appStore";
import Panel from "./Panel";
import handleComponentPropertyChange from "../actions/handleComponentPropertyChange";

const contribPoint = "panels";

function PanelsRow() {
  const appState = useAppStore();

  console.log("appState", appState);

  let panelElements: ReactElement | null = null;
  const contributionsRecordResult = appState.contributionsRecordResult;
  if (contributionsRecordResult.data) {
    const panelModels = contributionsRecordResult.data[contribPoint];
    const panelStates = appState.contributionStatesRecord[contribPoint];
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
      console.log(
        "propertyChange:",
        panelModels[panelIndex],
        panelStates[panelIndex],
        panelEvent,
      );
      handleComponentPropertyChange(contribPoint, panelIndex, panelEvent);
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
  } else if (contributionsRecordResult.error) {
    panelElements = (
      <div>
        Failed loading panels: {contributionsRecordResult.error.message}
      </div>
    );
  } else if (contributionsRecordResult.status === "pending") {
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
