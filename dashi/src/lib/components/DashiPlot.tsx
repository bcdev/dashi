import { createClassFromSpec } from "react-vega";

import { type PlotState } from "@/lib/types/state/component";
import { type PropertyChangeHandler } from "@/lib/types/model/event";
import type { CSSProperties } from "react";

export interface DashiPlotProps extends Omit<PlotState, "type"> {
  onPropertyChange: PropertyChangeHandler;
}

interface VegaChartWrapperProps {
  id?: string;
  style?: CSSProperties;
}

export function DashiPlot({
  id,
  style,
  figure,
  onPropertyChange,
}: DashiPlotProps) {
  if (!figure) {
    console.error(
      "Rendering DashiPlot failed:",
      "Expected figure, got",
      figure,
    );
    return null;
  }
  const { datasets, ...spec } = figure;
  const Plot = createClassFromSpec({
    mode: "vega-lite",
    spec: spec,
  });
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
  const VegaChartWrapper = ({ id, style }: VegaChartWrapperProps) => {
    return (
      <div id={id} style={style}>
        <Plot data={datasets} signalListeners={{ onClick: handleSignal }} />
      </div>
    );
  };
  return <VegaChartWrapper id={id} style={style} />;
}
