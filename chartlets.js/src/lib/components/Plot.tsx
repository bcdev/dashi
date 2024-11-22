import { VegaLite, type VisualizationSpec } from "react-vega";

import { type ComponentState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/state/event";

export interface PlotState extends ComponentState {
  type: "Plot";
  chart:
    | (VisualizationSpec & {
        datasets?: Record<string, unknown>; // Add the datasets property
      })
    | null;
}

export interface PlotProps extends Omit<PlotState, "type"> {
  onChange: ComponentChangeHandler;
}

export function Plot({ id, style, chart, onChange }: PlotProps) {
  if (!chart) {
    return <div id={id} style={style} />;
  }
  const { datasets, ...spec } = chart;
  const handleSignal = (_signalName: string, value: unknown) => {
    if (id) {
      return onChange({
        componentType: "Plot",
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
