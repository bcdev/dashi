import type { ElementType } from "react";
import MuiDivider from "@mui/material/Divider";

import type { ComponentState, ComponentProps } from "@/index";
import { Children } from "@/index";

interface DividerState extends ComponentState {
  orientation?: "horizontal" | "vertical";
  variant?: "fullWidth" | "inset" | "middle";
  flexItem?: boolean;
  textAlign?: "left" | "center" | "right";
  component?: ElementType<Element>;
}

interface DividerProps extends ComponentProps, DividerState {}

export const Divider = ({
  id,
  style,
  orientation,
  variant,
  flexItem,
  textAlign,
  children: nodes,
  onChange,
}: DividerProps) => {
  return (
    <MuiDivider
      id={id}
      style={style}
      orientation={orientation}
      variant={variant}
      flexItem={flexItem}
      textAlign={textAlign}
    >
      <Children nodes={nodes} onChange={onChange} />
    </MuiDivider>
  );
};
