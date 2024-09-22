import Plot from "react-plotly.js";
import { EventHandler, PlotModel } from "./types";

interface DashiPlotProps extends PlotModel {
  onEvent: EventHandler;
}

function DashiPlot({ data, config, layout, id, onEvent }: DashiPlotProps) {
  return (
    <Plot
      data={data}
      layout={layout}
      config={config}
      onClick={(event) => {
        onEvent({
          componentType: "plot",
          componentId: id,
          eventType: "onClick",
          eventData: {
            points: event.points,
          },
        });
      }}
    />
  );
}

export default DashiPlot;
