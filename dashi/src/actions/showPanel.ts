import appStore from "../store/appStore";
import fetchApiResult from "../utils/fetchApiResult";
import { fetchLayoutComponent } from "../api";
import { updatePanelState } from "./updatePanelState";

export function showPanel(panelIndex: number) {
  const getState = appStore.getState;
  const panelStates = getState().panelStates!;
  const panelState = panelStates[panelIndex];
  if (panelState.visible) {
    return; // nothing to do
  }
  if (panelState.componentModelResult.status) {
    // If we have some status, the component is loaded or is being loaded
    updatePanelState(panelIndex, { visible: true });
  } else {
    // No status yet, so we must load the component
    updatePanelState(panelIndex, {
      visible: true,
      componentModelResult: { status: "pending" },
    });
    const inputValues = getLayoutInputValues("panels", panelIndex);
    fetchApiResult(
      fetchLayoutComponent,
      "panels",
      panelIndex,
      inputValues,
    ).then((componentModelResult) => {
      updatePanelState(panelIndex, { componentModelResult });
    });
  }
}

function getLayoutInputValues(
  contribPoint: string,
  contribIndex: number,
): unknown[] {
  const contributionModels =
    appStore.getState().contributionPointsResult.data![contribPoint];
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
