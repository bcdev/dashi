import appStore, { ContributionState } from "../store/appStore";

export function updatePanelState(
  panelIndex: number,
  panelState: Partial<ContributionState>,
) {
  const contribPoint = "panels";
  const contributionPointStates = appStore.getState().contributionPointStates;
  const panelStates = contributionPointStates[contribPoint]!;
  appStore.setState({
    contributionPointStates: {
      ...contributionPointStates,
      [contribPoint]: updateArrayAt<ContributionState>(
        panelStates,
        panelIndex,
        panelState,
      ),
    },
  });
}

function updateArrayAt<T>(array: T[], index: number, item: Partial<T>): T[] {
  return [
    ...array.slice(0, index),
    { ...array[index], ...item },
    ...array.slice(index + 1),
  ];
}
