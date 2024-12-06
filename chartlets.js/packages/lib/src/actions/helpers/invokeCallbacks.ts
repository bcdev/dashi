import { store } from "@/store";
import type { CallbackRequest } from "@/types/model/callback";
import { fetchCallback } from "@/api/fetchCallback";
import { applyStateChangeRequests } from "@/actions/helpers/applyStateChangeRequests";

export function invokeCallbacks(callbackRequests: CallbackRequest[]) {
  const { configuration } = store.getState();
  const shouldLog = configuration.logging?.enabled;
  const invocationId = getInvocationId();
  if (shouldLog) {
    console.info(
      `chartlets: invokeCallbacks (${invocationId})-->`,
      callbackRequests,
    );
  }
  fetchCallback(callbackRequests, configuration.api).then(
    (changeRequestsResult) => {
      if (changeRequestsResult.data) {
        if (shouldLog) {
          console.info(
            `chartlets: invokeCallbacks <--(${invocationId})`,
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
