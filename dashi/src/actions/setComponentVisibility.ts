import appStore, { ContribPoint } from "../store/appStore";
import fetchApiResult from "../utils/fetchApiResult";
import { fetchComponentModel } from "../api";
import { updateContributionState } from "./updateContributionState";

export function setComponentVisibility(
  contribPoint: ContribPoint,
  panelIndex: number,
  visible: boolean,
) {
  const { contributionStatesRecord } = appStore.getState();
  const contributionStates = contributionStatesRecord[contribPoint];
  const contributionState = contributionStates[panelIndex];
  if (contributionState.visible === visible) {
    return; // nothing to do
  }
  if (contributionState.componentModelResult.status) {
    updateContributionState(contribPoint, panelIndex, { visible });
  } else {
    // No status yet, so we must load the component
    updateContributionState(contribPoint, panelIndex, {
      visible,
      componentModelResult: { status: "pending" },
    });
    const inputValues = getLayoutInputValues(contribPoint, panelIndex);
    fetchApiResult(
      fetchComponentModel,
      contribPoint,
      panelIndex,
      inputValues,
    ).then((componentModelResult) => {
      const componentState = componentModelResult?.data;
      updateContributionState(contribPoint, panelIndex, {
        componentModelResult,
        componentState,
      });
    });
  }
}

function getLayoutInputValues(
  contribPoint: ContribPoint,
  contribIndex: number,
): unknown[] {
  const contributionModels =
    appStore.getState().contributionsRecordResult.data![contribPoint];
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
