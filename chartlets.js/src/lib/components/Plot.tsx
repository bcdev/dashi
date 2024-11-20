import { VegaLite } from "react-vega";

import { type PlotState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/state/event";
import type { TopLevelParameter } from "vega-lite/src/spec/toplevel";
import type { TopLevelSelectionParameter } from "vega-lite/src/selection";
import type { Stream } from "vega-typings/types/spec/stream";

export interface PlotProps extends Omit<PlotState, "type"> {
  onChange: ComponentChangeHandler;
}

export function Plot({ id, style, chart, onChange }: PlotProps) {
  if (!chart) {
    return <div id={id} style={style} />;
  }

  function isTopLevelSelectionParameter(
    param: TopLevelParameter,
  ): param is TopLevelSelectionParameter {
    return "select" in param;
  }

  function isString(signal_name: string | Stream): signal_name is string {
    return typeof signal_name === "string";
  }

  const signals: { [key: string]: string } = {};

  chart.params?.forEach((param) => {
    if (isTopLevelSelectionParameter(param)) {
      if (
        typeof param.select === "object" &&
        "on" in param.select &&
        param.select.on != null
      ) {
        const signal_name = param.select.on;
        if (isString(signal_name)) {
          signals[signal_name] = param.name;
        }
      }
    }
  });

  const { datasets, ...spec } = chart;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const handleClickSignal = (signalName: string, value: unknown) => {
    if (id) {
      return onChange({
        componentType: "Plot",
        id: id,
        property: "points",
        value: value,
      });
    }
  };

  type SignalHandler = (signalName: string, value: unknown) => void;

  // Currently, we only have click events support, but if more are required, they can be implemented and added in the map below.
  const signalHandlerMap: { [key: string]: SignalHandler } = {
    click: handleClickSignal,
  };

  const createSignalListeners = (signals: { [key: string]: string }) => {
    const signalListeners: { [key: string]: SignalHandler } = {};
    Object.entries(signals).forEach(([event, signalName]) => {
      if (signalHandlerMap[event]) {
        signalListeners[signalName] = signalHandlerMap[event];
      } else {
        console.warn(
          "The signal " + event + " is not yet supported in chartlets.js",
        );
      }
    });

    return signalListeners;
  };

  const signalListeners = createSignalListeners(signals);

  return (
    <VegaLite
      spec={spec}
      data={datasets}
      style={style}
      signalListeners={signalListeners}
      actions={false}
    />
  );
}
