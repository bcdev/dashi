import MuiTypography from "@mui/material/Typography";
import { type TypographyVariant } from "@mui/material";

import type { ComponentState, ComponentProps } from "@/index";
import { Children } from "@/index";

interface TypographyState extends ComponentState {
  align?: "right" | "left" | "center" | "inherit" | "justify";
  gutterBottom?: boolean;
  noWrap?: boolean;
  variant?: TypographyVariant;
}

interface TypographyProps extends ComponentProps, TypographyState {}

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
      <Children nodes={nodes} onChange={onChange} />
    </MuiTypography>
  );
}
