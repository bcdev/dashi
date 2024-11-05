import memoizeOne from "memoize-one";

import { store } from "@/lib/store";
import type {
  CallbackRef,
  CallbackRequest,
  ContribRef,
  Input,
  InputRef,
} from "@/lib/types/model/callback";
import { getInputValues } from "@/lib/actions/helpers/getInputValues";
import { getValue, type PropertyPath } from "@/lib/utils/getValue";
import { invokeCallbacks } from "@/lib/actions/helpers/invokeCallbacks";
import type { ContributionState } from "@/lib";

/**
 * A reference to a property of an input of a callback of a contribution.
 */
export interface PropertyRef extends ContribRef, CallbackRef, InputRef {
  /** The property name as path. */
  propertyPath: PropertyPath;
}

export function handleHostStoreChange<S extends object = object>(
  currState: S,
  prevState: S,
) {
  const { contributionsRecord } = store.getState();
  const callbackRequests = getCallbackRequests(
    contributionsRecord,
    currState,
    prevState,
  );
  invokeCallbacks(callbackRequests);
}

function getCallbackRequests<S extends object = object>(
  contributionsRecord: Record<string, ContributionState[]>,
  hostState: S,
  prevHostState: S,
): CallbackRequest[] {
  const propertyRefs = getHostStorePropertyRefs().filter((propertyRef) =>
    hasPropertyChanged(propertyRef.propertyPath, hostState, prevHostState),
  );
  const callbackRequest: CallbackRequest[] = [];
  propertyRefs.forEach((propertyRef) => {
    const contributions = contributionsRecord[propertyRef.contribPoint];
    const contribution = contributions[propertyRef.contribIndex];
    const callback = contribution.callbacks![propertyRef.callbackIndex];
    const inputValues = getInputValues(
      callback.inputs!,
      contribution,
      hostState,
    );
    callbackRequest.push({ ...propertyRef, inputValues });
  });
  return callbackRequest;
}

const getHostStorePropertyRefs = memoizeOne(_getHostStorePropertyRefs);

function _getHostStorePropertyRefs(): PropertyRef[] {
  const { contributionsRecord } = store.getState();
  const propertyRefs: PropertyRef[] = [];
  Object.getOwnPropertyNames(contributionsRecord).forEach((contribPoint) => {
    const contributions = contributionsRecord[contribPoint];
    contributions.forEach((contribution, contribIndex) => {
      (contribution.callbacks || []).forEach(
        (callback, callbackIndex) =>
          (callback.inputs || []).forEach((input, inputIndex) => {
            if (input.type === "AppInput") {
              propertyRefs.push({
                contribPoint,
                contribIndex,
                callbackIndex,
                inputIndex,
                propertyPath: input.property.split("."),
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
  propertyPath: PropertyPath,
  currState: S,
  prevState: S,
): boolean {
  const currValue = getValue(currState, propertyPath);
  const prevValue = getValue(prevState, propertyPath);
  return !Object.is(currValue, prevValue);
}
