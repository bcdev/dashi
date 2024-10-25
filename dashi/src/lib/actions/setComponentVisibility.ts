import { store } from "@/lib/store";
import { fetchInitialComponentState } from "@/lib/api";
import { type ContribPoint } from "@/lib/types/model/extension";
import { fetchApiResult } from "@/lib/utils/fetchApiResult";
import { getInputValues } from "@/lib/actions/common";
import { updateContributionState } from "./updateContributionState";

export function setComponentVisibility(
  contribPoint: ContribPoint,
  panelIndex: number,
  visible: boolean,
) {
  const { configuration, contributionStatesRecord } = store.getState();
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
      configuration.api,
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
  const { configuration, contributionModelsRecord, contributionStatesRecord } =
    store.getState();
  const contributionModels = contributionModelsRecord[contribPoint];
  const contributionStates = contributionStatesRecord[contribPoint];
  const contributionModel = contributionModels[contribIndex];
  const contributionState = contributionStates[contribIndex];
  const inputs = contributionModel.layout!.inputs;
  if (inputs && inputs.length > 0) {
    return getInputValues(
      inputs,
      contributionState,
      configuration.hostStore?.getState,
    );
  } else {
    return [];
  }
}
