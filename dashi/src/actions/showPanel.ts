import appStore, { ContribPoint } from "../store/appStore";
import fetchApiResult from "../utils/fetchApiResult";
import { fetchLayoutComponent } from "../api";
import { updateContributionState } from "./updateContributionState";

export function showPanel(panelIndex: number) {
  const contribPoint = "panels";
  const getState = appStore.getState;
  const panelStates = getState().contributionStatesRecord[contribPoint];
  const panelState = panelStates[panelIndex];
  if (panelState.visible) {
    return; // nothing to do
  }
  if (panelState.componentModelResult.status) {
    // If we have some status, the component is loaded or is being loaded
    updateContributionState(contribPoint, panelIndex, { visible: true });
  } else {
    // No status yet, so we must load the component
    updateContributionState(contribPoint, panelIndex, {
      visible: true,
      componentModelResult: { status: "pending" },
    });
    const inputValues = getLayoutInputValues(contribPoint, panelIndex);
    fetchApiResult(
      fetchLayoutComponent,
      contribPoint,
      panelIndex,
      inputValues,
    ).then((componentModelResult) => {
      updateContributionState(contribPoint, panelIndex, {
        componentModelResult,
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
