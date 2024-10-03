import appStore, { ContribPoint, ContributionState } from "../store/appStore";
import {
  ComponentModel,
  ContainerModel,
  isContainerModel,
  PropertyChangeEvent,
} from "../model/component";
import { CallbackCallRequest, ChangeRequest, Change } from "../model/callback";
import fetchApiResult from "../utils/fetchApiResult";
import { fetchCallbackCallResults } from "../api";
import { updateArray } from "../utils/updateArray";

export default function handleComponentPropertyChange(
  contribPoint: ContribPoint,
  contribIndex: number,
  contribEvent: PropertyChangeEvent,
) {
  const appState = appStore.getState();
  const contributionModels =
    appState.contributionsRecordResult.data![contribPoint];
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
  console.debug("callRequests", callRequests);
  if (callRequests.length) {
    fetchApiResult(fetchCallbackCallResults, callRequests).then(
      (callResultResult) => {
        if (callResultResult.data) {
          applyCallbackCallResults(callResultResult.data);
        } else {
          console.error("callback failed:", callResultResult.error);
          console.error("  for requests:", callRequests);
        }
      },
    );
  } else {
  }
}

function applyCallbackCallResults(callResults: ChangeRequest[]) {
  console.log("processing call results", callResults);
  callResults.forEach(({ contribPoint, contribIndex, changes }) => {
    console.log("processing output of", contribPoint, contribIndex, changes);
    const contributionStatesRecord =
      appStore.getState().contributionStatesRecord;
    const contributionStates = contributionStatesRecord[contribPoint];
    const contributionState = contributionStates[contribIndex];
    const componentModelOld = contributionState.componentModelResult.data;
    let componentModel = componentModelOld;
    changes.forEach((output) => {
      if (componentModel && (!output.kind || output.kind === "Component")) {
        componentModel = updateComponentState(componentModel, output);
      } else {
        // TODO: process other output kinds which may not require componentModel.
        console.warn(
          "processing of this kind of output not supported yet:",
          output,
        );
      }
    });
    if (componentModel && componentModel !== componentModelOld) {
      appStore.setState({
        contributionStatesRecord: {
          ...contributionStatesRecord,
          [contribPoint]: updateArray<ContributionState>(
            contributionStates,
            contribIndex,
            {
              ...contributionState,
              componentModelResult: {
                ...contributionState.componentModelResult,
                data: componentModel,
              },
            },
          ),
        },
      });
    }
  });
}

function updateComponentState(
  componentModel: ComponentModel,
  output: Change,
): ComponentModel {
  if (componentModel.id === output.id) {
    return { ...componentModel, [output.property]: output.value };
  } else if (isContainerModel(componentModel)) {
    const containerModelOld: ContainerModel = componentModel;
    let containerModelNew: ContainerModel = containerModelOld;
    for (let i = 0; i < containerModelOld.components.length; i++) {
      const itemOld = containerModelOld.components[i];
      const itemNew = updateComponentState(itemOld, output);
      if (itemNew !== itemOld) {
        if (containerModelNew === containerModelOld) {
          containerModelNew = {
            ...containerModelOld,
            components: [...containerModelOld.components],
          };
        }
        containerModelNew.components[i] = itemNew;
      }
    }
    return containerModelNew;
  }
  return componentModel;
}
