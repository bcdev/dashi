import MuiBox from "@mui/material/Box";

import type { ElementType } from "react";
import type { ComponentState } from "@/lib/types/state/component";
import type { ComponentProps } from "@/lib/component/Component";
import { Children } from "@/lib/component/Children";

interface BoxState extends ComponentState {
  component?: ElementType<Element>;
}

interface BoxProps extends ComponentProps, BoxState {}

export function Box({
  id,
  style,
  color,
  component,
  children: nodes,
  onChange,
}: BoxProps) {
  return (
    <MuiBox id={id} style={style} color={color} component={component || "div"}>
      <Children nodes={nodes} onChange={onChange} />
    </MuiBox>
  );
}
