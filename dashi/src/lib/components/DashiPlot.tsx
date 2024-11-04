import { VegaLite } from "react-vega";

import { type PlotState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/model/event";

export interface DashiPlotProps extends Omit<PlotState, "type"> {
  onPropertyChange: ComponentChangeHandler;
}

export function DashiPlot({
  id,
  style,
  chart,
  onPropertyChange,
}: DashiPlotProps) {
  if (!chart) {
    return <div id={id} style={style} />;
  }
  const { datasets, ...spec } = chart;
  const handleSignal = (_signalName: string, value: unknown) => {
    if (id) {
      return onPropertyChange({
        componentType: "Plot",
        componentId: id,
        propertyName: "points",
        propertyValue: value,
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
