import { VegaLite } from "react-vega";

import { type PlotState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/state/event";
import { useSignalListeners } from "@/lib/hooks";

export interface PlotProps extends Omit<PlotState, "type"> {
  onChange: ComponentChangeHandler;
}

export function Plot({ id, style, chart, onChange }: PlotProps) {
  const signalListeners = useSignalListeners(chart, id, onChange);

  if (!chart) {
    return <div id={id} style={style} />;
  }

  return (
    <VegaLite
      spec={chart}
      style={style}
      signalListeners={signalListeners}
      actions={false}
    />
  );
}
