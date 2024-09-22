import Plot from "react-plotly.js";
import { EventHandler, makeId, PlotModel } from "./model";

interface DashiPlotProps extends PlotModel {
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
            [name]: value,
            points: event.points,
          },
        });
      }}
    />
  );
}

export default DashiPlot;
