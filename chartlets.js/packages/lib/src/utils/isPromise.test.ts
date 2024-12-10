import { describe, it, expect } from "vitest";
import { isPromise } from "@/utils/isPromise";

describe("Test that isPromise()", () => {
  it("works", () => {
    expect(isPromise(undefined)).toBe(false);
    expect(isPromise(null)).toBe(false);
    expect(isPromise(true)).toBe(false);
    expect(isPromise("abc")).toBe(false);
    expect(isPromise(0)).toBe(false);
    expect(isPromise(1)).toBe(false);
    expect(isPromise({})).toBe(false);
    expect(isPromise([])).toBe(false);
    expect(isPromise(() => {})).toBe(false);
    expect(isPromise(Promise.resolve(true))).toBe(true);
  });
});
