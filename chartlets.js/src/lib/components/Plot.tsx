import { VegaLite } from "react-vega";

import { type ComponentState } from "@/lib/types/state/component";
import type { ComponentProps } from "@/lib/component/Component";
import { useSignalListeners } from "@/lib/hooks";
import type { TopLevelSpec } from "vega-lite";

interface PlotState extends ComponentState {
  chart?:
    | TopLevelSpec // This is the vega-lite specification type
    | null;
}

interface PlotProps extends ComponentProps, PlotState {}

export function Plot({ type, id, style, chart, onChange }: PlotProps) {
  const signalListeners = useSignalListeners(chart, type, id, onChange);

  if (!chart) {
    return <div id={id} style={style} />;
  }

  return (
    <VegaLite
      spec={chart}
      style={style}
      signalListeners={signalListeners}
      actions={false}
    />
  );
}
