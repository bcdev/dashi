import Plot from "react-plotly.js";
import { PropertyChangeHandler, PlotModel } from "../model/component";

export interface DashiPlotProps extends Omit<PlotModel, "type"> {
  onPropertyChange: PropertyChangeHandler;
}

function DashiPlot({ id, style, figure, onPropertyChange }: DashiPlotProps) {
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

export default DashiPlot;
