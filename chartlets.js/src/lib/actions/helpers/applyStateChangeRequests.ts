import type {
  StateChange,
  StateChangeRequest,
} from "@/lib/types/model/callback";
import { store } from "@/lib/store";
import {
  type ComponentState,
  type ContainerState,
  isComponentState,
  isContainerState,
} from "@/lib/types/state/component";
import type { ContribPoint } from "@/lib/types/model/extension";
import type { ContributionState } from "@/lib";
import { updateArray } from "@/lib/utils/updateArray";
import { getValue, normalizeObjPath, setValue } from "@/lib/utils/objPath";

export function applyStateChangeRequests(
  stateChangeRequests: StateChangeRequest[],
) {
  const { contributionsRecord } = store.getState();
  const contributionsRecordNew = applyContributionChangeRequests(
    contributionsRecord,
    stateChangeRequests,
  );
  if (contributionsRecordNew !== contributionsRecord) {
    store.setState({
      contributionsRecord: contributionsRecordNew,
    });
  }
  applyHostStateChanges(stateChangeRequests);
}

// we export for testing only
export function applyContributionChangeRequests(
  contributionsRecord: Record<ContribPoint, ContributionState[]>,
  stateChangeRequests: StateChangeRequest[],
): Record<ContribPoint, ContributionState[]> {
  stateChangeRequests.forEach(
    ({ contribPoint, contribIndex, stateChanges }) => {
      const contribution = contributionsRecord[contribPoint][contribIndex];
      const container = applyStateChanges(
        contribution.container,
        stateChanges.filter((stateChange) => stateChange.link === "container"),
      );
      const component = applyComponentStateChanges(
        contribution.component,
        stateChanges.filter(
          (stateChange) =>
            !stateChange.link || stateChange.link === "component",
        ),
      );
      if (
        container !== contribution.container ||
        component !== contribution.component
      ) {
        contributionsRecord = {
          ...contributionsRecord,
          [contribPoint]: updateArray<ContributionState>(
            contributionsRecord[contribPoint],
            contribIndex,
            { ...contribution, container, component },
          ),
        };
      }
    },
  );

  return contributionsRecord;
}

function applyComponentStateChanges(
  componentOld: ComponentState | undefined,
  stateChanges: StateChange[],
) {
  let component = componentOld;
  if (component) {
    stateChanges.forEach((stateChange) => {
      component = applyComponentStateChange(component!, stateChange);
    });
  }
  return component;
}

// we export for testing only
export function applyComponentStateChange(
  component: ComponentState,
  stateChange: StateChange,
): ComponentState {
  if (isComponentState(component) && component.id === stateChange.id) {
    const property = normalizeObjPath(stateChange.property);
    const valueNew = stateChange.value;
    if (property.length === 0) {
      // Special case: If no property given, replace entire component.
      // But only if it is one, otherwise don't change state.
      return isComponentState(valueNew) ? valueNew : component;
    }
    const valueOld = getValue(component, property);
    if (
      property[property.length - 1] === "children" &&
      !Array.isArray(valueNew) &&
      valueNew !== null &&
      valueNew !== undefined
    ) {
      // Special case: if the value of "children" is changed:
      // convert scalar valueNew into one-element array
      return setValue(component, property, [valueNew]);
    } else if (valueOld !== valueNew) {
      return setValue(component, property, valueNew);
    }
  } else if (isContainerState(component)) {
    const containerOld: ContainerState = component;
    let containerNew: ContainerState = containerOld;
    for (let i = 0; i < containerOld.children.length; i++) {
      const itemOld = containerOld.children[i];
      if (isComponentState(itemOld)) {
        const itemNew = applyComponentStateChange(itemOld, stateChange);
        if (itemNew !== itemOld) {
          if (containerNew === containerOld) {
            containerNew = {
              ...containerOld,
              children: [...containerOld.children],
            };
          }
          containerNew.children[i] = itemNew;
        }
      }
    }
    return containerNew;
  }
  return component;
}

function applyHostStateChanges(stateChangeRequests: StateChangeRequest[]) {
  const { configuration } = store.getState();
  const { hostStore } = configuration;
  if (hostStore) {
    const hostStateOld = hostStore.getState();
    let hostState: object | undefined = hostStateOld;
    stateChangeRequests.forEach((stateChangeRequest) => {
      hostState = applyStateChanges(
        hostState,
        stateChangeRequest.stateChanges.filter(
          (stateChange) => stateChange.link === "app",
        ),
      );
    });
    if (hostState !== hostStateOld) {
      hostStore.setState(hostState);
    }
  }
}

// we export for testing only
export function applyStateChanges<S extends object | undefined>(
  state: S,
  stateChanges: StateChange[],
): S {
  stateChanges.forEach((stateChange) => {
    if (!state || getValue(state, stateChange.property) !== stateChange.value) {
      state = setValue(state, stateChange.property, stateChange.value) as S;
    }
  });
  return state;
}
