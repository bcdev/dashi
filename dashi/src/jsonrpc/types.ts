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

export type JsonRpcId = string | number;

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  method: string;
  params?: Record<string, JsonValue> | JsonValue[];
  id?: JsonRpcId;
}

export interface JsonRpcResponse {
  jsonrpc: "2.0";
  result?: JsonValue;
  error?: {
    code: number;
    message: string;
    data?: JsonValue;
  };
  id: JsonRpcId;
}

export interface JsonRpc {
  baseUrl: string;
  submit(request: JsonRpcRequest): Promise<JsonRpcResponse | undefined>;
}

export interface JsonRpcOptions {
  baseUrl: string;
  pollInterval?: number;
  fetch?: (url: string, init?: RequestInit) => Promise<Response>;
}
