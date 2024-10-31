import type { Input } from "@/lib/types/model/callback.js";
import type { ContributionState } from "@/lib/types/state/contribution.js";
import type { ComponentState } from "@/lib/types/state/component.js";
import { isSubscriptable } from "@/lib/utils/isSubscriptable.js";
import { isContainerState } from "@/lib/utils/isContainerState.js";

export function getInputValues(
  inputs: Input[],
  contributionState: ContributionState,
  getHostState?: () => unknown,
): unknown[] {
  return inputs.map((input) =>
    getInputValue(input, contributionState, getHostState),
  );
}

export function getInputValue(
  input: Input,
  contributionState: ContributionState,
  getHostState?: () => unknown,
): unknown {
  let inputValue: unknown = undefined;

  if (!input.kind || input.kind === "Component") {
    if (contributionState.component) {
      // Return value of a property of some component in the tree
      inputValue = getComponentStateValue(contributionState.component, input);
    }
  } else if (input.kind === "State") {
    // Note, it is actually not ok to pass contributionState here directly.
    // We may use a sub-state of contributionState later that holds
    // the extra state required here.
    inputValue = getInputValueFromState(input, contributionState);
  } else if (input.kind === "AppState") {
    if (getHostState) {
      inputValue = getInputValueFromState(input, getHostState());
    } else {
      console.warn(
        "missing configuration 'hostState'," +
          " which is need to resolve inputs of kind 'AppState'",
        input,
      );
    }
  } else {
    console.warn(`unknown input kind:`, input);
  }
  if (inputValue === undefined) {
    // We use null, because undefined is not JSON-serializable.
    inputValue = null;
    console.warn(`value is undefined for input`, input);
  }
  return inputValue;
}

const noValue = {};

// we export for testing only
export function getComponentStateValue(
  componentState: ComponentState,
  input: Input,
): unknown {
  if (componentState.id === input.id && input.property) {
    return (componentState as unknown as Record<string, unknown>)[
      input.property
    ];
  } else if (isContainerState(componentState)) {
    for (let i = 0; i < componentState.components.length; i++) {
      const item = componentState.components[i];
      const itemValue = getComponentStateValue(item, input);
      if (itemValue !== noValue) {
        return itemValue;
      }
    }
  }
  return noValue;
}

// we export for testing only
export function getInputValueFromState(
  input: Input,
  state: unknown,
): unknown | undefined {
  let inputValue: unknown = state;
  if (input.id && isSubscriptable(inputValue)) {
    inputValue = inputValue[input.id];
  }
  if (input.property && isSubscriptable(inputValue)) {
    inputValue = inputValue[input.property];
  }
  return inputValue;
}
