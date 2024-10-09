import Box from "@mui/material/Box";

import { BoxState } from "../state/component";
import { PropertyChangeHandler } from "../model/event";
import DashiChildren from "./DashiChildren";

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
