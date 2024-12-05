import MuiCircularProgress from "@mui/material/CircularProgress";

import type { ComponentState, ComponentProps } from "@/lib";

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
