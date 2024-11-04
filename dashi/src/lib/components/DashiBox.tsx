import Box from "@mui/material/Box";

import { type BoxState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/model/event";
import { DashiChildren } from "./DashiChildren";

export interface DashiBoxProps extends Omit<BoxState, "type"> {
  onChange: ComponentChangeHandler;
}

export function DashiBox({ id, style, components, onChange }: DashiBoxProps) {
  return (
    <Box id={id} style={style}>
      <DashiChildren components={components} onChange={onChange} />
    </Box>
  );
}
