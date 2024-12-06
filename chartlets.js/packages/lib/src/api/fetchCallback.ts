import {
  type CallbackRequest,
  type StateChangeRequest,
} from "@/types/model/callback";
import type { ApiOptions, ApiResult } from "@/types/api";
import { makeUrl, callApi, fetchApiResult } from "./helpers";

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
