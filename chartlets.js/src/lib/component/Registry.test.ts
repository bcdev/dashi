import { describe, it, expect } from "vitest";

import { RegistryImpl } from "@/lib/component/Registry";

describe("Test that RegistryImpl", () => {
  it("works", () => {
    const registry = new RegistryImpl();
    expect(registry.types).toEqual([]);

    const A = () => void 0;
    const B = () => void 0;
    const C = () => void 0;
    const unregisterA = registry.register(A);
    const unregisterB = registry.register(B);
    const unregisterC = registry.register(C);

    expect(registry.lookup("A")).toBe(A);
    expect(registry.lookup("B")).toBe(B);
    expect(registry.lookup("C")).toBe(C);
    expect(new Set(registry.types)).toEqual(new Set(["A", "B", "C"]));

    unregisterA();
    expect(registry.lookup("A")).toBeUndefined();
    expect(registry.lookup("B")).toBe(B);
    expect(registry.lookup("C")).toBe(C);
    expect(new Set(registry.types)).toEqual(new Set(["B", "C"]));

    unregisterB();
    expect(registry.lookup("A")).toBeUndefined();
    expect(registry.lookup("B")).toBeUndefined();
    expect(registry.lookup("C")).toBe(C);
    expect(new Set(registry.types)).toEqual(new Set(["C"]));

    const C2 = () => void 0;
    const unregisterC2 = registry.register(C2, "C");
    expect(registry.lookup("A")).toBeUndefined();
    expect(registry.lookup("B")).toBeUndefined();
    expect(registry.lookup("C")).toBe(C2);
    expect(new Set(registry.types)).toEqual(new Set(["C"]));

    unregisterC2();
    expect(registry.lookup("A")).toBeUndefined();
    expect(registry.lookup("B")).toBeUndefined();
    expect(registry.lookup("C")).toBe(C);
    expect(new Set(registry.types)).toEqual(new Set(["C"]));

    unregisterC();
    expect(registry.lookup("A")).toBeUndefined();
    expect(registry.lookup("B")).toBeUndefined();
    expect(registry.lookup("C")).toBeUndefined();
    expect(registry.types).toEqual([]);
  });
});
