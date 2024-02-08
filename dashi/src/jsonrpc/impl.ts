import { JsonRpc, JsonRpcRequest, JsonRpcResponse } from "./types.ts";

export function getJsonRpc(url: string, method: str = "POST"): JsonRpc {
  const jsonRpc: JsonRpc = async (
    request: JsonRpcRequest,
  ): Promise<JsonRpcResponse> => {
    const result = await fetch(url, { method, body: JSON.stringify(request) });
    if (typeof request.id === "string" || typeof request.id === "number") {
      // We expect an answer
    }
  };
  return jsonRpc;
}
