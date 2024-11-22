import { VegaLite } from "react-vega";

import { type PlotState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/state/event";

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
