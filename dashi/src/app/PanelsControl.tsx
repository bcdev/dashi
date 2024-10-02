import useAppStore, { ContribPoint } from "../store/appStore";
import { hidePanel } from "../actions/hidePanel";
import { showPanel } from "../actions/showPanel";
import {Checkbox} from "@mui/material";

const contribPoint: ContribPoint = "panels";

function PanelsControl() {
  const appState = useAppStore();

  const contributionsRecordResult = appState.contributionsRecordResult;
  const contributionsRecord = contributionsRecordResult.data;
  if (!contributionsRecord) {
    return null;
  }
  const panelModels = contributionsRecord[contribPoint];
  const panelStates = appState.contributionStatesRecord[contribPoint];
  if (
    !panelModels ||
    !panelStates ||
    panelModels.length != panelStates?.length
  ) {
    throw Error("internal state error");
  }
  return (
    <div style={{ padding: 5 }}>
      {panelStates.map((panelState, panelIndex) => {
        const id = `panels.${panelIndex}`;
        return (
          <div key={id}>
            <Checkbox
              color="secondary"
              id={id}
              checked={panelState.visible || false}
              value={panelIndex}
              onChange={(e) => {
                if (e.currentTarget.checked) {
                  showPanel(panelIndex);
                } else {
                  hidePanel(panelIndex);
                }
              }}
            />
            <label htmlFor={id}>{panelModels[panelIndex].name}</label>
          </div>
        );
      })}
    </div>
  );
}

export default PanelsControl;
