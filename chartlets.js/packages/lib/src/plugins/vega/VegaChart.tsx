import { VegaLite } from "react-vega";
import type { TopLevelSpec } from "vega-lite";

import type { ComponentState, ComponentProps } from "@/index";
import { useSignalListeners } from "./hooks/useSignalListeners";
import { useVegaTheme, type VegaTheme } from "./hooks/useVegaTheme";

interface VegaChartState extends ComponentState {
  theme?: VegaTheme | "default" | "system";
  chart?:
    | TopLevelSpec // This is the vega-lite specification type
    | null;
}

interface VegaChartProps extends ComponentProps, VegaChartState {}

export function VegaChart({
  type,
  id,
  style,
  theme,
  chart,
  onChange,
}: VegaChartProps) {
  const signalListeners = useSignalListeners(chart, type, id, onChange);
  const vegaTheme = useVegaTheme(theme);
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
