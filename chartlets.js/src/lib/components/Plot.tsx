import { VegaLite } from "react-vega";
import type { TopLevelSpec } from "vega-lite";
import { useTheme } from "@mui/material";

import { type ComponentState } from "@/lib/types/state/component";
import type { ComponentProps } from "@/lib/component/Component";
import { useSignalListeners } from "@/lib/hooks";

interface PlotState extends ComponentState {
  chart?:
    | TopLevelSpec // This is the vega-lite specification type
    | null;
}

interface PlotProps extends ComponentProps, PlotState {}

export function Plot({ type, id, style, chart, onChange }: PlotProps) {
  const muiTheme = useTheme();
  const signalListeners = useSignalListeners(chart, type, id, onChange);

  if (!chart) {
    return <div id={id} style={style} />;
  }

  return (
    <VegaLite
      theme={muiTheme.palette.mode === "dark" ? "dark" : undefined}
      spec={chart}
      style={style}
      signalListeners={signalListeners}
      actions={false}
    />
  );
}
