import type { JsonRpc, JsonRpcOptions } from "./types";
import { JsonRpcImpl } from "./impl";

export type {
  JsonRpc,
  JsonRpcOptions,
  JsonRpcRequest,
  JsonRpcResponse,
} from "./types";

export function newJsonRpc(options: JsonRpcOptions): JsonRpc {
  return new JsonRpcImpl(options);
}
