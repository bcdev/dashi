import { store } from "@/lib/store";
import type { CallbackRequest } from "@/lib/types/model/callback";
import { fetchCallback } from "@/lib/api/fetchCallback";
import { applyStateChangeRequests } from "@/lib/actions/helpers/applyStateChangeRequests";

export function invokeCallbacks(callbackRequests: CallbackRequest[]) {
  const { configuration } = store.getState();
  const shouldLog = configuration.logging?.enabled;
  if (!callbackRequests.length) {
    if (shouldLog) {
      console.info(`dashi: invokeCallbacks - no requests`, callbackRequests);
    }
    return;
  }
  const invocationId = getInvocationId();
  if (shouldLog) {
    console.info(
      `dashi: invokeCallbacks (${invocationId})-->`,
      callbackRequests,
    );
  }
  fetchCallback(callbackRequests, configuration.api).then(
    (changeRequestsResult) => {
      if (changeRequestsResult.data) {
        if (shouldLog) {
          console.info(
            `dashi: invokeCallbacks <--(${invocationId})`,
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
