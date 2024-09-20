import { describe, expect, test } from "vitest";
import { JsonRpcRequest, newJsonRpc } from "./index";

const baseUrl = "https://test-jsonrcp/";

const sum = (values: number[]) => values.reduce((vSum, v) => vSum + v);

describe("that the idea works", () => {
  const fetches: [string, RequestInit | undefined][] = [];
  let lastRequest: JsonRpcRequest | undefined = undefined;

  function fetchMock(url: string, init?: RequestInit): Promise<Response> {
    let body = "";
    fetches.push([url, init]);
    if (url.endsWith("/submit")) {
      const rcpRequest = JSON.parse(init!.body as string);
      // console.log("--------------->", rcpRequest);
      const method = rcpRequest.method;
      if (method === "sum") {
        body = JSON.stringify({
          jsonrpc: "2.0",
          id: rcpRequest.id,
          result: sum(rcpRequest.params as number[]),
        });
      } else if (method === "sum_later") {
        lastRequest = rcpRequest;
        body = JSON.stringify(null);
      } else {
        body = JSON.stringify({
          jsonrpc: "2.0",
          id: rcpRequest.id,
          error: { code: 13, message: `Invalid method: ${method}` },
        });
      }
    } else if (url.endsWith("/poll")) {
      if (lastRequest) {
        body = JSON.stringify([
          {
            jsonrpc: "2.0",
            id: lastRequest.id,
            result: sum(lastRequest.params as number[]),
          },
        ]);
      }
    }
    if (body === "") {
      return Promise.resolve(new Response());
    }
    return Promise.resolve(
      new Response(body, {
        status: 200,
        statusText: "OK",
        headers: { "Content-Length": `${body.length}` },
      }),
    );
  }

  const jsonRpc = newJsonRpc({
    baseUrl: baseUrl,
    fetch: fetchMock,
    pollInterval: 100,
  });

  test("immediate return value", async () => {
    const promise = jsonRpc.submit({
      jsonrpc: "2.0",
      id: 0,
      method: "sum",
      params: [1, 2, 3, 4, 5],
    });

    expect(promise).instanceof(Promise);
    expect(fetches.length).toBeGreaterThan(0);
    expect(fetches[0][0]).toEqual("https://test-jsonrcp/submit");
    expect(fetches[0][1]?.body).toEqual(
      '{"jsonrpc":"2.0","id":0,"method":"sum","params":[1,2,3,4,5]}',
    );

    const response = await promise;
    expect(response).instanceof(Object);
    expect(response?.id).toEqual(0);
    expect(response?.result).toEqual(15);
  });

  test("deferred return value", async () => {
    const promise = jsonRpc.submit({
      jsonrpc: "2.0",
      id: 1,
      method: "sum_later",
      params: [1, 2, 3, 4, 5, 6],
    });

    expect(promise).instanceof(Promise);
    expect(fetches.length).toBeGreaterThan(1);
    expect(fetches[1][0]).toEqual("https://test-jsonrcp/submit");
    expect(fetches[1][1]?.body).toEqual(
      '{"jsonrpc":"2.0","id":1,"method":"sum_later","params":[1,2,3,4,5,6]}',
    );

    const response = await promise;
    expect(response).instanceof(Object);
    expect(response?.id).toEqual(1);
    expect(response?.result).toEqual(21);
  });
});
