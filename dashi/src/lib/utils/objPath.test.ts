import { describe, it, expect } from "vitest";

import { getValue, setValue } from "./objPath";

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

describe("Test that setValue()", () => {
  it("works on 0th level", () => {
    const obj = { a: 1, b: "x" };
    const obj2 = setValue(obj, [], 13);
    expect(obj2).toBe(obj);
  });

  it("works on 1st level object - change", () => {
    const obj = { a: 1, b: "x" };
    const obj2 = setValue(obj, ["a"], 2);
    expect(obj2).not.toBe(obj);
    expect(obj2).toEqual({ a: 2, b: "x" });
  });

  it("works on 1st level object - create", () => {
    const obj = { b: "x" };
    const obj2 = setValue(obj, ["a"], 11);
    expect(obj2).not.toBe(obj);
    expect(obj2).toEqual({ a: 11, b: "x" });
  });

  it("works on 1st level object - no change", () => {
    const obj = { a: 1, b: "x" };
    const obj2 = setValue(obj, ["a"], 1);
    expect(obj2).toBe(obj);
    expect(obj2).toEqual({ a: 1, b: "x" });
  });

  it("works on 1st level array - change", () => {
    const obj = { a: [1, 2, 3], b: "x" };
    const obj2 = setValue(obj, ["a", 2], 15);
    expect(obj2).not.toBe(obj);
    expect(obj2).toEqual({ a: [1, 2, 15], b: "x" });
  });

  it("works on 1st level array - create", () => {
    const obj = { b: "x" };
    const obj2 = setValue(obj, ["a", 0], 14);
    expect(obj2).not.toBe(obj);
    expect(obj2).toEqual({ a: [14], b: "x" });
  });

  it("works on 1st level array - no change", () => {
    const obj = { a: [1, 2, 3], b: "x" };
    const obj2 = setValue(obj, ["a", 1], 2);
    expect(obj2).toBe(obj);
    expect(obj2).toEqual({ a: [1, 2, 3], b: "x" });
  });
});