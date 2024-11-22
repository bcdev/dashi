import MuiCircularProgress from "@mui/material/CircularProgress";

import { type ComponentState } from "@/lib/types/state/component";
import type { ComponentProps } from "@/lib/component/Component";

interface CircularProgressState extends ComponentState {
  size?: number | string;
  value?: number;
  variant?: "determinate" | "indeterminate";
}

interface CircularProgressProps extends ComponentProps, CircularProgressState {}

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
