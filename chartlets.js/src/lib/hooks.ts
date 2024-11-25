import type { StoreState } from "@/lib/types/state/store";
import { store } from "@/lib/store";
import { useCallback, useMemo } from "react";
import type { ContributionState } from "@/lib/types/state/contribution";
import { type SignalHandler } from "@/lib/types/state/vega";
import type { TopLevelSpec } from "vega-lite";
import type {
  ComponentChangeEvent,
  ComponentChangeHandler,
} from "@/lib/types/state/event";
import { handleComponentChange } from "@/lib/actions/handleComponentChange";
import { isString } from "@/lib/utils/isString";
import { isObject } from "@/lib/utils/isObject";

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
  chart: TopLevelSpec | null | undefined,
  type: string,
  id: string | undefined,
  onChange: ComponentChangeHandler,
): { [key: string]: SignalHandler } {
  /*
     Here, we create map of signals which will be then used to create the
     map of signal-listeners because not all params are event-listeners, and we
     need to identify them. Later in the code, we then see which handlers do we
     have so that we can create those listeners with the `name` specified in
     the event-listener object.
   */
  const signals: { [key: string]: string } = useMemo(() => {
    if (!chart) return {};
    if (!chart.params) return {};
    return chart.params
      .filter(
        (param): param is { name: string; select: { on: string } } =>
          isObject(param) &&
          param !== null &&
          "name" in param &&
          "select" in param &&
          isObject(param.select) &&
          param.select?.on != null &&
          isString(param.select.on),
      )
      .reduce(
        (acc, param) => {
          acc[param.select.on] = param.name;
          return acc;
        },
        {} as { [key: string]: string },
      );
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

/**
 * A hook that retrieves the contributions for the given contribution
 * point given by `contribPoint`.
 *
 * @param contribPoint Contribution point name.
 * @typeParam S Type of the container state.
 */
export function useContributions<S extends object = object>(
  contribPoint: string,
): ContributionState<S>[] {
  const contributionsRecord = useContributionsRecord();
  return contributionsRecord[contribPoint] as ContributionState<S>[];
}

/**
 * A hook that creates an array of length `numContribs` with stable
 * component change handlers of type `ComponentChangeHandler` for
 * the contribution point given by `contribPoint`.
 *
 * @param contribPoint Contribution point name.
 * @param numContribs Number of contributions. This should be the length
 *   of the array of contributions you get using the `useContributions` hook.
 */
export function useComponentChangeHandlers(
  contribPoint: string,
  numContribs: number,
): ComponentChangeHandler[] {
  return useMemo(
    () =>
      Array.from({ length: numContribs }).map(
        (_, contribIndex) => (componentEvent: ComponentChangeEvent) =>
          void handleComponentChange(
            contribPoint,
            contribIndex,
            componentEvent,
          ),
      ),
    [contribPoint, numContribs],
  );
}
