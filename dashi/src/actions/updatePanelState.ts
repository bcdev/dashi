import appStore, { PanelState } from "../store/appStore";

export function updatePanelState(
  panelIndex: number,
  panelState: Partial<PanelState>,
) {
  const panelStates = appStore.getState().panelStates!;
  appStore.setState({
    panelStates: insertPartial<PanelState>(panelStates, panelIndex, panelState),
  });
}

function insertPartial<T>(array: T[], index: number, item: Partial<T>): T[] {
  return [
    ...array.slice(0, index),
    { ...array[index], ...item },
    ...array.slice(index + 1),
  ];
}
