import { VegaLite, type VisualizationSpec } from "react-vega";

import { type PlotState } from "@/lib/types/state/component";
import { type PropertyChangeHandler } from "@/lib/types/model/event";
import { useEffect, useState } from "react";
import type { TopLevelParameter } from "vega-lite/build/src/spec/toplevel";
import Button from "@mui/material/Button";

export interface DashiPlotProps extends Omit<PlotState, "type"> {
  onPropertyChange: PropertyChangeHandler;
}

export function DashiPlot({
  id,
  style,
  chart,
  onPropertyChange,
}: DashiPlotProps) {
  const [updatedSpec, setupdatedSpec] = useState<
    | (VisualizationSpec & {
        params?: TopLevelParameter[];
      })
    | null
  >();
  const enableClickMode = () => {
    const panAndZoom: { params: TopLevelParameter[] } = {
      params: [
        {
          name: "grid",
          select: "interval",
          bind: "scales",
        },
      ],
    };
    const spec = {
      ...updatedSpec,
      params: [...(updatedSpec?.params || []), ...panAndZoom.params],
    };
    setupdatedSpec(spec);
  };

  useEffect(() => {
    if (chart) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { datasets, ...specification } = chart;
      setupdatedSpec(specification);
    }
  }, [chart]);

  if (!chart) {
    return <div id={id} style={style} />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { datasets } = chart;
  if (!updatedSpec) {
    return null;
  }
  console.log("spec::", updatedSpec.params, updatedSpec);
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
    <>
      <Button onClick={enableClickMode}>Click me</Button>

      <VegaLite
        spec={updatedSpec}
        data={datasets}
        style={style}
        signalListeners={{ onClick: handleSignal }}
        actions={false}
        renderer={"svg"}
      />
    </>
  );
}
