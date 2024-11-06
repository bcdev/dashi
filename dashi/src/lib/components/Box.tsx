import MuiBox from "@mui/material/Box";

import { type BoxState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/model/event";
import { ComponentChildren } from "./ComponentChildren";

export interface BoxProps extends Omit<BoxState, "type"> {
  onChange: ComponentChangeHandler;
}

export function Box({ id, style, components, onChange }: BoxProps) {
  return (
    <MuiBox id={id} style={style}>
      <ComponentChildren components={components} onChange={onChange} />
    </MuiBox>
  );
}
