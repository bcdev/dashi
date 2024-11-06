import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

import { hidePanel } from "@/demo/actions/hidePanel";
import { showPanel } from "@/demo/actions/showPanel";
import { usePanelStates } from "@/demo/hooks";

function PanelsControl() {
  const panelStates = usePanelStates();
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
