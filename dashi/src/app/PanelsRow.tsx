import useAppStore from "../store/appStore";
import applyPropertyChange from "../actions/applyPropertyChange";
import { PropertyChangeEvent } from "../model/event";
import Panel from "./Panel";

const contribPoint = "panels";

function PanelsRow() {
  const contributionModelsRecord = useAppStore(
    (state) => state.contributionModelsRecord,
  );
  const contributionStatesRecord = useAppStore(
    (state) => state.contributionStatesRecord,
  );
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

  return (
    <div style={{ display: "flex", gap: 5, paddingTop: 10 }}>
      {panelStates
        .filter((panelState) => panelState.visible)
        .map((panelState, panelIndex) => (
          <Panel
            key={panelIndex}
            panelModel={panelModels[panelIndex]}
            panelState={panelState}
            onPropertyChange={(e) => handlePropertyChange(panelIndex, e)}
          />
        ))}
    </div>
  );
}

export default PanelsRow;
