import type { StoreState } from "@/lib/types/state/store";
import { store } from "@/lib/store";
import { useCallback, useMemo } from "react";
import type { ContributionState } from "@/lib/types/state/contribution";
import type { ComponentChangeHandler } from "@/lib/types/state/event";
import {
  isTopLevelSelectionParameter,
  type SignalHandler,
} from "@/lib/types/state/vega";
import type { TopLevelSpec } from "vega-lite/src/spec";
import { isString } from "@/lib/utils/isString";

const selectConfiguration = (state: StoreState) => state.configuration;

const selectExtensions = (state: StoreState) => state.extensions;

const selectContributionsResult = (state: StoreState) =>
  state.contributionsResult;

const selectContributionsRecord = (state: StoreState) =>
  state.contributionsRecord;

const useStore = store;

export const useConfiguration = () => useStore(selectConfiguration);
export const useExtensions = () => useStore(selectExtensions);
export const useContributionsResult = () => useStore(selectContributionsResult);
export const useContributionsRecord = () => useStore(selectContributionsRecord);

export function makeContributionsHook<S extends object = object>(
  contribPoint: string,
): () => ContributionState<S>[] {
  return () => {
    const selectContributions = (state: StoreState) =>
      state.contributionsRecord[contribPoint];
    const contributions = useStore(selectContributions);
    return useMemo(() => {
      return (contributions || []) as ContributionState<S>[];
    }, [contributions]);
  };
}

export function useSignalListeners(
  chart: TopLevelSpec | null,
  id: string | undefined,
  onChange: ComponentChangeHandler,
): { [key: string]: SignalHandler } {
  /*
   Here, we loop through all the params to create map of signals which will
   be then used to create the map of signal-listeners because not all
   params are event-listeners, and we need to identify them. Later in the
   code, we then see which handlers do we have so that we can create
   those listeners with the `name` specified in the event-listener object.
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
          /*
           The signal name extracted from the `select.on` property can be
           either a string or of Stream type (internal Vega
           type). But since we create the selection events in
           Altair (in the server) using `on="click"` etc., the event type
           will be a string, but we need this type-guard to be sure.
           If it is a Stream object, that case is not handled yet.
           */
          if (isString(signalName)) {
            tempSignals[signalName] = param.name;
          } else {
            console.warn(
              `The signal ${param} is of Stream type` +
                " (internal Vega-lite type) which is not handled yet.",
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
   Currently, we only have click events support, but if more are required,
   they can be implemented and added in the map below.
   */
  const signalHandlerMap: { [key: string]: SignalHandler } = useMemo(
    () => ({
      click: handleClickSignal,
    }),
    [handleClickSignal],
  );

  /*
   This function creates the map of signal listeners based on the `signals`
   map computed above.
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

  return useMemo(
    () => createSignalListeners(signals),
    [createSignalListeners, signals],
  );
}
