import {
  type Input,
  isComponentChannel,
  isContainerChannel,
  isHostChannel,
} from "@/lib/types/model/channel";
import type { ContributionState } from "@/lib/types/state/contribution";
import {
  type ComponentState,
  isComponentState,
  isContainerState,
} from "@/lib/types/state/component";
import { formatObjPath, getValue, normalizeObjPath } from "@/lib/utils/objPath";
import { isObject } from "@/lib/utils/isObject";
import type { HostStore } from "@/lib/types/state/options";

export function getInputValues(
  inputs: Input[],
  contributionState: ContributionState,
  hostStore?: HostStore,
): unknown[] {
  return inputs.map((input) =>
    getInputValue(input, contributionState, hostStore),
  );
}

const noValue = {};

export function getInputValue(
  input: Input,
  contributionState: ContributionState,
  hostStore?: HostStore,
): unknown {
  let inputValue: unknown = undefined;
  if (isComponentChannel(input) && contributionState.component) {
    inputValue = getInputValueFromComponent(input, contributionState.component);
  } else if (isContainerChannel(input) && contributionState.container) {
    inputValue = getInputValueFromState(input, contributionState.container);
  } else if (isHostChannel(input) && hostStore) {
    inputValue = getInputValueFromHostStore(input, hostStore);
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
export function getInputValueFromComponent(
  input: Input,
  componentState: ComponentState,
): unknown {
  if (componentState.id === input.id) {
    return getValue(componentState, input.property);
  } else if (isContainerState(componentState)) {
    for (let i = 0; i < componentState.children.length; i++) {
      const item = componentState.children[i];
      if (isComponentState(item)) {
        const itemValue = getInputValueFromComponent(input, item);
        if (itemValue !== noValue) {
          return itemValue;
        }
      }
    }
  }
  return noValue;
}

// we export for testing only
export function getInputValueFromState(
  input: Input,
  state: object | undefined,
): unknown {
  let inputValue: unknown = state;
  if (input.id && isObject(inputValue)) {
    inputValue = inputValue[input.id];
  }
  if (isObject(inputValue)) {
    const state = inputValue;
    const property = normalizeObjPath(input.property);
    inputValue = getValue(state, property);
  }
  return inputValue;
}

export function getInputValueFromHostStore(
  input: Input,
  hostStore: HostStore,
): unknown {
  return hostStore.get(formatObjPath(input.property));
}
