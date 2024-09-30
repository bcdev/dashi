import useAppStore from "../store/appStore";
import { hidePanel } from "../actions/hidePanel";
import { showPanel } from "../actions/showPanel";

const contribState = "panels";

function PanelsControl() {
  const appState = useAppStore();

  const contributionPointsResult = appState.contributionPointsResult;
  const contributionPoints = contributionPointsResult.data;
  if (!contributionPoints) {
    return null;
  }
  const panelModels = contributionPoints[contribState];
  const panelStates = appState.contributionPointStates[contribState];
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
                  showPanel(panelIndex);
                } else {
                  hidePanel(panelIndex);
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
