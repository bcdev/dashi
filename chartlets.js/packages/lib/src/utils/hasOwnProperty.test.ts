import { describe, it, expect } from "vitest";
import { hasOwnProperty } from "@/utils/hasOwnProperty";

describe("Test that hasOwnProperty()", () => {
  it("works", () => {
    expect(hasOwnProperty({ test: 13 }, "test")).toBe(true);
    expect(hasOwnProperty({ test: 13 }, "test2")).toBe(false);
  });
});
