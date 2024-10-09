import useAppStore from "../store/appStore";
import { hidePanel } from "../actions/hidePanel";
import { showPanel } from "../actions/showPanel";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

import { ContribPoint } from "../model/extension";

const contribPoint: ContribPoint = "panels";

function PanelsControl() {
  const contributionStatesRecord = useAppStore(
    (state) => state.contributionStatesRecord,
  );
  const panelStates = contributionStatesRecord[contribPoint];
  if (!panelStates) {
    // Ok, not ready yet
    return null;
  }

  return (
    <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
      {panelStates.map((panelState, panelIndex) => {
        const id = `panels.${panelIndex}`;
        return (
          <FormControlLabel
            key={panelIndex}
            label={panelState.title}
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
