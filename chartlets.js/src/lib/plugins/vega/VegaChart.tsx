import { VegaLite } from "react-vega";
import type { TopLevelSpec } from "vega-lite";

import type { ComponentState, ComponentProps } from "@/lib";
import { useSignalListeners } from "./hooks/useSignalListeners";
import { useTheme, type VegaTheme } from "./hooks/useTheme";

interface PlotState extends ComponentState {
  theme?: VegaTheme | "default" | "system";
  chart?:
    | TopLevelSpec // This is the vega-lite specification type
    | null;
}

interface PlotProps extends ComponentProps, PlotState {}

export function VegaChart({
  type,
  id,
  style,
  theme,
  chart,
  onChange,
}: PlotProps) {
  const signalListeners = useSignalListeners(chart, type, id, onChange);
  const vegaTheme = useTheme(theme);
  if (chart) {
    return (
      <VegaLite
        theme={vegaTheme}
        spec={chart}
        style={style}
        signalListeners={signalListeners}
        actions={false}
      />
    );
  } else {
    return <div id={id} style={style} />;
  }
}
