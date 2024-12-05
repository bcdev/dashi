import { describe, it, expect } from "vitest";

import { type ComponentState } from "@/types/state/component";
import { type ContribPoint } from "@/types/model/extension";
import { type StateChangeRequest } from "@/types/model/callback";
import { type ContributionState } from "@/types/state/contribution";
import {
  applyComponentStateChange,
  applyContributionChangeRequests,
} from "./applyStateChangeRequests";

const componentTree = {
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
};

describe("Test that applyContributionChangeRequests()", () => {
  const contributionsRecord: Record<ContribPoint, ContributionState[]> = {
    panels: [
      {
        name: "",
        extension: "",
        componentResult: { status: "ok" },
        container: { visible: true },
        component: componentTree,
      },
    ],
  };

  const stateChangeRequest1: StateChangeRequest = {
    contribPoint: "panels",
    contribIndex: 0,
    stateChanges: [
      {
        id: "dd1",
        property: "value",
        value: 14,
      },
    ],
  };

  const stateChangeRequest2: StateChangeRequest = {
    contribPoint: "panels",
    contribIndex: 0,
    stateChanges: [
      {
        id: "dd1",
        property: "value",
        value: 13,
      },
    ],
  };

  it("changes state if values are different", () => {
    const newState = applyContributionChangeRequests(contributionsRecord, [
      stateChangeRequest1,
    ]);
    expect(newState).not.toBe(contributionsRecord);
    expect(
      (
        (newState["panels"][0].component!.children![1] as ComponentState)
          .children![1] as ComponentState
      ).value,
    ).toEqual(14);
  });

  it("doesn't change the state if value stays the same", () => {
    const newState = applyContributionChangeRequests(contributionsRecord, [
      stateChangeRequest2,
    ]);
    expect(newState).toBe(contributionsRecord);
  });
});

describe("Test that applyComponentStateChange()", () => {
  it("changes state if values are different", () => {
    const newState = applyComponentStateChange(componentTree, {
      id: "cb1",
      property: "value",
      value: false,
    });
    expect(newState).not.toBe(componentTree);
    expect(
      ((newState.children![1] as ComponentState).children![0] as ComponentState)
        .value,
    ).toEqual(false);
  });

  it("doesn't change the state if value stays the same", () => {
    const newState = applyComponentStateChange(componentTree, {
      id: "cb1",
      property: "value",
      value: true,
    });
    expect(newState).toBe(componentTree);
  });

  it("replaces state if property is empty string", () => {
    const value = {
      type: "Box",
      id: "b1",
      children: ["Hello", "World"],
    };
    const newState = applyComponentStateChange(componentTree, {
      id: "b1",
      property: "",
      value,
    });
    expect(newState).toBe(value);
    expect(newState).toEqual({
      type: "Box",
      id: "b1",
      children: ["Hello", "World"],
    });
  });
});
