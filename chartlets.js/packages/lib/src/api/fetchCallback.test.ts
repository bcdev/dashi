import {
  describe,
  it,
  vi,
  expect,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import { fetchCallback } from "./fetchCallback";

describe("fetchCallback", () => {
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
      contribPoint: "panels",
      contribIndex: 0,
      stateChanges: [
        {
          id: "checkbox0",
          property: "value",
          value: true,
        },
      ],
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
    const response = await fetchCallback([], {
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

  it("should return error for bad API responses", async () => {
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
    const response = await fetchCallback([], {
      serverUrl: "https://chartlets-test",
      endpointName: "api",
    });
    // Assertions
    expect(fetch).toHaveBeenCalledOnce();
    expect(response).toEqual({
      status: "failed",
      error: {
        message: "unexpected response from https://chartlets-test/api/callback",
      },
    });
  });
});
