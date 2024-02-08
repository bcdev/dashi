export interface JsonObject {
  [name: string]: JsonValue;
}
export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonObject
  | JsonValue[];

export interface JsonRpcRequest {
  jsonrpc: 2;
  method: string;
  params?: Record<string, JsonValue> | JsonValue[];
  id?: string | number | null;
}

export interface JsonRpcResponse {
  jsonrpc: 2;
  result?: JsonValue;
  error?: {
    code: number;
    message: string;
    data?: JsonValue;
  };
  id: string | number;
}

export interface JsonRpc {
  (request: JsonRpcRequest): Promise<JsonRpcResponse>;
}
