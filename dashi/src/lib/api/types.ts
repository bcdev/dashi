export interface ApiOptions {
  serverUrl?: string;
  endpointName?: string;
}

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
