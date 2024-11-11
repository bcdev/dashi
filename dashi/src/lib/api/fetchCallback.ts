import {
  type CallbackRequest,
  type StateChangeRequest,
} from "@/lib/types/model/callback";
import { makeUrl, callApi, fetchApiResult } from "./helpers";
import type { ApiOptions, ApiResult } from "./types";

export async function fetchCallback(
  callbackRequests: CallbackRequest[],
  options?: ApiOptions,
): Promise<ApiResult<StateChangeRequest[]>> {
  return fetchApiResult(_fetchCallback, callbackRequests, options);
}

async function _fetchCallback(
  callbackRequests: CallbackRequest[],
  options?: ApiOptions,
): Promise<StateChangeRequest[]> {
  return callApi(makeUrl("callback", options), {
    body: JSON.stringify({ callbackRequests }),
    method: "post",
  });
}
