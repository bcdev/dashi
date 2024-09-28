import { ComponentModel } from "../model/component.ts";
import { ContributionModel, Extension } from "../model/extension.ts";
import { CallbackCallRequest, CallbackCallResult } from "./types.ts";

const serverUrl = "http://localhost:8888";

export type ApiError = {
  status: number;
  message: string;
  traceback?: string[];
};

export async function fetchExtensions(): Promise<Extension[]> {
  return fetchJson(`${serverUrl}/dashi/extensions`);
}

export async function fetchContributions(
  contribPoint: string,
): Promise<ContributionModel[]> {
  return fetchJson(`${serverUrl}/dashi/contributions/${contribPoint}`);
}

export async function fetchLayoutComponent(
  contribPoint: string,
  contribIndex: number,
  inputValues: unknown[],
): Promise<ComponentModel> {
  return fetchJson(
    `${serverUrl}/dashi/layout/${contribPoint}/${contribIndex}`,
    { body: JSON.stringify({ inputValues }), method: "post" },
  );
}

export async function fetchCallbackOutputs(
  callRequests: CallbackCallRequest[],
): Promise<CallbackCallResult[]> {
  return fetchJson(`${serverUrl}/dashi/callback`, {
    body: JSON.stringify({ callRequests }),
    method: "post",
  });
}

export async function fetchJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, init);
  const apiResponse = await response.json();
  if (typeof apiResponse === "object") {
    if (apiResponse.hasOwnProperty("error")) {
      throw new ApiException(apiResponse.error);
    }
    if (!response.ok) {
      throw new ApiException({
        status: response.status,
        message: response.statusText,
      });
    }
    if (apiResponse.hasOwnProperty("result")) {
      return apiResponse.result;
    }
  }
  throw new Error(`unexpected response from ${url}`);
}

export class ApiException extends Error {
  public readonly status: number;
  public readonly traceback: string[] | undefined;

  constructor(error: ApiError) {
    super(error.message);
    this.status = error.status;
    this.traceback = error.traceback;
  }
}
