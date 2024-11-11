import { type ComponentState } from "@/lib/types/state/component";
import { type ContribPoint } from "@/lib/types/model/extension";
import type { ApiOptions, ApiResult } from "@/lib/types/api";
import { makeUrl, callApi, fetchApiResult } from "./helpers";

export async function fetchLayout(
  contribPoint: ContribPoint,
  contribIndex: number,
  inputValues: unknown[],
  options?: ApiOptions,
): Promise<ApiResult<ComponentState>> {
  return fetchApiResult(
    _fetchLayout,
    contribPoint,
    contribIndex,
    inputValues,
    options,
  );
}

async function _fetchLayout(
  contribPoint: ContribPoint,
  contribIndex: number,
  inputValues: unknown[],
  options?: ApiOptions,
): Promise<ComponentState> {
  return callApi(makeUrl(`layout/${contribPoint}/${contribIndex}`, options), {
    body: JSON.stringify({ inputValues }),
    method: "post",
  });
}
