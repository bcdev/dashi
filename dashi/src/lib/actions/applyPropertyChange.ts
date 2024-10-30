import { store } from "@/lib/store";
import { fetchStateChangeRequests } from "@/lib/api";
import { fetchApiResult } from "@/lib/utils/fetchApiResult";
import {
  type ComponentState,
  type ContainerState,
} from "@/lib/types/state/component";
import { type ContribPoint } from "@/lib/types/model/extension";
import {
  type Callback,
  type CallbackRef,
  type CallbackRequest,
  type StateChange,
  type StateChangeRequest,
} from "@/lib/types/model/callback";
import { type PropertyChangeEvent } from "@/lib/types/model/event";
import { type ContributionState } from "@/lib/types/state/contribution";
import { updateArray } from "@/lib/utils/updateArray";
import { isContainerState } from "@/lib/utils/isContainerState";
import { getInputValues } from "@/lib/actions/common";

export function applyPropertyChange(
  contribPoint: ContribPoint,
  contribIndex: number,
  contribEvent: PropertyChangeEvent,
) {
  const { configuration, contributionsRecord } = store.getState();
  const contributions = contributionsRecord[contribPoint];
  const contribution = contributions[contribIndex];
  const callbackRefs = generateCallbackRefs(
    contribution,
    contribEvent,
    store.getState().configuration.hostStore?.getState,
  );
  // The primary state change request corresponds
  // to the original property change event.
  const primaryChangeRequest: StateChangeRequest = {
    contribPoint,
    contribIndex,
    stateChanges: [
      {
        kind: "Component",
        id: contribEvent.componentId,
        property: contribEvent.propertyName,
        value: contribEvent.propertyValue,
      },
    ],
  };
  // console.debug("callRequests", callRequests);
  if (callbackRefs.length == 0) {
    applyStateChangeRequests([primaryChangeRequest]);
  } else {
    const callbackRequests: CallbackRequest[] = callbackRefs.map(
      (callbackRef) => ({
        contribPoint,
        contribIndex,
        ...callbackRef,
      }),
    );
    fetchApiResult(
      fetchStateChangeRequests,
      callbackRequests,
      configuration.api,
    ).then((changeRequestsResult) => {
      const secondaryChangeRequests = changeRequestsResult.data;
      if (secondaryChangeRequests) {
        applyStateChangeRequests(
          [primaryChangeRequest].concat(secondaryChangeRequests),
        );
      } else {
        // Note, we do not even apply the primaryChangeRequest
        // in order to avoid an inconsistent state.
        console.error(
          "callback failed:",
          changeRequestsResult.error,
          "for call requests:",
          callbackRefs,
        );
      }
    });
  }
}

function generateCallbackRefs(
  contribution: ContributionState,
  contribEvent: PropertyChangeEvent,
  getHostState?: () => unknown,
): CallbackRef[] {
  const callbackRefs: CallbackRef[] = [];
  // Prepare calling all callbacks of the contribution
  // that are triggered by the property change
  (contribution.callbacks || []).forEach((callback, callbackIndex) => {
    const inputValues = getCallbackInputValues(
      contribution,
      contribEvent,
      callback,
      getHostState,
    );
    if (inputValues) {
      callbackRefs.push({ callbackIndex, inputValues });
    }
  });
  return callbackRefs;
}

// we export for testing only
export function getCallbackInputValues(
  contribution: ContributionState,
  contribEvent: PropertyChangeEvent,
  callback: Callback,
  getHostState?: () => unknown,
): unknown[] | undefined {
  if (!callback.inputs || !callback.inputs.length) {
    // No inputs defined
    return undefined;
  }

  // Find the index of input that is a trigger
  const triggerIndex: number = callback.inputs.findIndex(
    (input) =>
      (!input.kind || input.kind === "Component") &&
      input.id === contribEvent.componentId &&
      input.property === contribEvent.propertyName,
  );
  if (triggerIndex < 0) {
    // No trigger index found --> this callback is not applicable
    return undefined;
  }

  const inputValues = getInputValues(
    callback.inputs,
    contribution,
    getHostState,
  );

  if (inputValues[triggerIndex] === contribEvent.propertyValue) {
    // No change --> this callback is not applicable
    return undefined;
  }

  inputValues[triggerIndex] = contribEvent.propertyValue;
  return inputValues;
}

function applyStateChangeRequests(stateChangeRequests: StateChangeRequest[]) {
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
  // TODO: Set value of another kind of output.
}

// we export for testing only
export function applyContributionChangeRequests(
  contributionsRecord: Record<ContribPoint, ContributionState[]>,
  stateChangeRequests: StateChangeRequest[],
): Record<ContribPoint, ContributionState[]> {
  stateChangeRequests.forEach(
    ({ contribPoint, contribIndex, stateChanges }) => {
      const contribution = contributionsRecord[contribPoint][contribIndex];
      const componentStateOld = contribution.componentState;
      let componentState = componentStateOld;
      if (componentState) {
        stateChanges
          .filter(
            (stateChange) =>
              !stateChange.kind || stateChange.kind === "Component",
          )
          .forEach((stateChange) => {
            componentState = applyComponentStateChange(
              componentState!,
              stateChange,
            );
          });
        if (componentState !== componentStateOld) {
          contributionsRecord = {
            ...contributionsRecord,
            [contribPoint]: updateArray<ContributionState>(
              contributionsRecord[contribPoint],
              contribIndex,
              { ...contribution, componentState },
            ),
          };
        }
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
    const property = stateChange.property || "value";
    const oldValue = (component as unknown as Record<string, unknown>)[
      property
    ];
    if (oldValue !== stateChange.value) {
      return { ...component, [property]: stateChange.value };
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
