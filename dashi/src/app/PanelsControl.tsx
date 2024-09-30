import useAppStore, { ContribPoint } from "../store/appStore";
import { hidePanel } from "../actions/hidePanel";
import { showPanel } from "../actions/showPanel";

const contribPoint: ContribPoint = "panels";

function PanelsControl() {
  const appState = useAppStore();

  const contributionPointsResult = appState.contributionsRecordResult;
  const contributionPoints = contributionPointsResult.data;
  if (!contributionPoints) {
    return null;
  }
  const panelModels = contributionPoints[contribPoint];
  const panelStates = appState.contributionStatesRecord[contribPoint];
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
