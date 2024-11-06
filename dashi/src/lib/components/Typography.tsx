import MuiTypography from "@mui/material/Typography";

import type { TypographyState } from "@/lib/types/state/component";

export interface TypographyProps extends Omit<TypographyState, "type"> {}

export function Typography({ id, style, text }: TypographyProps) {
  return (
    <MuiTypography id={id} style={style}>
      {text}
    </MuiTypography>
  );
}
