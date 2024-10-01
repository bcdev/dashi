import { BoxModel, PropertyChangeHandler } from "../model/component";
import DashiChildren from "./DashiChildren";
import {Box} from "@mui/material";

export interface DashiBoxProps extends Omit<BoxModel, "type"> {
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
