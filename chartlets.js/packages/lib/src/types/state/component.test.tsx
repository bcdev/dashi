import { describe, it, expect } from "vitest";
import { isComponentState, isContainerState } from "./component";

describe("isComponentState", () => {
  it("should work", () => {
    expect(isComponentState({ type: "Button" })).toBe(true);
    expect(isComponentState({ type: "Button", children: [] })).toBe(true);
    expect(isComponentState({})).toBe(false);
    expect(isComponentState("Button")).toBe(false);
    expect(isComponentState({ type: 2 })).toBe(false);
    expect(isComponentState(new Event("click"))).toBe(false);
    expect(isComponentState(<span />)).toBe(false);
  });
});

describe("isContainerState", () => {
  it("should work", () => {
    expect(isContainerState({ type: "Button" })).toBe(false);
    expect(isContainerState({ type: "Button", children: [] })).toBe(true);
    expect(isContainerState({})).toBe(false);
    expect(isContainerState("Button")).toBe(false);
    expect(isContainerState({ type: 2 })).toBe(false);
    expect(isComponentState(new Event("click"))).toBe(false);
    expect(isComponentState(<span />)).toBe(false);
  });
});
