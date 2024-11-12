import type {
  StateChange,
  StateChangeRequest,
} from "@/lib/types/model/callback";
import { store } from "@/lib/store";
import type {
  ComponentState,
  ContainerState,
} from "@/lib/types/state/component";
import type { ContribPoint } from "@/lib/types/model/extension";
import type { ContributionState } from "@/lib";
import { updateArray } from "@/lib/utils/updateArray";
import { isContainerState } from "@/lib/actions/helpers/isContainerState";
import { getValue, setValue } from "@/lib/utils/objPath";

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

// we export for testing only
export function applyComponentStateChange(
  component: ComponentState,
  stateChange: StateChange,
): ComponentState {
  if (component.id === stateChange.id) {
    const property = stateChange.property;
    const valueOld = getValue(component, property);
    const valueNew = stateChange.value;
    if (valueOld !== valueNew) {
      return setValue(component, property, valueNew);
    }
  } else if (isContainerState(component)) {
    const containerOld: ContainerState = component;
    let containerNew: ContainerState = containerOld;
    for (let i = 0; i < containerOld.components.length; i++) {
      const itemOld = containerOld.components[i];
      const itemNew = applyComponentStateChange(itemOld, stateChange);
      if (itemNew !== itemOld) {
        if (containerNew === containerOld) {
          containerNew = {
            ...containerOld,
            components: [...containerOld.components],
          };
        }
        containerNew.components[i] = itemNew;
      }
    }
    return containerNew;
  }
  return component;
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
