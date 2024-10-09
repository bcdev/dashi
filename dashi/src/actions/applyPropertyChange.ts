import appStore from "../store/appStore";
import {
  ComponentState,
  ContainerState,
  isContainerState,
} from "../state/component";
import {
  Callback,
  CallbackCall,
  CallbackCallRequest,
  Change,
  ChangeRequest,
  Input,
} from "../model/callback";
import fetchApiResult from "../utils/fetchApiResult";
import { fetchChangeRequests } from "../api";
import { updateArray } from "../utils/updateArray";
import { ContributionState } from "../state/contribution";
import { PropertyChangeEvent } from "../model/event";
import { ContribPoint } from "../model/extension";
import { Contribution } from "../model/contribution";

export default function applyPropertyChange(
  contribPoint: ContribPoint,
  contribIndex: number,
  contribEvent: PropertyChangeEvent,
) {
  const { contributionModelsRecord, contributionStatesRecord } =
    appStore.getState();
  const contributionModels = contributionModelsRecord[contribPoint];
  const contributionStates = contributionStatesRecord[contribPoint];
  const contributionModel = contributionModels[contribIndex];
  const contributionState = contributionStates[contribIndex];
  const callbackCalls = generateCallbackCalls(
    contributionModel,
    contributionState,
    contribEvent,
  );
  const triggerChangeRequest: ChangeRequest = {
    contribPoint,
    contribIndex,
    changes: [
      {
        kind: "Component",
        id: contribEvent.componentId,
        property: contribEvent.propertyName,
        value: contribEvent.propertyValue,
      },
    ],
  };
  // console.debug("callRequests", callRequests);
  if (callbackCalls.length == 0) {
    applyChangeRequests([triggerChangeRequest]);
  } else {
    const callbackCallRequests: CallbackCallRequest[] = callbackCalls.map(
      (cbc) => ({
        contribPoint,
        contribIndex,
        ...cbc,
      }),
    );
    fetchApiResult(fetchChangeRequests, callbackCallRequests).then(
      (changeRequestsResult) => {
        if (changeRequestsResult.data) {
          applyChangeRequests(
            [triggerChangeRequest].concat(changeRequestsResult.data),
          );
        } else {
          console.error(
            "callback failed:",
            changeRequestsResult.error,
            "for call requests:",
            callbackCalls,
          );
        }
      },
    );
  }
}

function generateCallbackCalls(
  contributionModel: Contribution,
  contributionState: ContributionState,
  contribEvent: PropertyChangeEvent,
): CallbackCall[] {
  const callbackCalls: CallbackCall[] = [];
  // Prepare calling all callbacks of the contribution
  // that are triggered by the property change
  (contributionModel.callbacks || []).forEach((callback, callbackIndex) => {
    const inputValues = getInputValues(
      contributionState,
      contribEvent,
      callback,
    );
    if (inputValues) {
      callbackCalls.push({ callbackIndex, inputValues });
    }
  });
  return callbackCalls;
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

export function applyChangeRequests(changeRequests: ChangeRequest[]) {
  const { contributionStatesRecord } = appStore.getState();
  const contributionStatesRecordNew = applyContributionChangeRequests(
    contributionStatesRecord,
    changeRequests,
  );
  if (contributionStatesRecordNew !== contributionStatesRecord) {
    appStore.setState({
      contributionStatesRecord: contributionStatesRecordNew,
    });
  }
  // TODO: Set value of another kind of output.
}

export function applyContributionChangeRequests(
  contributionStatesRecord: Record<ContribPoint, ContributionState[]>,
  changeRequests: ChangeRequest[],
): Record<ContribPoint, ContributionState[]> {
  changeRequests.forEach(({ contribPoint, contribIndex, changes }) => {
    const contributionState =
      contributionStatesRecord[contribPoint][contribIndex];
    const componentStateOld = contributionState.componentState;
    let componentState = componentStateOld;
    if (componentState) {
      changes
        .filter((change) => !change.kind || change.kind === "Component")
        .forEach((change) => {
          componentState = applyComponentStateChange(componentState!, change);
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
  });
  return contributionStatesRecord;
}

export function applyComponentStateChange(
  componentState: ComponentState,
  change: Change,
): ComponentState {
  if (componentState.id === change.id) {
    const oldValue = (componentState as unknown as Record<string, unknown>)[
      change.property
    ];
    if (oldValue !== change.value) {
      return { ...componentState, [change.property]: change.value };
    }
  } else if (isContainerState(componentState)) {
    const containerStateOld: ContainerState = componentState;
    let containerStateNew: ContainerState = containerStateOld;
    for (let i = 0; i < containerStateOld.components.length; i++) {
      const itemOld = containerStateOld.components[i];
      const itemNew = applyComponentStateChange(itemOld, change);
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
