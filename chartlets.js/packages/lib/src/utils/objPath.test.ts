import { describe, it, expect } from "vitest";

import {
  equalObjPaths,
  getValue,
  setValue,
  normalizeObjPath,
  formatObjPath,
} from "./objPath";

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

  it("ignores missing props", () => {
    const obj = { a: [1, 2, 3], b: { c: "x" } };
    expect(getValue(obj, ["c", 6, "d"])).toBeUndefined();
    expect(getValue(obj, ["b", "c", "d", "e"])).toBeUndefined();
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

describe("Test that normalizeObjPath()", () => {
  it("does not convert arrays", () => {
    const value = [1, 2, 3];
    expect(normalizeObjPath(value)).toBe(value);
    expect(normalizeObjPath(value)).toEqual([1, 2, 3]);
  });

  it("converts undefined", () => {
    expect(normalizeObjPath(undefined)).toEqual([]);
  });

  it("converts null", () => {
    expect(normalizeObjPath(null)).toEqual([]);
  });

  it("converts numbers", () => {
    expect(normalizeObjPath(3)).toEqual([3]);
  });

  it("converts strings", () => {
    expect(normalizeObjPath("")).toEqual([]);
    expect(normalizeObjPath("colors")).toEqual(["colors"]);
    expect(normalizeObjPath("colors.6")).toEqual(["colors", 6]);
    expect(normalizeObjPath("colors.6.red")).toEqual(["colors", 6, "red"]);
  });
});

describe("Test that formatObjPath()", () => {
  it("works", () => {
    expect(formatObjPath(undefined)).toEqual("");
    expect(formatObjPath([])).toEqual("");
    expect(formatObjPath(["a", 3, "c"])).toEqual("a.3.c");
    expect(formatObjPath("a.b.3")).toEqual("a.b.3");
    expect(formatObjPath(6)).toEqual("6");
  });
});

describe("Test that equalObjPaths()", () => {
  it("works with equal paths", () => {
    expect(equalObjPaths("a", "a")).toBe(true);
    expect(equalObjPaths(2, 2)).toBe(true);
    expect(equalObjPaths("2", 2)).toBe(true);
    expect(equalObjPaths([3, 1, 2], [3, 1, 2])).toBe(true);
    expect(equalObjPaths([3, 1, 2], "3.1.2")).toBe(true);
  });

  it("works with non-equal paths", () => {
    expect(equalObjPaths("a", "b")).toBe(false);
    expect(equalObjPaths("a", 2)).toBe(false);
    expect(equalObjPaths("a", 2)).toBe(false);
    expect(equalObjPaths([3, 1, 2], [3, 1, 2, 0])).toBe(false);
  });
});
