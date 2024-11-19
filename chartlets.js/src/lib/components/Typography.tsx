import MuiTypography from "@mui/material/Typography";

import type { TypographyState } from "@/lib/types/state/component";
import { ComponentChildren } from "@/lib/components/ComponentChildren";
import type { ComponentChangeHandler } from "@/lib";

export interface TypographyProps extends Omit<TypographyState, "type"> {
  onChange: ComponentChangeHandler;
}

export function Typography({
  id,
  style,
  children: components,
  onChange,
}: TypographyProps) {
  return (
    <MuiTypography id={id} style={style}>
      <ComponentChildren components={components} onChange={onChange} />
    </MuiTypography>
  );
}
