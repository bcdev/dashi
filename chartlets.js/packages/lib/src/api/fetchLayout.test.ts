import {
  describe,
  it,
  vi,
  expect,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import { fetchLayout } from "./fetchLayout";

describe("fetchLayout", () => {
  beforeEach(() => {
    // Mock the global fetch function
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    // Restore the original fetch implementation
    vi.restoreAllMocks();
  });

  it("should return expected data on success", async () => {
    // Define a mock response
    const expectedResult = {
      type: "Button",
      text: "Click me!",
    };
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "ok",
      json: vi.fn().mockResolvedValue({
        result: expectedResult,
      }),
    };

    // Mock fetch to resolve with the mock response
    (globalThis.fetch as Mock).mockResolvedValue(mockResponse);

    // Call fetch
    const response = await fetchLayout("panels", 0, [], {
      serverUrl: "https://chartlets-test",
      endpointName: "api",
    });

    // Assertions
    expect(fetch).toHaveBeenCalledOnce();
    expect(response).toEqual({
      status: "ok",
      data: expectedResult,
    });
  });

  it("should return error for bad responses", async () => {
    // Define a mock response
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "ok",
      json: vi.fn().mockResolvedValue({ message: "Hello, world!" }),
    };

    // Mock fetch to resolve with the mock response
    (globalThis.fetch as Mock).mockResolvedValue(mockResponse);

    // Call fetch
    const response = await fetchLayout("panels", 0, [], {
      serverUrl: "https://chartlets-test",
      endpointName: "api",
    });
    // Assertions
    expect(fetch).toHaveBeenCalledOnce();
    expect(response).toEqual({
      status: "failed",
      error: {
        message:
          "unexpected response from https://chartlets-test/api/layout/panels/0",
      },
    });
  });
});
