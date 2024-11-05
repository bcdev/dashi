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
import { isContainerState } from "@/lib/utils/isContainerState";

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
          (stateChange) => stateChange.type === "AppOutput",
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
      const state = applyStateChanges(
        contribution.state,
        stateChanges.filter(
          (stateChange) =>
            (!stateChange.type || stateChange.type === "Output") &&
            !stateChange.id,
        ),
      );
      const component = applyComponentStateChanges(
        contribution.component,
        stateChanges.filter(
          (stateChange) =>
            (!stateChange.type || stateChange.type === "Output") &&
            stateChange.id,
        ),
      );
      if (
        state !== contribution.state ||
        component !== contribution.component
      ) {
        contributionsRecord = {
          ...contributionsRecord,
          [contribPoint]: updateArray<ContributionState>(
            contributionsRecord[contribPoint],
            contribIndex,
            { ...contribution, state, component },
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
    const valueOld = (component as unknown as Record<string, unknown>)[
      property
    ];
    const valueNew = stateChange.value;
    if (valueOld !== valueNew) {
      return { ...component, [property]: valueNew };
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
export function applyStateChanges<S extends object>(
  state: S | undefined,
  stateChanges: StateChange[],
): S | undefined {
  stateChanges.forEach((stateChange) => {
    if (
      !state ||
      (state as unknown as Record<string, unknown>)[stateChange.property] !==
        stateChange.value
    ) {
      state = { ...state, [stateChange.property]: stateChange.value } as S;
    }
  });
  return state;
}
