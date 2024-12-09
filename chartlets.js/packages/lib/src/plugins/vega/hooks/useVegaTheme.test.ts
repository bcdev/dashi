import { vi, describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useVegaTheme } from "./useVegaTheme";

describe("useVegaTheme", () => {
  let matchMediaMock: jest.Mock;

  // Base mock for matchMedia
  const baseMock = {
    media: "",
    matches: false,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };

  beforeAll(() => {
    matchMediaMock = vi.fn((query) => ({
      ...baseMock,
      media: query,
      matches: query === "(prefers-color-scheme: dark)",
    }));

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function setMatchMediaState(isDark: boolean) {
    const media = isDark
      ? "(prefers-color-scheme: dark)"
      : "(prefers-color-scheme: light)";
    matchMediaMock.mockImplementation((query) => ({
      ...baseMock,
      media,
      matches: query === media,
    }));
  }

  it("'default' in dark mode", () => {
    setMatchMediaState(true);
    const { result } = renderHook(() => useVegaTheme("default"));
    expect(result.current).toEqual(undefined);
  });

  it("'default' in light mode", () => {
    setMatchMediaState(false);
    const { result } = renderHook(() => useVegaTheme("default"));
    expect(result.current).toEqual(undefined);
  });

  it("'system' in dark mode", () => {
    setMatchMediaState(true);
    const { result } = renderHook(() => useVegaTheme("system"));
    expect(result.current).toEqual("dark");
  });

  it("'system' in light mode", () => {
    setMatchMediaState(false);
    const { result } = renderHook(() => useVegaTheme("system"));
    expect(result.current).toEqual(undefined);
  });

  it("vega theme in dark mode", () => {
    setMatchMediaState(true);
    const { result } = renderHook(() => useVegaTheme("carbong90"));
    expect(result.current).toEqual("carbong90");
  });

  it("vega theme in light mode", () => {
    setMatchMediaState(false);
    const { result } = renderHook(() => useVegaTheme("carbong90"));
    expect(result.current).toEqual("carbong90");
  });
});
