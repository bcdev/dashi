import React, { type CSSProperties, useState } from "react";
import type { TopLevelParameter } from "vega-lite/build/src/spec/toplevel";
import { Tooltip } from "@mui/material";
import { type PropertyChangeHandler } from "@/lib";
import type { PlotState } from "@/lib/types/state/component";
import type { Transform } from "vega-lite/build/src/transform";
import LoupeIcon from "@mui/icons-material/Loupe";
import ReplayIcon from "@mui/icons-material/Replay";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import SignalCellular4BarIcon from "@mui/icons-material/SignalCellular4Bar";

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

  enum ChartStatus {
    ORIGINAL,
    CURRENT,
  }

  const getLatestChart = (chartStatus: ChartStatus) => {
    const { contributionStatesRecord } = store.getState();
    const contribPoint = "panels";
    const contributionState =
      contributionStatesRecord[contribPoint][panelIndex];
    const plot = contributionState?.componentState?.components?.find(
      (component) => component.type === "Plot",
    ) as PlotState;
    switch (chartStatus) {
      case ChartStatus.ORIGINAL: {
        return plot?.originalChart;
      }
      case ChartStatus.CURRENT: {
        return plot?.chart;
      }
    }
  };

  let chart = getLatestChart(ChartStatus.CURRENT);

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

  enum Toolbar {
    PanAndZoom,
    Brush,
    MiniMapZoom,
  }

  interface ToolbarSpec {
    params: TopLevelParameter[];
    transform?: Transform[];
  }

  const getToolbarSpec = (toolbar: Toolbar): ToolbarSpec => {
    switch (toolbar) {
      case Toolbar.PanAndZoom:
        return {
          params: [
            {
              name: "grid",
              select: "interval",
              bind: "scales",
            },
          ],
        };
      case Toolbar.Brush:
        return {
          params: [
            {
              name: "brush",
              select: "interval",
            },
          ],
        };
      case Toolbar.MiniMapZoom:
        return {
          params: [
            {
              name: "brush",
              select: { type: "interval", encodings: ["x"] },
            },
          ],
          transform: [
            {
              filter: { param: "brush" },
            },
          ],
        };
    }
  };

  const enableMiniMap = () => {
    resetMode();
    chart = getLatestChart(ChartStatus.CURRENT);
    const minimapZoom = getToolbarSpec(Toolbar.MiniMapZoom);
    if (!chart) {
      return null;
    }
    if (!chart?.params?.find((param) => param.name === "grid")) {
      const { $schema, config, data, datasets, ...rest } = chart;
      const updatedChart = {
        $schema,
        config,
        data,
        datasets,
        vconcat: [
          {
            ...rest,
            transform: minimapZoom.transform,
            params: [],
          },
          {
            ...rest,
            height: 60,
            params: minimapZoom.params,
          },
        ],
      };
      console.log("after::", updatedChart);
      return onPropertyChange({
        componentType: "Plot",
        componentId: "plot",
        propertyName: "chart",
        propertyValue: updatedChart,
      });
    }
  };

  const enablePanAndZoomMode = () => {
    resetMode();
    chart = getLatestChart(ChartStatus.CURRENT);

    const panAndZoom = getToolbarSpec(Toolbar.PanAndZoom);

    if (!chart?.params?.find((param) => param.name === "grid")) {
      const updatedChart = {
        ...chart,
        params: [...(chart?.params || []), ...panAndZoom.params],
      };
      return onPropertyChange({
        componentType: "Plot",
        componentId: "plot",
        propertyName: "chart",
        propertyValue: updatedChart,
      });
    }
  };

  const resetMode = () => {
    chart = getLatestChart(ChartStatus.ORIGINAL);
    return onPropertyChange({
      componentType: "Plot",
      componentId: "plot",
      propertyName: "chart",
      propertyValue: chart,
    });
  };

  const enableBrushMode = () => {
    resetMode();
    chart = getLatestChart(ChartStatus.CURRENT);
    const brush = getToolbarSpec(Toolbar.Brush);

    if (!chart?.params?.find((param) => param.name === "brush")) {
      const updatedChart = {
        ...chart,
        params: [...(chart?.params || []), ...brush.params],
      };
      return onPropertyChange({
        componentType: "Plot",
        componentId: "plot",
        propertyName: "chart",
        propertyValue: updatedChart,
      });
    }
  };

  enum MarkTypes {
    POINT = "point",
    BAR = "bar",
    LINE = "line",
    AREA = "area",
  }

  const switchToMark = (markType: MarkTypes): void => {
    chart = getLatestChart(ChartStatus.ORIGINAL);
    const updatedChart = {
      ...chart,
      mark: { type: markType },
    };
    return onPropertyChange({
      componentType: "Plot",
      componentId: "plot",
      propertyName: "chart",
      propertyValue: updatedChart,
    });
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
            top: -25,
            right: 8,
            zIndex: 10,
          }}
        >
          <Tooltip title={"Convert Mark to Point"}>
            <ScatterPlotIcon
              fontSize={"small"}
              onClick={() => switchToMark(MarkTypes.POINT)}
            ></ScatterPlotIcon>
          </Tooltip>
          <Tooltip title={"Convert Mark to Line"}>
            <ShowChartIcon
              fontSize={"small"}
              onClick={() => switchToMark(MarkTypes.LINE)}
            ></ShowChartIcon>
          </Tooltip>
          <Tooltip title={"Convert Mark to Area"}>
            <SignalCellular4BarIcon
              fontSize={"small"}
              onClick={() => switchToMark(MarkTypes.AREA)}
            ></SignalCellular4BarIcon>
          </Tooltip>
          <Tooltip title={"Convert Mark to Bar"}>
            <BarChartIcon
              fontSize={"small"}
              onClick={() => switchToMark(MarkTypes.BAR)}
            ></BarChartIcon>
          </Tooltip>
          <Tooltip title={"Pan and Zoom"}>
            <LoupeIcon
              fontSize={"small"}
              onClick={enablePanAndZoomMode}
            ></LoupeIcon>
          </Tooltip>
          <Tooltip title={"Minimap Zoom"}>
            <LibraryAddIcon
              fontSize={"small"}
              onClick={enableMiniMap}
            ></LibraryAddIcon>
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
