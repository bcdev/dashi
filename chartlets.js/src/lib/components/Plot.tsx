import { VegaLite, type VisualizationSpec } from "react-vega";

import { type ComponentState } from "@/lib/types/state/component";
import type { ComponentProps } from "@/lib/component/Component";

interface PlotState extends ComponentState {
  chart?:
    | (VisualizationSpec & {
        datasets?: Record<string, unknown>; // Add the datasets property
      })
    | null
    | undefined;
}

interface PlotProps extends ComponentProps, PlotState {}

export function Plot({ type, id, style, chart, onChange }: PlotProps) {
  if (!chart) {
    return <div id={id} style={style} />;
  }
  const { datasets, ...spec } = chart;
  const handleSignal = (_signalName: string, value: unknown) => {
    if (id) {
      return onChange({
        componentType: type,
        id: id,
        property: "points",
        value: value,
      });
    }
  };
  return (
    <VegaLite
      spec={spec}
      data={datasets}
      style={style}
      signalListeners={{ onClick: handleSignal }}
      actions={false}
    />
  );
}
