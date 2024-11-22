import MuiCircularProgress from "@mui/material/CircularProgress";

import { type ComponentState } from "@/lib/types/state/component";

export interface CircularProgressState extends ComponentState {
  type: "CircularProgress";
  size?: number | string;
  value?: number;
  variant?: "determinate" | "indeterminate";
}

export interface CircularProgressProps
  extends Omit<CircularProgressState, "type"> {}

export function CircularProgress({
  id,
  style,
  size,
  value,
  variant,
}: CircularProgressProps) {
  return (
    <MuiCircularProgress
      id={id}
      style={style}
      size={size}
      value={value}
      variant={variant}
    />
  );
}
