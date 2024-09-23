import Plot from "react-plotly.js";
import { EventHandler, makeId, PlotModel } from "./model";

export interface DashiPlotProps extends Omit<PlotModel, "type"> {
  onEvent: EventHandler;
}

function DashiPlot({
  data,
  config,
  layout,
  id,
  name,
  value,
  onEvent,
}: DashiPlotProps) {
  return (
    <Plot
      divId={makeId("plot", id)}
      data={data}
      layout={layout}
      config={config}
      onClick={(event) => {
        onEvent({
          componentType: "plot",
          componentId: id,
          eventType: "onClick",
          eventData: {
            [name || "value"]: value,
            points: event.points,
          },
        });
      }}
    />
  );
}

export default DashiPlot;
