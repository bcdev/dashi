import { VegaLite } from "react-vega";
import type { TopLevelSpec } from "vega-lite";
import * as vegaThemes from "vega-themes";
import { useTheme } from "@mui/material";

import { type ComponentState } from "@/lib/types/state/component";
import type { ComponentProps } from "@/lib/component/Component";
import { useSignalListeners } from "@/lib/hooks";

type VegaTheme = Omit<typeof vegaThemes, "version">;

const isVegaTheme = (key?: string): key is keyof VegaTheme =>
  !!key && key in vegaThemes;

interface PlotState extends ComponentState {
  theme?: string;
  chart?:
    | TopLevelSpec // This is the vega-lite specification type
    | null;
}

interface PlotProps extends ComponentProps, PlotState {}

export function Plot({ type, id, style, theme, chart, onChange }: PlotProps) {
  const muiTheme = useTheme();
  const signalListeners = useSignalListeners(chart, type, id, onChange);

  if (!chart) {
    return <div id={id} style={style} />;
  }

  const vegaTheme = isVegaTheme(theme)
    ? theme
    : muiTheme.palette.mode === "dark"
      ? "dark"
      : undefined;

  return (
    <VegaLite
      theme={vegaTheme}
      spec={chart}
      style={style}
      signalListeners={signalListeners}
      actions={false}
    />
  );
}
