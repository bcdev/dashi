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
  type Input,
  type StateChange,
  type StateChangeRequest,
} from "@/lib/types/model/callback";
import { type PropertyChangeEvent } from "@/lib/types/model/event";
import { type Contribution } from "@/lib/types/model/contribution";
import { type ContributionState } from "@/lib/types/state/contribution";
import { updateArray } from "@/lib/utils/updateArray";
import { isContainerState } from "@/lib/utils/isContainerState";
import { isSubscriptable } from "@/lib/utils/isSubscriptable";

export function applyPropertyChange(
  contribPoint: ContribPoint,
  contribIndex: number,
  contribEvent: PropertyChangeEvent,
) {
  const { configuration, contributionModelsRecord, contributionStatesRecord } =
    store.getState();
  const contributionModels = contributionModelsRecord[contribPoint];
  const contributionStates = contributionStatesRecord[contribPoint];
  const contributionModel = contributionModels[contribIndex];
  const contributionState = contributionStates[contribIndex];
  const callbackRefs = generateCallbackRefs(
    contributionModel,
    contributionState,
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
  contributionModel: Contribution,
  contributionState: ContributionState,
  contribEvent: PropertyChangeEvent,
  getHostState?: () => unknown,
): CallbackRef[] {
  const callbackRefs: CallbackRef[] = [];
  // Prepare calling all callbacks of the contribution
  // that are triggered by the property change
  (contributionModel.callbacks || []).forEach((callback, callbackIndex) => {
    const inputValues = getInputValues(
      contributionState,
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
export function getInputValues(
  contributionState: ContributionState,
  contribEvent: PropertyChangeEvent,
  callback: Callback,
  getHostState?: () => unknown,
): unknown[] | undefined {
  // No inputs defined
  if (!callback.inputs || !callback.inputs.length) {
    return undefined;
  }

  // Find the index of input that is a trigger
  const triggerIndex: number = callback.inputs.findIndex(
    (input) =>
      (!input.kind || input.kind === "Component") &&
      input.id === contribEvent.componentId &&
      input.property === contribEvent.propertyName,
  );
  // No trigger index found --> this callback is not applicable
  if (triggerIndex < 0) {
    return undefined;
  }

  // Compute input values
  return callback.inputs.map((input, inputIndex) => {
    let inputValue: unknown = undefined;
    if (!input.kind || input.kind === "Component") {
      if (inputIndex === triggerIndex) {
        // Return the property value of the trigger event
        inputValue = contribEvent.propertyValue;
      } else if (contributionState.componentState) {
        // Return value of a property of some component in the tree
        inputValue = getComponentStateValue(
          contributionState.componentState,
          input,
        );
      }
    } else if (input.kind === "State") {
      // Note, it is actually not ok to pass contributionState here directly.
      // We may use sub-state of contributionState later that holds
      // the extra state required here.
      inputValue = getInputValue(input, contributionState);
    } else if (input.kind === "AppState") {
      if (getHostState) {
        inputValue = getInputValue(input, getHostState());
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
  });
}

function applyStateChangeRequests(stateChangeRequests: StateChangeRequest[]) {
  const { contributionStatesRecord } = store.getState();
  const contributionStatesRecordNew = applyContributionChangeRequests(
    contributionStatesRecord,
    stateChangeRequests,
  );
  if (contributionStatesRecordNew !== contributionStatesRecord) {
    store.setState({
      contributionStatesRecord: contributionStatesRecordNew,
    });
  }
  // TODO: Set value of another kind of output.
}

// we export for testing only
export function applyContributionChangeRequests(
  contributionStatesRecord: Record<ContribPoint, ContributionState[]>,
  stateChangeRequests: StateChangeRequest[],
): Record<ContribPoint, ContributionState[]> {
  stateChangeRequests.forEach(
    ({ contribPoint, contribIndex, stateChanges }) => {
      const contributionState =
        contributionStatesRecord[contribPoint][contribIndex];
      const componentStateOld = contributionState.componentState;
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
          contributionStatesRecord = {
            ...contributionStatesRecord,
            [contribPoint]: updateArray<ContributionState>(
              contributionStatesRecord[contribPoint],
              contribIndex,
              { ...contributionState, componentState },
            ),
          };
        }
      }
    },
  );
  return contributionStatesRecord;
}

// we export for testing only
export function applyComponentStateChange(
  componentState: ComponentState,
  stateChange: StateChange,
): ComponentState {
  if (componentState.id === stateChange.id) {
    const property = stateChange.property || "value";
    const oldValue = (componentState as unknown as Record<string, unknown>)[
      property
    ];
    if (oldValue !== stateChange.value) {
      return { ...componentState, [property]: stateChange.value };
    }
  } else if (isContainerState(componentState)) {
    const containerStateOld: ContainerState = componentState;
    let containerStateNew: ContainerState = containerStateOld;
    for (let i = 0; i < containerStateOld.components.length; i++) {
      const itemOld = containerStateOld.components[i];
      const itemNew = applyComponentStateChange(itemOld, stateChange);
      if (itemNew !== itemOld) {
        if (containerStateNew === containerStateOld) {
          containerStateNew = {
            ...containerStateOld,
            components: [...containerStateOld.components],
          };
        }
        containerStateNew.components[i] = itemNew;
      }
    }
    return containerStateNew;
  }
  return componentState;
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
export function getInputValue(
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
