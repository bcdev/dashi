import { describe, it, expect } from "vitest";

import {
  getInputValueFromComponent,
  getInputValueFromState,
} from "./getInputValues";

const componentState = {
  type: "Box",
  id: "b1",
  children: [
    { type: "Plot", id: "p1", chart: null },
    {
      type: "Box",
      id: "b2",
      children: [
        { type: "Checkbox", id: "cb1", value: true },
        { type: "Select", id: "dd1", value: 13 },
      ],
    },
  ],
  value: 14,
};

describe("Test that getInputValueFromComponent()", () => {
  it("works on 1st level", () => {
    expect(getInputValueFromComponent(componentState, "b1", "value")).toEqual(
      14,
    );
  });

  it("works on 2nd level", () => {
    expect(getInputValueFromComponent(componentState, "p1", "chart")).toEqual(
      null,
    );
  });

  it("works on 3rd level", () => {
    expect(getInputValueFromComponent(componentState, "cb1", "value")).toEqual(
      true,
    );

    expect(getInputValueFromComponent(componentState, "dd1", "value")).toEqual(
      13,
    );
  });
});

describe("Test that getInputValueFromState()", () => {
  it("works without input.id", () => {
    const state = { x: [4, 5, 6] };
    expect(getInputValueFromState(state, "x")).toEqual([4, 5, 6]);
  });

  it("works on 2nd level", () => {
    const state = { x: { y: 15 } };
    expect(getInputValueFromState(state, "x.y")).toEqual(15);
  });

  it("works on 3nd level", () => {
    const state = { x: { y: [4, 5, 6] } };
    expect(getInputValueFromState(state, "x.y.2")).toEqual(6);
  });

  it("works with non-object states", () => {
    const state = 13;
    expect(
      getInputValueFromState(state as unknown as object, "x.y.2"),
    ).toBeUndefined();
  });
});
