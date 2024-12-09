import { renderHook, act } from "@testing-library/react";
import {
  useConfiguration,
  useExtensions,
  useContributionsResult,
  useContributionsRecord,
  useThemeMode,
  useContributions,
  useComponentChangeHandlers,
} from "./hooks";

describe("useConfiguration", () => {
  it("should initially return a stable object", () => {
    const { result, rerender } = renderHook(() => useConfiguration());
    const c1 = result.current;
    rerender();
    const c2 = result.current;
    expect(c1).toEqual({});
    expect(c2).toEqual({});
    expect(c1).toBe(c2);
  });
});

describe("useExtensions", () => {
  it("should initially return a stable array", () => {
    const { result, rerender } = renderHook(() => useExtensions());
    const e1 = result.current;
    rerender();
    const e2 = result.current;
    expect(e1).toEqual([]);
    expect(e2).toEqual([]);
    expect(e1).toBe(e2);
  });
});

describe("useContributionsResult", () => {
  it("should initially return a stable object", () => {
    const { result, rerender } = renderHook(() => useContributionsResult());
    const cr1 = result.current;
    rerender();
    const cr2 = result.current;
    expect(cr1).toEqual({});
    expect(cr2).toEqual({});
    expect(cr1).toBe(cr2);
  });
});

describe("useContributionsRecord", () => {
  it("should initially return a stable object", () => {
    const { result, rerender } = renderHook(() => useContributionsRecord());
    const cr1 = result.current;
    rerender();
    const cr2 = result.current;
    expect(cr1).toEqual({});
    expect(cr2).toEqual({});
    expect(cr1).toBe(cr2);
  });
});

describe("useThemeMode", () => {
  it("should initially return undefined", () => {
    const { result } = renderHook(() => useThemeMode());
    expect(result.current).toBeUndefined;
  });
});

describe("useContributions", () => {
  it("should initially return a stable empty array for empty contributions", () => {
    const { result, rerender } = renderHook(() => useContributions("panels"));
    const c1 = result.current;
    rerender();
    const c2 = result.current;
    expect(c1).toEqual([]);
    expect(c2).toEqual([]);
    expect(c1).toBe(c2);
  });
});

describe("useComponentChangeHandlers", () => {
  it("should return an array", () => {
    const { result } = renderHook(() =>
      useComponentChangeHandlers("panels", 3),
    );
    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current.length).toBe(3);
  });

  it("should return an array of callable handlers", () => {
    const { result } = renderHook(() =>
      useComponentChangeHandlers("panels", 3),
    );
    act(() =>
      result.current[0]({
        componentType: "button",
        id: "btn",
        property: "clicked",
        value: true,
      }),
    );
  });
});
