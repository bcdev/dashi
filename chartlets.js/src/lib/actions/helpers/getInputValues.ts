import type { Input } from "@/lib/types/model/channel";
import type { ContributionState } from "@/lib/types/state/contribution";
import {
  type ComponentState,
  isComponentState,
  isContainerState,
} from "@/lib/types/state/component";
import { formatObjPath, getValue, normalizeObjPath } from "@/lib/utils/objPath";
import { isObject } from "@/lib/utils/isObject";
import type { GetDerivedState } from "@/lib/types/state/store";

export function getInputValues<S extends object = object>(
  inputs: Input[],
  contributionState: ContributionState,
  hostState?: S | undefined,
  getDerivedHostState?: GetDerivedState,
): unknown[] {
  return inputs.map((input) =>
    getInputValue(input, contributionState, hostState, getDerivedHostState),
  );
}

const noValue = {};

export function getInputValue<S extends object = object>(
  input: Input,
  contributionState: ContributionState,
  hostState?: S,
  getDerivedHostState?: GetDerivedState<S>,
): unknown {
  let inputValue: unknown = undefined;
  const dataSource = input.link || "component";
  if (dataSource === "component" && contributionState.component) {
    inputValue = getInputValueFromComponent(input, contributionState.component);
  } else if (dataSource === "container" && contributionState.container) {
    inputValue = getInputValueFromState(input, contributionState.container);
  } else if (dataSource === "app" && hostState) {
    inputValue = getInputValueFromState(
      input,
      hostState,
      getDerivedHostState as GetDerivedState,
    );
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
  getDerivedState?: GetDerivedState,
): unknown {
  let inputValue: unknown = state;
  if (input.id && isObject(inputValue)) {
    inputValue = inputValue[input.id];
  }
  if (isObject(inputValue)) {
    const state = inputValue;
    const property = normalizeObjPath(input.property);
    inputValue = getValue(state, property);
    if (inputValue === undefined && getDerivedState !== undefined) {
      inputValue = getDerivedState(state, formatObjPath(input.property));
    }
  }
  return inputValue;
}
