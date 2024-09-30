import appStore, { ContribPoint } from "../store/appStore";
import { PropertyChangeEvent } from "../model/component";
import { CallbackCallRequest, CallbackCallResult } from "../model/callback";
import fetchApiResult from "../utils/fetchApiResult";
import { fetchCallbackOutputs } from "../api";

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
              triggerIndex = inputIndex;
              return componentPropertyValue;
            } else {
              // TODO: get inputValue from other component with given id/property.
              //    For time being we use null as it is JSON-serializable
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
    fetchApiResult(fetchCallbackOutputs, callRequests).then(
      (callResultResult) => {
        if (callResultResult.data) {
          applyCallbackCallResults(callResultResult.data);
        } else {
          console.error("callback failed:", callResultResult.error);
          console.error("  for requests:", callRequests);
        }
      },
    );
  }
}

function applyCallbackCallResults(callResults: CallbackCallResult[]) {
  // TODO: process call result --> modify any targets in appState.
  console.warn(
    "processing of callback results not implemented yet:",
    callResults,
  );
  //const contributionPoints = appStore.getState().contributionPointsResult.data!;
  callResults.forEach(
    ({ contribPoint: _1, contribIndex: _2, computedOutputs }) => {
      //const contributions = contributionPoints[contribPoint];
      //const contributionModel = contributions[contribIndex];
      //const contributionState = { ...appStore.getState().panelStates[c] };
      computedOutputs.forEach((output) => {
        if (!output.kind || output.kind === "Component") {
          //const componentId = output.id;
          //const propertyName = output.property;
          //const propertyValue = output.value;
        }
      });
    },
  );
}
