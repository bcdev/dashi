import {
  describe,
  it,
  vi,
  expect,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import { fetchContributions } from "./fetchContributions";

describe("fetchContributions", () => {
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
      extensions: [{ name: "e0", version: "1", contributes: ["panels"] }],
      contributions: {
        panels: [{ name: "p0", extension: "e0", layout: {} }],
      },
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
    const response = await fetchContributions({
      serverUrl: "https://chartlets-test",
      endpointName: "api",
    });

    // Assertions
    expect(fetch).toHaveBeenCalledOnce();
    expect(response).toEqual({
      status: "ok",
      data: {
        extensions: [{ name: "e0", version: "1", contributes: ["panels"] }],
        contributions: {
          panels: [
            {
              name: "p0",
              extension: "e0",
              layout: { inputs: [], outputs: [] },
              callbacks: [],
            },
          ],
        },
      },
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
    const response = await fetchContributions({
      serverUrl: "https://chartlets-test",
      endpointName: "api",
    });
    // Assertions
    expect(fetch).toHaveBeenCalledOnce();
    expect(response).toEqual({
      status: "failed",
      error: {
        message:
          "unexpected response from https://chartlets-test/api/contributions",
      },
    });
  });
});
