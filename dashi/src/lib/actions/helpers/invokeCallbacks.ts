import { store } from "@/lib/store";
import type { CallbackRequest } from "@/lib/types/model/callback";
import { fetchApiResult } from "@/lib/utils/fetchApiResult";
import { fetchStateChangeRequests } from "@/lib/api";
import { applyStateChangeRequests } from "@/lib/actions/helpers/applyStateChangeRequests";

export function invokeCallbacks(callbackRequests: CallbackRequest[]) {
  const { configuration } = store.getState();
  console.debug("invokeCallbacks -->", callbackRequests);
  if (callbackRequests.length) {
    fetchApiResult(
      fetchStateChangeRequests,
      callbackRequests,
      configuration.api,
    ).then((changeRequestsResult) => {
      if (changeRequestsResult.data) {
        console.debug("invokeCallbacks <--", changeRequestsResult.data);
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
