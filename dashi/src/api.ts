import { ComponentModel } from "./model/component";
import { Extension } from "./model/extension";
import { Contribution } from "./model/contribution";
import { CallbackCallRequest, ChangeRequest } from "./model/callback";
import { callApi } from "./utils/fetchApiResult";
import { ContribPoint } from "./state/contribution";

const serverUrl = "http://localhost:8888";

export async function fetchExtensions(): Promise<Extension[]> {
  return callApi(`${serverUrl}/dashi/extensions`);
}

export async function fetchContributionsRecord(): Promise<
  Record<ContribPoint, Contribution[]>
> {
  return callApi(`${serverUrl}/dashi/contributions`);
}

export async function fetchComponentModel(
  contribPoint: ContribPoint,
  contribIndex: number,
  inputValues: unknown[],
): Promise<ComponentModel> {
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
