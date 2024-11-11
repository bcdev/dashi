import { store } from "@/lib/store";
import { type ContribPoint } from "@/lib/types/model/extension";
import { type CallbackRequest } from "@/lib/types/model/callback";
import { type ComponentChangeEvent } from "@/lib/types/state/event";
import { getInputValues } from "@/lib/actions/helpers/getInputValues";
import { applyStateChangeRequests } from "@/lib/actions/helpers/applyStateChangeRequests";
import { invokeCallbacks } from "@/lib/actions/helpers/invokeCallbacks";
import { equalObjPaths } from "@/lib/utils/objPath";

export function handleComponentChange(
  contribPoint: ContribPoint,
  contribIndex: number,
  changeEvent: ComponentChangeEvent,
) {
  // Apply actual component state change immediately
  applyStateChangeRequests([
    {
      contribPoint,
      contribIndex,
      stateChanges: [
        {
          link: "component",
          id: changeEvent.id,
          property: changeEvent.property,
          value: changeEvent.value,
        },
      ],
    },
  ]);
  const callbackRequests = getCallbackRequests(
    contribPoint,
    contribIndex,
    changeEvent,
  );
  invokeCallbacks(callbackRequests);
}

/**
 * Collect callback requests for the callbacks of
 * the contribution that are triggered by the change event.
 *
 * @param contribPoint Name of the contribution point.
 * @param contribIndex Index of the contribution.
 * @param changeEvent The change event.
 */
function getCallbackRequests(
  contribPoint: ContribPoint,
  contribIndex: number,
  changeEvent: ComponentChangeEvent,
): CallbackRequest[] {
  const { configuration, contributionsRecord } = store.getState();
  const { hostStore } = configuration;
  const hostState = hostStore?.getState();
  const contributions = contributionsRecord[contribPoint];
  const contribution = contributions[contribIndex];
  const callbackRequests: CallbackRequest[] = [];
  (contribution.callbacks || []).forEach((callback, callbackIndex) => {
    if (callback.inputs && callback.inputs.length) {
      const inputs = callback.inputs;
      const inputIndex = inputs.findIndex(
        (input) =>
          !input.noTrigger &&
          (!input.link || input.link === "component") &&
          input.id === changeEvent.id &&
          equalObjPaths(input.property, changeEvent.property),
      );
      if (inputIndex >= 0) {
        // Collect triggered callback
        callbackRequests.push({
          contribPoint,
          contribIndex,
          callbackIndex,
          inputIndex,
          inputValues: getInputValues(inputs, contribution, hostState),
        });
      }
    }
  });
  return callbackRequests;
}
