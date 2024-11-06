import { type ComponentState } from "@/lib/types/state/component";
import {
  type ContribPoint,
  type Contributions,
} from "@/lib/types/model/extension";
import {
  type CallbackRequest,
  type StateChangeRequest,
} from "@/lib/types/model/callback";
import { callApi } from "@/lib/utils/fetchApiResult";

const defaultServerUrl = "http://localhost:8888";
const defaultEndpointName = "dashi";

export interface ApiOptions {
  serverUrl?: string;
  endpointName?: string;
}

export async function fetchContributions(
  options?: ApiOptions,
): Promise<Contributions> {
  return callApi(makeUrl("contributions", options));
}

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

export async function fetchStateChangeRequests(
  callbackRequests: CallbackRequest[],
  options?: ApiOptions,
): Promise<StateChangeRequest[]> {
  return callApi(makeUrl("callback", options), {
    body: JSON.stringify({ callbackRequests }),
    method: "post",
  });
}

function makeUrl(path: string, options?: ApiOptions): string {
  const serverUrl = options?.serverUrl || defaultServerUrl;
  const endpointName = options?.endpointName || defaultEndpointName;
  return `${serverUrl}/${endpointName}/${path}`;
}
