import { describe, it, expect } from "vitest";

import type { ComponentState } from "@/lib";
import type { PlotState } from "@/lib/components/Plot";
import {
  getInputValueFromComponent,
  getInputValueFromState,
} from "./getInputValues";

const componentState: ComponentState = {
  type: "Box",
  id: "b1",
  children: [
    { type: "Plot", id: "p1", chart: null } as PlotState,
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
    expect(
      getInputValueFromComponent(
        {
          link: "component",
          id: "b1",
          property: "value",
        },
        componentState,
      ),
    ).toEqual(14);
  });

  it("works on 2nd level", () => {
    expect(
      getInputValueFromComponent(
        {
          link: "component",
          id: "p1",
          property: "chart",
        },
        componentState,
      ),
    ).toEqual(null);
  });

  it("works on 3rd level", () => {
    expect(
      getInputValueFromComponent(
        {
          link: "component",
          id: "cb1",
          property: "value",
        },
        componentState,
      ),
    ).toEqual(true);

    expect(
      getInputValueFromComponent(
        {
          link: "component",
          id: "dd1",
          property: "value",
        },
        componentState,
      ),
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

  it("works on 2nd level", () => {
    const state = { x: { y: 15 } };
    expect(
      getInputValueFromState({ link: "container", property: "x.y" }, state),
    ).toEqual(15);
  });

  it("works on 3nd level", () => {
    const state = { x: { y: [4, 5, 6] } };
    expect(
      getInputValueFromState({ link: "container", property: "x.y.2" }, state),
    ).toEqual(6);
  });

  it("works with derived state", () => {
    const state = { x: { y: [4, 5, 6] } };
    const getDerivedState = (
      _state: object,
      name: string,
    ): number | undefined =>
      name === "x.ySum"
        ? state.x.y[0] + state.x.y[1] + state.x.y[2]
        : undefined;
    expect(
      getInputValueFromState(
        { link: "container", property: "x.ySum" },
        state,
        getDerivedState,
      ),
    ).toEqual(4 + 5 + 6);
  });
});
