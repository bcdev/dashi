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
} from "./applyStateChangeRequests";

const componentTree: ComponentState = {
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
        link: "component",
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
        link: "component",
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
      newState["panels"][0].component!.components![1].components![1].value,
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
      link: "component",
      id: "cb1",
      property: "value",
      value: false,
    });
    expect(newState).not.toBe(componentTree);
    expect(newState.components![1].components![0].value).toEqual(false);
  });

  it("doesn't change the state if value stays the same", () => {
    const newState = applyComponentStateChange(componentTree, {
      link: "component",
      id: "cb1",
      property: "value",
      value: true,
    });
    expect(newState).toBe(componentTree);
  });
});
