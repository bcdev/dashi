import React, { type CSSProperties, useState } from "react";
import type { TopLevelParameter } from "vega-lite/build/src/spec/toplevel";
import LoupeIcon from "@mui/icons-material/Loupe";
import ReplayIcon from "@mui/icons-material/Replay";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import { Tooltip } from "@mui/material";
import { type PropertyChangeHandler } from "@/lib";
import type { PlotState } from "@/lib/types/state/component";
import { store } from "@/lib/store";

export interface DashiPlotToolbarProps {
  style: CSSProperties;
  children: React.ReactNode;
  panelIndex: number;
  onPropertyChange: PropertyChangeHandler;
}

export function DashiPlotToolbar({
  style,
  children,
  panelIndex,
  onPropertyChange,
}: DashiPlotToolbarProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

  const getLatestChart = () => {
    const { contributionStatesRecord } = store.getState();
    const contribPoint = "panels";
    const contributionState =
      contributionStatesRecord[contribPoint][panelIndex];
    const plot = contributionState?.componentState?.components?.find(
      (component) => component.type === "Plot",
    ) as PlotState;
    return plot?.chart;
  };

  let chart = getLatestChart();

  // TODO: Try to memoize the following
  // const chart = useMemo(() => {
  //   const plot = contributionState?.componentState?.components?.find(
  //     (component) => component.type === "Plot",
  //   ) as PlotState;
  //   return plot?.chart;
  // }, [contributionState]);

  // const parameters = useMemo(
  //   () =>
  //     chart?.params?.reduce((map, param, paramIndex) => {
  //       map.set(param.name, paramIndex);
  //       return map;
  //     }, new Map<string, number>()),
  //   [chart?.params],
  // );

  if (!chart) {
    return null;
  }

  const enablePanAndZoomMode = () => {
    resetMode();
    chart = getLatestChart();
    console.log("chart in zoom::", chart);
    const panAndZoom: { params: TopLevelParameter[] } = {
      params: [
        {
          name: "grid",
          select: "interval",
          bind: "scales",
        },
      ],
    };

    if (!chart?.params?.find((param) => param.name === "grid")) {
      const updatedSpec = {
        ...chart,
        params: [...(chart?.params || []), ...panAndZoom.params],
      };
      console.log("updatedSpec", updatedSpec);
      return onPropertyChange({
        componentType: "Plot",
        componentId: "plot",
        propertyName: "chart",
        propertyValue: updatedSpec,
      });
    }
  };

  const resetMode = () => {
    const filteredParams = chart?.params?.filter(
      (param) => !(param.name === "grid" || param.name === "brush"),
    );

    if (filteredParams !== chart?.params) {
      const spec = {
        ...chart,
        params: filteredParams,
      };
      return onPropertyChange({
        componentType: "Plot",
        componentId: "plot",
        propertyName: "chart",
        propertyValue: spec,
      });
    }
  };

  const enableBrushMode = () => {
    resetMode();
    chart = getLatestChart();
    console.log("chart in brush:", chart);
    const brush: { params: TopLevelParameter[] } = {
      params: [
        {
          name: "brush",
          select: "interval",
        },
      ],
    };

    if (!chart?.params?.find((param) => param.name === "brush")) {
      const updatedSpec = {
        ...chart,
        params: [...(chart?.params || []), ...brush.params],
      };
      return onPropertyChange({
        componentType: "Plot",
        componentId: "plot",
        propertyName: "chart",
        propertyValue: updatedSpec,
      });
    }
  };

  return (
    <div
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 8,
            zIndex: 10,
          }}
        >
          <Tooltip title={"Pan and Zoom"}>
            <LoupeIcon
              fontSize={"small"}
              onClick={enablePanAndZoomMode}
            ></LoupeIcon>
          </Tooltip>
          <Tooltip title={"Brush"}>
            <HighlightAltIcon
              fontSize={"small"}
              onClick={enableBrushMode}
            ></HighlightAltIcon>
          </Tooltip>
          <Tooltip title={"Reset Mode"}>
            <ReplayIcon fontSize={"small"} onClick={resetMode}></ReplayIcon>
          </Tooltip>
        </div>
      )}
      {children}
    </div>
  );
}
