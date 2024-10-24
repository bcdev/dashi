import { store } from "@/lib/store";
import { fetchInitialComponentState } from "@/lib/api";
import { type ContribPoint } from "@/lib/types/model/extension";
import { type Input } from "@/lib/types/model/callback";
import { fetchApiResult } from "@/lib/utils/fetchApiResult";
import { updateContributionState } from "./updateContributionState";

export function setComponentVisibility(
  contribPoint: ContribPoint,
  panelIndex: number,
  visible: boolean,
) {
  const { apiOptions, contributionStatesRecord } = store.getState();
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
      apiOptions,
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
  const { contributionModelsRecord } = store.getState();
  const contributionModels = contributionModelsRecord[contribPoint];
  const contributionModel = contributionModels[contribIndex];
  const inputs = contributionModel.layout!.inputs;
  if (inputs && inputs.length > 0) {
    return inputs.map((input: Input) => {
      if (!input.kind || input.kind === "Component") {
        console.warn(`input kind not supported in layout:`, input);
      } else {
        // TODO: Get value from another kind of input.
        console.warn(`input kind not supported yet:`, input);
      }
      return null;
    });
  } else {
    return [];
  }
}
