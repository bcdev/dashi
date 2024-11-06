import type { Input } from "@/lib/types/model/channel";
import type { ContributionState } from "@/lib/types/state/contribution";
import type { ComponentState } from "@/lib/types/state/component";
import { isSubscriptable } from "@/lib/utils/isSubscriptable";
import { isContainerState } from "@/lib/utils/isContainerState";

export function getInputValues<S extends object = object>(
  inputs: Input[],
  contributionState: ContributionState,
  hostState?: S | undefined,
): unknown[] {
  return inputs.map((input) =>
    getInputValue(input, contributionState, hostState),
  );
}

const noValue = {};

export function getInputValue<S extends object = object>(
  input: Input,
  contributionState: ContributionState,
  hostState?: S | undefined,
): unknown {
  let inputValue: unknown = undefined;
  const dataSource = input.link || "component";
  if (dataSource === "component" && contributionState.component) {
    // Return value of a property of some component in the tree
    inputValue = getComponentStateValue(contributionState.component, input);
  } else if (dataSource === "container" && contributionState.state) {
    inputValue = getInputValueFromState(input, hostState);
  } else if (dataSource === "app" && hostState) {
    inputValue = getInputValueFromState(input, hostState);
  } else {
    console.warn(`input with unknown data source:`, input);
  }
  if (inputValue === undefined || inputValue === noValue) {
    // We use null, because undefined is not JSON-serializable.
    inputValue = null;
    console.warn(`value is undefined for input`, input);
  }
  return inputValue;
}

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
  if (isSubscriptable(inputValue)) {
    inputValue = inputValue[input.property];
  }
  return inputValue;
}
