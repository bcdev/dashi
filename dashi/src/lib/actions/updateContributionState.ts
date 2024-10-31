import { store } from "@/lib/store";
import { fetchInitialComponentState } from "@/lib/api";
import { fetchApiResult } from "@/lib/utils/fetchApiResult";
import { getInputValues } from "@/lib/actions/common";
import { updateArray } from "@/lib/utils/updateArray";
import type { ContribPoint } from "@/lib/types/model/extension";
import type { ContributionState } from "@/lib/types/state/contribution";

export function updateContributionState<S extends object = object>(
  contribPoint: ContribPoint,
  contribIndex: number,
  contribState: Partial<S>,
  requireComponent: boolean = true,
) {
  const { configuration, contributionsRecord } = store.getState();
  const contributionStates = contributionsRecord[contribPoint];
  const contributionState = contributionStates[contribIndex];
  if (contributionState.state === contribState) {
    return; // nothing to do
  }
  const componentStatus = contributionState.componentResult.status;
  if (!requireComponent || componentStatus) {
    _updateContributionState(contribPoint, contribIndex, {
      state: contribState,
    });
  } else if (!componentStatus) {
    // No status yet, so we must load the component
    _updateContributionState(contribPoint, contribIndex, {
      state: contribState,
      componentResult: { status: "pending" },
    });
    const inputValues = getLayoutInputValues(contribPoint, contribIndex);
    fetchApiResult(
      fetchInitialComponentState,
      contribPoint,
      contribIndex,
      inputValues,
      configuration.api,
    ).then((componentResult) => {
      _updateContributionState(contribPoint, contribIndex, {
        componentResult,
        component: componentResult.data,
      });
    });
  }
}

function getLayoutInputValues(
  contribPoint: ContribPoint,
  contribIndex: number,
): unknown[] {
  const { configuration, contributionsRecord } = store.getState();
  const contributionStates = contributionsRecord[contribPoint];
  const contributionState = contributionStates[contribIndex];
  const inputs = contributionState.layout!.inputs;
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

function _updateContributionState(
  contribPoint: ContribPoint,
  contribIndex: number,
  contribState: Partial<ContributionState>,
) {
  const { contributionsRecord } = store.getState();
  const contribStates = contributionsRecord[contribPoint]!;
  const contribStateOld = contribStates[contribIndex];
  const contribStateNew = contribState.state
    ? {
        ...contribState,
        state: { ...contribStateOld.state, ...contribState.state },
      }
    : contribState;
  store.setState({
    contributionsRecord: {
      ...contributionsRecord,
      [contribPoint]: updateArray<ContributionState>(
        contribStates,
        contribIndex,
        contribStateNew,
      ),
    },
  });
}
