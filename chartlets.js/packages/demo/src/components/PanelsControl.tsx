import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

import { useContributions } from "chartlets";

import { hidePanel } from "@/actions/hidePanel";
import { showPanel } from "@/actions/showPanel";
import type { PanelState } from "@/types";

function PanelsControl() {
  const panelStates = useContributions<PanelState>("panels");
  if (!panelStates) {
    // Ok, not ready yet
    return null;
  }

  return (
    <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
      {panelStates.map((panelState, panelIndex) => {
        const id = `panels.${panelIndex}`;
        const { title, visible } = panelState.container;
        return (
          <FormControlLabel
            key={panelIndex}
            label={title}
            control={
              <Checkbox
                color="secondary"
                id={id}
                checked={visible || false}
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
