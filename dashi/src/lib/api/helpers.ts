import type { ApiOptions, ApiError, ApiResult } from "@/lib/types/api";
import { hasOwnProperty } from "../utils/hasOwnProperty";

const defaultServerUrl = "http://localhost:8888";
const defaultEndpointName = "dashi";

export async function fetchApiResult<T, P extends unknown[]>(
  callApi: (...args: P) => Promise<T>,
  ...args: P
): Promise<ApiResult<T>> {
  try {
    const data = await callApi(...args);
    return { status: "ok", data };
  } catch (exception) {
    if (exception instanceof ApiException) {
      return { status: "failed", error: exception.apiError };
    } else {
      const message = `${(exception as { message: string }).message || exception}`;
      return { status: "failed", error: { message } };
    }
  }
}

export async function callApi<T, T2 = T>(
  url: string,
  init?: RequestInit,
  transform?: (data: T) => T2,
): Promise<T2> {
  const response = await fetch(url, init);
  const apiResponse = await response.json();
  if (typeof apiResponse === "object") {
    if (apiResponse.error) {
      throw new ApiException(apiResponse.error);
    }
    if (!response.ok) {
      throw new ApiException({
        status: response.status,
        message: response.statusText,
      });
    }
    if (hasOwnProperty(apiResponse, "result")) {
      return transform ? transform(apiResponse.result) : apiResponse.result;
    }
  }
  throw new ApiException({ message: `unexpected response from ${url}` });
}

export class ApiException extends Error {
  public readonly apiError: ApiError;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.apiError = apiError;
  }
}

export function makeUrl(path: string, options?: ApiOptions): string {
  const serverUrl = options?.serverUrl || defaultServerUrl;
  const endpointName = options?.endpointName || defaultEndpointName;
  return `${serverUrl}/${endpointName}/${path}`;
}
