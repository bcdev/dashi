import {
  JsonRpc,
  JsonRpcId,
  JsonRpcOptions,
  JsonRpcRequest,
  JsonRpcResponse,
  JsonValue,
} from "./types";
import { validateRequest, validateResponse } from "./schema";
import { JsonRpcRequestError, JsonRpcResponseError } from "./error";

type Subscription = [
  (response: JsonRpcResponse) => void,
  (error: JsonRpcResponseError) => void,
];

export class JsonRpcImpl implements JsonRpc {
  readonly baseUrl: string;
  readonly submitUrl: string;
  readonly pollUrl: string;
  readonly pollInterval: number;
  private pollTimerId: number | undefined;
  private readonly subscriptions: Map<JsonRpcId, Subscription>;
  private readonly fetch: (
    url: string,
    init?: RequestInit,
  ) => Promise<Response>;

  constructor(options: JsonRpcOptions) {
    let baseUrl = options.baseUrl;
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    }
    this.baseUrl = baseUrl;
    this.submitUrl = `${baseUrl}/submit`;
    this.pollUrl = `${baseUrl}/poll`;
    this.pollInterval = options.pollInterval || 1000;
    this.pollTimerId = undefined;
    this.subscriptions = new Map();
    this.fetch = options.fetch || fetch;
  }

  async submit(
    rpcRequest: JsonRpcRequest,
  ): Promise<JsonRpcResponse | undefined> {
    if (!validateRequest(rpcRequest)) {
      throw new JsonRpcRequestError(rpcRequest, validateRequest.errors);
    }
    const rpcResponse = await this.fetchJson(this.submitUrl, {
      method: "POST",
      body: JSON.stringify(rpcRequest),
    });
    if (rpcResponse !== undefined && rpcResponse !== null) {
      if (validateResponse(rpcResponse)) {
        return rpcResponse as unknown as JsonRpcResponse;
      } else {
        throw new JsonRpcResponseError(rpcResponse, validateResponse.errors);
      }
    } else if (rpcRequest.id !== undefined) {
      if (this.pollTimerId === undefined) {
        this.pollTimerId = window.setInterval(
          this.poll.bind(this),
          this.pollInterval,
        );
      }
      const id = rpcRequest.id;
      return new Promise<JsonRpcResponse>((resolve, reject) => {
        this.subscriptions.set(id, [resolve, reject]);
      });
    }
  }

  async poll() {
    const responses = await this.fetchJson(this.pollUrl);
    if (!Array.isArray(responses)) {
      return;
    }
    for (const response of responses) {
      const id = getId(response);
      if (isId(id) && this.subscriptions.has(id)) {
        const [resolve, reject] = this.subscriptions.get(id)!;
        this.subscriptions.delete(id);
        if (this.subscriptions.size === 0) {
          window.clearInterval(this.pollTimerId);
          this.pollTimerId = undefined;
        }
        // TODO
        /*
        void this.submit({
          jsonrpc: "2.0",
          id: -1,
          method: "response_consumed",
          params: [id],
        });
        */
        if (validateResponse(response)) {
          resolve(response as unknown as JsonRpcResponse);
        } else {
          reject(new JsonRpcResponseError(response, validateResponse.errors));
        }
      }
    }
  }

  async fetchJson(
    url: string,
    options?: RequestInit,
  ): Promise<JsonValue | undefined> {
    const response = await this.fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`${response.statusText} (status ${response.status})`);
    }
    if (!response.headers.get("Content-Length")) {
      return undefined;
    }
    return await response.json();
  }
}

function isId(value: JsonValue | undefined): value is string | number {
  return typeof value === "string" || typeof value === "number";
}

function getId(response: JsonValue): JsonValue | undefined {
  if (
    typeof response === "object" &&
    response !== null &&
    !Array.isArray(response)
  ) {
    return response.id;
  }
}
