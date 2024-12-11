import MuiTooltip from "@mui/material/Tooltip";
import type { ReactElement } from "react";

interface TooltipProps {
  title?: string;
  children: ReactElement;
}

export function Tooltip({ title, children }: TooltipProps) {
  return title ? <MuiTooltip title={title}>{children}</MuiTooltip> : children;
}
