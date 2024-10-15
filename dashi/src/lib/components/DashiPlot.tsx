import Plot from "react-plotly.js";

import { type PlotState } from "@/lib/types/state/component";
import { type PropertyChangeHandler } from "@/lib/types/model/event";

export interface DashiPlotProps extends Omit<PlotState, "type"> {
  onPropertyChange: PropertyChangeHandler;
}

export function DashiPlot({
  id,
  style,
  figure,
  onPropertyChange,
}: DashiPlotProps) {
  if (!figure) {
    return <div id={id} style={style} />;
  }
  return (
    <Plot
      divId={id}
      style={style}
      data={figure.data}
      layout={figure.layout}
      config={figure.config}
      onClick={(event) => {
        if (id) {
          onPropertyChange({
            componentType: "Plot",
            componentId: id,
            propertyName: "points",
            propertyValue: event.points,
          });
        }
      }}
    />
  );
}
