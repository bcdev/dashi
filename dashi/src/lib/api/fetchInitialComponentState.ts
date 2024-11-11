import { type ComponentState } from "@/lib/types/state/component";
import { type ContribPoint } from "@/lib/types/model/extension";
import { callApi } from "@/lib/utils/fetchApiResult";
import type { ApiOptions } from "@/lib/api/types";
import { makeUrl } from "@/lib/api/common";

export async function fetchInitialComponentState(
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
