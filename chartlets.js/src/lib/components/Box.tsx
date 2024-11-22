import MuiBox from "@mui/material/Box";

import { type ContainerState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/state/event";
import { ComponentChildren } from "./ComponentChildren";

export interface BoxState extends ContainerState {
  type: "Box";
}

export interface BoxProps extends Omit<BoxState, "type"> {
  onChange: ComponentChangeHandler;
}

export function Box({ id, style, children: components, onChange }: BoxProps) {
  return (
    <MuiBox id={id} style={style}>
      <ComponentChildren components={components} onChange={onChange} />
    </MuiBox>
  );
}
