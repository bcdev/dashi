import { describe, it, vi, expect, beforeEach, afterEach, Mock } from "vitest";
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
    const mockResponse = {
      json: vi.fn().mockResolvedValue({ message: "Hello, world!" }),
    };

    // Mock fetch to resolve with the mock response
    (globalThis.fetch as Mock).mockResolvedValue(mockResponse);

    // Call fetch
    const response = await fetchContributions({
      serverUrl: "https://chartlets-test",
      endpointName: "api",
    });
    const data = response.data;

    // Assertions
    expect(fetch).toHaveBeenCalledOnce();
    expect(data).toEqual({ message: "Hello, world!" });
  });
});
