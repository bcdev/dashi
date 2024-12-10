import { describe, it, expect } from "vitest";
import { updateArray } from "@/utils/updateArray";

describe("Test that updateArray()", () => {
  it("works", () => {
    const array0: Record<string, unknown>[] = [
      { x: [0] },
      { x: [1] },
      { x: [2] },
    ];
    const array1 = updateArray(array0, 0, { y: 12 });
    expect(array0).toEqual([{ x: [0] }, { x: [1] }, { x: [2] }]);
    expect(array1).toEqual([{ x: [0], y: 12 }, { x: [1] }, { x: [2] }]);
    expect(array1).not.toBe(array0);
    expect(array1[0]).not.toBe(array0[0]);
    expect(array1[0].x).toBe(array0[0].x);
    expect(array1[1]).toBe(array0[1]);
    expect(array1[2]).toBe(array0[2]);
  });
});
