import MuiBox from "@mui/material/Box";

import type { ComponentState } from "@/lib/types/state/component";
import { Children } from "../component/Children";
import type { ComponentProps } from "@/lib/component/Component";

interface BoxState extends ComponentState {}

interface BoxProps extends ComponentProps, BoxState {}

export function Box({ id, style, children, onChange }: BoxProps) {
  return (
    <MuiBox id={id} style={style}>
      <Children nodes={children} onChange={onChange} />
    </MuiBox>
  );
}
