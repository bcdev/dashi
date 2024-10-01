import { expect, test } from "vitest";
import { set } from "./set";

test("set flat object", () => {
  const obj = { a: 1, b: 2 };
  expect(set(obj, "a", 3)).toEqual({ a: 3, b: 2 });
  expect(set(obj, "b", 4)).toEqual({ a: 3, b: 4 });
  expect(set(obj, "c", 5)).toEqual({ a: 3, b: 4, c: 5 });
});

test("set nested object", () => {
  const obj = { a: { b: 2, c: "X" } };
  expect(set(obj, "a.b", 3)).toEqual({ a: { b: 3, c: "X" } });
  expect(set(obj, "a.c", "Y")).toEqual({ a: { b: 3, c: "Y" } });
  expect(set(obj, "a.d", true)).toEqual({ a: { b: 3, c: "Y", d: true } });
});

test("set array", () => {
  const arr = [1, 2];
  expect(set(arr, "0", 3)).toEqual([3, 2]);
  expect(set(arr, "1", 4)).toEqual([3, 4]);
  expect(set(arr, "2", 5)).toEqual([3, 4, 5]);
});

test("set array of objects", () => {
  const arr = [{ a: 1, b: 2 }, 3];
  expect(set(arr, "0.a", 4)).toEqual([{ a: 4, b: 2 }, 3]);
  expect(set(arr, "0.b", 5)).toEqual([{ a: 4, b: 5 }, 3]);
  expect(set(arr, "1", 7)).toEqual([{ a: 4, b: 5 }, 7]);
  expect(set(arr, "2", 8)).toEqual([{ a: 4, b: 5 }, 7, 8]);
});

test("set object with array of objects with array", () => {
  const arr = { a: [{ b: [{ x: 27, y: 28 }] }, 38] };
  expect(set(arr, "a.0.b.0.x", 28)).toEqual({
    a: [{ b: [{ x: 28, y: 28 }] }, 38],
  });
  expect(set(arr, "a.0.b.0.y", 29)).toEqual({
    a: [{ b: [{ x: 28, y: 29 }] }, 38],
  });
});
