import { expect, test } from "vitest";
import { get } from "./get.js";

test("get from flat object", () => {
  const obj = { a: 1, b: 2 };
  expect(get(obj, "a")).toBe(1);
  expect(get(obj, "b")).toBe(2);
  expect(get(obj, "c")).toBeUndefined();
});

test("get from nested object", () => {
  const obj = { a: { b: 2, c: "X" } };
  expect(get(obj, "a.b")).toBe(2);
  expect(get(obj, "a.c")).toBe("X");
  expect(get(obj, "a.d")).toBeUndefined();
});

test("get from array", () => {
  const arr = [1, 2];
  expect(get(arr, "0")).toBe(1);
  expect(get(arr, "1")).toBe(2);
  expect(get(arr, "2")).toBeUndefined();
});

test("get from array of objects", () => {
  const arr = [{ a: 1, b: 2 }, 2];
  expect(get(arr, "0.a")).toBe(1);
  expect(get(arr, "0.b")).toBe(2);
  expect(get(arr, "0.c")).toBeUndefined();
  expect(get(arr, "1")).toBe(2);
  expect(get(arr, "2")).toBeUndefined();
});

test("get from object with array of objects with array", () => {
  const arr = { a: [{ b: [{ x: 27 }] }, 38] };
  expect(get(arr, "a.0.b.0.x")).toBe(27);
  expect(get(arr, "a.1")).toBe(38);
});
