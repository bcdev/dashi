import { useCallback, useMemo } from "react";
import { TopLevelSpec } from "vega-lite";

import { ComponentChangeHandler } from "@/lib/types/state/event";
import { isObject } from "@/lib/utils/isObject";
import { isString } from "@/lib/utils/isString";

type SignalHandler = (signalName: string, signalValue: unknown) => void;

/*
 * This is a partial representation of the parameter type from
 * SelectionParameter type from the `vega-lite` module. Since we are
 * only interested in extracting the handlers, the following
 * properties are required.
 */
type SelectionParameter = { name: string; select: { on: string } };

const isSelectionParameter = (param: unknown): param is SelectionParameter =>
  isObject(param) &&
  "name" in param &&
  "select" in param &&
  isObject(param.select) &&
  param.select?.on !== null &&
  isString(param.select.on);

export function useSignalListeners(
  chart: TopLevelSpec | null | undefined,
  type: string,
  id: string | undefined,
  onChange: ComponentChangeHandler,
): { [key: string]: SignalHandler } {
  /*
   * Here, we create map of signals which will be then used to create the
   * map of signal-listeners because not all params are event-listeners, and we
   * need to identify them. Later in the code, we then see which handlers do we
   * have so that we can create those listeners with the `name` specified in
   * the event-listener object.
   */
  const signals = useMemo(() => {
    if (!chart) {
      return {};
    }
    if (!chart.params) {
      return {};
    }
    return chart.params.filter(isSelectionParameter).reduce((acc, param) => {
      acc[param.select.on] = param.name;
      return acc;
    }, {});
  }, [chart]);

  const handleClickSignal = useCallback(
    (signalName: string, signalValue: unknown) => {
      if (id) {
        return onChange({
          componentType: type,
          id: id,
          property: signalName,
          value: signalValue,
        });
      }
    },
    [id, onChange, type],
  );

  /*
   * Currently, we only have click events support, but if more are required,
   * they can be implemented and added in the map below.
   */
  const signalHandlerMap: { [key: string]: SignalHandler } = useMemo(
    () => ({
      click: handleClickSignal,
    }),
    [handleClickSignal],
  );

  /*
   * Creates the map of signal listeners based on
   * the `signals` map computed above.
   */
  return useMemo(() => {
    const signalListeners = {};
    Object.entries(signals).forEach(([event, signalName]) => {
      if (signalHandlerMap[event]) {
        signalListeners[signalName] = signalHandlerMap[event];
      } else {
        console.warn(
          `The signal "${event}" is not yet supported in chartlets.js`,
        );
      }
    });
    return signalListeners;
  }, [signals]);
}
