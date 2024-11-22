import MuiTypography from "@mui/material/Typography";
import { type TypographyVariant } from "@mui/material";

import { ComponentChildren } from "@/lib/components/ComponentChildren";
import type { ComponentChangeHandler, ContainerState } from "@/lib";

export interface TypographyState extends ContainerState {
  type: "Typography";
  align?: "right" | "left" | "center" | "inherit" | "justify";
  gutterBottom?: boolean;
  noWrap?: boolean;
  variant?: TypographyVariant;
}

export interface TypographyProps extends Omit<TypographyState, "type"> {
  onChange: ComponentChangeHandler;
}

export function Typography({
  id,
  style,
  align,
  gutterBottom,
  noWrap,
  variant,
  children: nodes,
  onChange,
}: TypographyProps) {
  return (
    <MuiTypography
      id={id}
      style={style}
      align={align}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      variant={variant}
    >
      <ComponentChildren nodes={nodes} onChange={onChange} />
    </MuiTypography>
  );
}
