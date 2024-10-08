import { ReactElement } from "react";
import { PropertyChangeEvent } from "../model/component";
import useAppStore from "../store/appStore";
import Panel from "./Panel";
import handleComponentPropertyChange from "../actions/handleComponentPropertyChange";
import { PanelModel } from "../model/panel";
import { JSX } from "react/jsx-runtime";

const contribPoint = "panels";

function PanelsRow() {
  const contributionStatesRecord = useAppStore(
    (state) => state.contributionStatesRecord,
  );
  const contributionsRecordResult = useAppStore(
    (state) => state.contributionsRecordResult,
  );

  let panelElements: ReactElement | null = null;
  if (contributionsRecordResult.data) {
    // TODO: Validate that PanelModel contains a title (It should be valid).
    //  It can be done in one central place and not everytime we need to render a panel
    const panelModels = contributionsRecordResult.data[
      contribPoint
    ] as PanelModel[];
    const panelStates = contributionStatesRecord[contribPoint];
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
        panelIndex,
        panelModels[panelIndex],
        panelStates[panelIndex],
        panelEvent,
      );
      handleComponentPropertyChange(contribPoint, panelIndex, panelEvent);
    };

    const visiblePanels: JSX.Element[] = [];
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
    panelElements = <>{visiblePanels}</>;
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
