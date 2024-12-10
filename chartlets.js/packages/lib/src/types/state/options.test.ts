import { describe, it, expect } from "vitest";
import { isMutableHostStore } from "./options";

const hostStore = {
  get: (name: string) => name,
  subscribe: (_cb: () => void) => {},
};

const mutableHostStore = {
  ...hostStore,
  set: (_name: string, _value: unknown) => {},
};

describe("isHostStore", () => {
  it("should work", () => {
    expect(isMutableHostStore({})).toBe(false);
    expect(isMutableHostStore(hostStore)).toBe(true);
    expect(isMutableHostStore(mutableHostStore)).toBe(true);
  });
});

describe("isMutableHostStore", () => {
  it("should work", () => {
    expect(isMutableHostStore({})).toBe(false);
    expect(isMutableHostStore(hostStore)).toBe(false);
    expect(isMutableHostStore(mutableHostStore)).toBe(true);
  });
});
