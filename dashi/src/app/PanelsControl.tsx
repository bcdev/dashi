import { useAppStore } from "./appStore.ts";

function PanelsControl() {
  const appState = useAppStore();

  const contributionPointsResult = appState.contributionPointsResult;
  const contributionPoints = contributionPointsResult.data;
  if (!contributionPoints) {
    return null;
  }
  const panelModels = contributionPoints["panels"];
  const panelStates = appState.panelStates;
  if (
    !panelModels ||
    !panelStates ||
    panelModels.length != panelStates?.length
  ) {
    throw Error("internal state error");
  }
  return (
    <div style={{ padding: 5 }}>
      {panelStates.map((panelState, panelIndex) => {
        const id = `panels.${panelIndex}`;
        return (
          <div key={id}>
            <input
              id={id}
              type="checkbox"
              checked={panelState.visible}
              value={panelIndex}
              onChange={(e) => {
                if (e.currentTarget.checked) {
                  appState.showPanel(panelIndex);
                } else {
                  appState.hidePanel(panelIndex);
                }
              }}
            />
            <label htmlFor={id}>{panelModels[panelIndex].name}</label>
          </div>
        );
      })}
    </div>
  );
}

export default PanelsControl;
