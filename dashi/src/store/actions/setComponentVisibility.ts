import systemStore from "../system";
import { fetchInitialComponentState } from "../../api";
import { ContribPoint } from "../../model/extension";
import fetchApiResult from "../../utils/fetchApiResult";
import { updateContributionState } from "./updateContributionState";

export function setComponentVisibility(
  contribPoint: ContribPoint,
  panelIndex: number,
  visible: boolean,
) {
  const { contributionStatesRecord } = systemStore.getState();
  const contributionStates = contributionStatesRecord[contribPoint];
  const contributionState = contributionStates[panelIndex];
  if (contributionState.visible === visible) {
    return; // nothing to do
  }
  if (contributionState.componentStateResult.status) {
    updateContributionState(contribPoint, panelIndex, { visible });
  } else {
    // No status yet, so we must load the component
    updateContributionState(contribPoint, panelIndex, {
      visible,
      componentStateResult: { status: "pending" },
    });
    const inputValues = getLayoutInputValues(contribPoint, panelIndex);
    fetchApiResult(
      fetchInitialComponentState,
      contribPoint,
      panelIndex,
      inputValues,
    ).then((componentModelResult) => {
      const componentState = componentModelResult?.data;
      updateContributionState(contribPoint, panelIndex, {
        componentStateResult: componentModelResult,
        componentState,
      });
    });
  }
}

function getLayoutInputValues(
  contribPoint: ContribPoint,
  contribIndex: number,
): unknown[] {
  const { contributionModelsRecord } = systemStore.getState();
  const contributionModels = contributionModelsRecord[contribPoint];
  const contributionModel = contributionModels[contribIndex];
  const inputs = contributionModel.layout!.inputs;
  if (inputs && inputs.length > 0) {
    // TODO: get inputValue from sources specified by input.kind.
    //    For time being we use null as it is JSON-serializable
    return inputs.map((input) => {
      console.warn(`layout input not supported yet`, input);
      return null;
    });
  } else {
    return [];
  }
}
