import { describe, it, expect } from "vitest";
import {
  type HostStore,
  type MutableHostStore,
  isHostStore,
  isMutableHostStore,
} from "./host";

const hostStore: HostStore = {
  get: (name: string) => name,
  subscribe: (_cb: () => void) => {},
};

const mutableHostStore: MutableHostStore = {
  ...hostStore,
  set: (_name: string, _value: unknown) => {},
};

describe("isHostStore", () => {
  it("should work", () => {
    expect(isHostStore({})).toBe(false);
    expect(isHostStore(hostStore)).toBe(true);
    expect(isHostStore(mutableHostStore)).toBe(true);
  });
});

describe("isMutableHostStore", () => {
  it("should work", () => {
    expect(isMutableHostStore({})).toBe(false);
    expect(isMutableHostStore(hostStore)).toBe(false);
    expect(isMutableHostStore(mutableHostStore)).toBe(true);
  });
});
