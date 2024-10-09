import appStore from "../store/appStore";
import {
  ComponentState,
  ContainerState,
  isContainerState,
} from "../state/component";
import { CallbackCallRequest, ChangeRequest, Change } from "../model/callback";
import fetchApiResult from "../utils/fetchApiResult";
import { fetchChangeRequests } from "../api";
import { updateArray } from "../utils/updateArray";
import { ContributionState } from "../state/contribution";
import { PropertyChangeEvent } from "../model/event";

import { ContribPoint } from "../model/extension";

export default function applyPropertyChange(
  contribPoint: ContribPoint,
  contribIndex: number,
  contribEvent: PropertyChangeEvent,
) {
  const { contributionModelsRecord } = appStore.getState();
  const contributionModels = contributionModelsRecord[contribPoint];
  const componentId = contribEvent.componentId;
  const componentPropertyName = contribEvent.propertyName;
  const componentPropertyValue = contribEvent.propertyValue;
  const contributionModel = contributionModels[contribIndex];
  const callRequests: CallbackCallRequest[] = [];
  // Prepare calling all callbacks of the contribution
  // that are triggered by the property change
  (contributionModel.callbacks || []).forEach((callback, callbackIndex) => {
    if (callback.inputs && callback.inputs.length > 0) {
      let triggerIndex: number = -1;
      const inputValues: unknown[] = callback.inputs.map(
        (input, inputIndex) => {
          const kind = input.kind || "Component";
          if (kind === "Component") {
            if (
              input.id === componentId &&
              input.property === componentPropertyName
            ) {
              // Ok - the current callback is triggered by the property change
              triggerIndex = inputIndex;
              return componentPropertyValue;
            } else {
              // TODO: get inputValue from other component with given id/property.
              //   For time being we use null as it is JSON-serializable
            }
          } else {
            // TODO: get inputValue from other kinds.
            //   For time being we use null as it is JSON-serializable
          }
          console.warn(`callback input not supported yet:`, input);
          return null;
        },
      );
      if (triggerIndex >= 0) {
        callRequests.push({
          contribPoint,
          contribIndex,
          callbackIndex,
          inputValues,
        });
      }
    }
  });
  const originalChangeRequest: ChangeRequest = {
    contribPoint,
    contribIndex,
    changes: [
      {
        kind: "Component",
        id: componentId,
        property: componentPropertyName,
        value: componentPropertyValue,
      },
    ],
  };
  console.debug("callRequests", callRequests);
  if (callRequests.length == 0) {
    applyChangeRequests([originalChangeRequest]);
  } else {
    fetchApiResult(fetchChangeRequests, callRequests).then(
      (changeRequestsResult) => {
        if (changeRequestsResult.data) {
          applyChangeRequests(
            [originalChangeRequest].concat(changeRequestsResult.data),
          );
        } else {
          console.error(
            "callback failed:",
            changeRequestsResult.error,
            "for call requests:",
            callRequests,
          );
        }
      },
    );
  }
}

function applyChangeRequests(changeRequests: ChangeRequest[]) {
  console.log("applying change requests", changeRequests);
  changeRequests.forEach(({ contribPoint, contribIndex, changes }) => {
    console.log(
      "processing change request",
      contribPoint,
      contribIndex,
      changes,
    );
    const { contributionStatesRecord } = appStore.getState();
    const contributionStates = contributionStatesRecord[contribPoint];
    const contributionState = contributionStates[contribIndex];
    const componentStateOld = contributionState.componentState;
    let componentState = componentStateOld;
    changes.forEach((change) => {
      if (componentState && (!change.kind || change.kind === "Component")) {
        componentState = applyComponentStateChange(componentState, change);
      } else {
        // TODO: process other output kinds which may not require componentModel.
        console.warn(
          "processing of this kind of output not supported yet:",
          change,
        );
      }
    });
    if (componentState && componentState !== componentStateOld) {
      appStore.setState({
        contributionStatesRecord: {
          ...contributionStatesRecord,
          [contribPoint]: updateArray<ContributionState>(
            contributionStates,
            contribIndex,
            { ...contributionState, componentState },
          ),
        },
      });
    }
  });
}

function applyComponentStateChange(
  componentState: ComponentState,
  change: Change,
): ComponentState {
  if (componentState.id === change.id) {
    return { ...componentState, [change.property]: change.value };
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