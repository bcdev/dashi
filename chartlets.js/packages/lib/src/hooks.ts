import type { StoreState } from "@/types/state/store";
import { store } from "@/store";
import { useMemo } from "react";
import type { ContributionState } from "@/types/state/contribution";
import type {
  ComponentChangeEvent,
  ComponentChangeHandler,
} from "@/types/state/event";
import { handleComponentChange } from "@/actions/handleComponentChange";

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
