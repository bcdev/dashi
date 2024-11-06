import { describe, it, expect } from "vitest";

import { getValue } from "./getValue";

describe("Test that getValue()", () => {
  it("works on 0th level", () => {
    const obj = { a: 1, b: "x" };
    expect(getValue(obj, [])).toEqual({ a: 1, b: "x" });
  });

  it("works on 1st level", () => {
    const obj = { a: 1, b: "x" };
    expect(getValue(obj, ["a"])).toEqual(1);
    expect(getValue(obj, ["b"])).toEqual("x");
  });

  it("works on 2nd level", () => {
    const obj = { a: [1, 2, 3], b: { c: "x" } };
    expect(getValue(obj, ["a", "1"])).toEqual(2);
    expect(getValue(obj, ["a", 2])).toEqual(3);
    expect(getValue(obj, ["b", "c"])).toEqual("x");
  });
});
