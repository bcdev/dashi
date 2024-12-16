import type { StoreState } from "@/types/state/store";
import { store } from "@/store";
import { useCallback, useMemo } from "react";
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

const selectThemeMode = (state: StoreState) => state.themeMode;

const useStore = store;

export const useConfiguration = () => useStore(selectConfiguration);
export const useExtensions = () => useStore(selectExtensions);
export const useContributionsResult = () => useStore(selectContributionsResult);
export const useContributionsRecord = () => useStore(selectContributionsRecord);
export const useThemeMode = () => useStore(selectThemeMode);

/**
 * A hook that retrieves the contributions for the given contribution
 * point given by `contribPoint`.
 *
 * A stable empty array is returned if there are no contributions or
 * the contribution point does not exist.
 *
 * @param contribPoint Contribution point name.
 * @typeParam S Type of the container state.
 * @returns Array of contributions.
 */
export function useContributions<S extends object = object>(
  contribPoint: string,
): ContributionState<S>[] {
  const selectContributions = useCallback(
    (state: StoreState) => state.contributionsRecord[contribPoint],
    [contribPoint],
  );
  const contributions = useStore(selectContributions);
  return useMemo(
    () => (contributions || []) as ContributionState<S>[],
    [contributions],
  );
}

/**
 * A hook that creates an array of length `numContribs` with stable
 * component change handlers of type `ComponentChangeHandler` for
 * the contribution point given by `contribPoint`.
 *
 * A stable empty array is returned if there are no contributions or
 * the contribution point does not exist.
 *
 * @param contribPoint Contribution point name.
 * @param numContribs Number of contributions. This should be the length
 *   of the array of contributions you get using the `useContributions` hook.
 * @returns Array of component change handlers
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
