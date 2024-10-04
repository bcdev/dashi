import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { PropertyChangeHandler, PlotModel } from "../model/component";

export interface DashiPlotProps extends Omit<PlotModel, "type"> {
  onPropertyChange: PropertyChangeHandler;
}

function DashiPlot({ id, style, figure, onPropertyChange }: DashiPlotProps) {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    setRevision(revision + 1);
    // eslint-disable-next-line
  }, [figure?.data, figure?.layout, figure?.config]);

  console.log("rendering panel, revision =", revision, ", figure =", figure);

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
      revision={revision}
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
