import {
  type CallbackRequest,
  type StateChangeRequest,
} from "@/lib/types/model/callback";
import { callApi } from "@/lib/utils/fetchApiResult";
import type { ApiOptions } from "@/lib/api/types";
import { makeUrl } from "@/lib/api/common";

export async function fetchStateChangeRequests(
  callbackRequests: CallbackRequest[],
  options?: ApiOptions,
): Promise<StateChangeRequest[]> {
  return callApi(makeUrl("callback", options), {
    body: JSON.stringify({ callbackRequests }),
    method: "post",
  });
}
