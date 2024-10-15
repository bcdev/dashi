import systemStore from "@/store/system";
import { fetchStateChangeRequests } from "@/api";
import fetchApiResult from "@/utils/fetchApiResult";
import {
  ComponentState,
  ContainerState,
  isContainerState,
} from "@/state/component";
import { ContribPoint } from "@/model/extension";
import {
  Callback,
  CallbackRef,
  CallbackRequest,
  Input,
  StateChange,
  StateChangeRequest,
} from "@/model/callback";
import { PropertyChangeEvent } from "@/model/event";
import { Contribution } from "@/model/contribution";
import { ContributionState } from "@/state/contribution";
import { updateArray } from "@/utils/updateArray";

export default function applyPropertyChange(
  contribPoint: ContribPoint,
  contribIndex: number,
  contribEvent: PropertyChangeEvent,
) {
  const { apiOptions, contributionModelsRecord, contributionStatesRecord } =
    systemStore.getState();
  const contributionModels = contributionModelsRecord[contribPoint];
  const contributionStates = contributionStatesRecord[contribPoint];
  const contributionModel = contributionModels[contribIndex];
  const contributionState = contributionStates[contribIndex];
  const callbackRefs = generateCallbackRefs(
    contributionModel,
    contributionState,
    contribEvent,
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
    fetchApiResult(fetchStateChangeRequests, callbackRequests, apiOptions).then(
      (changeRequestsResult) => {
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
      },
    );
  }
}

function generateCallbackRefs(
  contributionModel: Contribution,
  contributionState: ContributionState,
  contribEvent: PropertyChangeEvent,
): CallbackRef[] {
  const callbackRefs: CallbackRef[] = [];
  // Prepare calling all callbacks of the contribution
  // that are triggered by the property change
  (contributionModel.callbacks || []).forEach((callback, callbackIndex) => {
    const inputValues = getInputValues(
      contributionState,
      contribEvent,
      callback,
    );
    if (inputValues) {
      callbackRefs.push({ callbackIndex, inputValues });
    }
  });
  return callbackRefs;
}

export function getInputValues(
  contributionState: ContributionState,
  contribEvent: PropertyChangeEvent,
  callback: Callback,
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
    } else {
      // TODO: Get value from another kind of input.
      console.warn(`input kind not supported yet:`, input);
    }
    if (inputValue === undefined) {
      // We use null, because undefined is not JSON-serializable.
      inputValue = null;
      console.warn(`value is undefined for input`, input);
    }
    return inputValue;
  });
}

export function applyStateChangeRequests(
  stateChangeRequests: StateChangeRequest[],
) {
  const { contributionStatesRecord } = systemStore.getState();
  const contributionStatesRecordNew = applyContributionChangeRequests(
    contributionStatesRecord,
    stateChangeRequests,
  );
  if (contributionStatesRecordNew !== contributionStatesRecord) {
    systemStore.setState({
      contributionStatesRecord: contributionStatesRecordNew,
    });
  }
  // TODO: Set value of another kind of output.
}

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

export function applyComponentStateChange(
  componentState: ComponentState,
  stateChange: StateChange,
): ComponentState {
  if (componentState.id === stateChange.id) {
    const oldValue = (componentState as unknown as Record<string, unknown>)[
      stateChange.property
    ];
    if (oldValue !== stateChange.value) {
      return { ...componentState, [stateChange.property]: stateChange.value };
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

export function getComponentStateValue(
  componentState: ComponentState,
  input: Input,
): unknown {
  if (componentState.id === input.id) {
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
