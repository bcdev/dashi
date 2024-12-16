import { describe, it, expect } from "vitest";
import { isObject } from "@/utils/isObject";

describe("Test that isObject()", () => {
  it("works", () => {
    expect(isObject(undefined)).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject("abc")).toBe(false);
    expect(isObject(0)).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(() => {})).toBe(false);
  });
});
