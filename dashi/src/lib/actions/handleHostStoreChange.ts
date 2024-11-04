import { store } from "@/lib/store";
import type {
  CallbackRequest,
  ContribRef,
  Input,
} from "@/lib/types/model/callback";
import { getInputValues, getValue } from "@/lib/actions/common";
import { fetchApiResult } from "@/lib/utils/fetchApiResult";
import { fetchStateChangeRequests } from "@/lib/api";
import { applyStateChangeRequests } from "@/lib/actions/applyStateChangeRequests";

interface InputRef extends ContribRef {
  // The callback index of the contribution
  callbackIndex: number;
  // The index of an input
  inputIndex: number;
  // The property path
  propertyPath: string[];
}

export function handleHostStoreChange<S extends object = object>(
  currState: S,
  prevState: S,
) {
  console.log("handleHostStoreChange:", currState, prevState);
  const effectiveInputRefs = getHostStoreInputRefs().filter((inputRef) =>
    isEffectiveInputRef(inputRef, currState, prevState),
  );
  if (effectiveInputRefs.length === 0) {
    return;
  }
  const { configuration, contributionsRecord } = store.getState();
  const { hostStore } = configuration;
  const callbackRequests: CallbackRequest[] = effectiveInputRefs.map(
    (inputRef) => {
      const contribution =
        contributionsRecord[inputRef.contribPoint][inputRef.contribIndex];
      const callback = contribution.callbacks
        ? contribution.callbacks[inputRef.callbackIndex]
        : undefined;
      const inputValues =
        callback && callback.inputs
          ? getInputValues(callback.inputs, contribution, hostStore?.getState())
          : [];
      return { ...inputRef, inputValues };
    },
  );
  fetchApiResult(
    fetchStateChangeRequests,
    callbackRequests,
    configuration.api,
  ).then((changeRequestsResult) => {
    if (changeRequestsResult.data) {
      applyStateChangeRequests(changeRequestsResult.data);
    } else {
      console.error(
        "callback failed:",
        changeRequestsResult.error,
        "for call requests:",
        callbackRequests,
      );
    }
  });
}

// TODO: memoize this function,
//  its output should stay constant
function getHostStoreInputRefs(): InputRef[] {
  const { contributionsRecord } = store.getState();
  const appStateRefs: InputRef[] = [];
  Object.getOwnPropertyNames(contributionsRecord).forEach((contribPoint) => {
    const contributions = contributionsRecord[contribPoint];
    contributions.forEach((contribution, contribIndex) => {
      (contribution.callbacks || []).forEach(
        (callback, callbackIndex) =>
          (callback.inputs || []).forEach((input, inputIndex) => {
            if (input.kind === "AppState") {
              appStateRefs.push({
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
  return appStateRefs;
}

function isEffectiveInputRef<S extends object = object>(
  inputRef: InputRef,
  currState: S,
  prevState: S,
): boolean {
  const propertyPath = inputRef.propertyPath;
  const currValue = getValue(currState, propertyPath);
  const prevValue = getValue(prevState, propertyPath);
  return !Object.is(currValue, prevValue);
}
