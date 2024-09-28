import { ApiError, ApiException } from "./api.ts";
import { useEffect, useState } from "react";

export interface FetchState<T> {
  data?: T;
  error?: ApiError;
  loading?: boolean;
}

export function useFetchState<T, P extends unknown[]>(
  fetch: (...args: P) => Promise<T>,
  ...args: P
): FetchState<T> | undefined {
  const [state, setState] = useState<FetchState<T>>();
  useEffect(() => {
    if (!state) {
      setState({ loading: true });
      fetchState(fetch, ...args).then((state) => void setState({ ...state }));
    }
  }, [fetch, ...args]);
  return state;
}

export function fetchState<T, P extends unknown[]>(
  fetch: (...args: P) => Promise<T>,
  ...args: P
): Promise<FetchState<T>> {
  return fetch(...args)
    .then((data) => ({ data }))
    .catch((error) => {
      if (error instanceof ApiException) {
        return {
          error: {
            status: error.status,
            message: error.message,
            traceback: error.traceback,
          },
        };
      } else {
        return {
          error: { status: -1, message: `${error}` },
        };
      }
    });
}
