import { describe, it, expect } from "vitest";
import { isFunction } from "@/utils/isFunction";

describe("Test that isFunction()", () => {
  it("works", () => {
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(true)).toBe(false);
    expect(isFunction("abc")).toBe(false);
    expect(isFunction(0)).toBe(false);
    expect(isFunction(1)).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction(() => {})).toBe(true);
  });
});
