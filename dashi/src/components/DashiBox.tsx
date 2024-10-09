import { BoxState } from "../state/component";
import DashiChildren from "./DashiChildren";
import { Box } from "@mui/material";
import { PropertyChangeHandler } from "../model/event";

export interface DashiBoxProps extends Omit<BoxState, "type"> {
  onPropertyChange: PropertyChangeHandler;
}

function DashiBox({ id, style, components, onPropertyChange }: DashiBoxProps) {
  return (
    <Box id={id} style={style}>
      <DashiChildren
        components={components}
        onPropertyChange={onPropertyChange}
      />
    </Box>
  );
}

export default DashiBox;
