import { hasOwnProperty } from "./hasOwnProperty";

export interface ApiResult<T> {
  status?: "pending" | "ok" | "failed";
  data?: T;
  error?: ApiError;
}

export type ApiError = {
  message: string;
  status?: number;
  traceback?: string[];
};

export class ApiException extends Error {
  public readonly apiError: ApiError;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.apiError = apiError;
  }
}

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

export async function callApi<T, RT = T>(
  url: string,
  init?: RequestInit,
  transform?: (data: RT) => T,
): Promise<T> {
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
