import Box from "@mui/material/Box";

import { type BoxState } from "@/lib/types/state/component";
import { type PropertyChangeHandler } from "@/lib/types/model/event";
import { DashiChildren } from "./DashiChildren";

export interface DashiBoxProps extends Omit<BoxState, "type"> {
  onPropertyChange: PropertyChangeHandler;
}

export function DashiBox({
  id,
  style,
  components,
  onPropertyChange,
}: DashiBoxProps) {
  return (
    <Box id={id} style={style}>
      <DashiChildren
        components={components}
        onPropertyChange={onPropertyChange}
      />
    </Box>
  );
}
