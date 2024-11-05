import { store } from "@/lib/store";
import { fetchStateChangeRequests } from "@/lib/api";
import { fetchApiResult } from "@/lib/utils/fetchApiResult";
import { type ContribPoint } from "@/lib/types/model/extension";
import {
  type Callback,
  type CallbackRef,
  type CallbackRequest,
  type StateChangeRequest,
} from "@/lib/types/model/callback";
import { type ComponentChangeEvent } from "@/lib/types/model/event";
import { type ContributionState } from "@/lib/types/state/contribution";
import { getInputValues } from "@/lib/actions/common";
import { applyStateChangeRequests } from "@/lib/actions/applyStateChangeRequests";

export function handleComponentChange(
  contribPoint: ContribPoint,
  contribIndex: number,
  contribEvent: ComponentChangeEvent,
) {
  const { configuration, contributionsRecord } = store.getState();
  const { hostStore } = configuration;
  const contributions = contributionsRecord[contribPoint];
  const contribution = contributions[contribIndex];
  const callbackRefs = generateCallbackRefs(
    contribution,
    contribEvent,
    hostStore?.getState(),
  );
  // The primary state change request corresponds
  // to the original property change event.
  const primaryChangeRequest: StateChangeRequest = {
    contribPoint,
    contribIndex,
    stateChanges: [
      {
        kind: "Component",
        id: contribEvent.componentId,
        property: contribEvent.propertyName,
        value: contribEvent.propertyValue,
      },
    ],
  };
  // console.debug("callRequests", callRequests);
  if (callbackRefs.length == 0) {
    applyStateChangeRequests([primaryChangeRequest]);
  } else {
    const callbackRequests: CallbackRequest[] = callbackRefs.map(
      (callbackRef) => ({
        contribPoint,
        contribIndex,
        ...callbackRef,
      }),
    );
    fetchApiResult(
      fetchStateChangeRequests,
      callbackRequests,
      configuration.api,
    ).then((changeRequestsResult) => {
      const secondaryChangeRequests = changeRequestsResult.data;
      if (secondaryChangeRequests) {
        applyStateChangeRequests(
          [primaryChangeRequest].concat(secondaryChangeRequests),
        );
      } else {
        // Note, we do not even apply the primaryChangeRequest
        // in order to avoid an inconsistent state.
        console.error(
          "callback failed:",
          changeRequestsResult.error,
          "for call requests:",
          callbackRequests,
        );
      }
    });
  }
}

function generateCallbackRefs<S extends object>(
  contribution: ContributionState,
  contribEvent: ComponentChangeEvent,
  hostState?: S | undefined,
): CallbackRef[] {
  const callbackRefs: CallbackRef[] = [];
  // Prepare calling all callbacks of the contribution
  // that are triggered by the property change
  (contribution.callbacks || []).forEach((callback, callbackIndex) => {
    const inputValues = getCallbackInputValues(
      contribution,
      contribEvent,
      callback,
      hostState,
    );
    if (inputValues) {
      callbackRefs.push({ callbackIndex, inputValues });
    }
  });
  return callbackRefs;
}

// we export for testing only
export function getCallbackInputValues<S extends object>(
  contribution: ContributionState,
  contribEvent: ComponentChangeEvent,
  callback: Callback,
  hostState?: S | undefined,
): unknown[] | undefined {
  if (!callback.inputs || !callback.inputs.length) {
    // No inputs defined
    return undefined;
  }

  // Find the index of input that is a trigger
  const triggerIndex: number = callback.inputs.findIndex(
    (input) =>
      (!input.kind || input.kind === "Component") &&
      input.id === contribEvent.componentId &&
      input.property === contribEvent.propertyName,
  );
  if (triggerIndex < 0) {
    // No trigger index found --> this callback is not applicable
    return undefined;
  }

  const inputValues = getInputValues(callback.inputs, contribution, hostState);

  if (inputValues[triggerIndex] === contribEvent.propertyValue) {
    // No change --> this callback is not applicable
    return undefined;
  }

  inputValues[triggerIndex] = contribEvent.propertyValue;
  return inputValues;
}
