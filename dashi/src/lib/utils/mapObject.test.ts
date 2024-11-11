import { describe, it, expect } from "vitest";

import { getValue, setValue, toObjPath } from "./objPath";
import { mapObject } from "@/lib/utils/mapObject";

describe("Test that mapObject()", () => {
  it("works", () => {
    const obj = { a: 1, b: "4", c: true };
    expect(mapObject(obj, (x) => Number(x))).toEqual({ a: 1, b: 4, c: 1 });
  });
});
