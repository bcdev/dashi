import { ComponentModel } from "../model/component.ts";
import { ContributionModel, ExtensionModel } from "../model/extension.ts";
import { CallbackCallRequest, CallbackCallResult } from "./types.ts";
import { callApi } from "../utils/fetchApiResult.ts";

const serverUrl = "http://localhost:8888";

export async function fetchExtensions(): Promise<ExtensionModel[]> {
  return callApi(`${serverUrl}/dashi/extensions`);
}

export async function fetchContributions(): Promise<
  Record<string, ContributionModel[]>
> {
  return callApi(`${serverUrl}/dashi/contributions`);
}

export async function fetchLayoutComponent(
  contribPoint: string,
  contribIndex: number,
  inputValues: unknown[],
): Promise<ComponentModel> {
  return callApi(`${serverUrl}/dashi/layout/${contribPoint}/${contribIndex}`, {
    body: JSON.stringify({ inputValues }),
    method: "post",
  });
}

export async function fetchCallbackOutputs(
  callRequests: CallbackCallRequest[],
): Promise<CallbackCallResult[]> {
  return callApi(`${serverUrl}/dashi/callback`, {
    body: JSON.stringify({ callRequests }),
    method: "post",
  });
}
