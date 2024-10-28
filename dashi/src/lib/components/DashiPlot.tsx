import { VegaLite } from "react-vega";
import { type PropertyChangeHandler } from "@/lib/types/model/event";

import { type PlotState } from "@/lib/types/state/component";
import { DashiPlotToolbar } from "@/lib/components/DashiPlotToolbar";

export interface DashiPlotProps extends Omit<PlotState, "type"> {
  onPropertyChange: PropertyChangeHandler;
  panelIndex: number;
}

export function DashiPlot({
  id,
  style,
  chart,
  panelIndex,
  onPropertyChange,
}: DashiPlotProps) {
  if (!chart) {
    return <div id={id} style={style} />;
  }
  const { datasets, ...specification } = chart;

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
    <DashiPlotToolbar
      style={{ position: "relative", display: "inline-block" }}
      onPropertyChange={onPropertyChange}
      panelIndex={panelIndex}
    >
      <VegaLite
        spec={specification}
        data={datasets}
        style={style}
        signalListeners={{ onClick: handleSignal }}
        actions={false}
        renderer={"svg"}
      />
    </DashiPlotToolbar>
  );
}
