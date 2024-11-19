import { store } from "@/lib/store";
import type {
  CallbackRef,
  CallbackRequest,
  ContribRef,
  InputRef,
} from "@/lib/types/model/callback";
import type { Input } from "@/lib/types/model/channel";
import { getInputValues } from "@/lib/actions/helpers/getInputValues";
import {
  getValue,
  type ObjPath,
  normalizeObjPath,
  formatObjPath,
} from "@/lib/utils/objPath";
import { invokeCallbacks } from "@/lib/actions/helpers/invokeCallbacks";
import type { ContributionState } from "@/lib/types/state/contribution";
import type { GetDerivedState } from "@/lib/types/state/store";

/**
 * A reference to a property of an input of a callback of a contribution.
 */
export interface PropertyRef extends ContribRef, CallbackRef, InputRef {
  /** The property name as path. */
  propertyPath: ObjPath;
}

export function handleHostStoreChange<S extends object = object>(
  currState: S,
  prevState: S,
) {
  if (store.getState().extensions.length === 0) {
    // Exit immediately if there are no extensions (yet)
    return;
  }
  const { configuration, contributionsRecord } = store.getState();
  const { getDerivedHostState } = configuration;
  const callbackRequests = getCallbackRequests(
    contributionsRecord,
    currState,
    prevState,
    getDerivedHostState,
  );
  invokeCallbacks(callbackRequests);
}

function getCallbackRequests<S extends object = object>(
  contributionsRecord: Record<string, ContributionState[]>,
  hostState: S,
  prevHostState: S,
  getDerivedHostState: GetDerivedState<S> | undefined,
): CallbackRequest[] {
  return getHostStorePropertyRefs()
    .filter((propertyRef) =>
      hasPropertyChanged(
        propertyRef.propertyPath,
        hostState,
        prevHostState,
        getDerivedHostState,
      ),
    )
    .map((propertyRef) => {
      const contributions = contributionsRecord[propertyRef.contribPoint];
      const contribution = contributions[propertyRef.contribIndex];
      const callback = contribution.callbacks![propertyRef.callbackIndex];
      const inputValues = getInputValues(
        callback.inputs!,
        contribution,
        hostState,
        getDerivedHostState as GetDerivedState,
      );
      return { ...propertyRef, inputValues };
    });
}

// const getHostStorePropertyRefs = memoizeOne(_getHostStorePropertyRefs);

/**
 * Get the static list of host state property references for all contributions.
 */
function getHostStorePropertyRefs(): PropertyRef[] {
  const { contributionsRecord } = store.getState();
  const propertyRefs: PropertyRef[] = [];
  Object.getOwnPropertyNames(contributionsRecord).forEach((contribPoint) => {
    const contributions = contributionsRecord[contribPoint];
    contributions.forEach((contribution, contribIndex) => {
      (contribution.callbacks || []).forEach(
        (callback, callbackIndex) =>
          (callback.inputs || []).forEach((input, inputIndex) => {
            if (!input.noTrigger && input.link === "app") {
              propertyRefs.push({
                contribPoint,
                contribIndex,
                callbackIndex,
                inputIndex,
                propertyPath: normalizeObjPath(input.property!),
              });
            }
          }),
        [] as Input[],
      );
    });
  });
  return propertyRefs;
}

function hasPropertyChanged<S extends object = object>(
  propertyPath: ObjPath,
  currState: S,
  prevState: S,
  getDerivedHostState: GetDerivedState<S> | undefined,
): boolean {
  const currValue = getValue(currState, propertyPath);
  const prevValue = getValue(prevState, propertyPath);
  if (
    currValue === undefined &&
    prevValue === undefined &&
    getDerivedHostState !== undefined
  ) {
    const propertyName = formatObjPath(propertyPath);
    return !Object.is(
      getDerivedHostState(currState, propertyName),
      getDerivedHostState(prevState, propertyName),
    );
  }
  return !Object.is(currValue, prevValue);
}
