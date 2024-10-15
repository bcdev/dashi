import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

import { useContributionStatesRecord } from "@/lib";
import { hidePanel } from "@/demo/actions/hidePanel";
import { showPanel } from "@/demo/actions/showPanel";

const contribPoint = "panels";

function PanelsControl() {
  const contributionStatesRecord = useContributionStatesRecord();
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
