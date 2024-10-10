import { ComponentState } from "./state/component";
import { ContribPoint, Contributions } from "./model/extension";
import { CallbackRequest, StateChangeRequest } from "./model/callback";
import { callApi } from "./utils/fetchApiResult";

const serverUrl = "http://localhost:8888";

export async function fetchContributions(): Promise<Contributions> {
  return callApi(`${serverUrl}/dashi/contributions`);
}

export async function fetchInitialComponentState(
  contribPoint: ContribPoint,
  contribIndex: number,
  inputValues: unknown[],
): Promise<ComponentState> {
  return callApi(`${serverUrl}/dashi/layout/${contribPoint}/${contribIndex}`, {
    body: JSON.stringify({ inputValues }),
    method: "post",
  });
}

export async function fetchStateChangeRequests(
  callbackRequests: CallbackRequest[],
): Promise<StateChangeRequest[]> {
  return callApi(`${serverUrl}/dashi/callback`, {
    body: JSON.stringify({ callbackRequests: callbackRequests }),
    method: "post",
  });
}
