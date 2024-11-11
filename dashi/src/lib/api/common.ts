import type { ApiOptions } from "@/lib/api/types";

const defaultServerUrl = "http://localhost:8888";
const defaultEndpointName = "dashi";

export function makeUrl(path: string, options?: ApiOptions): string {
  const serverUrl = options?.serverUrl || defaultServerUrl;
  const endpointName = options?.endpointName || defaultEndpointName;
  return `${serverUrl}/${endpointName}/${path}`;
}
