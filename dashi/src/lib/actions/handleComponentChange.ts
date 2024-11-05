import { store } from "@/lib/store";
import { fetchStateChangeRequests } from "@/lib/api";
import { fetchApiResult } from "@/lib/utils/fetchApiResult";
import { type ContribPoint } from "@/lib/types/model/extension";
import {
  type Callback,
  type CallbackRef,
  type CallbackRequest,
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
  applyStateChangeRequests([
    {
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
    },
  ]);

  const { configuration, contributionsRecord } = store.getState();
  const { hostStore } = configuration;
  const contributions = contributionsRecord[contribPoint];
  const contribution = contributions[contribIndex];
  const callbackRefs = generateCallbackRefs(
    contribution,
    contribEvent,
    hostStore?.getState(),
  );
  // console.debug("callRequests", callRequests);
  if (callbackRefs.length) {
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

  return getInputValues(callback.inputs, contribution, hostState);
}
