import { VegaLite } from "react-vega";

import { type PlotState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/state/event";
import {
  isString,
  isTopLevelSelectionParameter,
  type SignalHandler,
} from "@/lib/types/state/vega";
import { useCallback, useMemo } from "react";

export interface PlotProps extends Omit<PlotState, "type"> {
  onChange: ComponentChangeHandler;
}

export function Plot({ id, style, chart, onChange }: PlotProps) {
  /*
  Here, we loop through all the params to create map of signals which will be then used to create the map of
  signal-listeners
  */
  const signals: { [key: string]: string } = useMemo(() => {
    if (!chart) return {};
    const tempSignals: { [key: string]: string } = {};
    chart.params?.forEach((param) => {
      if (isTopLevelSelectionParameter(param)) {
        if (
          typeof param.select === "object" &&
          "on" in param.select &&
          param.select.on != null
        ) {
          const signalName = param.select.on;
          if (isString(signalName)) {
            tempSignals[signalName] = param.name;
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
    return tempSignals;
  }, [chart]);

  const handleClickSignal = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (signalName: string, value: unknown) => {
      if (id) {
        return onChange({
          componentType: "Plot",
          id: id,
          property: "points",
          value: value,
        });
      }
    },
    [id, onChange],
  );

  /*
  Currently, we only have click events support, but if more are required, they can be implemented and added in the map below.
   */
  const signalHandlerMap: { [key: string]: SignalHandler } = useMemo(
    () => ({
      click: handleClickSignal,
    }),
    [handleClickSignal],
  );

  /*
  This function creates the map of signal listeners based on the `signals` map computed above.
  */
  const createSignalListeners = useCallback(
    (signals: { [key: string]: string }) => {
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
    },
    [signalHandlerMap],
  );

  const signalListeners = useMemo(
    () => createSignalListeners(signals),
    [createSignalListeners, signals],
  );

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
