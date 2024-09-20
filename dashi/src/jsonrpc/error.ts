import { ErrorObject } from "ajv";
import { JsonRpcRequest, JsonRpcResponse } from "./types.ts";

export class JsonRpcError extends Error {
  readonly errors: ErrorObject[] | undefined;

  constructor(message: string, errors: ErrorObject[] | null | undefined) {
    super(message);
    this.errors = errors === null ? undefined : errors;
  }
}

export class JsonRpcRequestError extends JsonRpcError {
  readonly request: JsonRpcRequest;

  constructor(
    request: JsonRpcRequest,
    errors: ErrorObject[] | null | undefined,
  ) {
    super("Invalid JSON-RCP request", errors);
    this.request = request;
  }
}

export class JsonRpcResponseError extends JsonRpcError {
  readonly response: JsonRpcResponse | unknown;

  constructor(
    response: JsonRpcResponse | unknown,
    errors: ErrorObject[] | null | undefined,
  ) {
    super("Invalid JSON-RCP request", errors);
    this.response = response;
  }
}
