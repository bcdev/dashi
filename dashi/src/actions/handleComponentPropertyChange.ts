import appStore from "../store/appStore";
import { PropertyChangeEvent } from "../model/component";
import { CallbackCallRequest } from "../model/callback";
import fetchApiResult from "../utils/fetchApiResult";
import { fetchCallbackOutputs } from "../api";

export default function handleComponentPropertyChange(
  contribPoint: string,
  contribIndex: number,
  contribEvent: PropertyChangeEvent,
) {
  const appState = appStore.getState();
  const contributionModels =
    appState.contributionPointsResult.data![contribPoint];
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
  console.log("callRequests", callRequests);
  if (callRequests.length) {
    fetchApiResult(fetchCallbackOutputs, callRequests).then(
      (callResultResult) => {
        if (callResultResult.data) {
          const callResult = callResultResult.data;
          // TODO: process call result --> modify any targets in appState.
          console.warn(
            "processing of callback results not implemented yet:",
            callResult,
          );
        } else {
          console.error("callback failed:", callResultResult.error);
          console.error("  for requests:", callRequests);
        }
      },
    );
  }
}
