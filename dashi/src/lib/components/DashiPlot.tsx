import { createClassFromSpec, type VisualizationSpec } from "react-vega";

import { type PlotState } from "@/lib/types/state/component";
import { type PropertyChangeHandler } from "@/lib/types/model/event";
import type { CSSProperties } from "react";

export interface DashiPlotProps
  extends Omit<PlotState, "type">,
    Omit<PlotState, "onPropertyChange"> {
  onPropertyChange: PropertyChangeHandler;
}

interface VegaChartWrapperProps {
  id?: string;
  style?: CSSProperties;
}

const specification: VisualizationSpec = {
  config: { view: { continuousWidth: 300, continuousHeight: 300 } },
  data: { name: "myData" },
  mark: { type: "bar" },
  description: "A simple bar chart with embedded data.",
  encoding: {
    tooltip: [
      { field: "a", title: "a", type: "nominal" },
      { field: "b", title: "b", type: "quantitative" },
    ],
    x: { field: "a", title: "a", type: "nominal" },
    y: { field: "b", title: "b", type: "quantitative" },
  },
  params: [{ name: "click", select: { type: "point", on: "click" } }],
  $schema: "https://vega.github.io/schema/vega-lite/v5.20.1.json",
  datasets: {},
};

const data = {
  myData: [
    { a: "A", b: 28 },
    { a: "B", b: 55 },
    { a: "C", b: 43 },
    { a: "D", b: 91 },
    { a: "E", b: 81 },
    { a: "F", b: 53 },
    { a: "G", b: 19 },
    { a: "H", b: 87 },
    { a: "I", b: 52 },
  ],
};

export function DashiPlot({
  id,
  style,
  // onPropertyChange,
}: DashiPlotProps) {
  const Plot = createClassFromSpec({
    mode: "vega-lite",
    spec: specification,
  });
  const VegaChartWrapper = ({ id, style }: VegaChartWrapperProps) => {
    return (
      <div id={id} style={style}>
        <Plot data={data} />
      </div>
    );
  };
  return <VegaChartWrapper id={id} style={style} />;
}
