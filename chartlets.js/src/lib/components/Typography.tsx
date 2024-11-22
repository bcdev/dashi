import MuiTypography from "@mui/material/Typography";
import { type TypographyVariant } from "@mui/material";

import { Children } from "@/lib/component/Children";
import type { ComponentState } from "@/lib/types/state/component";
import type { ComponentProps } from "@/lib/component/Component";

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
