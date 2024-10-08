import useAppStore from "../store/appStore";
import { hidePanel } from "../actions/hidePanel";
import { showPanel } from "../actions/showPanel";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

import { ContribPoint } from "../model/extension";

const contribPoint: ContribPoint = "panels";

function PanelsControl() {
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

  return (
    <FormGroup>
      {panelStates.map((panelState, panelIndex) => {
        const id = `panels.${panelIndex}`;
        return (
          <FormControlLabel
            key={panelIndex}
            label={panelModels[panelIndex].name}
            control={
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
            }
          />
        );
      })}
    </FormGroup>
  );
}

export default PanelsControl;
