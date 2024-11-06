import { describe, it, expect } from "vitest";

import type { ComponentState, PlotState } from "@/lib/types/state/component";
import {
  getComponentStateValue,
  getInputValueFromState,
} from "./getInputValues";

const componentState: ComponentState = {
  type: "Box",
  id: "b1",
  components: [
    { type: "Plot", id: "p1", chart: null } as PlotState,
    {
      type: "Box",
      id: "b2",
      components: [
        { type: "Checkbox", id: "cb1", value: true },
        { type: "Dropdown", id: "dd1", value: 13 },
      ],
    },
  ],
  value: 14,
};

describe("Test that getComponentStateValue()", () => {
  it("works on 1st level", () => {
    expect(
      getComponentStateValue(componentState, {
        link: "component",
        id: "b1",
        property: "value",
      }),
    ).toEqual(14);
  });

  it("works on 2nd level", () => {
    expect(
      getComponentStateValue(componentState, {
        link: "component",
        id: "p1",
        property: "chart",
      }),
    ).toEqual(null);
  });

  it("works on 3rd level", () => {
    expect(
      getComponentStateValue(componentState, {
        link: "component",
        id: "cb1",
        property: "value",
      }),
    ).toEqual(true);

    expect(
      getComponentStateValue(componentState, {
        link: "component",
        id: "dd1",
        property: "value",
      }),
    ).toEqual(13);
  });
});

describe("Test that getInputValueFromState()", () => {
  it("works with input.id and input.property", () => {
    const state = { x: { y: 26 } };
    expect(
      getInputValueFromState(
        { link: "component", id: "x", property: "y" },
        state,
      ),
    ).toEqual(26);
  });

  it("works with arrays indexes", () => {
    const state = { x: [4, 5, 6] };
    expect(
      getInputValueFromState(
        { link: "component", id: "x", property: "1" },
        state,
      ),
    ).toEqual(5);
  });

  it("works without input.id", () => {
    const state = { x: [4, 5, 6] };
    expect(
      getInputValueFromState({ link: "container", property: "x" }, state),
    ).toEqual([4, 5, 6]);
  });
});
