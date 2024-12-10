import { describe, it, expect } from "vitest";
import { isString } from "@/utils/isString";

describe("Test that isString()", () => {
  it("works", () => {
    expect(isString(undefined)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(true)).toBe(false);
    expect(isString("abc")).toBe(true);
    expect(isString(0)).toBe(false);
    expect(isString(1)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(() => {})).toBe(false);
  });
});
