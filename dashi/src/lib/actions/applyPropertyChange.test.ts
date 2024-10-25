import { describe, it, expect } from "vitest";

import { type ContribPoint } from "@/lib/types/model/extension";
import { type StateChangeRequest } from "@/lib/types/model/callback";
import {
  type ComponentState,
  type PlotState,
} from "@/lib/types/state/component";
import { type ContributionState } from "@/lib/types/state/contribution";
import {
  applyComponentStateChange,
  applyContributionChangeRequests,
} from "./applyPropertyChange";

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
};

describe("Test that applyContributionChangeRequests()", () => {
  const contributionStatesRecord: Record<ContribPoint, ContributionState[]> = {
    panels: [
      { componentStateResult: { status: "ok" }, visible: true, componentState },
    ],
  };

  const stateChangeRequest1: StateChangeRequest = {
    contribPoint: "panels",
    contribIndex: 0,
    stateChanges: [
      {
        kind: "Component",
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
        kind: "Component",
        id: "dd1",
        property: "value",
        value: 13,
      },
    ],
  };

  it("changes state if values are different", () => {
    const newState = applyContributionChangeRequests(contributionStatesRecord, [
      stateChangeRequest1,
    ]);
    expect(newState).not.toBe(contributionStatesRecord);
    expect(
      newState["panels"][0].componentState!.components![1].components![1].value,
    ).toEqual(14);
  });

  it("doesn't change the state if value stays the same", () => {
    const newState = applyContributionChangeRequests(contributionStatesRecord, [
      stateChangeRequest2,
    ]);
    expect(newState).toBe(contributionStatesRecord);
  });
});

describe("Test that applyComponentStateChange()", () => {
  it("changes state if values are different", () => {
    const newState = applyComponentStateChange(componentState, {
      kind: "Component",
      id: "cb1",
      property: "value",
      value: false,
    });
    expect(newState).not.toBe(componentState);
    expect(newState.components![1].components![0].value).toEqual(false);
  });

  it("doesn't change the state if value stays the same", () => {
    const newState = applyComponentStateChange(componentState, {
      kind: "Component",
      id: "cb1",
      property: "value",
      value: true,
    });
    expect(newState).toBe(componentState);
  });
});
