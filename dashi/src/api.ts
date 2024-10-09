import { ComponentState } from "./state/component";
import { ContribPoint, Contributions } from "./model/extension";
import { CallbackCallRequest, ChangeRequest } from "./model/callback";
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

export async function fetchChangeRequests(
  callRequests: CallbackCallRequest[],
): Promise<ChangeRequest[]> {
  return callApi(`${serverUrl}/dashi/callback`, {
    body: JSON.stringify({ callRequests }),
    method: "post",
  });
}
