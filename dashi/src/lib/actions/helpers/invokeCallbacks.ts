import { store } from "@/lib/store";
import type { CallbackRequest } from "@/lib/types/model/callback";
import { fetchCallback } from "@/lib/api/fetchCallback";
import { applyStateChangeRequests } from "@/lib/actions/helpers/applyStateChangeRequests";

export function invokeCallbacks(callbackRequests: CallbackRequest[]) {
  if (!callbackRequests.length) {
    return;
  }
  const { configuration } = store.getState();
  const invocationId = getInvocationId();
  if (import.meta.env.DEV) {
    console.debug(`invokeCallbacks (${invocationId})-->`, callbackRequests);
  }
  fetchCallback(callbackRequests, configuration.api).then(
    (changeRequestsResult) => {
      if (changeRequestsResult.data) {
        if (import.meta.env.DEV) {
          console.debug(
            `invokeCallbacks <--(${invocationId})`,
            changeRequestsResult.data,
          );
        }
        applyStateChangeRequests(changeRequestsResult.data);
      } else {
        console.error(
          "callback failed:",
          changeRequestsResult.error,
          "for call requests:",
          callbackRequests,
        );
      }
    },
  );
}

let invocationCounter = 0;

function getInvocationId() {
  return invocationCounter++;
}
