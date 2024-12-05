import {
  type Input,
  isComponentChannel,
  isContainerChannel,
  isHostChannel,
} from "@/types/model/channel";
import type { ContributionState } from "@/types/state/contribution";
import {
  type ComponentState,
  isComponentState,
  isContainerState,
} from "@/types/state/component";
import { formatObjPath, getValue, type ObjPathLike } from "@/utils/objPath";
import { isObject } from "@/utils/isObject";
import type { HostStore } from "@/types/state/options";

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
  const { id, property } = input;
  if (isComponentChannel(input) && contributionState.component) {
    inputValue = getInputValueFromComponent(
      contributionState.component,
      id,
      property,
    );
  } else if (isContainerChannel(input) && contributionState.container) {
    inputValue = getInputValueFromState(contributionState.container, property);
  } else if (isHostChannel(input) && hostStore) {
    inputValue = getInputValueFromHostStore(hostStore, property);
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
  componentState: ComponentState,
  id: string,
  property: ObjPathLike,
): unknown {
  if (componentState.id === id) {
    return getValue(componentState, property);
  } else if (isContainerState(componentState)) {
    for (let i = 0; i < componentState.children.length; i++) {
      const item = componentState.children[i];
      if (isComponentState(item)) {
        const itemValue = getInputValueFromComponent(item, id, property);
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
  state: object | undefined,
  property: ObjPathLike,
): unknown {
  return isObject(state) ? getValue(state, property) : undefined;
}

// we export for testing only
export function getInputValueFromHostStore(
  hostStore: HostStore,
  property: ObjPathLike,
): unknown {
  return hostStore.get(formatObjPath(property));
}
