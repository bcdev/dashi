import { VegaLite } from "react-vega";

import { type PlotState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/state/event";
import type { TopLevelParameter } from "vega-lite/src/spec/toplevel";
import type { TopLevelSelectionParameter } from "vega-lite/src/selection";
import type { Stream } from "vega-typings/types/spec/stream";

type SignalHandler = (signalName: string, value: unknown) => void;

export interface PlotProps extends Omit<PlotState, "type"> {
  onChange: ComponentChangeHandler;
}

/*
There are two types of Parameters in Vega-lite. Variable and Selection parameters. We need to check if the provided
parameter in the chart from the server is a Selection parameter so that we can extract the selection event types
(point or interval) and further, the events from the `select.on` property (e.g. click, mouseover, keydown etc.) if
that property `on` exists. We need these events and their names to create the signal listeners and pass them to the
Vega-lite element for event-handling (signal-listeners).
*/
function isTopLevelSelectionParameter(
  param: TopLevelParameter,
): param is TopLevelSelectionParameter {
  return "select" in param;
}

/*
The signal name extracted from the `select.on` property can be either a string or of Stream type (internal Vega
type). But since we create the selection events in Altair (in the server) using `on="click"` etc., the event type
will be a string, but we need this type-guard to be sure. If it is a Stream object, that case is not handled yet.
*/
function isString(signal_name: string | Stream): signal_name is string {
  return typeof signal_name === "string";
}

export function Plot({ id, style, chart, onChange }: PlotProps) {
  if (!chart) {
    return <div id={id} style={style} />;
  }

  const signals: { [key: string]: string } = {};

  /*
  Here, we loop through all the params to create map of signals which will be then used to create the map of
  signal-listeners
  */
  chart.params?.forEach((param) => {
    console.log("param", param);
    if (isTopLevelSelectionParameter(param)) {
      if (
        typeof param.select === "object" &&
        "on" in param.select &&
        param.select.on != null
      ) {
        const signal_name = param.select.on;
        if (isString(signal_name)) {
          signals[signal_name] = param.name;
        } else {
          console.warn(
            "The signal " +
              param +
              " is of Stream type (internal Vega-lite type) which is not handled yet.",
          );
        }
      }
    }
  });

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

  /*
  Currently, we only have click events support, but if more are required, they can be implemented and added in the map below.
   */
  const signalHandlerMap: { [key: string]: SignalHandler } = {
    click: handleClickSignal,
  };

  /*
  This function creates the map of signal listeners based on the `signals` map computed above.
  */
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
      spec={chart}
      style={style}
      signalListeners={signalListeners}
      actions={false}
    />
  );
}
